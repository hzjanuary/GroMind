import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChefHat, X } from "lucide-react";

function FloatingRecipeButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Hiển thị button khi scroll xuống 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToRecipes = () => {
    // Tìm section recipes - có thể dùng id hoặc class
    const recipesSection = document.querySelector('[data-recipe-section]');
    if (recipesSection) {
      recipesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <Button
          onClick={scrollToRecipes}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden pr-6 pl-5 py-6"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient"></div>
          
          {/* Content */}
          <div className="relative flex items-center gap-3">
            <ChefHat className="h-5 w-5 animate-bounce" />
            <span className="font-semibold whitespace-nowrap">
              Bạn chưa biết ăn gì?
            </span>
          </div>
        </Button>
      </div>

      {/* Custom animation for gradient */}
      <style>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </>
  );
}

export default FloatingRecipeButton;