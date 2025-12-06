// Mobile-optimized components and responsive utilities

// Mobile Navigation Component
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Home,
  ShoppingBag,
  User,
  Heart,
  Search,
  Menu,
  X,
  Phone,
  MapPin,
  ChevronRight
} from 'lucide-react';

function MobileNavigation({ cartItems, isAuthenticated, user }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: "Trang chủ", href: "/" },
    { icon: <Search className="h-5 w-5" />, label: "Tìm kiếm", href: "/search" },
    { icon: <Heart className="h-5 w-5" />, label: "Yêu thích", href: "/favorites" },
    { icon: <ShoppingBag className="h-5 w-5" />, label: "Đơn hàng", href: "/orders" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">GroMind</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* User Info */}
          {isAuthenticated && (
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                </a>
              ))}
            </div>

            {/* Categories */}
            <div className="p-4 border-t">
              <h3 className="font-semibold mb-3">Danh mục</h3>
              <div className="space-y-2">
                <a href="/categories/vegetables" className="block p-2 hover:bg-gray-100 rounded">
                  🥬 Rau củ
                </a>
                <a href="/categories/fruits" className="block p-2 hover:bg-gray-100 rounded">
                  🍎 Trái cây
                </a>
                <a href="/categories/meat" className="block p-2 hover:bg-gray-100 rounded">
                  🥩 Thịt cá
                </a>
                <a href="/categories/dry" className="block p-2 hover:bg-gray-100 rounded">
                  🌾 Đồ khô
                </a>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>1900-1234</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Giao hàng toàn quốc</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Mobile Product Grid Component
function MobileProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {products.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Product Image */}
          <div className="relative aspect-square">
            <img
              src={product.image || `https://picsum.photos/seed/${product._id}/200/200.jpg`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                -{product.discountPercent}%
              </span>
            )}
          </div>
          
          {/* Product Info */}
          <div className="p-3">
            <h3 className="font-medium text-sm mb-1 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                {product.discountPercent > 0 ? (
                  <>
                    <p className="text-sm font-bold text-red-600">
                      {Math.round(product.price * (1 - product.discountPercent / 100)).toLocaleString('vi-VN')}đ
                    </p>
                    <p className="text-xs text-gray-400 line-through">
                      {product.price.toLocaleString('vi-VN')}đ
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-bold text-gray-900">
                    {product.price.toLocaleString('vi-VN')}đ
                  </p>
                )}
              </div>
              <Button
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => addToCart(product)}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Mobile Search Component
function MobileSearch({ onSearch, allProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredProducts = searchTerm
    ? allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="px-4 py-3 bg-white border-b">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        />
        <button
          onClick={() => onSearch(searchTerm)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
        >
          <Search className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Search Results */}
      {showResults && filteredProducts.length > 0 && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {filteredProducts.map((product) => (
            <button
              key={product._id}
              onClick={() => {
                onSearch(product.name);
                setSearchTerm(product.name);
                setShowResults(false);
              }}
              className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 border-b last:border-b-0"
            >
              <img
                src={`https://picsum.photos/seed/${product._id}/40/40.jpg`}
                alt={product.name}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {product.price.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile Cart Component
function MobileCart({ cartItems, totalAmount, onCheckout }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium">Giỏ hàng ({cartItems.length})</span>
          <span className="font-bold text-lg">
            {totalAmount.toLocaleString('vi-VN')}đ
          </span>
        </div>
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          onClick={onCheckout}
        >
          Thanh toán
        </Button>
      </div>
    </div>
  );
}

// Responsive utilities
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

// Touch-friendly button sizes
export const touchableSizes = {
  small: 'p-3 min-h-[44px]',
  medium: 'p-4 min-h-[48px]',
  large: 'p-6 min-h-[52px]'
};

// Mobile-optimized spacing
export const mobileSpacing = {
  container: 'px-4',
  section: 'py-6',
  card: 'p-4',
  button: 'py-3 px-6'
};

export {
  MobileNavigation,
  MobileProductGrid,
  MobileSearch,
  MobileCart
};