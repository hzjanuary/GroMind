// backend/src/models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  unit: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  isFeatured: { type: Boolean, default: false },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
