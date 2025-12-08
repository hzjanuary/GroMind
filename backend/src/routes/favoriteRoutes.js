const express = require('express');
const router = express.Router();
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  checkFavorite,
} = require('../controllers/favoriteController');
const { verifyToken } = require('../middleware/auth');

// Tất cả các route favorites đều cần authentication
router.use(verifyToken);

// @route   GET /api/favorites
// @desc    Lấy danh sách sản phẩm yêu thích
// @access  Private
router.get('/', getFavorites);

// @route   GET /api/favorites/check/:productId
// @desc    Kiểm tra sản phẩm có trong danh sách yêu thích không
// @access  Private
router.get('/check/:productId', checkFavorite);

// @route   POST /api/favorites/:productId
// @desc    Thêm sản phẩm vào danh sách yêu thích
// @access  Private
router.post('/:productId', addToFavorites);

// @route   DELETE /api/favorites/:productId
// @desc    Xóa sản phẩm khỏi danh sách yêu thích
// @access  Private
router.delete('/:productId', removeFromFavorites);

// @route   PUT /api/favorites/:productId/toggle
// @desc    Toggle sản phẩm trong danh sách yêu thích
// @access  Private
router.put('/:productId/toggle', toggleFavorite);

module.exports = router;
