const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  instructions: String,
  image_url: String,
  ingredients: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity_description: { type: String, required: true }
    }
  ]
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;