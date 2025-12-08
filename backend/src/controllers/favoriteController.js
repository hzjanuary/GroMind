const User = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Lấy danh sách sản phẩm yêu thích
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    // Populate thông tin chi tiết sản phẩm
    const favoriteIds = user.favorites.map((fav) => fav.productId);
    const products = await Product.find({ _id: { $in: favoriteIds } }).select(
      'name price image category unit stock discountPercent',
    );

    // Map thông tin sản phẩm với favorites
    const favoritesWithDetails = user.favorites.map((fav) => {
      const product = products.find(
        (p) => p._id.toString() === fav.productId.toString(),
      );
      return {
        _id: fav._id,
        productId: fav.productId,
        name: fav.name,
        addedAt: fav.addedAt,
        product: product || null,
      };
    });

    res.status(200).json({
      success: true,
      data: favoritesWithDetails,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu thích:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách yêu thích',
      error: error.message,
    });
  }
};

// @desc    Thêm sản phẩm vào danh sách yêu thích
// @route   POST /api/favorites/:productId
// @access  Private
const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.params;

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    // Tìm user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    // Kiểm tra xem sản phẩm đã có trong favorites chưa
    const existingFavorite = user.favorites.find(
      (fav) => fav.productId.toString() === productId,
    );

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Sản phẩm đã có trong danh sách yêu thích',
      });
    }

    // Thêm vào favorites với id và name
    user.favorites.push({
      productId: product._id,
      name: product.name,
      addedAt: new Date(),
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Đã thêm vào danh sách yêu thích',
      data: user.favorites,
    });
  } catch (error) {
    console.error('Lỗi khi thêm vào yêu thích:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm vào yêu thích',
      error: error.message,
    });
  }
};

// @desc    Xóa sản phẩm khỏi danh sách yêu thích
// @route   DELETE /api/favorites/:productId
// @access  Private
const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    // Kiểm tra xem sản phẩm có trong favorites không
    const favoriteIndex = user.favorites.findIndex(
      (fav) => fav.productId.toString() === productId,
    );

    if (favoriteIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Sản phẩm không có trong danh sách yêu thích',
      });
    }

    // Xóa khỏi favorites
    user.favorites.splice(favoriteIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Đã xóa khỏi danh sách yêu thích',
      data: user.favorites,
    });
  } catch (error) {
    console.error('Lỗi khi xóa khỏi yêu thích:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa khỏi yêu thích',
      error: error.message,
    });
  }
};

// @desc    Toggle sản phẩm trong danh sách yêu thích (thêm nếu chưa có, xóa nếu đã có)
// @route   PUT /api/favorites/:productId/toggle
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    let message;
    let isFavorited;

    const existingIndex = user.favorites.findIndex(
      (fav) => fav.productId.toString() === productId,
    );

    if (existingIndex !== -1) {
      // Xóa nếu đã có
      user.favorites.splice(existingIndex, 1);
      message = 'Đã xóa khỏi danh sách yêu thích';
      isFavorited = false;
    } else {
      // Thêm nếu chưa có
      user.favorites.push({
        productId: product._id,
        name: product.name,
        addedAt: new Date(),
      });
      message = 'Đã thêm vào danh sách yêu thích';
      isFavorited = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message,
      isFavorited,
      data: user.favorites,
    });
  } catch (error) {
    console.error('Lỗi khi toggle yêu thích:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi toggle yêu thích',
      error: error.message,
    });
  }
};

// @desc    Kiểm tra sản phẩm có trong danh sách yêu thích không
// @route   GET /api/favorites/check/:productId
// @access  Private
const checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    const isFavorited = user.favorites.some(
      (fav) => fav.productId.toString() === productId,
    );

    res.status(200).json({
      success: true,
      isFavorited,
    });
  } catch (error) {
    console.error('Lỗi khi kiểm tra yêu thích:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi kiểm tra yêu thích',
      error: error.message,
    });
  }
};

module.exports = {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  checkFavorite,
};
