const Draft = require('../models/Draft');
const SharedDraft = require('../models/SharedDraft');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const crypto = require('crypto');

// Create new draft
const createDraft = async (req, res) => {
  try {
    const { name, wallData, previewImage } = req.body;
    
    if (!name || !wallData || !previewImage) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          name: !name,
          wallData: !wallData,
          previewImage: !previewImage
        }
      });
    }

    // Check user's current subscription and plan limits
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's subscription to find their plan
    const subscription = await Subscription.findOne({ userId: req.userId });
    let draftLimit = 1; // Default limit for free users
    
    if (subscription && subscription.plan) {
      // Find the plan details to get the draft limit
      const plan = await Plan.findOne({ name: subscription.plan });
      if (plan && plan.limits && plan.limits.designsPerMonth !== undefined) {
        draftLimit = plan.limits.designsPerMonth;
      }
    }

    // If unlimited drafts allowed (-1), skip limit check
    if (draftLimit !== -1) {
      // Count user's existing drafts
      const existingDraftsCount = await Draft.countDocuments({ userId: req.userId });
      
      if (existingDraftsCount >= draftLimit) {
        return res.status(403).json({ 
          error: 'Draft limit exceeded',
          message: `You have reached your plan limit of ${draftLimit} saved draft${draftLimit > 1 ? 's' : ''}. Please upgrade your plan or delete existing drafts to continue.`,
          currentCount: existingDraftsCount,
          limit: draftLimit
        });
      }
    }

    const draft = new Draft({
      name,
      userId: req.userId, // Use the userId from the token
      wallData,
      previewImage
    });
    
    await draft.save();
    
    res.status(201).json({
      message: 'Draft saved successfully',
      draft
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({ 
      error: 'Failed to save draft',
      details: error.message
    });
  }
};

// Get user's drafts
const getUserDrafts = async (req, res) => {
  try {
    // Use the userId from the authenticated token
    const drafts = await Draft.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select('name userId previewImage createdAt updatedAt');
    
    res.json(drafts);
  } catch (error) {
    console.error('Get drafts error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch drafts',
      details: error.message
    });
  }
};

// Helper to generate a secure random token
function generateShareToken() {
  return crypto.randomBytes(32).toString('hex');
}

const SHARE_TOKEN_EXPIRATION_DAYS = 7;

// Get specific draft
const getDraftById = async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.draftId)
      .populate('userId', 'name email');
      
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    // Check for public access via share token (for /drafts/shared/:draftId)
    // Allow if: draft is public, token matches, and not expired
    const providedToken = req.query.token;
    const now = new Date();
    if (providedToken && draft.isPublic && draft.shareToken === providedToken && draft.shareTokenExpires && draft.shareTokenExpires > now) {
      return res.json(draft);
    }

    // Only allow access for owner or users the draft is shared with (authenticated)
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const isOwner = draft.userId._id.toString() === req.userId;
    const isSharedWithUser = draft.sharedWith && Array.isArray(draft.sharedWith) && 
      draft.sharedWith.some(share => share.userId && share.userId.toString() === req.userId);

    if (!isOwner && !isSharedWithUser) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(draft);
  } catch (error) {
    console.error('Get draft error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch draft',
      details: error.message
    });
  }
};

// Update draft
const updateDraft = async (req, res) => {
  try {
    const { name, wallData, previewImage, isPublic } = req.body;
    
    const draft = await Draft.findById(req.params.draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    // Ensure user can only update their own drafts
    if (draft.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update fields if provided
    if (name !== undefined) draft.name = name;
    if (wallData !== undefined) draft.wallData = wallData;
    if (previewImage !== undefined) draft.previewImage = previewImage;
    if (isPublic !== undefined) draft.isPublic = isPublic;
    
    draft.lastModified = new Date();
    await draft.save();
    
    res.json({
      message: 'Draft updated successfully',
      draft
    });
  } catch (error) {
    console.error('Update draft error:', error);
    res.status(500).json({ 
      error: 'Failed to update draft',
      details: error.message
    });
  }
};

// Delete draft
const deleteDraft = async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    // Ensure user can only delete their own drafts
    if (draft.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await draft.deleteOne();
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Delete draft error:', error);
    res.status(500).json({ 
      error: 'Failed to delete draft',
      details: error.message
    });
  }
};

// Share draft
const shareDraft = async (req, res) => {
  try {
    const { draftId } = req.params;
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: 'User IDs array is required' });
    }

    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    // Ensure user can only share their own drafts
    if (draft.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Initialize sharedWith array if it doesn't exist
    if (!draft.sharedWith) {
      draft.sharedWith = [];
    }

    // Add new users to sharedWith array (avoid duplicates)
    const existingUserIds = draft.sharedWith.map(share => share.userId.toString());
    const newUserIds = userIds.filter(id => !existingUserIds.includes(id));
    
    const newShares = newUserIds.map(userId => ({
      userId: userId,
      sharedAt: new Date()
    }));

    draft.sharedWith.push(...newShares);
    await draft.save();

    // Create SharedDraft records for admin tracking
    const sharedDraftRecords = newUserIds.map(userId => ({
      draftId: draft._id,
      draftName: draft.name,
      sharedBy: req.userId,
      sharedWith: userId,
      sharedAt: new Date(),
      isActive: true,
      permissions: {
        canEdit: false,
        canView: true,
        canShare: false
      }
    }));

    if (sharedDraftRecords.length > 0) {
      await SharedDraft.insertMany(sharedDraftRecords);
    }

    res.json({ 
      message: 'Draft shared successfully',
      sharedWith: draft.sharedWith.length,
      newShares: newUserIds.length
    });
  } catch (error) {
    console.error('Share draft error:', error);
    res.status(500).json({ error: 'Failed to share draft' });
  }
};

