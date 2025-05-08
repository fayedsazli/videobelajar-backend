const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Endpoint Register User
router.post('/register', registerUser);

// Endpoint Login User
router.post('/login', loginUser);

module.exports = router;
