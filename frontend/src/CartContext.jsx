// src/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Tạo Context
const CartContext = createContext();

// 2. Tạo "Provider" (Nhà cung cấp)
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // Khởi tạo từ localStorage nếu có
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }); // State chứa các sản phẩm

  // Đồng bộ cartItems vào localStorage mỗi khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch {
      // Ignore write errors (e.g., storage full)
    }
  }, [cartItems]);

  // === HÀM THÊM SẢN PHẨM ===
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        // Nếu đã có, tăng số lượng lên 1
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // Nếu chưa có, thêm vào với số lượng là 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // === HÀM GIẢM SỐ LƯỢNG ===
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === productId);

      // Nếu số lượng là 1, thì giảm cũng đồng nghĩa là xóa
      if (existingItem && existingItem.quantity === 1) {
        return prevItems.filter((item) => item._id !== productId);
      }

      // Ngược lại, chỉ giảm số lượng
      return prevItems.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  };

  // === HÀM XÓA SẢN PHẨM ===
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId),
    );
  };

  // === HÀM XÓA TẤT CẢ (THÊM MỚI) ===
  const clearCart = () => {
    setCartItems([]);
  };

  // Tính tổng số lượng sản phẩm (itemCount)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Tính tổng tiền
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // 3. Giá trị cung cấp cho các component con
  const value = {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    itemCount,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 4. "Hook" tùy chỉnh (Custom Hook)
export function useCart() {
  return useContext(CartContext);
}
