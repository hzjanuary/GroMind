import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChefHat } from 'lucide-react';

function FloatingRecipeButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

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
    // Tìm section recipes
    const recipesSection = document.querySelector('[data-recipe-section]');
    if (recipesSection) {
      // Bật hiệu ứng
      setIsScrolling(true);

      // Scroll với animation mượt
      recipesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Tắt hiệu ứng sau khi scroll xong (1 giây)
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          isVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <Button
          onClick={scrollToRecipes}
          size="lg"
          className={`rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden pr-6 pl-5 py-6 ${
            isScrolling ? 'animate-bounce-smooth' : ''
          }`}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient"></div>

          {/* Content */}
          <div className="relative flex items-center gap-3">
            <ChefHat
              className={`h-5 w-5 transition-transform duration-300 ${
                isScrolling ? 'animate-wiggle' : 'group-hover:animate-bounce'
              }`}
            />
            <span className="font-semibold whitespace-nowrap">
              Bạn chưa biết ăn gì?
            </span>
          </div>

          {/* Ripple effect khi click */}
          {isScrolling && (
            <span className="absolute inset-0 animate-ping-slow bg-primary/30 rounded-full"></span>
          )}
        </Button>
      </div>

      {/* Custom animations */}
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
        
        @keyframes bounce-smooth {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }
        
        @keyframes ping-slow {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .animate-bounce-smooth {
          animation: bounce-smooth 0.6s ease-in-out;
        }
        
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 1s cubic-bezier(0, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
}

export default FloatingRecipeButton;
