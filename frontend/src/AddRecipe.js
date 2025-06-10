import React, { useState } from 'react';

function AddRecipe() {
  const [formData, setFormData] = useState({  //creating an empty recipe
    title: '',
    ingredients: '',
    instructions: '',
    imageURL: '',
    tags: ''
  });

  const [message, setMessage] = useState(''); //message for user: success or fail

  //entering new recipe data
  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value 
    });
  };

  //sending the form and preventing page refresh
  const handleSubmit = async (e) => {
    e.preventDefault();

    //creating object
    const payload = {
      ...formData,
      ingredients: formData.ingredients.split(',').map(i => i.trim()),
      tags: formData.tags.split(',').map(t => t.trim())
    };

    try {  //server POST request
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to add recipe'); //test if worked well

      const data = await response.json();
      setMessage(`Recipe "${data.title}" added successfully!`);
      setFormData({ title: '', ingredients: '', instructions: '', imageURL: '', tags: '' });
    } catch (err) {  //incase of an error
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="container">
      <h2>Add a New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required /><br /><br />
        <input name="ingredients" value={formData.ingredients} onChange={handleChange} placeholder="Ingredients (comma separated)" required /><br /><br />
        <textarea name="instructions" value={formData.instructions} onChange={handleChange} placeholder="Instructions" required /><br /><br />
        <input name="imageURL" value={formData.imageURL} onChange={handleChange} placeholder="Image URL" /><br /><br />
        <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" /><br /><br />
        <button type="submit">Add Recipe</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddRecipe;
