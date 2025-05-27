const express = require('express');
const router = express.Router(); 

const {
  getRecipesByIngredients,
  getRecipeById,
  createRecipe
} = require('../controllers/recipeController'); 

// searches according to ingridients
router.get('/', getRecipesByIngredients);

// searches using id
router.get('/:id', getRecipeById);

// creates new recipe
router.post('/', createRecipe);

module.exports = router;
