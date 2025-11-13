// backend/models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true,
      minlength: [2, 'Tên phải có ít nhất 2 ký tự'],
    },
    username: {
      type: String,
      required: false,
      trim: true,
      unique: false,
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email không hợp lệ',
      ],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false, // Không trả về password khi query
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    addresses: [
      {
        houseNumber: String,
        street: String,
        ward: String,
        district: String,
        city: String,
        phone: String,
        label: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Hash password trước khi lưu
userSchema.pre('save', async function (next) {
  // Chỉ hash nếu password được modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method: So sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Lỗi khi so sánh mật khẩu');
  }
};

// Method: Tạo object user không có password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
