import React, { useState } from 'react';
import './App.css';  //file containing page design
import AddRecipe from './AddRecipe';

function App() {
  const [showAddPage, setShowAddPage] = useState(false); //add recipe
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); //favorites
  const [ingredients, setIngredients] = useState(''); //user's input
  const [recipes, setRecipes] = useState([]); //recipes output
  const [error, setError] = useState(null); //error message 

    //Favorite recipes feature
  const [favorites, setFavorites] = useState(() => {
  const stored = localStorage.getItem('favorites');
  return stored ? JSON.parse(stored) : [];
  });

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

   const activateFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];

    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
    };

   return (
    <div className="container">
      <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} style={{ marginRight: '10px' }}>
        {showFavoritesOnly ? "Show All Recipes" : "Show Favorites Only"}
      </button>

      <button onClick={() => setShowAddPage(!showAddPage)}>
        {showAddPage ? 'Back to Search' : 'Add Recipe'}
      </button>

      {showAddPage ? (
        <AddRecipe />
      ) : (
        <>
          <h1>ASK THE CHEF</h1>
          <p>Enter ingredients separated by commas:</p>

          <input
            type="text"
            value={ingredients}
            onChange={handleInputChange}
            placeholder="egg, tomato, onion"
          />
          <button onClick={handleSearch}>Search</button>

          <hr />
          <h2>Results:</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {recipes.length === 0 && !error && <p>No recipes found.</p>}

          {(showFavoritesOnly 
            ? recipes.filter(r => favorites.includes(r._id))
            : recipes
          ).map(recipe => (
            <div className="recipe-card" key={recipe._id}>
              <h3>
                <button onClick={() => activateFavorite(recipe._id)}>
                {favorites.includes(recipe._id) ? "♥" : "♡"}
                </button>
                {recipe.title}</h3>
              {recipe.imageURL && <img src={recipe.imageURL} alt={recipe.title} width="150" />}
              <p>{recipe.instructions}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
