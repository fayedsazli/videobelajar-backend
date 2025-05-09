const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Endpoint Register User
router.post('/register', registerUser);

// Endpoint Login User
router.post('/login', loginUser);

// Contoh Protected Route
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: "Profile data fetched successfully",
    user: req.user  // Data ini berasal dari payload JWT
  });
});

module.exports = router;
