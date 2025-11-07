// backend/src/controllers/categoryController.js
const Category = require('../models/categoryModel');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

module.exports = { getAllCategories };