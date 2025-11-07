// backend/src/models/categoryModel.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // Bạn có thể thêm image_url sau nếu muốn
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;