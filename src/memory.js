// src/memory.js

// config สำหรับ mapping ชื่อเล่น
const USER_NICKNAMES = {
    '538769942200320022': 'แมน', 
    '981200635951202335': 'ต้นไม้', 
    '396210093718503425': 'เมียร์', 
    '262147369750102016': 'แบงค์',
    '921700987188695040': 'บอย', 
    '426417509592203264': 'ทิฟฟี่', 
    '873246582471028817': 'โอ้ต', 
    '401032587079843850': 'หนาน',
    '1189602184908771419': 'เบลด'
    // เพิ่มคนอื่นได้ เช่น '123456789': 'บอย'
};

// เก็บประวัติการคุย (ในหน่วยความจำ ถ้าปิดบอทจะหาย)
// Key: userId, Value: Array of messages
const conversationHistory = new Map();

const getNickname = (userId) => {
    return USER_NICKNAMES[userId] || 'คุณ'; // ถ้าไม่มีชื่อในลิสต์ จะเรียกว่า "คุณ"
};

const getHistory = (userId) => {
    if (!conversationHistory.has(userId)) {
        conversationHistory.set(userId, []);
    }
    return conversationHistory.get(userId);
};

const addMessage = (userId, role, content) => {
    const history = getHistory(userId);
    history.push({ role, content });
    
    // จำกัด Memory ไม่ให้ยาวเกินไป (เช่น จำแค่ 10 ข้อความล่าสุด) เพื่อประหยัด Token
    if (history.length > 10) {
        history.shift(); 
    }
};

const clearHistory = (userId) => {
    conversationHistory.delete(userId);
};

module.exports = { getNickname, getHistory, addMessage, clearHistory };