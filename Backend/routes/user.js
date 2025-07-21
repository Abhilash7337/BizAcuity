const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getPublicPlans } = require('../controllers/planController');
const { 
  getUserById, 
  getUserProfile,
  updatePassword, 
  updateProfile, 
  choosePlan, 
  searchUsers 
} = require('../controllers/userController');

// Public route - Get active plans
router.get('/plans', getPublicPlans);

// Protected route - Get current user profile (use token)
router.get('/user/profile', verifyToken, getUserProfile);

// Update password - Protected (use token)
router.put('/user/update-password', verifyToken, updatePassword);

// Update user profile - Protected (use token)
router.put('/user/profile', verifyToken, updateProfile);

// Choose plan - Protected
router.post('/user/choose-plan', verifyToken, choosePlan);

// Search users endpoint - Protected
router.get('/users/search', verifyToken, searchUsers);

module.exports = router;
