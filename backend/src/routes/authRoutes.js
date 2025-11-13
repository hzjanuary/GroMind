// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Lấy JWT_SECRET từ .env hoặc dùng default
const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// ===== HELPER FUNCTIONS =====

// Tạo JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Middleware: Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Không tìm thấy token xác thực',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Gán user ID vào request
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token không hợp lệ hoặc đã hết hạn',
    });
  }
};

// ===== ROUTES =====

// @route   POST /api/auth/register
// @desc    Đăng ký user mới
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng điền đầy đủ thông tin',
      });
    }

    // Kiểm tra độ dài password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email đã được sử dụng',
      });
    }

    // Tạo user mới
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      username: username ? username.trim() : undefined,
    });

    // Tạo token
    const token = generateToken(user._id);

    // Trả về response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Register error:', error);

    // Xử lý validation errors từ mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Lỗi server khi đăng ký',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Đăng nhập
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập email và mật khẩu',
      });
    }

    // Tìm user và lấy cả password (dùng select vì password có select: false)
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Kiểm tra password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Email hoặc mật khẩu không đúng',
      });
    }

    // Tạo token
    const token = generateToken(user._id);

    // Trả về response (không bao gồm password)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server khi đăng nhập',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Lấy thông tin user hiện tại
// @access  Private (cần token)
router.get('/me', verifyToken, async (req, res) => {
  try {
    // req.userId đã được set bởi middleware verifyToken
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy user',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        addresses: user.addresses || [],
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server',
    });
  }
});

// @route   PUT /api/auth/update-profile
// @desc    Cập nhật thông tin user
// @access  Private
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const { name, username } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Tên phải có ít nhất 2 ký tự',
      });
    }

    const update = { name: name.trim() };
    if (typeof username === 'string') update.username = username.trim();

    const user = await User.findByIdAndUpdate(req.userId, update, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy user',
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server',
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Đổi mật khẩu
// @access  Private
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập đầy đủ thông tin',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Mật khẩu mới phải có ít nhất 6 ký tự',
      });
    }

    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy user',
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Mật khẩu hiện tại không đúng',
      });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server',
    });
  }
});

// ===== Address management =====
// GET /api/auth/addresses
router.get('/addresses', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (err) {
    console.error('Get addresses error:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// POST /api/auth/addresses
router.post('/addresses', verifyToken, async (req, res) => {
  try {
    const { houseNumber, street, ward, district, city, label, phone } =
      req.body;
    const user = await User.findById(req.userId);
    user.addresses = user.addresses || [];
    user.addresses.push({
      houseNumber,
      street,
      ward,
      district,
      city,
      phone,
      label,
    });
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error('Add address error:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

// DELETE /api/auth/addresses/:index
router.delete('/addresses/:index', verifyToken, async (req, res) => {
  try {
    const idx = parseInt(req.params.index, 10);
    const user = await User.findById(req.userId);
    if (!user.addresses || idx < 0 || idx >= user.addresses.length) {
      return res
        .status(400)
        .json({ success: false, error: 'Address not found' });
    }
    user.addresses.splice(idx, 1);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error('Delete address error:', err);
    res.status(500).json({ success: false, error: 'Lỗi server' });
  }
});

module.exports = router;
