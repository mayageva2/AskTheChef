import React, { useState } from 'react';
import './App.css';  //file containing page design

function App() {
  const [ingredients, setIngredients] = useState(''); //user's input
  const [recipes, setRecipes] = useState([]); //recipes output
  const [error, setError] = useState(null); //error message 

  //turns input into an ingredient
  const handleInputChange = (e) => {
    setIngredients(e.target.value);
  };

  //turns into array
  const handleSearch = async () => {
    const query = ingredients.split(',').map(i => i.trim()).join(',');

    try {
      //GET that returns a json
      const response = await fetch(`http://localhost:5000/api/recipes?ingredients=${query}`);
      const data = await response.json();

      setRecipes(data);
      setError(null);
    } catch (err) { //in case of error
      setError('Failed to fetch recipes.');
      setRecipes([]);
    }
  };

  return (
    <div className="container">
      <h1>ASK THE CHEF</h1>
      <p>Enter ingredients separated by commas:</p>

      <input //search bar
        type="text"
        value={ingredients}
        onChange={handleInputChange}
        placeholder="egg, tomato, onion"
      />

      //search button
      <button onClick={handleSearch}>Search</button> 
      <hr />
      <h2>Results:</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {recipes.length === 0 && !error && <p>No recipes found.</p>}

      {recipes.map(recipe => ( //shows recipe
        <div className="recipe-card" key={recipe._id}>
          <h3>{recipe.title}</h3>

          {recipe.imageURL && (
            <img src={recipe.imageURL} alt={recipe.title} width="150" />
          )}

          <p>{recipe.instructions}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
