import React from 'react';
import EnhancedHeader from './components/Header';
import Footer from './Footer';

const Favorites = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <EnhancedHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Sản phẩm yêu thích
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Danh sách sản phẩm yêu thích của bạn đang trống.
        </p>
        <p className="text-gray-500 mt-2 text-sm">
          (Tính năng đang được phát triển)
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
