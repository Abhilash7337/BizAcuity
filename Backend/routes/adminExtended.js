const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Import all controllers
const { 
  getAllUsers, 
  getUserDetails, 
  updateUser, 
  deleteUser, 
  getAllPayments, 
  createPayment, 
  getDashboardStats,
  getAdvancedDashboardStats,
  getAllDrafts, 
  deleteDraft 
} = require('../controllers/adminController');

const {
  getAllFlaggedContent,
  getFlaggedContentDetails,
  updateFlaggedContentStatus,
  bulkUpdateFlaggedContent,
  createFlaggedContentReport,
  getFlaggedContentAnalytics
} = require('../controllers/flaggedContentController');

const {
  getAllSubscriptions,
  getSubscriptionDetails,
  updateSubscription,
  cancelSubscription,
  getSubscriptionAnalytics,
  bulkUpdateSubscriptions
} = require('../controllers/subscriptionController');

const {
  generateAdminReport,
  exportUserData
} = require('../controllers/reportsController');

const {
  revokeShare,
  reactivateShare,
  deleteShare,
  cleanupRevokedShares,
  getSharingAnalytics,
  getDraftSharingDetails
} = require('../controllers/sharingController');

// ===== EXISTING ROUTES =====

// User Management Routes
router.get('/admin/users', verifyToken, verifyAdmin, getAllUsers);
router.get('/admin/users/:userId', verifyToken, verifyAdmin, getUserDetails);
router.put('/admin/users/:userId', verifyToken, verifyAdmin, updateUser);
router.delete('/admin/users/:userId', verifyToken, verifyAdmin, deleteUser);

// Payment Management Routes
router.get('/admin/payments', verifyToken, verifyAdmin, getAllPayments);
router.post('/admin/payments', verifyToken, verifyAdmin, createPayment);

// Dashboard Routes
router.get('/admin/dashboard', verifyToken, verifyAdmin, getDashboardStats);
router.get('/admin/dashboard/advanced', verifyToken, verifyAdmin, getAdvancedDashboardStats);

// Draft Management Routes
router.get('/admin/drafts', verifyToken, verifyAdmin, getAllDrafts);
router.delete('/admin/drafts/:draftId', verifyToken, verifyAdmin, deleteDraft);

// Sharing Management Routes
router.get('/admin/sharing-analytics', verifyToken, verifyAdmin, getSharingAnalytics);
router.get('/admin/drafts/:draftId/sharing', verifyToken, verifyAdmin, getDraftSharingDetails);
router.put('/admin/shared-drafts/:shareId/revoke', verifyToken, verifyAdmin, revokeShare);
router.put('/admin/shared-drafts/:shareId/reactivate', verifyToken, verifyAdmin, reactivateShare);
router.delete('/admin/shared-drafts/:shareId', verifyToken, verifyAdmin, deleteShare);
router.delete('/admin/shared-drafts/cleanup', verifyToken, verifyAdmin, cleanupRevokedShares);

// ===== NEW ROUTES =====

// Flagged Content Management Routes
router.get('/admin/flagged-content', verifyToken, verifyAdmin, getAllFlaggedContent);
router.get('/admin/flagged-content/analytics', verifyToken, verifyAdmin, getFlaggedContentAnalytics);
router.get('/admin/flagged-content/:id', verifyToken, verifyAdmin, getFlaggedContentDetails);
router.put('/admin/flagged-content/:id', verifyToken, verifyAdmin, updateFlaggedContentStatus);
router.put('/admin/flagged-content/bulk-update', verifyToken, verifyAdmin, bulkUpdateFlaggedContent);

// Subscription Management Routes
router.get('/admin/subscriptions', verifyToken, verifyAdmin, getAllSubscriptions);
router.get('/admin/subscriptions/analytics', verifyToken, verifyAdmin, getSubscriptionAnalytics);
router.get('/admin/subscriptions/:id', verifyToken, verifyAdmin, getSubscriptionDetails);
router.put('/admin/subscriptions/:id', verifyToken, verifyAdmin, updateSubscription);
router.put('/admin/subscriptions/:id/cancel', verifyToken, verifyAdmin, cancelSubscription);
router.put('/admin/subscriptions/bulk-update', verifyToken, verifyAdmin, bulkUpdateSubscriptions);

// Reports and Export Routes
router.get('/admin/reports', verifyToken, verifyAdmin, generateAdminReport);
router.post('/admin/export/users', verifyToken, verifyAdmin, exportUserData);

// Public Routes (for users to report content)
router.post('/report-content', verifyToken, createFlaggedContentReport);

module.exports = router;
