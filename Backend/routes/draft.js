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
  removeFromSharedDraft 
} = require('../controllers/draftController');

// Protected route - Create new draft
router.post('/drafts', verifyToken, createDraft);

// Protected route - Get user's drafts
router.get('/drafts/:userId', verifyToken, getUserDrafts);

// Get specific draft - Protected, but allows access to shared drafts
router.get('/drafts/single/:draftId', verifyToken, getDraftById);

// Update draft - Protected
router.put('/drafts/:draftId', verifyToken, updateDraft);

// Delete draft - Protected
router.delete('/drafts/:draftId', verifyToken, deleteDraft);

// Share draft endpoint - Protected
router.post('/drafts/:draftId/share', verifyToken, shareDraft);

// Get shared drafts for a user - Protected
router.get('/drafts/shared/:userId', verifyToken, getSharedDrafts);

// Remove user from shared draft (unshare for the current user) - Protected
router.delete('/drafts/shared/:draftId/remove', verifyToken, removeFromSharedDraft);

module.exports = router;
