import React from 'react';
import { useTheme } from './ThemeContext';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden hover:bg-primary/80 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {/* Sun Icon (Light Mode) */}
      <Sun 
        className={`h-5 w-5 absolute transition-all duration-500 ${
          isDark 
            ? 'rotate-90 scale-0 opacity-0' 
            : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      
      {/* Moon Icon (Dark Mode) */}
      <Moon 
        className={`h-5 w-5 absolute transition-all duration-500 ${
          isDark 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
    </Button>
  );
}

export default ThemeToggle;