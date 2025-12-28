// src/index.js
require('dotenv').config();
const http = require('http');
const client = require('./bot');

const TOKEN = process.env.DISCORD_TOKEN;
const PORT = process.env.PORT || 3000;

if (!TOKEN) {
    console.error("Error: ไม่พบ DISCORD_TOKEN ในไฟล์ .env");
    process.exit(1);
}

// ===== Health Check Server สำหรับ UptimeRobot =====
const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'alive',
            bot: client.user ? client.user.tag : 'Starting...',
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Health check server running on port ${PORT}`);

    // หลังจาก server พร้อมแล้ว ค่อย login Discord
    client.login(TOKEN).catch(err => {
        console.error('Discord login failed:', err);
    });
});
