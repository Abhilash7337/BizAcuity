const FlaggedContent = require('../models/FlaggedContent');
const User = require('../models/User');
const Draft = require('../models/Draft');
const SharedDraft = require('../models/SharedDraft');

// Get all flagged content - Admin only
const getAllFlaggedContent = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = '', 
      priority = '', 
      contentType = '',
      reason = ''
    } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (contentType) query.contentType = contentType;
    if (reason) query.reason = reason;

    const flaggedContent = await FlaggedContent.find(query)
      .populate('reportedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .populate('contentDetails')
      .sort({ priority: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await FlaggedContent.countDocuments(query);

    // Get summary stats
    const stats = await FlaggedContent.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await FlaggedContent.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      flaggedContent,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + flaggedContent.length < total,
        hasPrev: page > 1
      },
      stats: {
        byStatus: stats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byPriority: priorityStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get flagged content error:', error);
    res.status(500).json({ error: 'Failed to fetch flagged content' });
  }
};

// Get flagged content details - Admin only
const getFlaggedContentDetails = async (req, res) => {
  try {
    const flaggedContent = await FlaggedContent.findById(req.params.id)
      .populate('reportedBy', 'name email createdAt')
      .populate('reviewedBy', 'name email')
      .populate('contentDetails');

    if (!flaggedContent) {
      return res.status(404).json({ error: 'Flagged content not found' });
    }

    // Get related reports for the same content
    const relatedReports = await FlaggedContent.find({
      contentId: flaggedContent.contentId,
      contentType: flaggedContent.contentType,
      _id: { $ne: flaggedContent._id }
    }).populate('reportedBy', 'name email');

    res.json({
      flaggedContent,
      relatedReports
    });
  } catch (error) {
    console.error('Get flagged content details error:', error);
    res.status(500).json({ error: 'Failed to fetch flagged content details' });
  }
};

// Update flagged content status - Admin only
const updateFlaggedContentStatus = async (req, res) => {
  try {
    const { status, resolution, adminNotes, priority } = req.body;
    
    const flaggedContent = await FlaggedContent.findById(req.params.id);
    if (!flaggedContent) {
      return res.status(404).json({ error: 'Flagged content not found' });
    }

    // Update fields
    if (status) {
      flaggedContent.status = status;
      if (status === 'reviewed' || status === 'resolved') {
        flaggedContent.reviewedBy = req.userId;
        flaggedContent.reviewedAt = new Date();
      }
    }
    if (resolution) flaggedContent.resolution = resolution;
    if (adminNotes) flaggedContent.adminNotes = adminNotes;
    if (priority) flaggedContent.priority = priority;

    await flaggedContent.save();

    // Execute resolution actions
    if (resolution) {
      await executeResolutionAction(flaggedContent, resolution);
    }

    res.json({
      message: 'Flagged content updated successfully',
      flaggedContent
    });
  } catch (error) {
    console.error('Update flagged content error:', error);
    res.status(500).json({ error: 'Failed to update flagged content' });
  }
};

// Execute resolution actions
const executeResolutionAction = async (flaggedContent, resolution) => {
  try {
    switch (resolution) {
      case 'content_removed':
        if (flaggedContent.contentType === 'draft') {
          await Draft.findByIdAndDelete(flaggedContent.contentId);
        } else if (flaggedContent.contentType === 'shared_draft') {
          await SharedDraft.findByIdAndUpdate(
            flaggedContent.contentId, 
            { isActive: false, unsharedAt: new Date() }
          );
        }
        break;
        
      case 'user_warned':
        // Could implement warning system
        break;
        
      case 'user_suspended':
        if (flaggedContent.contentType === 'user') {
          await User.findByIdAndUpdate(
            flaggedContent.contentId,
            { isVerified: false, suspendedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
          );
        }
        break;
        
      case 'user_banned':
        if (flaggedContent.contentType === 'user') {
          await User.findByIdAndUpdate(
            flaggedContent.contentId,
            { isVerified: false, isBanned: true, bannedAt: new Date() }
          );
        }
        break;
    }
  } catch (error) {
    console.error('Execute resolution action error:', error);
  }
};

// Bulk update flagged content - Admin only
const bulkUpdateFlaggedContent = async (req, res) => {
  try {
    const { ids, action, status, resolution } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid IDs provided' });
    }

    let updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'reviewed' || status === 'resolved') {
        updateData.reviewedBy = req.userId;
        updateData.reviewedAt = new Date();
      }
    }
    if (resolution) updateData.resolution = resolution;

    const result = await FlaggedContent.updateMany(
      { _id: { $in: ids } },
      updateData
    );

    // Execute resolution actions for each item if specified
    if (resolution) {
      const flaggedItems = await FlaggedContent.find({ _id: { $in: ids } });
      for (const item of flaggedItems) {
        await executeResolutionAction(item, resolution);
      }
    }

    res.json({
      message: `Successfully updated ${result.modifiedCount} items`,
      modified: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update flagged content error:', error);
    res.status(500).json({ error: 'Failed to bulk update flagged content' });
  }
};

// Create flagged content report - For users to report content
const createFlaggedContentReport = async (req, res) => {
  try {
    const { contentType, contentId, reason, description } = req.body;
    
    // Validate content exists
    let contentExists = false;
    switch (contentType) {
      case 'draft':
        contentExists = await Draft.findById(contentId);
        break;
      case 'user':
        contentExists = await User.findById(contentId);
        break;
      case 'shared_draft':
        contentExists = await SharedDraft.findById(contentId);
        break;
    }

    if (!contentExists) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Check if user already reported this content
    const existingReport = await FlaggedContent.findOne({
      contentType,
      contentId,
      reportedBy: req.userId
    });

    if (existingReport) {
      return res.status(400).json({ error: 'You have already reported this content' });
    }

    const flaggedContent = new FlaggedContent({
      contentType,
      contentId,
      contentModel: contentType === 'draft' ? 'Draft' : 
                    contentType === 'user' ? 'User' : 'SharedDraft',
      reportedBy: req.userId,
      reason,
      description,
      metadata: {
        reporterIP: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await flaggedContent.save();

    res.status(201).json({
      message: 'Content reported successfully',
      reportId: flaggedContent._id
    });
  } catch (error) {
    console.error('Create flagged content report error:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
};

// Get flagged content analytics - Admin only
const getFlaggedContentAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Reports over time
    const reportsOverTime = await FlaggedContent.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Reports by reason
    const reportsByReason = await FlaggedContent.aggregate([
      {
        $group: {
          _id: '$reason',
          count: { $sum: 1 }
        }
      }
    ]);

    // Reports by content type
    const reportsByContentType = await FlaggedContent.aggregate([
      {
        $group: {
          _id: '$contentType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Resolution effectiveness
    const resolutionStats = await FlaggedContent.aggregate([
      {
        $match: {
          status: { $in: ['reviewed', 'resolved'] }
        }
      },
      {
        $group: {
          _id: '$resolution',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top reporters
    const topReporters = await FlaggedContent.aggregate([
      {
        $group: {
          _id: '$reportedBy',
          reportCount: { $sum: 1 }
        }
      },
      { $sort: { reportCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          reportCount: 1,
          user: { $arrayElemAt: ['$user', 0] }
        }
      }
    ]);

    res.json({
      summary: {
        totalReports: await FlaggedContent.countDocuments(),
        pendingReports: await FlaggedContent.countDocuments({ status: 'pending' }),
        resolvedReports: await FlaggedContent.countDocuments({ status: 'resolved' }),
        recentReports: await FlaggedContent.countDocuments({ 
          createdAt: { $gte: startDate } 
        })
      },
      charts: {
        reportsOverTime,
        reportsByReason,
        reportsByContentType,
        resolutionStats
      },
      topReporters
    });
  } catch (error) {
    console.error('Get flagged content analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

module.exports = {
  getAllFlaggedContent,
  getFlaggedContentDetails,
  updateFlaggedContentStatus,
  bulkUpdateFlaggedContent,
  createFlaggedContentReport,
  getFlaggedContentAnalytics
};
