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
  getImageUploadStatus,
  setDraftPublicWithToken,
  revokeShareToken,
  getDraftsSharedByMe
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

// Add a protected route for updating public sharing and generating a share token
router.put('/drafts/:draftId/public', verifyToken, setDraftPublicWithToken);

// Add a protected route for revoking a share token
router.put('/drafts/:draftId/revoke-share', verifyToken, revokeShareToken);
// Add a protected route for getting drafts shared by the current user via link
router.get('/drafts/shared-by-me', verifyToken, getDraftsSharedByMe);

// Delete draft - Protected
router.delete('/drafts/:draftId', verifyToken, deleteDraft);

// Share draft endpoint - Protected
router.post('/drafts/:draftId/share', verifyToken, shareDraft);

// Get shared drafts for a user - Protected (no userId needed in URL, use token)
router.get('/drafts/shared', verifyToken, getSharedDrafts);

// Remove user from shared draft (unshare for the current user) - Protected
router.delete('/drafts/shared/:draftId/remove', verifyToken, removeFromSharedDraft);

module.exports = router;
