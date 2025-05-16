const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendVerificationEmail } = require('../services/emailService');
require('dotenv').config();

// Koneksi Database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Register User
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

      // Generate Verification Token
      const verificationToken = uuidv4();

      // Insert ke database
      const insertQuery = `INSERT INTO user (Nama, Email, Password, No_Hp, Role, VerificationToken, Created_at, Updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
      db.query(insertQuery, [Nama, Email, hashedPassword, No_Hp, Role, verificationToken], (err, result) => {
        if (err) return res.status(500).json({ message: "Failed to register user", error: err });

        // Kirim Email Verifikasi
        sendVerificationEmail(Email, verificationToken);

        res.status(201).json({ 
          message: "User registered successfully. Please check your email for verification link." 
        });
      });
    });
  });
};

// Login User
const loginUser = (req, res) => {
  const { Email, Password } = req.body;

  // Cek apakah user ada di database
  const query = `SELECT * FROM user WHERE Email = ?`;
  db.query(query, [Email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    // Bandingkan password
    bcrypt.compare(Password, user.Password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: "Error comparing passwords", error: err });

      if (!isMatch) {
        return res.status(401).json({ message: "Password is incorrect" });
      }

      // Generate Token
      const token = jwt.sign(
        {
          userId: user.ID,
          email: user.Email,
          role: user.Role,
        },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
      );

      // Kirim response sukses
      res.status(200).json({
        message: "Login successful",
        token: token,
      });
    });
  });
};

module.exports = { registerUser, loginUser };


