const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, error: 'Không tìm thấy token xác thực' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Lấy thông tin user từ database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: 'Người dùng không tồn tại' });
    }

    req.user = user;
    req.userId = decoded.id; // Giữ lại để backward compatibility
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = { verifyToken };
