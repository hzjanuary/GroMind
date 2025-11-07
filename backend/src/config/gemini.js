const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Lấy API key từ file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = genAI;