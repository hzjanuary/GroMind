const Order = require('../models/orderModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Create new order (optional auth: parse token if present to attach username)
const createOrder = async (req, res) => {
  try {
    const { items, customerName, phone, address, paymentMethod, totalAmount } =
      req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: 'items is required and must be a non-empty array' });
    }
    if (!customerName || !phone) {
      return res
        .status(400)
        .json({ error: 'customerName and phone are required' });
    }

    const orderData = {
      items,
      customerName,
      phone,
      address,
      paymentMethod,
      totalAmount,
    };

    // Try to parse token from Authorization header (optional, guest orders allowed)
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      }
    } catch (err) {
      // Token parsing/verification failed; continue as guest order
    }

    // If user is authenticated, attach user id and username
    if (userId) {
      orderData.user = userId;
      try {
        const User = require('../models/userModel');
        const user = await User.findById(userId).lean();
        if (user) {
          // prefer username if set, otherwise fallback to name
          orderData.username = user.username || user.name || undefined;
        }
      } catch (err) {
        console.error('Error loading user to attach username to order:', err);
      }
    }

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({ success: true, orderId: order._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Lỗi server khi tạo đơn hàng' });
  }
};

module.exports = { createOrder };
