const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const {
  suggestRecipe,
  getRecipeDetails,
} = require('../controllers/aiController'); // <-- Import đã đúng
const orderRoutes = require('./orderRoutes');

// Phân luồng các route
router.use('/products', productRoutes); // Mọi request đến /api/products sẽ do productRoutes xử lý
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);

// API Gợi ý (đã có)
router.post('/suggest-recipe', suggestRecipe);

// API Tìm kiếm (BỊ THIẾU)
router.post('/get-recipe-details', getRecipeDetails); // <-- THÊM DÒNG NÀY

// Route cơ sở để kiểm tra API
router.get('/', (req, res) => {
  res.send('API đang chạy ngon lành!');
});

module.exports = router;
