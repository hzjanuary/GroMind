// Enhanced ProductCard Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import { useAuth } from '../AuthContext.jsx';
import { toast } from '../lib/toast.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  ChevronRight,
} from 'lucide-react';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, isFavorited, toggleFavorite } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Kiểm tra trạng thái yêu thích từ context
  const productIsFavorited = isFavorited(product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    if (isTogglingFavorite) return;

    setIsTogglingFavorite(true);
    try {
      const result = await toggleFavorite(product._id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const discountedPrice =
    product.discountPercent > 0
      ? Math.round(product.price * (1 - product.discountPercent / 100))
      : product.price;

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-0 shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        const slug = product.name
          .toString()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '');
        navigate(`/${slug}`);
      }}
    >
      {/* Product Image Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-square">
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              -{product.discountPercent}%
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={isTogglingFavorite}
          className={`absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 hover:scale-110 hover:bg-white ${
            isTogglingFavorite ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              productIsFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Quick Actions Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Thêm vào giỏ
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-white text-white hover:bg-white/30"
            >
              <Truck className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative w-full h-full">
          <img
            src={
              product.image ||
              `https://picsum.photos/seed/${product._id}/400/400.jpg`
            }
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
        </div>

        {/* Product Trust Badges */}
        <div className="absolute bottom-3 left-3 flex gap-1">
          {product.isOrganic && (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Hữu cơ
            </span>
          )}
          {product.isFresh && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              Tươi mới
            </span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <CardContent className="p-4 bg-white dark:bg-gray-800 transition-colors">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < (product.rating || 4)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviews || 12} đánh giá)
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-end justify-between mb-3">
          <div>
            {product.discountPercent > 0 ? (
              <>
                <p className="text-lg font-bold text-red-600">
                  {discountedPrice.toLocaleString('vi-VN')}đ
                  <span className="text-xs text-gray-500 font-normal">
                    /{product.unit}
                  </span>
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {product.price.toLocaleString('vi-VN')}đ
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {product.price.toLocaleString('vi-VN')}đ
                <span className="text-xs text-gray-500 font-normal">
                  /{product.unit}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Stock & Delivery Info */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                product.stock > 10 ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <span>
              {product.stock > 10
                ? 'Còn hàng'
                : `Còn ${product.stock} sản phẩm`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            <span>Giao trong 2h</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:shadow-lg"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Thêm vào giỏ hàng
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
