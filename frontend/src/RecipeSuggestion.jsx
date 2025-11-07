import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input"; 
import { Loader2, AlertCircle, Wand2, Sparkles, ChefHat } from "lucide-react";

const BACKEND_URL = 'http://localhost:5000';

function RecipeSuggestion({ allProducts }) { 
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ingredientInput, setIngredientInput] = useState(''); 

  const handleGetSuggestion = async () => {
    if (!ingredientInput) {
      setError("Vui lòng nhập một nguyên liệu.");
      return;
    }
    
    if (allProducts.length === 0) {
      setError("Danh sách sản phẩm trống.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuggestion('');

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/suggest-recipe`, 
        {
          mainIngredient: ingredientInput, 
          availableProducts: allProducts // Gửi cả object vì backend xử lý được
        }
      );
      if (response.data && response.data.suggestion) {
        setSuggestion(response.data.suggestion);
      }
    } catch (err) {
      const errorMessage = err.response ? err.response.data.error : err.message;
      setError(`Không thể lấy gợi ý: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSuggestion = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      
      // Check if it's a bold header (starts with **)
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        const title = trimmed.replace(/\*\*/g, '');
        return (
          <div key={idx} className="mt-4 first:mt-0">
            <h4 className="font-bold text-lg text-primary flex items-center gap-2">
              {idx === 0 && <ChefHat className="h-5 w-5" />}
              {title}
            </h4>
          </div>
        );
      }
      
      // Check if line contains ** for inline bold
      if (trimmed.includes('**')) {
        const parts = trimmed.split('**');
        return (
          <p key={idx} className="text-sm leading-relaxed mb-2">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
            )}
          </p>
        );
      }
      
      // Handle bullet points
      if (/^[•·-]/.test(trimmed)) {
        return (
          <div key={idx} className="flex gap-3 items-start mb-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span className="flex-1 text-sm leading-relaxed">
              {trimmed.replace(/^[•·-]\s*/, '')}
            </span>
          </div>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\./.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s*\*\*(.*?)\*\*:?\s*(.*)/);
        if (match) {
          const [, number, title, content] = match;
          return (
            <div key={idx} className="flex gap-3 mb-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">{number}</span>
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-foreground">{title}</p>
                {content && <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>}
              </div>
            </div>
          );
        }
        // Simple numbered item
        return (
          <div key={idx} className="flex gap-2 mb-2">
            <span className="font-semibold text-accent-foreground min-w-[2rem]">
              {trimmed.match(/^\d+\./)[0]}
            </span>
            <span className="flex-1 text-sm leading-relaxed">{trimmed.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={idx} className="text-sm leading-relaxed mb-2 text-foreground/90">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="flex items-center">
          <Wand2 className="mr-2 h-6 w-6" />
          Gợi ý món ngon
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center gap-2">
          <Input 
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGetSuggestion()}
            placeholder="Nhập một nguyên liệu (ví dụ: Thịt ba chỉ)"
            className="flex-1"
          />
          <Button 
            onClick={handleGetSuggestion} 
            disabled={isLoading || allProducts.length === 0}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang hỏi AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {allProducts.length === 0 ? 'Đang tải...' : 'Lấy gợi ý'}
              </>
            )}
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* AI Response Section */}
        {suggestion && (
          <div className="border-t pt-6 mt-4">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="text-lg font-bold">Gợi ý từ AI</h3>
            </div>
            
            <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background border border-primary/20 rounded-lg p-6 space-y-3">
              {formatSuggestion(suggestion)}
            </div>
            
            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setSuggestion('');
                  setIngredientInput('');
                }}
              >
                Thử lại
              </Button>
              <Button 
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  // Could scroll to recipe search or pass data
                  console.log('View detailed recipe');
                }}
              >
                Xem công thức chi tiết
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecipeSuggestion;