const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },     //name of food
  ingredients: [{ type: String }],      
  instructions: { type: String, required: true },
  imageURL: { type: String },  //optional
  tags: [{ type: String }]     //vegeterian, gluten free,...
});

module.exports = mongoose.model('Recipe', recipeSchema);
