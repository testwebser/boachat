// src/bot.js
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { getChatCompletion } = require('./groq');
const { getNickname, getHistory, addMessage, clearHistory } = require('./memory');
const { generateSystemPrompt } = require('./prompt');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // สำคัญมาก ต้องเปิดใน Discord Developer Portal ด้วย
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel] // เพื่อให้คุยใน DM ได้
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    // 1. ไม่ตอบแชทตัวเอง หรือ บอทตัวอื่น
    if (message.author.bot) return;

    // 2. (Optional) เงื่อนไขการตอบ เช่น ต้อง Tag บอทก่อน หรือคุยใน Channel เฉพาะ
    // ในที่นี้จะให้ตอบทุกข้อความที่พิมพ์มา หรือถ้าอยากให้ตอบเฉพาะตอน Tag ให้ใช้เงื่อนไขด้านล่าง
    // if (!message.mentions.users.has(client.user.id)) return;

    const userId = message.author.id;
    const userMessage = message.content;

    // คำสั่งรีเซ็ตความจำ
    if (userMessage === '!reset') {
        clearHistory(userId);
        message.reply("ลบความทรงจำเรียบร้อย เริ่มต้นใหม่กันนะ!");
        return;
    }

    try {
        // --- Process ---
        await message.channel.sendTyping(); // ขึ้นสถานะกำลังพิมพ์

        // 1. หาชื่อเล่น
        const nickname = getNickname(userId);

        // 2. เตรียม Memory
        const history = getHistory(userId);
        
        // 3. เตรียม System Prompt (ใส่ชื่อเล่นลงไป)
        const systemPrompt = generateSystemPrompt(nickname);

        // 4. สร้าง Payload ส่งไปหา AI (System + History + New Message)
        const messagesToSend = [
            systemPrompt,
            ...history,
            { role: "user", content: userMessage }
        ];

        // 5. ส่งไป Groq
        const replyText = await getChatCompletion(messagesToSend);

        // 6. อัปเดต Memory
        addMessage(userId, "user", userMessage);
        addMessage(userId, "assistant", replyText);

        // 7. ตอบกลับใน Discord
        await message.reply(replyText);

    } catch (error) {
        console.error(error);
        await message.reply("เกิดข้อผิดพลาดบางอย่าง");
    }
});

module.exports = client;