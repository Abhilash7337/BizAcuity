const SharedDraft = require('../models/SharedDraft');
const Draft = require('../models/Draft');

// Revoke shared draft - Admin only
const revokeShare = async (req, res) => {
  try {
    const { shareId } = req.params;

    const sharedDraft = await SharedDraft.findById(shareId);
    if (!sharedDraft) {
      return res.status(404).json({ error: 'Shared draft not found' });
    }

    if (!sharedDraft.isActive) {
      return res.status(400).json({ error: 'Share is already revoked' });
    }

    // Revoke the share
    sharedDraft.isActive = false;
    sharedDraft.unsharedAt = new Date();
    await sharedDraft.save();

    // Remove from the main draft's sharedWith array
    const draft = await Draft.findById(sharedDraft.draftId);
    if (draft && draft.sharedWith) {
      draft.sharedWith = draft.sharedWith.filter(
        share => share.userId.toString() !== sharedDraft.sharedWith.toString()
      );
      await draft.save();
    }

    res.json({ 
      message: 'Share revoked successfully',
      share: sharedDraft
    });
  } catch (error) {
    console.error('Revoke share error:', error);
    res.status(500).json({ error: 'Failed to revoke share' });
  }
};

// Reactivate shared draft - Admin only (PATCH method)
const reactivateShare = async (req, res) => {
  try {
    const { shareId } = req.params;

    const sharedDraft = await SharedDraft.findById(shareId);
    if (!sharedDraft) {
      return res.status(404).json({ error: 'Shared draft not found' });
    }

    if (sharedDraft.isActive) {
      return res.status(400).json({ error: 'Share is already active' });
    }

    // Reactivate the share
    sharedDraft.isActive = true;
    sharedDraft.unsharedAt = null; // Clear the revoke date
    await sharedDraft.save();

    // Add back to the main draft's sharedWith array if not already there
    const draft = await Draft.findById(sharedDraft.draftId);
    if (draft) {
      const isAlreadyShared = draft.sharedWith && 
        draft.sharedWith.some(share => share.userId.toString() === sharedDraft.sharedWith.toString());
      
      if (!isAlreadyShared) {
        if (!draft.sharedWith) {
          draft.sharedWith = [];
        }
        draft.sharedWith.push({
          userId: sharedDraft.sharedWith,
          sharedAt: new Date()
        });
        await draft.save();
      }
    }

    res.json({ 
      message: 'Share reactivated successfully',
      share: sharedDraft
    });
  } catch (error) {
    console.error('Reactivate share error:', error);
    res.status(500).json({ error: 'Failed to reactivate share' });
  }
};

// Delete shared draft - Admin only
const deleteShare = async (req, res) => {
  try {
    const { shareId } = req.params;
    const { permanent = false } = req.query; // Optional query param for permanent deletion

    const sharedDraft = await SharedDraft.findById(shareId);
    if (!sharedDraft) {
      return res.status(404).json({ error: 'Shared draft not found' });
    }

    if (permanent === 'true') {
      // Permanently delete the share record
      await SharedDraft.findByIdAndDelete(shareId);
    } else {
      // Mark the share as revoked (for audit trail)
      sharedDraft.isActive = false;
      sharedDraft.unsharedAt = new Date();
      await sharedDraft.save();
    }

    // Also remove from the main draft's sharedWith array
    const draft = await Draft.findById(sharedDraft.draftId);
    if (draft && draft.sharedWith) {
      draft.sharedWith = draft.sharedWith.filter(
        share => share.userId.toString() !== sharedDraft.sharedWith.toString()
      );
      await draft.save();
    }

    res.json({ 
      message: permanent === 'true' ? 'Share deleted permanently' : 'Share revoked successfully',
      permanent: permanent === 'true'
    });
  } catch (error) {
    console.error('Revoke share error:', error);
    res.status(500).json({ error: 'Failed to revoke share' });
  }
};

