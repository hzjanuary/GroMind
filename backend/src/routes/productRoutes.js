const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../controllers/productController');
const { verifyToken } = require('../middleware/auth');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// GET /api/products
router.get('/', getAllProducts);

// POST /api/products - create product (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { name, price, unit, category } = req.body;
    if (!name || !price || !unit || !category) {
      return res.status(400).json({ success: false, error: 'Thiếu thông tin' });
    }

    const product = new Product({ name, price, unit, category });
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// PUT /api/products/:id - update product (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { name, price, unit, category } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, unit, category },
      { new: true },
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: 'Không tìm thấy sản phẩm' });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// DELETE /api/products/:id - delete product (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: 'Không tìm thấy sản phẩm' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// PATCH /api/products/:id/featured - toggle featured status (admin only)
router.patch('/:id/featured', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { isFeatured } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isFeatured },
      { new: true },
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: 'Không tìm thấy sản phẩm' });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error('Error updating featured status:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

module.exports = router;
