const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Tải data
const categoryData = require('./data/categories.js');
const productData = require('./data/products.js');

// Tải Models (chú ý đường dẫn /src)
const Category = require('./src/models/categoryModel.js');
const Product = require('./src/models/productModel.js');

// Tải hàm kết nối DB (chú ý đường dẫn /src)
const connectDB = require('./src/config/db.js');

// Cấu hình dotenv để lấy MONGO_URI
dotenv.config();

// Kết nối DB
connectDB();

const importData = async () => {
  try {
    // 1. Xóa sạch dữ liệu cũ
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Đã xóa dữ liệu cũ...');

    // 2. Thêm danh mục mới
    // Chuyển mảng string thành mảng object { name: "..." }
    const categoriesToInsert = categoryData.map(name => ({ name }));
    const createdCategories = await Category.insertMany(categoriesToInsert);
    console.log('Đã thêm danh mục...');

    // 3. Chuẩn bị dữ liệu sản phẩm
    // Tạo một bản đồ (map) để tra cứu ID danh mục bằng TÊN
    // Ví dụ: { "Thịt, Gia cầm & Trứng": "60f..." }
    const categoryMap = createdCategories.reduce((acc, category) => {
      acc[category.name] = category._id;
      return acc;
    }, {});

    // 4. Thêm categoryId vào cho từng sản phẩm
    const productsToInsert = productData.map(product => {
      return {
        ...product,
        category: categoryMap[product.categoryName], // Lấy ID từ bản đồ
        // Xóa categoryName vì không cần lưu vào DB
        categoryName: undefined 
      };
    });

    // 5. Thêm sản phẩm vào DB
    await Product.insertMany(productsToInsert);
    console.log('Đã thêm sản phẩm...');

    console.log('=============================');
    console.log('GIEO MẦM DỮ LIỆU THÀNH CÔNG!');
    console.log('=============================');
    process.exit();
  } catch (error) {
    console.error(`LỖI: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();

    console.log('=============================');
    console.log('XÓA DỮ LIỆU THÀNH CÔNG!');
    console.log('=============================');
    process.exit();
  } catch (error) {
    console.error(`LỖI: ${error}`);
    process.exit(1);
  }
};

// Logic để chạy script từ dòng lệnh
if (process.argv[2] === '-destroy') {
  destroyData();
} else {
  importData();
}