const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { 
  createDraft, 
  getUserDrafts, 
  getDraftById, 
  updateDraft, 
  deleteDraft, 
  shareDraft, 
  getSharedDrafts, 
  removeFromSharedDraft,
  getDraftStatus,
  getImageUploadStatus
} = require('../controllers/draftController');

// Protected route - Create new draft
router.post('/drafts', verifyToken, createDraft);

// Protected route - Get user's drafts (no userId needed in URL, use token)
router.get('/drafts', verifyToken, getUserDrafts);

// Protected route - Get user's draft status and limits
router.get('/drafts/status', verifyToken, getDraftStatus);

// Protected route - Get user's image upload status and limits
router.get('/drafts/image-upload-status', verifyToken, getImageUploadStatus);

// Get specific draft - Protected, but allows access to shared drafts
router.get('/drafts/single/:draftId', verifyToken, getDraftById);

// Public route for shared drafts (no authentication required)
router.get('/drafts/shared/:draftId', getDraftById);

// Update draft - Protected
router.put('/drafts/:draftId', verifyToken, updateDraft);

// Delete draft - Protected
router.delete('/drafts/:draftId', verifyToken, deleteDraft);

// Share draft endpoint - Protected
router.post('/drafts/:draftId/share', verifyToken, shareDraft);

// Get shared drafts for a user - Protected (no userId needed in URL, use token)
router.get('/drafts/shared', verifyToken, getSharedDrafts);

// Remove user from shared draft (unshare for the current user) - Protected
router.delete('/drafts/shared/:draftId/remove', verifyToken, removeFromSharedDraft);

module.exports = router;
