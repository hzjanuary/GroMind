import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from './CartContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertCircle,
  ChefHat,
  Loader2,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

function RecipeSearch({ allProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const handleSearch = async () => {
    if (!searchTerm) return;
    if (allProducts.length === 0) {
      setError('Chưa tải xong danh sách sản phẩm.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/get-recipe-details`,
        {
          dishName: searchTerm,
          availableProducts: allProducts.map((p) => p.name),
        },
      );
      setRecipe(response.data);
    } catch (err) {
      const errorMessage = err.response ? err.response.data.error : err.message;
      setError(`Không thể tìm thấy: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    if (!recipe) return;
    recipe.ingredients
      .filter((ing) => ing.product)
      .forEach((ing) => {
        addToCart(ing.product);
      });
  };

  const formatInstructions = (text) => {
    const lines = text.split('\n').filter((line) => line.trim());

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      // Bold header
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        const title = trimmed.replace(/\*\*/g, '');
        return (
          <h5
            key={idx}
            className="font-bold text-lg text-primary mt-4 first:mt-0 mb-2"
          >
            {title}
          </h5>
        );
      }

      // Inline bold
      if (trimmed.includes('**')) {
        const parts = trimmed.split('**');
        return (
          <p key={idx} className="text-sm leading-relaxed mb-2">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold">
                  {part}
                </strong>
              ) : (
                part
              ),
            )}
          </p>
        );
      }

      // Numbered with bold title
      const numberedMatch = trimmed.match(/^(\d+)\.\s*\*\*(.*?)\*\*:?\s*(.*)/);
      if (numberedMatch) {
        const [, number, title, content] = numberedMatch;
        return (
          <div key={idx} className="flex gap-3 mb-3">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">{number}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold">{title}</p>
              {content && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  {content}
                </p>
              )}
            </div>
          </div>
        );
      }

      // Simple numbered
      if (/^\d+\./.test(trimmed)) {
        return (
          <div key={idx} className="flex gap-2 mb-2">
            <span className="font-semibold text-accent-foreground min-w-[2rem]">
              {trimmed.match(/^\d+\./)[0]}
            </span>
            <span className="flex-1 text-sm leading-relaxed">
              {trimmed.replace(/^\d+\.\s*/, '')}
            </span>
          </div>
        );
      }

      // Bullet points
      if (/^[•·*-]\s/.test(trimmed)) {
        return (
          <div key={idx} className="flex gap-3 items-start mb-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span className="flex-1 text-sm leading-relaxed">
              {trimmed.replace(/^[•·*-]\s*/, '')}
            </span>
          </div>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-sm leading-relaxed mb-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="flex items-center">
          <ChefHat className="mr-2 h-6 w-6" />
          Tìm công thức món ăn (Bằng AI)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Nhập tên món ăn (ví dụ: Cá kho tộ)"
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
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
                {allProducts.length === 0 ? 'Đang tải...' : 'Tìm'}
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

        {recipe && (
          <div className="border-t pt-6 mt-4">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <h3 className="text-lg font-bold">Công thức từ AI</h3>
            </div>

            <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background border border-primary/20 rounded-lg p-6 space-y-4">
              {/* Recipe Title */}
              <div>
                <h4 className="text-xl font-bold text-primary">
                  {recipe.name}
                </h4>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                {formatInstructions(recipe.instructions)}
              </div>

              {/* Ingredients Section */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <div className="space-y-3 mt-6 pt-4 border-t border-primary/20">
                  <h5 className="font-bold text-lg text-primary">
                    Nguyên liệu cần mua từ shop:
                  </h5>
                  <div className="grid gap-2">
                    {recipe.ingredients
                      .filter((ing) => ing.product)
                      .map((ing) => (
                        <div
                          key={ing.product._id}
                          className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-primary font-bold">•</span>
                            <span className="font-semibold">
                              {ing.product.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">
                              {ing.product.price.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-sm text-muted-foreground">
                              / {ing.product.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setRecipe(null);
                    setSearchTerm('');
                  }}
                >
                  Tìm món khác
                </Button>
                <Button className="flex-1" onClick={handleAddAllToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4 cursor-pointer" />
                  Thêm tất cả vào giỏ
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecipeSearch;
