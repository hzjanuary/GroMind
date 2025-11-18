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

// Countdown Timer Component
function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date();

      if (difference <= 0) {
        setTimeLeft('Đã hết hạn');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-1 text-xs text-white bg-red-500 px-2 py-1 rounded">
      <Clock className="h-3 w-3" />
      <span>{timeLeft}</span>
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
              className="shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary cursor-pointer relative"
            >
              {hasActiveDiscount && (
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{product.discountPercent}%
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-base font-semibold h-12 overflow-hidden text-ellipsis">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img
                  src={`https://via.placeholder.com/200?text=${product.name.replace(
                    ' ',
                    '+',
                  )}`}
                  alt={product.name}
                  className="w-full h-36 object-cover"
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
                <div className="p-4 space-y-1">
                  {hasActiveDiscount ? (
                    <>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                        {product.price.toLocaleString('vi-VN')}đ
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-500 font-bold">
                        {discountedPrice.toLocaleString('vi-VN')}đ /{' '}
                        {product.unit}
                      </p>
                      {product.discountEndTime && (
                        <CountdownTimer endTime={product.discountEndTime} />
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-red-600 dark:text-red-500 font-bold">
                      {product.price.toLocaleString('vi-VN')}đ / {product.unit}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Thêm vào giỏ
                </Button>
              </CardFooter>
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
