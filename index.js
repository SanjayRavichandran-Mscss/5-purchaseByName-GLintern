const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const dotenv = require("dotenv").config();

const db = require('./config/db');

const app = express();

app.use(bodyParser.json());

// Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: err.message });
});


// Start the Server
db.query("SELECT 1")
  .then(() => {
    console.log("MySQL connected!");
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => console.error("Database connection failed:", err.message));
