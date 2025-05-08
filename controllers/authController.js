const bcrypt = require('bcrypt');
const mysql = require('mysql2');
require('dotenv').config();

// Koneksi Database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Register User
const registerUser = (req, res) => {
  const { Nama, Email, Password, No_Hp, Role } = req.body;

  // Cek apakah email sudah digunakan
  const checkQuery = `SELECT * FROM user WHERE Email = ?`;
  db.query(checkQuery, [Email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: "Hashing error", error: err });

      // Insert ke database
      const insertQuery = `INSERT INTO user (Nama, Email, Password, No_Hp, Role, Created_at, Updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;
      db.query(insertQuery, [Nama, Email, hashedPassword, No_Hp, Role], (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to register user", error: err });

        res.status(201).json({ message: "User registered successfully" });
      });
    });
  });
};

module.exports = { registerUser };
