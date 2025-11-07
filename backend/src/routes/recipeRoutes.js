const express = require('express');
const router = express.Router();
const { addRecipe, searchRecipes } = require('../controllers/recipeController');

// POST /api/recipes
router.post('/', addRecipe);

// GET /api/recipes/search?name=...
router.get('/search', searchRecipes);

module.exports = router;