const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function getChatCompletion(messages) {
    try {
        const ChatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,

        })
        return ChatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Error getting chat completion:', error);
        return 'ขออภัย ระบบไม่สามารถตอบกลับได้ โปรดลองอีกครั้ง'
    }
}

module.exports = { getChatCompletion }
