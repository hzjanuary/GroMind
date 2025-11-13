const Order = require('../models/orderModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Create new order (requires authentication)
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

    // Parse token from Authorization header (required)
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Vui lòng đăng nhập để đặt hàng',
        });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      return res.status(401).json({
        error: 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại',
      });
    }

    const orderData = {
      items,
      customerName,
      phone,
      address,
      paymentMethod,
      totalAmount,
      user: userId,
    };

    // Attach user data
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

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({ success: true, orderId: order._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Lỗi server khi tạo đơn hàng' });
  }
};

module.exports = { createOrder };
