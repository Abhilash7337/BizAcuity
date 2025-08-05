
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
  searchUsers, 
  getLatestPlanUpgradeRequest,
  updateProfilePhoto,
  removeProfilePhoto
} = require('../controllers/userController');
const multer = require('multer');
const { multerConfig } = require('../config/middleware');
const upload = multer(multerConfig); // In-memory only
// Get latest plan upgrade request for the logged-in user
router.get('/user/plan-upgrade-request', verifyToken, getLatestPlanUpgradeRequest);

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

// Add profile photo upload and delete endpoints
router.post('/user/profile-photo', verifyToken, upload.single('profilePhoto'), updateProfilePhoto);
router.delete('/user/profile-photo', verifyToken, removeProfilePhoto);

module.exports = router;
