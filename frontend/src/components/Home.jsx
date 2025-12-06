// Enhanced Home Page Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Clock,
  Truck,
  Shield,
  Leaf,
  Star,
  TrendingUp,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import EnhancedHeader from './Header.jsx';
import CategorySidebar from '../CategorySidebar.jsx';
import ProductCard from './ProductCard.jsx';
import Footer from '../Footer.jsx';
import RecipeSuggestion from '../RecipeSuggestion.jsx';
import RecipeDialog from '../RecipeDialog.jsx';
import FloatingRecipeButton from '../FloatingRecipeButton.jsx';

const BACKEND_URL = 'http://localhost:5000';

// Hero Section Component
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Rau củ tươi ngon mỗi ngày',
      subtitle: 'Nông sản hữu cơ từ nông trại đến bàn ăn',
      image: 'https://picsum.photos/seed/hero1/1200/400.jpg',
      cta: 'Mua ngay',
      discount: 'Giảm giá 20%',
    },
    {
      title: 'Trái cây nhập khẩu chất lượng',
      subtitle: 'Tươi mới, bảo đảm nguồn gốc',
      image: 'https://picsum.photos/seed/hero2/1200/400.jpg',
      cta: 'Khám phá',
      discount: 'Miễn phí vận chuyển',
    },
    {
      title: 'Thực phẩm sạch an toàn',
      subtitle: 'Cam kết không thuốc trừ sâu',
      image: 'https://picsum.photos/seed/hero3/1200/400.jpg',
      cta: 'Xem thêm',
      discount: 'Ưu đãi đặc biệt',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {slide.discount}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-6 text-white/90">
                    {slide.subtitle}
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                  >
                    {slide.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Features Section Component
function FeaturesSection() {
  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: 'Giao hàng nhanh',
      description: 'Trong vòng 2 giờ tại nội thành',
      color: 'bg-blue-500',
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: 'Nông sản hữu cơ',
      description: '100% sạch, không thuốc trừ sâu',
      color: 'bg-green-500',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Bảo đảm chất lượng',
      description: 'Hoàn tiền nếu không hài lòng',
      color: 'bg-purple-500',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Đặt hàng 24/7',
      description: 'Luôn sẵn sàng phục vụ',
      color: 'bg-orange-500',
    },
  ];

  return (
    <section className="py-12 bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div
                className={`w-16 h-16 ${feature.color} text-white rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Category Showcase Component
function CategoryShowcase({ categories, onSelectCategory, onViewAll }) {
  const categoryIcons = {
    'Rau củ': '🥬',
    'Trái cây': '🍎',
    'Thịt cá': '🥩',
    'Đồ khô': '🌾',
    Sữa: '🥛',
    Bánh: '🍰',
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Danh mục sản phẩm
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Khám phá các loại nông sản tươi ngon
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full md:w-auto"
            onClick={onViewAll}
          >
            Xem tất cả danh mục
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category._id}
              onClick={() => onSelectCategory(category._id)}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
            >
              <div className="text-4xl mb-3">
                {categoryIcons[category.name] || '📦'}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {category.productCount || 0} sản phẩm
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Enhanced Product Section Component
function ProductSection({
  title,
  products,
  subtitle,
  showViewAll = true,
  onViewAll,
}) {
  return (
    <section className="py-12 bg-white dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              {title}
              {title.includes('Khuyến mãi') && (
                <Sparkles className="h-6 w-6 text-yellow-500" />
              )}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>
          {showViewAll && (
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={onViewAll}
            >
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesListDialog({ isOpen, onClose, categories }) {
  const navigate = useNavigate();
  // Helper to slugify text
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl flex flex-col p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Tất cả danh mục
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                const slug = slugify(cat.name);
                navigate(`/danh-muc/${slug}`);
                onClose();
              }}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group text-center"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryProductsDialog({ isOpen, onClose, category, products }) {
  if (!category) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {category.name}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({products.length} sản phẩm)
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4 pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);

  // Helper to slugify text
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/products`),
          axios.get(`${BACKEND_URL}/api/categories`),
        ]);

        const products = productsRes.data;
        setAllProducts(products);

        // Calculate product counts manually since backend might not provide it
        const categoriesWithCounts = categoriesRes.data.map((cat) => ({
          ...cat,
          productCount: products.filter((p) => p.category === cat._id).length,
        }));
        setCategories(categoriesWithCounts);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    };
    fetchData();

    const handleOpenRecipeDialog = () => setShowRecipeDialog(true);
    window.addEventListener('openRecipeDialog', handleOpenRecipeDialog);
    return () =>
      window.removeEventListener('openRecipeDialog', handleOpenRecipeDialog);
  }, []);

  // Featured products
  const featuredProducts = allProducts
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    .slice(0, 8);

  // New arrivals
  const newArrivals = allProducts
    .filter((p) => p.isNew)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  // Best sellers
  const bestSellers = allProducts
    .filter((p) => p.isBestSeller)
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 8);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // Scroll to products section
    window.scrollTo({ top: 800, behavior: 'smooth' });
  };

  // If searching or filtering, show filtered view
  if (searchQuery || selectedCategory) {
    const filteredProducts = selectedCategory
      ? allProducts.filter((product) => product.category === selectedCategory)
      : allProducts;

    const displayedProducts = searchQuery
      ? filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : filteredProducts;

    return (
      <div>
        <EnhancedHeader onSearch={handleSearch} allProducts={allProducts} />

        <div className="container mx-auto mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
          <aside className="lg:col-span-1">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </aside>

          <main className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery
                  ? `Kết quả tìm kiếm: "${searchQuery}"`
                  : 'Sản phẩm'}
              </h2>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="mt-2"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy sản phẩm nào phù hợp
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>

        <Footer />
        <FloatingRecipeButton />
      </div>
    );
  }

  // Normal home view
  return (
    <div>
      <EnhancedHeader onSearch={handleSearch} allProducts={allProducts} />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <ProductSection
          title="Sản phẩm khuyến mãi"
          subtitle="Ưu đãi đặc biệt chỉ có tại GroMind"
          products={featuredProducts}
          showViewAll={false}
        />
      )}

      {/* Categories */}

      <CategoryShowcase
        categories={categories}
        onSelectCategory={handleCategorySelect}
        onViewAll={() => setShowCategoriesDialog(true)}
      />

      {/* Per Category Sections */}
      {categories.map((category) => {
        const allCategoryProducts = allProducts.filter(
          (p) => p.category === category._id,
        );
        const categoryProducts = allCategoryProducts.slice(0, 4);

        if (categoryProducts.length === 0) return null;

        return (
          <ProductSection
            key={category._id}
            title={category.name}
            subtitle={`Khám phá các sản phẩm ${category.name}`}
            products={categoryProducts}
            showViewAll={true}
            onViewAll={() => navigate(`/danh-muc/${slugify(category.name)}`)}
          />
        );
      })}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <ProductSection
          title="Sản phẩm mới"
          subtitle="Nông sản tươi mới về hôm nay"
          products={newArrivals}
          showViewAll={false}
        />
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <ProductSection
          title="Sản phẩm bán chạy"
          subtitle="Được khách hàng tin tưởng lựa chọn"
          products={bestSellers}
          showViewAll={false}
        />
      )}

      {/* Recipe Dialog */}
      <RecipeDialog
        isOpen={showRecipeDialog}
        onClose={() => setShowRecipeDialog(false)}
        allProducts={allProducts}
      />

      <CategoriesListDialog
        isOpen={showCategoriesDialog}
        onClose={() => setShowCategoriesDialog(false)}
        categories={categories}
      />

      <Footer />
      <FloatingRecipeButton />
    </div>
  );
}
