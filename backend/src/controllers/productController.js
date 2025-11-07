const Product = require('../models/productModel');

const getAllProducts = async (req, res) => {
  try {
    // SỬA DÒNG NÀY:
    // Xóa bỏ 'name price unit' để nó trả về TẤT CẢ các trường (bao gồm 'category')
    const products = await Product.find({}); 
    
    res.json(products);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy sản phẩm.' });
  }
};

// Bạn có thể thêm các controller khác như addProduct, deleteProduct ở đây
module.exports = { getAllProducts };