import React, { useState } from 'react';
import './App.css';  //file containing page design
import AddRecipe from './AddRecipe';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RecipeDetails from './RecipeDetails';

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

  //activates the heart to save to favorites
  const activateFavorite = (id) => {
  const updated = favorites.includes(id)
    ? favorites.filter(favId => favId !== id)
    : [...favorites, id];

  setFavorites(updated);
  localStorage.setItem('favorites', JSON.stringify(updated));
  };

   return (
      <Router>
      <Routes>
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/" element={
          <div className="container">
           <div className="button-group">
            {!showAddPage && (
              <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
                {showFavoritesOnly ? "Show All Recipes" : "Show Favorites Only"}
              </button>
            )}
            
            <button onClick={() => setShowAddPage(!showAddPage)}>
              {showAddPage ? 'Back to Search' : 'Add Recipe'}
            </button>
          </div>

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
                    <Link to={`/recipe/${recipe._id}`}><h3>{recipe.title}</h3></Link>

                    {recipe.imageURL?.trim() && (
                      <img
                        src={recipe.imageURL}
                        alt={recipe.title}
                        width="150"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}

                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                      <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                    )}

                    <button className="heart-button" onClick={() => activateFavorite(recipe._id)}>
                      {favorites.includes(recipe._id) ? "♥" : "♡"}
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
