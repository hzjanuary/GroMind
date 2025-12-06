import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../CartContext';
import { toast } from '../lib/toast';
import EnhancedHeader from './Header';
import Footer from '../Footer';
import FloatingRecipeButton from '../FloatingRecipeButton';

const ProductDetail = () => {
  const { productName } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Helper to slugify text for comparison
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Since we don't have a direct slug API, we fetch all products and find the match
        // In a real app, you'd want a specific API endpoint for this
        const response = await axios.get('http://localhost:5000/api/products');
        const foundProduct = response.data.find(
          (p) => slugify(p.name) === productName,
        );

        setProduct(foundProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Không tìm thấy sản phẩm
        </h2>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Add product quantity times
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
  };

  const images = [
    `https://picsum.photos/seed/${product._id}/600/600.jpg`,
    `https://picsum.photos/seed/${product._id}-1/600/600.jpg`,
    `https://picsum.photos/seed/${product._id}-2/600/600.jpg`,
    `https://picsum.photos/seed/${product._id}-3/600/600.jpg`,
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <EnhancedHeader />

      <main className="container mx-auto px-4 py-8 mt-4">
        {/* Breadcrumb / Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Trở lại
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative group">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {product.categoryName || 'Sản phẩm'}
                  </span>
                  {product.isNew && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      Mới
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    (128 đánh giá)
                  </span>
                </div>

                <div className="flex items-end gap-3 mb-8">
                  <span className="text-4xl font-bold text-primary">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-xl text-gray-400 line-through mb-1">
                    {(product.price * 1.2).toLocaleString('vi-VN')}₫
                  </span>
                  <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-md text-sm font-bold mb-2">
                    -20%
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">
                  {product.description ||
                    `Sản phẩm ${product.name} tươi ngon, chất lượng cao, được tuyển chọn kỹ lưỡng từ những nông trại đạt chuẩn VietGAP. Cam kết an toàn vệ sinh thực phẩm và giữ trọn hương vị tự nhiên.`}
                </p>

                {/* Actions */}
                <div className="space-y-6 mt-auto">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                      <button
                        onClick={() =>
                          quantity > 1 && setQuantity((q) => q - 1)
                        }
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
                      >
                        <Minus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                      <span className="w-12 text-center font-bold text-lg text-gray-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
                      >
                        <Plus className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <span className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Tạm tính
                      </span>
                      <span className="block text-xl font-bold text-gray-900 dark:text-white">
                        {(product.price * quantity).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      className="h-14 text-lg font-bold shadow-lg shadow-primary/20"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-6 w-6" />
                      Thêm vào giỏ
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 text-lg font-bold border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Heart className="mr-2 h-6 w-6" />
                      Yêu thích
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                      <Truck className="h-5 w-5" />
                    </div>
                    <span>Giao 2h</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <span>Bảo đảm 100%</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full text-purple-600 dark:text-purple-400">
                      <RotateCcw className="h-5 w-5" />
                    </div>
                    <span>Đổi trả 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingRecipeButton />
    </div>
  );
};

export default ProductDetail;
