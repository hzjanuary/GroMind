// src/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

// Import các component
import Header from './Header.jsx';
import CategorySidebar from './CategorySidebar.jsx';
import ProductList from './ProductList.jsx';
import Footer from './Footer.jsx';
import RecipeSuggestion from './RecipeSuggestion.jsx';
import RecipeSearch from './RecipeSearch.jsx';
import FloatingRecipeButton from './FloatingRecipeButton.jsx';
import { useScrollReveal } from './hooks/useScrollReveal.js';

// URL backend
const BACKEND_URL = 'http://localhost:5000';

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll reveal hooks cho từng section
  const [recipeSuggestionRef, isSuggestionVisible] = useScrollReveal({
    threshold: 0.2,
  });
  const [recipeSearchRef, isSearchVisible] = useScrollReveal({
    threshold: 0.2,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products`);
        setAllProducts(response.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách sản phẩm:', err);
      }
    };
    fetchProducts();
  }, []);

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
                  : 'Sản phẩm nổi bật'}
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

          {/* THÊM data-recipe-section để FloatingButton có thể scroll tới đây */}
          <section className="space-y-8" data-recipe-section>
            {/* RecipeSuggestion với scroll animation */}
            <div
              ref={recipeSuggestionRef}
              className={`transition-all duration-1000 ease-out ${
                isSuggestionVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <RecipeSuggestion allProducts={allProducts} />
            </div>

            {/* RecipeSearch với scroll animation (delay hơn) */}
            <div
              ref={recipeSearchRef}
              className={`transition-all duration-1000 ease-out delay-200 ${
                isSearchVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <RecipeSearch allProducts={allProducts} />
            </div>
          </section>
        </main>
      </div>

      <Footer />
      <FloatingRecipeButton />
    </div>
  );
}
