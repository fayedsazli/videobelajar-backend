const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Cek apakah ada token di header
  if (!authHeader) {
    return res.status(403).json({ message: "Authorization header is missing" });
  }

  // Format Authorization: Bearer <token>
  const token = authHeader.split(' ')[1];

  // Verifikasi token
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    
    // Menyimpan data user yang sudah didecode ke dalam request
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
