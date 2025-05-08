const Recipe = require('../models/Recipe');

// searches recipes according to ingridients
const getRecipesByIngredients = async (req, res) => {
  const ingredients = req.query.ingredients?.split(',') || [];

  try {
    const recipes = await Recipe.find({
      ingredients: { $all: ingredients } 
    });

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 //going to page on specific recipe
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// creates a new recipe
const createRecipe = async (req, res) => {
  const { title, ingredients, instructions, imageURL, tags } = req.body;

  const newRecipe = new Recipe({
    title,
    ingredients,
    instructions,
    imageURL,
    tags
  });

  try {
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getRecipesByIngredients,
  getRecipeById,
  createRecipe
};
