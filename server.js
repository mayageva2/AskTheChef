//loads variables from .env
require('dotenv').config();
console.log("🔍 Loaded MONGO_URI:", process.env.MONGO_URI);

// includes libraries
const express = require('express');
const mongoose = require('mongoose');

// includes router's file
const recipeRoutes = require('./routes/recipeRoutes');

// creates the server app
const app = express();

// connects to mongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// transfers json to an object
app.use(express.json());

//connects the routers
app.use('/api/recipes', recipeRoutes);

// defining server port and runs the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
