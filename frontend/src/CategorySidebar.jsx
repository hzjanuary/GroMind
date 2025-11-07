// src/CategorySidebar.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

function CategorySidebar({ onSelectCategory, selectedCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="p-4 rounded-lg border shadow-md">
      <h3 className="text-lg font-bold mb-4 flex items-center transition-colors hover:text-primary cursor-pointer">
        <LayoutGrid className="mr-2 h-5 w-5" />
        Danh mục sản phẩm
      </h3>
      <div className="space-y-2">
        <Button
          variant={!selectedCategory ? "secondary" : "ghost"}
          className="w-full justify-start cursor-pointer"
          onClick={() => onSelectCategory(null)}
        >
          Tất cả sản phẩm
        </Button>
        {categories.map(category => (
          <Button
            key={category._id}
            variant={selectedCategory === category._id ? "secondary" : "ghost"}
            className="w-full justify-start cursor-pointer"
            onClick={() => onSelectCategory(category._id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </nav>
  );
}

export default CategorySidebar;