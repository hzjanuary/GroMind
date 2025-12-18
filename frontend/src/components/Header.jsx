// Enhanced Header Component
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../CartContext.jsx';
import { useAuth } from '../AuthContext.jsx';
import LoginDialog from '../LoginDialog.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  LogIn,
  LogOut,
  Search,
  X,
  User,
  Menu,
  Phone,
  MapPin,
  Heart,
  ChevronDown,
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function Header({ onSearch, allProducts = [] }) {
  const {
    cartItems,
    itemCount,
    totalAmount,
    decreaseQuantity,
    addToCart,
    clearCart,
  } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);

  // Enhanced search with categories
  useEffect(() => {
    if (searchTerm.trim() && allProducts.length > 0) {
      const filtered = allProducts
        .filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .slice(0, 8);
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
      setIsSearchExpanded(false);
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-950 shadow-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 text-gray-900 dark:text-gray-100">
      {/* Top Bar - Contact Info */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>Hotline: 1900-1234</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Giao hàng toàn quốc</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">
              Miễn phí vận chuyển đơn &gt; 99k
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <a
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-transform hover:scale-105"
          >
            🥬 GroMind
          </a>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-lg mx-8"
            ref={searchRef}
          >
            <div className="relative w-full">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowDropdown(true)}
                placeholder="Tìm kiếm rau củ, trái cây, thực phẩm..."
                className="w-full pr-24 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
                autoComplete="off"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-gray-100"
                    onClick={() => {
                      setSearchTerm('');
                      setShowDropdown(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="submit"
                  className="h-7 bg-primary hover:bg-primary/90"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Enhanced Search Dropdown */}
              {showDropdown && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                  <div className="max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Gợi ý sản phẩm
                      </p>
                    </div>
                    {filteredSuggestions.map((product) => (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() => {
                          setSearchTerm(product.name);
                          if (onSearch) onSearch(product.name);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 flex items-center gap-3"
                      >
                        <img
                          src={`https://picsum.photos/seed/${product._id}/50/50.jpg`}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product.price.toLocaleString('vi-VN')}đ /{' '}
                            {product.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">
                            {product.price.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
              onClick={() => navigate('/favorites')}
            >
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                >
                  <ShoppingBag className="h-6 w-6" />
                  <span className="hidden sm:inline">Giỏ hàng</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent className="w-full sm:w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 transition-colors flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between">
                  <SheetTitle className="text-gray-900 dark:text-gray-100">
                    Giỏ hàng ({itemCount} sản phẩm)
                  </SheetTitle>
                  {itemCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-auto px-2 py-1"
                      onClick={clearCart}
                    >
                      Xóa tất cả
                    </Button>
                  )}
                </SheetHeader>

                <div className="flex-1 overflow-y-auto mt-4">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                      <ShoppingBag className="h-16 w-16 mb-4" />
                      <p>Giỏ hàng đang trống</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate('/')}
                      >
                        Tiếp tục mua sắm
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors"
                        >
                          <img
                            src={`https://picsum.photos/seed/${item._id}/60/60.jpg`}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.price.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                              onClick={() => decreaseQuantity(item._id)}
                            >
                              -
                            </Button>
                            <span className="w-6 text-center text-sm font-medium text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                              onClick={() => addToCart(item)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold text-lg mb-4 text-gray-900 dark:text-white">
                      <span>Tổng cộng:</span>
                      <span className="text-primary">
                        {totalAmount.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => navigate('/checkout')}
                    >
                      Thanh toán
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden lg:inline">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg z-50"
                >
                  <DropdownMenuLabel className="text-gray-900 dark:text-white">
                    Tài khoản
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
                  <DropdownMenuItem
                    onClick={() => navigate('/account')}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 text-gray-700 dark:text-gray-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/orders')}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 text-gray-700 dark:text-gray-200"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Đơn hàng của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/favorites')}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 text-gray-700 dark:text-gray-200"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Yêu thích
                  </DropdownMenuItem>
                  {user?.username === 'admin' && (
                    <>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
                      <DropdownMenuItem
                        onClick={() => navigate('/admin')}
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 text-gray-700 dark:text-gray-200"
                      >
                        ⚙️ Quản trị
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 dark:text-red-500 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 focus:bg-red-50 dark:focus:bg-red-950/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                className="hidden sm:flex hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                onClick={() => setShowLoginDialog(true)}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Đăng nhập
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchExpanded && (
          <form onSubmit={handleSearch} className="md:hidden pb-4">
            <div className="relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pr-20"
                autoFocus
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setSearchTerm('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button type="submit" size="icon" className="h-7 w-7">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                setIsSearchExpanded(!isSearchExpanded);
                setIsMobileMenuOpen(false);
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate('/categories')}
            >
              <Menu className="mr-2 h-4 w-4" />
              Danh mục
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => navigate('/favorites')}
            >
              <Heart className="mr-2 h-4 w-4" />
              Yêu thích
            </Button>
            {!isAuthenticated && (
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowLoginDialog(true)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập
              </Button>
            )}
          </nav>
        </div>
      )}

      {/* Login Dialog */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </header>
  );
}

export default Header;
