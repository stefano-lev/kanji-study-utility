// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Import kanji routes
const kanjiRoutes = require('./routes/kanji');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/kanji', kanjiRoutes); // Connect kanji routes

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
