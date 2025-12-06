import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import EnhancedHeader from './Header';
import Footer from '../Footer';
import FloatingRecipeButton from '../FloatingRecipeButton';

const CategoryDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  // Helper to slugify text (must match the one used in navigation)
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
        setLoading(true);
        // Fetch all data and filter client-side
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/categories'),
        ]);

        const allProducts = productsRes.data;
        const allCategories = categoriesRes.data;

        // Find category by slug
        const category = allCategories.find((c) => slugify(c.name) === slug);

        if (category) {
          setCategoryName(category.name);
          const filtered = allProducts.filter(
            (p) => p.category === category._id,
          );
          setProducts(filtered);
        } else {
          // Fallback or handle not found
          setCategoryName('Danh mục không tồn tại');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <EnhancedHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="p-2 h-auto hover:bg-transparent hover:text-primary -ml-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? 'Đang tải...' : categoryName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {products.length} sản phẩm
              </p>
            </div>
          </div>

          <Button variant="outline" className="hidden md:flex gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400">
              Không tìm thấy sản phẩm nào trong danh mục này.
            </p>
            <Button
              variant="link"
              onClick={() => navigate('/')}
              className="mt-2"
            >
              Quay lại trang chủ
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <FloatingRecipeButton />
    </div>
  );
};

export default CategoryDetail;
