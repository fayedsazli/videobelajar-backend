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

// Verify Email
router.get('/verify-email', (req, res) => {
  const { token } = req.query;

  const query = `SELECT * FROM user WHERE VerificationToken = ?`;
  db.query(query, [token], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid Verification Token" });
    }

    const updateQuery = `UPDATE user SET IsVerified = 1, VerificationToken = NULL WHERE VerificationToken = ?`;
    db.query(updateQuery, [token], (err, updateResult) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });

      res.status(200).json({ message: "Email Verified Successfully" });
    });
  });
});


module.exports = router;
