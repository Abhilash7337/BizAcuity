const Draft = require('../models/Draft');
const SharedDraft = require('../models/SharedDraft');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');

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

// Get specific draft
const getDraftById = async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.draftId)
      .populate('userId', 'name email');
      
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    // Check if this is a public access request (no token required)
    const isPublicAccess = !req.userId;
    
    if (isPublicAccess) {
      // For public access, only allow if the draft is marked as public
      if (!draft.isPublic) {
        return res.status(403).json({ error: 'Draft is not publicly accessible' });
      }
      // Return draft for public access
      return res.json(draft);
    }

    // For authenticated access, check ownership or sharing
    const isOwner = draft.userId._id.toString() === req.userId;
    const isSharedWithUser = draft.sharedWith && Array.isArray(draft.sharedWith) && 
      draft.sharedWith.some(share => share.userId && share.userId.toString() === req.userId);

    if (!isOwner && !isSharedWithUser && !draft.isPublic) {
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

// Get shared drafts for a user
const getSharedDrafts = async (req, res) => {
  try {
    // Use the userId from the authenticated token
    const userId = req.userId;

    // Find all drafts that are shared with this user
    const sharedDrafts = await Draft.find({
      'sharedWith.userId': userId
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

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
  getImageUploadStatus
};
