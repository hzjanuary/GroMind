// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db'); // Import hàm kết nối DB
const allRoutes = require('./routes'); // Import file route "tổng"
const authRoutes = require('./routes/authRoutes'); // <- CHỈ IMPORT 1 LẦN

// Khởi chạy kết nối CSDL
connectDB();

const app = express();

// ===== MIDDLEWARES =====
app.use(express.json()); // Để đọc JSON body
app.use(express.urlencoded({ extended: true })); // Để đọc URL-encoded body
app.use(cors()); // Để React gọi được API

// ===== ROUTES =====
// Auth routes - PHẢI ĐẶT TRƯỚC /api để có URL riêng
app.use('/api/auth', authRoutes);

// Cắm tất cả route còn lại vào tiền tố (prefix) /api
app.use('/api', allRoutes);

// Root route để kiểm tra server
app.get('/', (req, res) => {
  res.json({
    message: 'GroMind API Server',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (requires token)'
      },
      products: 'GET /api/products',
      recipes: {
        search: 'GET /api/recipes/search?name=...',
        suggest: 'POST /api/suggest-recipe',
        details: 'POST /api/get-recipe-details'
      }
    }
  });
});

// ===== ERROR HANDLING MIDDLEWARE =====
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Lỗi server',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route không tồn tại',
    path: req.path
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});