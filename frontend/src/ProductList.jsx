// src/ProductList.jsx
import React, { useState, useMemo } from 'react';
import { useCart } from './CartContext.jsx';
import { Button } from '@/components/ui/button'; // Đảm bảo import này đúng
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function ProductList({ products }) {
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
    setTimeout(() => setToast(null), 2000); // Ẩn toast sau 2 giây
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
        {sortedProducts.map((product) => (
          <Card
            key={product._id}
            className="shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary cursor-pointer"
          >
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
                  // fallback to local asset if external placeholder fails (DNS or network issue)
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
              <p className="text-sm text-red-600 font-bold p-4">
                {product.price.toLocaleString('vi-VN')}đ / {product.unit}
              </p>
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
        ))}
      </div>
    </div>
  );
}

export default ProductList;
