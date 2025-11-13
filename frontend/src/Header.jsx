// src/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from './CartContext.jsx';
import { useAuth } from './AuthContext.jsx'; // <- THÊM MỚI
import LoginDialog from './LoginDialog.jsx'; // <- THÊM MỚI
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  LogIn,
  LogOut,
  Trash2,
  Search,
  X,
  TrendingUp,
  User,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
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
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onDecrease}
        >
          -
        </Button>
        <span className="w-5 text-center">{item.quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onIncrease}
        >
          +
        </Button>
      </div>
    </div>
  );
}

// Component Header chính
function Header({ onSearch, allProducts = [] }) {
  const {
    cartItems,
    itemCount,
    totalAmount,
    decreaseQuantity,
    addToCart,
    clearCart,
  } = useCart();
  const { user, isAuthenticated, logout } = useAuth(); // <- THÊM MỚI
  const navigate = useNavigate();
  const goToAccount = React.useCallback(() => navigate('/account'), [navigate]);
  const goToOrders = React.useCallback(() => navigate('/orders'), [navigate]);
  const goToCheckout = React.useCallback(
    () => navigate('/checkout'),
    [navigate],
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false); // <- THÊM MỚI
  const searchRef = useRef(null);

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions khi user nhập
  useEffect(() => {
    if (searchTerm.trim() && allProducts.length > 0) {
      const filtered = allProducts
        .filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 5); // Chỉ hiển thị 5 kết quả
      setFilteredSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowDropdown(false);
    }
  }, [searchTerm, allProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (productName) => {
    setSearchTerm(productName);
    if (onSearch) {
      onSearch(productName);
    }
    setShowDropdown(false);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setShowDropdown(false);
    if (onSearch) {
      onSearch('');
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} className="text-accent font-bold">
          {part}
        </strong>
      ) : (
        part
      ),
    );
  };

  return (
    <header className="w-full bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-bold transition-transform hover:scale-105 cursor-pointer flex-shrink-0"
          >
            GroMind
          </a>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-8"
            ref={searchRef}
          >
            <div className="relative w-full">
              <Input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => searchTerm && setShowDropdown(true)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pr-20 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-primary-foreground/20"
                autoComplete="off"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-primary-foreground/20"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-primary-foreground/20"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Dropdown Suggestions */}
              {showDropdown && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-80 overflow-y-auto">
                    {filteredSuggestions.map((product) => (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() => handleSelectSuggestion(product.name)}
                        className="w-full text-left px-4 py-3 hover:bg-accent/10 transition-colors border-b border-border last:border-b-0 flex items-center gap-3 group"
                      >
                        <Search className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {highlightMatch(product.name, searchTerm)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.price.toLocaleString('vi-VN')}đ /{' '}
                            {product.unit}
                          </p>
                        </div>
                        <TrendingUp className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                  <div className="px-4 py-2 bg-muted/50 text-xs text-muted-foreground border-t border-border">
                    Nhấn Enter để xem tất cả kết quả
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/80"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <ThemeToggle />

            {/* Login/User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-primary/80 gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden lg:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-card border-border"
                >
                  <DropdownMenuLabel className="text-card-foreground">
                    Tài khoản của tôi
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    className="text-card-foreground hover:bg-accent cursor-pointer"
                    onClick={goToAccount}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-card-foreground hover:bg-accent cursor-pointer"
                    onClick={goToOrders}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Đơn hàng của tôi
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-500 hover:bg-red-500/10 hover:text-red-600 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                className="hidden sm:flex hover:bg-primary/80 cursor-pointer"
                onClick={() => setShowLoginDialog(true)}
              >
                <LogIn className="mr-2 h-5 w-5" />
                <span className="hidden lg:inline">Đăng nhập</span>
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative hover:bg-primary/80 cursor-pointer"
                >
                  <ShoppingBag className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent className="flex flex-col bg-primary text-primary-foreground border-l-0">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <span>Giỏ hàng của bạn ({itemCount})</span>

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
                            <AlertDialogTitle>
                              Xóa tất cả sản phẩm?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này sẽ xóa tất cả {itemCount} sản phẩm
                              trong giỏ hàng. Bạn có chắc chắn muốn tiếp tục?
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
                    cartItems.map((item) => (
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
                        <span className="text-accent">
                          {totalAmount.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <SheetClose asChild>
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={goToCheckout}
                        >
                          Tiến hành Thanh toán
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        {isSearchExpanded && (
          <form
            onSubmit={handleSearch}
            className="md:hidden pb-4 animate-in slide-in-from-top duration-300"
            ref={searchRef}
          >
            <div className="relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => searchTerm && setShowDropdown(true)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pr-20 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
                autoFocus
                autoComplete="off"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-primary-foreground/20"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-primary-foreground/20"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Dropdown */}
              {showDropdown && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((product) => (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() => handleSelectSuggestion(product.name)}
                        className="w-full text-left px-4 py-3 hover:bg-accent/10 transition-colors border-b border-border last:border-b-0"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {highlightMatch(product.name, searchTerm)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.price.toLocaleString('vi-VN')}đ /{' '}
                          {product.unit}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Login Dialog */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </header>
  );
}

export default Header;
