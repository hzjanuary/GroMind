// src/ProductList.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from './CartContext.jsx';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock } from 'lucide-react';

// Countdown Timer Component - Format HH:MM:SS
function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date();

      if (difference <= 0) {
        setTimeLeft('Hết hạn');
        return;
      }

      const hours = String(
        Math.floor((difference / (1000 * 60 * 60)) % 24),
      ).padStart(2, '0');
      const minutes = String(
        Math.floor((difference / 1000 / 60) % 60),
      ).padStart(2, '0');
      const seconds = String(Math.floor((difference / 1000) % 60)).padStart(
        2,
        '0',
      );

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="text-xs text-gray-600 dark:text-gray-400">
      Kết thúc sau{' '}
      <span className="font-semibold text-red-500">{timeLeft}</span>
    </div>
  );
}

function ProductList({ products, showLoadMore = false, onLoadMore }) {
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null);

  // Sort products alphabetically by name
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }, [products]);

  if (sortedProducts.length === 0) {
    return <p>Đang tải sản phẩm...</p>;
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    setToast({
      id: Date.now(),
      message: `Đã thêm "${product.name}" vào giỏ hàng`,
    });
    setTimeout(() => setToast(null), 2000);
  };

  const getDiscountedPrice = (product) => {
    if (product.discountPercent > 0) {
      return Math.round(product.price * (1 - product.discountPercent / 100));
    }
    return product.price;
  };

  const isDiscountActive = (product) => {
    if (!product.discountEndTime) return product.discountPercent > 0;
    return (
      new Date(product.discountEndTime) > new Date() &&
      product.discountPercent > 0
    );
  };

  return (
    <div>
      {/* Toast Popup */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out z-50">
          {toast.message}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedProducts.map((product) => {
          const hasActiveDiscount = isDiscountActive(product);
          const discountedPrice = getDiscountedPrice(product);

          return (
            <Card
              key={product._id}
              className="shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer relative flex flex-col h-full border border-gray-200 dark:border-gray-700"
              style={{
                backgroundColor: 'rgb(249, 250, 251)',
              }}
            >
              {hasActiveDiscount && (
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{product.discountPercent}%
                </div>
              )}

              {/* Image Section - Full Height with Ratio */}
              <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                <img
                  src={`https://via.placeholder.com/200?text=${product.name.replace(
                    ' ',
                    '+',
                  )}`}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                  onError={(e) => {
                    try {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = '/vite.svg';
                      }
                    } catch {
                      // ignore
                    }
                  }}
                />
              </div>

              {/* Content Section - Separate from Image */}
              <div className="flex flex-col flex-grow bg-gray-50 dark:bg-gray-900">
                {/* Product Name - Clear Separation */}
                <div className="px-3 pt-3 pb-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm font-semibold text-black dark:text-white line-clamp-2 leading-tight">
                    {product.name}
                  </p>
                </div>

                {/* Price & Discount Info */}
                <div className="px-3 py-2 space-y-2 flex-grow bg-gray-50 dark:bg-gray-900">
                  {hasActiveDiscount ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                          {product.price.toLocaleString('vi-VN')}đ
                        </span>
                        <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
                          -{product.discountPercent}%
                        </span>
                      </div>
                      <p className="text-sm font-bold text-red-600 dark:text-red-500">
                        {discountedPrice.toLocaleString('vi-VN')}đ
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-normal">
                          /{product.unit}
                        </span>
                      </p>
                      {product.discountEndTime && (
                        <CountdownTimer endTime={product.discountEndTime} />
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-red-600 dark:text-red-500">
                        {product.price.toLocaleString('vi-VN')}đ
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-normal">
                          /{product.unit}
                        </span>
                      </p>
                    </>
                  )}
                </div>

                {/* Add to Cart Button */}
                <div className="px-3 pb-3 pt-1 bg-gray-50 dark:bg-gray-900">
                  <Button
                    className="w-full h-9 text-sm hover:bg-primary/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    Thêm vào giỏ
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Load More Button */}
      {showLoadMore && onLoadMore && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={onLoadMore} className="px-8">
            Xem thêm sản phẩm
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductList;
