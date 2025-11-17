const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');
const Order = require('../models/orderModel');

// POST /api/orders - create order (optional auth)
router.post('/', createOrder);

// GET /api/orders/my - get orders for current user (by username exclusively)
router.get('/my', verifyToken, async (req, res) => {
  try {
    // Get user and query orders by username exclusively
    const User = require('../models/userModel');
    const user = await User.findById(req.userId).lean();

    if (!user || !user.username) {
      // User must have a username set to retrieve orders
      return res.json({ success: true, orders: [] });
    }

    const orders = await Order.find({ username: user.username }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// DELETE /api/orders/cleanup-guest - delete orders without username (protected)
router.delete('/cleanup-guest', verifyToken, async (req, res) => {
  try {
    const User = require('../models/userModel');
    const user = await User.findById(req.userId).lean();
    // Only allow user with username 'admin' or matching ADMIN_EMAIL to perform cleanup
    const adminEmail = process.env.ADMIN_EMAIL;
    const isAdmin =
      user &&
      (user.username === 'admin' || (adminEmail && user.email === adminEmail));
    if (!isAdmin) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const result = await Order.deleteMany({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: '' },
      ],
    });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    console.error('Error cleaning guest orders:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// GET /api/orders/all - get all orders (admin only)
router.get('/all', verifyToken, async (req, res) => {
  try {
    const User = require('../models/userModel');
    const user = await User.findById(req.userId).lean();

    if (!user || user.username !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// PATCH /api/orders/:orderId/status - update order status (admin only)
router.patch('/:orderId/status', verifyToken, async (req, res) => {
  try {
    const User = require('../models/userModel');
    const user = await User.findById(req.userId).lean();

    if (!user || user.username !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const { status } = req.body;
    if (!['Đã đặt', 'Đang giao', 'Thành công'].includes(status)) {
      return res
        .status(400)
        .json({ success: false, error: 'Trạng thái không hợp lệ' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true },
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, error: 'Không tìm thấy đơn hàng' });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

module.exports = router;
