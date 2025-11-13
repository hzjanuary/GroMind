const jwt = require('jsonwebtoken');
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, error: 'Không tìm thấy token xác thực' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

module.exports = { verifyToken };
