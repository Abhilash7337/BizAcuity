const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { 
  revokeShare, 
  reactivateShare, 
  deleteShare, 
  cleanupRevokedShares, 
  getSharingAnalytics, 
  getDraftSharingDetails 
} = require('../controllers/sharingController');

// Revoke shared draft - Admin only
router.put('/admin/shared-drafts/:shareId/revoke', verifyToken, verifyAdmin, revokeShare);

// Re-enable revoked shared draft - Admin only (PATCH method)
router.patch('/admin/shared-drafts/:shareId/reactivate', verifyToken, verifyAdmin, reactivateShare);

// Reactivate shared draft - Admin only (PUT method to match frontend)
router.put('/admin/shared-drafts/:shareId/reactivate', verifyToken, verifyAdmin, reactivateShare);

// Revoke/Delete shared draft - Admin only
router.delete('/admin/shared-drafts/:shareId', verifyToken, verifyAdmin, deleteShare);

// Cleanup old revoked shares - Admin only
router.delete('/admin/shared-drafts/cleanup', verifyToken, verifyAdmin, cleanupRevokedShares);

// Get sharing analytics - Admin only
router.get('/admin/sharing-analytics', verifyToken, verifyAdmin, getSharingAnalytics);

// Get specific draft sharing details - Admin only
router.get('/admin/drafts/:draftId/sharing', verifyToken, verifyAdmin, getDraftSharingDetails);

module.exports = router;
