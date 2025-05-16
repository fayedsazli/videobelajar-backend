const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
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
// Register User
const registerUser = async (req, res) => {
  const { Nama, Email, Password, No_Hp, Role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = await User.create({
      Nama,
      Email,
      Password: hashedPassword,
      No_Hp,
      Role,
      Created_at: new Date(),
      Updated_at: new Date()
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await User.findOne({ where: { Email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      {
        userId: user.ID,
        email: user.Email,
        role: user.Role,
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to login", error });
  }
};

module.exports = { registerUser, loginUser };


