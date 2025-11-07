// src/Cart.jsx
import React from 'react';
import { useCart } from './CartContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // Dùng để tạo vạch kẻ
import { ShoppingCart } from 'lucide-react';

function Cart() {
  // Lấy thêm hàm totalAmount từ context
  const { cartItems, itemCount, totalAmount, decreaseQuantity, addToCart } = useCart();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Giỏ hàng ({itemCount} sản phẩm)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cartItems.length === 0 ? (
          <p className="text-muted-foreground">Giỏ hàng của bạn đang trống.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                {/* Thêm nút + - */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => decreaseQuantity(item._id)}>-</Button>
                  <span className="w-5 text-center">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => addToCart(item)}>+</Button>
                </div>
              </div>
            ))}
            
            <Separator />
            
            {/* Hiển thị tổng tiền */}
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng:</span>
              <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        )}
      </CardContent>
      {cartItems.length > 0 && (
        <CardFooter>
          {/* Thay thế <button> cũ bằng <Button> */}
          <Button className="w-full">
            Tiến hành Thanh toán
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default Cart;