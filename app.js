require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 5000;
const authRoutes = require('./routes/authRoutes');


// Middleware
app.use(express.json());

app.use(express.json());
app.use('/api', authRoutes);

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Cek Koneksi Database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err.message);
    return;
  }
  console.log("🔥 Connected to MySQL Database!");
});

// Test Endpoint
app.get("/", (req, res) => {
  res.send("EduCourse App is Running!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });