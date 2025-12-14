import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleLayout from './layouts/SimpleLayout';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { toast } from './lib/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Star,
  Truck,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

const Favorites = () => {
  const navigate = useNavigate();
  const { isAuthenticated, favorites, toggleFavorite, loadFavorites, token } =
    useAuth();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFavorites = async () => {
      if (isAuthenticated && token) {
        setIsLoading(true);
        await loadFavorites(token);
        if (isMounted) {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchFavorites();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token, loadFavorites]);

  const handleRemoveFavorite = async (productId) => {
    setRemovingId(productId);
    try {
      const result = await toggleFavorite(productId);
      if (result.success) {
        toast.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (product) => {
    if (product) {
      addToCart(product);
      toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
    }
  };

  const navigateToProduct = (product) => {
    if (!product) return;
    const slug = product.name
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
    navigate(`/${slug}`);
  };

  if (!isAuthenticated) {
    return (
      <SimpleLayout>
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay về trang chủ
          </Button>
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Sản phẩm yêu thích
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Vui lòng đăng nhập để xem danh sách sản phẩm yêu thích của bạn.
            </p>
            <Button onClick={() => navigate('/')}>Về trang chủ</Button>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sản phẩm yêu thích
            </h1>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              {favorites.length} sản phẩm
            </span>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay về trang chủ
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Danh sách sản phẩm yêu thích của bạn đang trống.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Hãy thêm sản phẩm yêu thích bằng cách nhấn vào biểu tượng trái tim
              trên sản phẩm.
            </p>
            <Button onClick={() => navigate('/')}>Khám phá sản phẩm</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => {
              const product = favorite.product;
              // Chỉ hiển thị giá khuyến mãi khi sản phẩm là featured
              const hasDiscount =
                product?.isFeatured && product?.discountPercent > 0;
              const discountedPrice = hasDiscount
                ? Math.round(
                    product.price * (1 - product.discountPercent / 100),
                  )
                : product?.price;

              return (
                <Card
                  key={favorite._id}
                  className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Product Image */}
                  <div
                    className="relative overflow-hidden bg-gray-100 aspect-square cursor-pointer"
                    onClick={() => navigateToProduct(product)}
                  >
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 z-20">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{product.discountPercent}%
                        </span>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(favorite.productId);
                      }}
                      disabled={removingId === favorite.productId}
                      className="absolute top-3 right-3 z-20 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-50"
                    >
                      {removingId === favorite.productId ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                      ) : (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      )}
                    </button>

                    <img
                      src={
                        product?.image ||
                        `https://picsum.photos/seed/${favorite.productId}/400/400.jpg`
                      }
                      alt={favorite.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Product Content */}
                  <CardContent className="p-4 bg-white dark:bg-gray-800">
                    <h3
                      className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigateToProduct(product)}
                    >
                      {favorite.name}
                    </h3>

                    {product ? (
                      <>
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

                        {/* Price */}
                        <div className="mb-3">
                          {hasDiscount ? (
                            <>
                              <p className="text-lg font-bold text-red-600">
                                {discountedPrice?.toLocaleString('vi-VN')}đ
                                <span className="text-xs text-gray-500 font-normal">
                                  /{product.unit}
                                </span>
                              </p>
                              <p className="text-sm text-gray-400 line-through">
                                {product.price?.toLocaleString('vi-VN')}đ
                              </p>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {product.price?.toLocaleString('vi-VN')}đ
                              <span className="text-xs text-gray-500 font-normal">
                                /{product.unit}
                              </span>
                            </p>
                          )}
                        </div>

                        {/* Stock Info */}
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                product.stock > 10
                                  ? 'bg-green-500'
                                  : 'bg-yellow-500'
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
                          className="w-full bg-primary hover:bg-primary/90 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Thêm vào giỏ hàng
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm mb-3">
                          Sản phẩm không còn tồn tại
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRemoveFavorite(favorite.productId)
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa khỏi danh sách
                        </Button>
                      </div>
                    )}

                    {/* Added Date */}
                    <p className="text-xs text-gray-400 mt-3 text-center">
                      Đã thêm:{' '}
                      {new Date(favorite.addedAt).toLocaleDateString('vi-VN')}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </SimpleLayout>
  );
};

export default Favorites;