// Cleanup old revoked shares - Admin only
const cleanupRevokedShares = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find and delete shares that were revoked more than 30 days ago
    const result = await SharedDraft.deleteMany({
      isActive: false,
      unsharedAt: { $lt: thirtyDaysAgo }
    });

    res.json({ 
      message: 'Cleanup completed successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Cleanup revoked shares error:', error);
    res.status(500).json({ error: 'Failed to cleanup revoked shares' });
  }
};

// Get sharing analytics - Admin only
const getSharingAnalytics = async (req, res) => {
  try {
    const { page = 1, limit = 20, type = 'all', owner = '', recipient = '', status = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filter by sharing status
    if (type === 'active' || status === 'active') {
      query.isActive = true;
    } else if (type === 'revoked' || status === 'revoked') {
      query.isActive = false;
    }

    // Build aggregation pipeline for complex filtering
    let pipeline = [
      { $match: query }
    ];

    // Add owner filtering if provided
    if (owner) {
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: 'sharedBy',
          foreignField: '_id',
          as: 'ownerInfo'
        }
      });
      pipeline.push({
        $match: {
          $or: [
            { 'ownerInfo.name': { $regex: owner, $options: 'i' } },
            { 'ownerInfo.email': { $regex: owner, $options: 'i' } }
          ]
        }
      });
    }

    // Add recipient filtering if provided
    if (recipient) {
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: 'sharedWith',
          foreignField: '_id',
          as: 'recipientInfo'
        }
      });
      pipeline.push({
        $match: {
          $or: [
            { 'recipientInfo.name': { $regex: recipient, $options: 'i' } },
            { 'recipientInfo.email': { $regex: recipient, $options: 'i' } }
          ]
        }
      });
    }

    // Add sorting, skip, and limit
    pipeline.push(
      { $sort: { sharedAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    // Execute aggregation
    const sharedDraftsRaw = await SharedDraft.aggregate(pipeline);

    // Populate the results manually
    const sharedDrafts = await SharedDraft.populate(sharedDraftsRaw, [
      { path: 'draftId', select: 'name isPublic createdAt' },
      { path: 'sharedBy', select: 'name email' },
      { path: 'sharedWith', select: 'name email' }
    ]);

    // Get total count using the same filtering logic (without skip/limit)
    let countPipeline = pipeline.slice(0, -3); // Remove sort, skip, limit
    countPipeline.push({ $count: "total" });
    const totalResult = await SharedDraft.aggregate(countPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // Get sharing stats
    const stats = await SharedDraft.aggregate([
      {
        $group: {
          _id: null,
          totalShares: { $sum: 1 },
          activeShares: { $sum: { $cond: ['$isActive', 1, 0] } },
          revokedShares: { $sum: { $cond: ['$isActive', 0, 1] } },
          totalAccesses: { $sum: '$accessCount' }
        }
      }
    ]);

    // Get top sharers
    const topSharers = await SharedDraft.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$sharedBy',
          shareCount: { $sum: 1 }
        }
      },
      { $sort: { shareCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          shareCount: 1
        }
      }
    ]);

    res.json({
      sharedDrafts,
      stats: stats[0] || { totalShares: 0, activeShares: 0, revokedShares: 0, totalAccesses: 0 },
      topSharers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + sharedDrafts.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get sharing analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch sharing analytics' });
  }
};

// Get specific draft sharing details - Admin only
const getDraftSharingDetails = async (req, res) => {
  try {
    const { draftId } = req.params;

    const draft = await Draft.findById(draftId).populate('userId', 'name email');
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    const sharingHistory = await SharedDraft.find({ draftId })
      .populate('sharedBy', 'name email')
      .populate('sharedWith', 'name email')
      .sort({ sharedAt: -1 });

    res.json({
      draft,
      sharingHistory,
      currentShares: sharingHistory.filter(share => share.isActive).length,
      totalShares: sharingHistory.length
    });
  } catch (error) {
    console.error('Get draft sharing details error:', error);
    res.status(500).json({ error: 'Failed to fetch draft sharing details' });
  }
};

module.exports = {
  revokeShare,
  reactivateShare,
  deleteShare,
  cleanupRevokedShares,
  getSharingAnalytics,
  getDraftSharingDetails
};
