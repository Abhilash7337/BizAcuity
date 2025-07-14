const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { 
  getUserById, 
  updatePassword, 
  updateProfile, 
  choosePlan, 
  searchUsers 
} = require('../controllers/userController');

// Protected route - Get user
router.get('/user/:id', verifyToken, getUserById);

// Update password - Protected
router.put('/user/update-password/:id', verifyToken, updatePassword);

// Update user profile - Protected
router.put('/user/profile/:id', verifyToken, updateProfile);

// Choose plan - Protected
router.post('/api/user/choose-plan', verifyToken, choosePlan);

// Search users endpoint - Protected
router.get('/users/search', verifyToken, searchUsers);

module.exports = router;
