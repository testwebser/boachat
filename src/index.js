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

server.listen(PORT, () => {
    console.log(`🌐 Health check server running on port ${PORT}`);
});

// ===== Self-Ping ทุก 5 นาที =====
const SELF_PING_URL = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/health`
    : `http://localhost:${PORT}/health`;

setInterval(() => {
    http.get(SELF_PING_URL.replace('https:', 'http:'), (res) => {
        console.log(`🔄 Self-ping: ${res.statusCode}`);
    }).on('error', (err) => {
        // ไม่ต้อง log error เพราะอาจเป็น localhost ตอน dev
    });
}, 1 * 60 * 1000); // ทุก 1 นาที

// เริ่มต้นบอท
client.login(TOKEN);
