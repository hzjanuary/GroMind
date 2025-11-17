// backend/src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../controllers/categoryController');
const { verifyToken } = require('../middleware/auth');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');

// GET /api/categories
router.get('/', getAllCategories);

// POST /api/categories - create category (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: 'Tên danh mục không được để trống' });
    }

    const category = new Category({ name });
    await category.save();
    res.json({ success: true, category });
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// DELETE /api/categories/:id - delete category (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: 'Không tìm thấy danh mục' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// PUT /api/categories/:id - update category (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: 'Tên danh mục không được để trống' });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true },
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: 'Không tìm thấy danh mục' });
    }

    res.json({ success: true, category });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

module.exports = router;
