const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db'); // Import hàm kết nối DB
const allRoutes = require('./routes'); // Import file route "tổng"

// Khởi chạy kết nối CSDL
connectDB();

const app = express();

// Middlewares
app.use(express.json()); // Để đọc JSON body
app.use(cors());         // Để React gọi được API

// Cắm tất cả route vào tiền tố (prefix) /api
app.use('/api', allRoutes);
// Giờ đây, các route của bạn sẽ là:
// GET /api/products
// GET /api/recipes/search?name=...
// POST /api/suggest-recipe

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});