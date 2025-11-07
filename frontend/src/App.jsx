// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import các component
import Header from './Header.jsx';
import CategorySidebar from './CategorySidebar.jsx';
import ProductList from './ProductList.jsx';
import Footer from './Footer.jsx';
import RecipeSuggestion from './RecipeSuggestion.jsx';
import RecipeSearch from './RecipeSearch.jsx';
import FloatingRecipeButton from './FloatingRecipeButton.jsx'; // <- THÊM MỚI

// URL backend
const BACKEND_URL = 'http://localhost:5000';

function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/products`);
        setAllProducts(response.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? allProducts.filter(product => product.category === selectedCategory)
    : allProducts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header /> 

      <div className="container mx-auto mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8 px-4">
        
        <aside className="lg:col-span-1">
          <CategorySidebar 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </aside>

        <main className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4">Sản phẩm nổi bật</h2>
            <ProductList products={filteredProducts} />
          </section>
          
          <hr />
          
          {/* THÊM data-recipe-section để FloatingButton có thể scroll tới đây */}
          <section className="space-y-8" data-recipe-section>
            <RecipeSuggestion 
              allProducts={allProducts} 
            />
            
            <RecipeSearch 
              allProducts={allProducts} 
            />
          </section>
        </main>
        
      </div>
      
      <Footer />
      
      {/* THÊM FloatingRecipeButton */}
      <FloatingRecipeButton />
    </div>
  );
}

export default App;