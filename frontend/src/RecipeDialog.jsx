import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from './CartContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  ChefHat,
  Loader2,
  ShoppingCart,
  Sparkles,
  Wand2,
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

function RecipeDialog({ isOpen, onClose, allProducts }) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('suggest');

  // Suggestion tab state
  const [suggestionInput, setSuggestionInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionError, setSuggestionError] = useState(null);

  // Search tab state
  const [searchTerm, setSearchTerm] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Handle tab change - clear data from previous tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    // Clear suggestion tab data when switching away
    if (tab === 'search') {
      setSuggestionInput('');
      setSuggestion('');
      setSuggestionError(null);
    }

    // Clear search tab data when switching away
    if (tab === 'suggest') {
      setSearchTerm('');
      setRecipe(null);
      setSearchError(null);
    }
  };

  const handleGetSuggestion = async () => {
    if (!suggestionInput) {
      setSuggestionError('Vui lòng nhập một nguyên liệu.');
      return;
    }

    if (allProducts.length === 0) {
      setSuggestionError('Danh sách sản phẩm trống.');
      return;
    }

    setSuggestionLoading(true);
    setSuggestionError(null);
    setSuggestion('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/suggest-recipe`, {
        mainIngredient: suggestionInput,
        availableProducts: allProducts,
      });
      if (response.data && response.data.suggestion) {
        setSuggestion(response.data.suggestion);
      }
    } catch (err) {
      const errorMessage = err.response ? err.response.data.error : err.message;
      setSuggestionError(`Không thể lấy gợi ý: ${errorMessage}`);
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    if (allProducts.length === 0) {
      setSearchError('Chưa tải xong danh sách sản phẩm.');
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
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
      setSearchError(`Không thể tìm thấy: ${errorMessage}`);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    if (!recipe || !recipe.ingredients) return;

    recipe.ingredients.forEach((ingredientItem) => {
      // ingredientItem has structure: { product: { _id, name, price, unit, ... } }
      if (ingredientItem.product) {
        addToCart(ingredientItem.product);
      }
    });

    setSearchTerm('');
    setRecipe(null);
    onClose();
  };

  const formatSuggestion = (text) => {
    const lines = text.split('\n').filter((line) => line.trim());

    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        const title = trimmed.replace(/\*\*/g, '');
        return (
          <h3 key={idx} className="font-bold text-lg mt-3 mb-2">
            {title}
          </h3>
        );
      }

      if (trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 text-sm">
            {trimmed.substring(2)}
          </li>
        );
      }

      if (trimmed.startsWith('1. ') || /^\d+\. /.test(trimmed)) {
        return (
          <li key={idx} className="ml-4 text-sm list-decimal">
            {trimmed.replace(/^\d+\. /, '')}
          </li>
        );
      }

      return (
        trimmed && (
          <p key={idx} className="text-sm mb-2">
            {trimmed}
          </p>
        )
      );
    });
  };

  const handleClose = () => {
    setSuggestionInput('');
    setSuggestion('');
    setSuggestionError(null);
    setSearchTerm('');
    setRecipe(null);
    setSearchError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Trợ lý Minder
          </DialogTitle>
          <DialogDescription>
            Tìm gợi ý món ngon hoặc tìm kiếm công thức theo tên món ăn
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggest" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Gợi ý món ngon
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <Wand2 className="h-4 w-4" />
              Tìm công thức
            </TabsTrigger>
          </TabsList>

          {/* Suggestion Tab */}
          <TabsContent value="suggest" className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Nhập nguyên liệu bạn cần gợi ý
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="VD: cà chua, gà, cá..."
                  value={suggestionInput}
                  onChange={(e) => setSuggestionInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGetSuggestion()}
                  disabled={suggestionLoading}
                />
                <Button
                  onClick={handleGetSuggestion}
                  disabled={suggestionLoading}
                  className="gap-2"
                >
                  {suggestionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tìm...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Gợi ý
                    </>
                  )}
                </Button>
              </div>
            </div>

            {suggestionError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{suggestionError}</AlertDescription>
              </Alert>
            )}

            {suggestion && (
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-bold text-base mb-3">Công thức gợi ý:</h3>
                <ul className="space-y-1">{formatSuggestion(suggestion)}</ul>
              </div>
            )}
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Nhập món ăn bạn muốn tìm kiếm
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="VD: cơm chiên, canh chua..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={searchLoading}
                />
                <Button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="gap-2"
                >
                  {searchLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tìm...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Tìm
                    </>
                  )}
                </Button>
              </div>
            </div>

            {searchError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{searchError}</AlertDescription>
              </Alert>
            )}

            {recipe && (
              <div className="space-y-4 border rounded-lg p-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">{recipe.name}</h3>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Nguyên liệu:</h4>
                  <ul className="space-y-1">
                    {recipe.ingredients &&
                      recipe.ingredients.map((ingredientItem, idx) => {
                        const product = ingredientItem.product;
                        const isAvailable = allProducts.some(
                          (p) =>
                            p.name.toLowerCase() === product.name.toLowerCase(),
                        );
                        return (
                          <li
                            key={idx}
                            className={`text-sm ${
                              isAvailable
                                ? 'text-foreground'
                                : 'text-muted-foreground line-through'
                            }`}
                          >
                            {product.name}
                            {!isAvailable && ' (không có)'}
                          </li>
                        );
                      })}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Hướng dẫn:</h4>
                  <p className="text-sm whitespace-pre-wrap">
                    {recipe.instructions}
                  </p>
                </div>

                <Button onClick={handleAddAllToCart} className="w-full gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Thêm tất cả vào giỏ hàng
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default RecipeDialog;
