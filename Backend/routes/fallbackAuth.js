const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { registerUser, loginUser } = require('../controllers/authController');

// Fallback register (OTP-based registration is in auth.js routes)
router.post('/register', registerUser);

// Fallback login (verified user login is in auth.js routes)
router.post('/login', loginUser);

module.exports = router;
