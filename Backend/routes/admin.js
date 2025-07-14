const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { 
  getAllUsers, 
  getUserDetails, 
  updateUser, 
  deleteUser, 
  getAllPayments, 
  createPayment, 
  getDashboardStats, 
  getAllDrafts, 
  deleteDraft 
} = require('../controllers/adminController');

// Get all users - Admin only
router.get('/admin/users', verifyToken, verifyAdmin, getAllUsers);

// Get user details - Admin only
router.get('/admin/users/:userId', verifyToken, verifyAdmin, getUserDetails);

// Update user - Admin only
router.put('/admin/users/:userId', verifyToken, verifyAdmin, updateUser);

// Delete user - Admin only
router.delete('/admin/users/:userId', verifyToken, verifyAdmin, deleteUser);

// Get all payments - Admin only
router.get('/admin/payments', verifyToken, verifyAdmin, getAllPayments);

// Create payment - Admin only
router.post('/admin/payments', verifyToken, verifyAdmin, createPayment);

// Get dashboard stats - Admin only
router.get('/admin/dashboard', verifyToken, verifyAdmin, getDashboardStats);

// Get all drafts - Admin only
router.get('/admin/drafts', verifyToken, verifyAdmin, getAllDrafts);

// Delete draft - Admin only
router.delete('/admin/drafts/:draftId', verifyToken, verifyAdmin, deleteDraft);

module.exports = router;
