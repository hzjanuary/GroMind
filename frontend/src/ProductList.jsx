// src/ProductList.jsx
import React from 'react';
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

  if (products.length === 0) {
    return <p>Đang tải sản phẩm...</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
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
                } catch (err) {
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
                addToCart(product);
              }}
            >
              Thêm vào giỏ
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default ProductList;
