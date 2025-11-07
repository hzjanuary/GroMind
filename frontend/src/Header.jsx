// src/Header.jsx
import React from 'react';
import { useCart } from './CartContext.jsx';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { ShoppingBag, LogIn, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Component CartItem (dùng bên trong Sheet)
function CartItem({ item, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-primary-foreground/20"> 
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-primary-foreground/80">
          {item.price.toLocaleString('vi-VN')}đ
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDecrease}>-</Button>
        <span className="w-5 text-center">{item.quantity}</span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onIncrease}>+</Button>
      </div>
    </div>
  );
}

// Component Header chính
function Header() {
  const { cartItems, itemCount, totalAmount, decreaseQuantity, addToCart, clearCart } = useCart();

  return (
    <header className="w-full bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a 
          href="/" 
          className="text-2xl font-bold transition-transform hover:scale-105 cursor-pointer"
        >
          GroMind — AI-Powered Intelligent Shopping Assistant
        </a>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hover:bg-primary/80 cursor-pointer">
            <LogIn className="mr-2 h-5 w-5" />
            Đăng nhập
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="relative hover:bg-primary/80 cursor-pointer">
                <ShoppingBag className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              </Button>
            </SheetTrigger>
            
            <SheetContent className="flex flex-col bg-primary text-primary-foreground border-l-0">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  <span>Giỏ hàng của bạn ({itemCount})</span>
                  
                  {/* THÊM NÚT CLEAR ALL VỚI CONFIRM DIALOG */}
                  {cartItems.length > 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 hover:bg-red-500/20 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xóa tất cả sản phẩm?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này sẽ xóa tất cả {itemCount} sản phẩm trong giỏ hàng. 
                            Bạn có chắc chắn muốn tiếp tục?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={clearCart}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Xóa tất cả
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-primary-foreground/60">
                    <ShoppingBag className="h-16 w-16 mb-4 opacity-40" />
                    <p>Giỏ hàng đang trống.</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <CartItem 
                      key={item._id}
                      item={item}
                      onDecrease={() => decreaseQuantity(item._id)}
                      onIncrease={() => addToCart(item)}
                    />
                  ))
                )}
              </div>
              
              {cartItems.length > 0 && (
                <SheetFooter className="mt-auto border-t border-primary-foreground/20 pt-4">
                  <div className="w-full space-y-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng:</span>
                      <span className="text-accent">{totalAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <Button variant="secondary" className="w-full">
                      Tiến hành Thanh toán
                    </Button>
                  </div>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;