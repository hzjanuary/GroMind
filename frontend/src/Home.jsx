// src/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

// Import các component
import Header from './Header.jsx';
import CategorySidebar from './CategorySidebar.jsx';
import ProductList from './ProductList.jsx';
import Footer from './Footer.jsx';
import RecipeSuggestion from './RecipeSuggestion.jsx';
import RecipeSearch from './RecipeSearch.jsx';
import RecipeDialog from './RecipeDialog.jsx';
import FloatingRecipeButton from './FloatingRecipeButton.jsx';

// URL backend
const BACKEND_URL = 'http://localhost:5000';

// Countdown Badge Component
function CountdownBadge({ endTime }) {
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
    <div className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
      <Clock className="h-3 w-3" />
      <span>{timeLeft}</span>
    </div>
  );
}

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/products`),
          axios.get(`${BACKEND_URL}/api/categories`),
        ]);
        setAllProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    };
    fetchData();

    // Listen for custom event from FloatingRecipeButton
    const handleOpenRecipeDialog = () => setShowRecipeDialog(true);

    window.addEventListener('openRecipeDialog', handleOpenRecipeDialog);

    return () => {
      window.removeEventListener('openRecipeDialog', handleOpenRecipeDialog);
    };
  }, []);

  // Featured products (isFeatured = true), sorted A-Z, max 4
  const featuredProducts = allProducts
    .filter((p) => p.isFeatured)
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'))
    .slice(0, 4);

  const filteredProducts = selectedCategory
    ? allProducts.filter((product) => product.category === selectedCategory)
    : allProducts;

  // Thêm filter theo search query
  const displayedProducts = searchQuery
    ? filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : filteredProducts;

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Scroll to products section khi search
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <Header onSearch={handleSearch} allProducts={allProducts} />

      {/* When searching or filtering by category, show normal layout */}
      {searchQuery || selectedCategory ? (
        <div className="container mx-auto mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
          <aside className="lg:col-span-1">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </aside>

          <main className="lg:col-span-3 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold">
                  {searchQuery
                    ? `Kết quả tìm kiếm: "${searchQuery}"`
                    : 'Sản phẩm'}
                </h2>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
              {displayedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Không tìm thấy sản phẩm nào phù hợp với "{searchQuery}"
                  </p>
                </div>
              ) : (
                <ProductList products={displayedProducts} />
              )}
            </section>

            <hr />

            {/* Hidden Recipe Sections */}
            <section className="space-y-8 hidden" data-recipe-section>
              <div>
                <RecipeSuggestion allProducts={allProducts} />
              </div>
              <div>
                <RecipeSearch allProducts={allProducts} />
              </div>
            </section>
          </main>
        </div>
      ) : (
        // Home page: Featured products + Categories with products
        <div className="container mx-auto mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
          <aside className="lg:col-span-1">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </aside>

          <main className="lg:col-span-3 space-y-8">
            {/* Featured Products Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold">Sản phẩm khuyến mãi</h2>
                {featuredProducts.length > 0 &&
                  featuredProducts[0]?.discountEndTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        Kết thúc trong
                      </span>
                      <CountdownBadge
                        endTime={featuredProducts[0].discountEndTime}
                      />
                    </div>
                  )}
              </div>
              {featuredProducts.length > 0 ? (
                <div className="space-y-4">
                  <ProductList products={featuredProducts} />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    Chưa có sản phẩm khuyến mãi
                  </p>
                </div>
              )}
            </section>

            <hr />

            {/* Categories with Products */}
            <section className="space-y-8">
              {categories.map((category) => {
                const isExpanded = expandedCategories[category._id];
                const allCategoryProducts = allProducts
                  .filter((p) => p.category === category._id)
                  .sort((a, b) => a.name.localeCompare(b.name, 'vi'));
                const displayedProducts = isExpanded
                  ? allCategoryProducts
                  : allCategoryProducts.slice(0, 4);
                const hasMore = allCategoryProducts.length > 4;

                return (
                  <div key={category._id}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                    </div>
                    {displayedProducts.length > 0 ? (
                      <>
                        <ProductList products={displayedProducts} />
                        {hasMore && !isExpanded && (
                          <div className="text-center mt-4">
                            <Button
                              variant="outline"
                              onClick={() =>
                                setExpandedCategories({
                                  ...expandedCategories,
                                  [category._id]: true,
                                })
                              }
                              className="px-8"
                            >
                              Xem thêm {allCategoryProducts.length - 4} sản phẩm
                            </Button>
                          </div>
                        )}
                        {isExpanded && (
                          <div className="text-center mt-4">
                            <Button
                              variant="outline"
                              onClick={() =>
                                setExpandedCategories({
                                  ...expandedCategories,
                                  [category._id]: false,
                                })
                              }
                              className="px-8"
                            >
                              Thu gọn
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground">
                        Chưa có sản phẩm trong danh mục này
                      </p>
                    )}
                  </div>
                );
              })}
            </section>

            <hr />

            {/* Hidden Recipe Sections */}
            <section className="space-y-8 hidden" data-recipe-section>
              <div>
                <RecipeSuggestion allProducts={allProducts} />
              </div>
              <div>
                <RecipeSearch allProducts={allProducts} />
              </div>
            </section>
          </main>
        </div>
      )}

      {/* Recipe Dialog */}
      <RecipeDialog
        isOpen={showRecipeDialog}
        onClose={() => setShowRecipeDialog(false)}
        allProducts={allProducts}
      />

      <Footer />
      <FloatingRecipeButton />
    </div>
  );
}