// Share draft via link (generate token if needed)
const setDraftPublicWithToken = async (req, res) => {
  try {
    const { draftId } = req.params;
    const { isPublic, linkPermission } = req.body;
    const userId = req.userId;
    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    if (draft.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    // Only generate a new token if making public and no token exists
    if (isPublic) {
      if (!draft.shareToken) {
        draft.shareToken = generateShareToken();
        draft.shareTokenExpires = new Date(Date.now() + SHARE_TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
      }
      draft.isPublic = true;
    } else {
      draft.isPublic = false;
      draft.shareToken = null;
      draft.shareTokenExpires = null;
    }
    // Optionally store linkPermission if needed
    if (linkPermission !== undefined) {
      draft.linkPermission = linkPermission;
    }
    await draft.save();
    res.json({
      message: 'Draft sharing updated',
      shareToken: draft.shareToken,
      shareTokenExpires: draft.shareTokenExpires,
      isPublic: draft.isPublic
    });
  } catch (error) {
    console.error('Set draft public with token error:', error);
    res.status(500).json({ error: 'Failed to update sharing' });
  }
};

// Revoke share token (owner only)
const revokeShareToken = async (req, res) => {
  try {
    const { draftId } = req.params;
    const userId = req.userId;
    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    if (draft.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    draft.shareToken = null;
    draft.shareTokenExpires = null;
    draft.isPublic = false;
    await draft.save();
    res.json({ message: 'Share link revoked' });
  } catch (error) {
    console.error('Revoke share token error:', error);
    res.status(500).json({ error: 'Failed to revoke share link' });
  }
};

// Get drafts shared by the current user via link
const getDraftsSharedByMe = async (req, res) => {
  try {
    const userId = req.userId;
    const drafts = await Draft.find({
      userId,
      isPublic: true,
      shareToken: { $ne: null }
    }).sort({ updatedAt: -1 });
    res.json(drafts);
  } catch (error) {
    console.error('Get drafts shared by me error:', error);
    res.status(500).json({ error: 'Failed to fetch shared drafts' });
  }
};

// Get shared drafts for a user
const getSharedDrafts = async (req, res) => {
  try {
    const userId = req.userId;
    // Find all active shared drafts for this user
    const sharedDrafts = await SharedDraft.find({ sharedWith: userId, isActive: true })
      .populate({ path: 'draftId', populate: { path: 'userId', select: 'name email' } })
      .populate('sharedBy', 'name email');
    res.json(sharedDrafts);
  } catch (error) {
    console.error('Get shared drafts error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch shared drafts',
      details: error.message
    });
  }
};

// Remove user from shared draft
const removeFromSharedDraft = async (req, res) => {
  try {
    const { draftId } = req.params;
    const userId = req.userId;

    // Find the draft
    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    // Check if the user is actually in the sharedWith list
    const isSharedWithUser = draft.sharedWith && 
      draft.sharedWith.some(share => share.userId.toString() === userId);

    if (!isSharedWithUser) {
      return res.status(404).json({ error: 'Draft not shared with this user' });
    }

    // Remove user from sharedWith array
    draft.sharedWith = draft.sharedWith.filter(
      share => share.userId.toString() !== userId
    );
    await draft.save();

    // Mark SharedDraft record as inactive
    await SharedDraft.updateOne(
      { 
        draftId: draftId, 
        sharedWith: userId, 
        isActive: true 
      },
      { 
        isActive: false, 
        unsharedAt: new Date() 
      }
    );

    res.json({ message: 'Successfully removed from shared draft' });
  } catch (error) {
    console.error('Remove from shared draft error:', error);
    res.status(500).json({ error: 'Failed to remove from shared draft' });
  }
};

// Get user's draft status and limits
const getDraftStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's subscription to find their plan
    const subscription = await Subscription.findOne({ userId: req.userId });
    let draftLimit = 1; // Default limit for free users
    let planName = 'Free';
    
    if (subscription && subscription.plan) {
      planName = subscription.plan;
      // Find the plan details to get the draft limit
      const plan = await Plan.findOne({ name: subscription.plan });
      if (plan && plan.limits && plan.limits.designsPerMonth !== undefined) {
        draftLimit = plan.limits.designsPerMonth;
      }
    }

    // Count user's existing drafts
    const currentDrafts = await Draft.countDocuments({ userId: req.userId });
    
    res.json({
      currentDrafts,
      limit: draftLimit,
      planName,
      canSaveMore: draftLimit === -1 || currentDrafts < draftLimit,
      unlimited: draftLimit === -1
    });
  } catch (error) {
    console.error('Get draft status error:', error);
    res.status(500).json({ 
      error: 'Failed to get draft status',
      details: error.message
    });
  }
};

// Get image upload status and limits for user
const getImageUploadStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's subscription to find their plan
    const subscription = await Subscription.findOne({ userId: req.userId });
    let imageUploadLimit = 1; // Default limit if no subscription found
    
    if (subscription && subscription.plan) {
      // Find the plan details to get the image upload limit
      const plan = await Plan.findOne({ name: subscription.plan });
      if (plan && plan.limits && plan.limits.imageUploadsPerDesign !== undefined) {
        imageUploadLimit = plan.limits.imageUploadsPerDesign;
      }
    }

    res.json({
      allowedLimit: imageUploadLimit,
      isUnlimited: imageUploadLimit === -1,
      planName: subscription?.plan || 'free'
    });
  } catch (error) {
    console.error('Get image upload status error:', error);
    res.status(500).json({ error: 'Failed to get image upload status' });
  }
};

module.exports = {
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
};
