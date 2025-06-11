import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

//creates a page for recipe
function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  //finds recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/recipes/${id}`);
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        setError('Failed to load recipe.');
      }
    };
    fetchRecipe();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{recipe.title}</h1>
      {recipe.imageURL && <img src={recipe.imageURL} alt={recipe.title} width="300" />}
      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h3>Instructions:</h3>
      <p>{recipe.instructions}</p>
      {recipe.tags?.length > 0 && (
        <>
          <h4>Tags:</h4>
          <p>{recipe.tags.join(', ')}</p>
        </>
      )}
    </div>
  );
}

export default RecipeDetails;
