const Recipe = require('../models/recipeModel');

const addRecipe = async (req, res) => {
  try {
    const { name, instructions, ingredients } = req.body;

    const formattedIngredients = ingredients.map(ing => ({
      product: ing.product_id,
      quantity_description: ing.quantity
    }));

    const newRecipe = new Recipe({
      name,
      instructions,
      ingredients: formattedIngredients
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Lỗi khi thêm công thức:", error);
    res.status(500).json({ error: 'Lỗi khi thêm công thức.' });
  }
};

const searchRecipes = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'Vui lòng nhập tên món ăn.' });
    }

    const recipe = await Recipe.findOne({ name: { $regex: name, $options: 'i' } })
                               .populate('ingredients.product'); // Lấy chi tiết sản phẩm

    if (!recipe) {
      return res.status(404).json({ error: 'Không tìm thấy món ăn.' });
    }
    res.json(recipe);
  } catch (error) {
    console.error("Lỗi khi tìm công thức:", error);
    res.status(500).json({ error: 'Lỗi khi tìm công thức.' });
  }
};

module.exports = { addRecipe, searchRecipes };