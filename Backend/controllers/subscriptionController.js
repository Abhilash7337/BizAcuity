const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Get all subscriptions - Admin only
const getAllSubscriptions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = '', 
      plan = '',
      search = '',
      healthStatus = ''
    } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (plan) query.plan = plan;

    // Build aggregation pipeline
    let pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ];

    // Add search filter
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'user.name': { $regex: search, $options: 'i' } },
            { 'user.email': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Add virtual fields for health status filtering
    pipeline.push({
      $addFields: {
        daysRemaining: {
          $divide: [
            { $subtract: ['$endDate', new Date()] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    });

    pipeline.push({
      $addFields: {
        healthStatus: {
          $switch: {
            branches: [
              { case: { $in: ['$status', ['expired', 'cancelled']] }, then: 'expired' },
              { case: { $eq: ['$status', 'suspended'] }, then: 'suspended' },
              { case: { $lte: ['$daysRemaining', 3] }, then: 'critical' },
              { case: { $lte: ['$daysRemaining', 7] }, then: 'warning' },
              { case: { $lte: ['$daysRemaining', 30] }, then: 'caution' }
            ],
            default: 'healthy'
          }
        }
      }
    });

    // Filter by health status if specified
    if (healthStatus) {
      pipeline.push({
        $match: { healthStatus: healthStatus }
      });
    }

    // Add pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    const [subscriptions, countResult] = await Promise.all([
      Subscription.aggregate(pipeline),
      Subscription.aggregate(countPipeline)
    ]);

    const total = countResult[0]?.total || 0;

    // Get summary stats
    const stats = await Subscription.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$amount' }
        }
      }
    ]);

    const planStats = await Subscription.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      subscriptions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSubscriptions: total,
        hasNext: skip + subscriptions.length < total,
        hasPrev: page > 1
      },
      stats: {
        byStatus: stats.reduce((acc, item) => {
          acc[item._id] = { count: item.count, revenue: item.totalRevenue };
          return acc;
        }, {}),
        byPlan: planStats.reduce((acc, item) => {
          acc[item._id] = { count: item.count, revenue: item.totalRevenue };
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

// Get subscription details - Admin only
const getSubscriptionDetails = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate('userId', 'name email createdAt')
      .populate('paymentHistory.paymentId');

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Get usage analytics
    const usageAnalytics = {
      draftsCreated: subscription.usage.draftsCreated,
      draftsShared: subscription.usage.draftsShared,
      lastAccess: subscription.usage.lastAccess,
      totalLogins: subscription.usage.totalLogins,
      utilizationRate: {
        drafts: subscription.features.maxDrafts > 0 ? 
          (subscription.usage.draftsCreated / subscription.features.maxDrafts * 100) : 0,
        sharing: subscription.features.maxSharing > 0 ? 
          (subscription.usage.draftsShared / subscription.features.maxSharing * 100) : 0
      }
    };

    res.json({
      subscription,
      usageAnalytics,
      healthStatus: subscription.healthStatus,
      daysRemaining: subscription.daysRemaining
    });
  } catch (error) {
    console.error('Get subscription details error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
};

// Update subscription - Admin only
const updateSubscription = async (req, res) => {
  try {
    const { 
      plan, 
      status, 
      endDate, 
      autoRenew, 
      features,
      notes 
    } = req.body;
    
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    // Update fields
    if (plan) subscription.plan = plan;
    if (status) subscription.status = status;
    if (endDate) subscription.endDate = new Date(endDate);
    if (typeof autoRenew === 'boolean') subscription.autoRenew = autoRenew;
    if (features) subscription.features = { ...subscription.features, ...features };
    
    // Add admin note
    if (notes) {
      subscription.notes.push({
        text: notes,
        addedBy: req.userId
      });
    }

    // Update user's plan if subscription plan changed
    if (plan) {
      await User.findByIdAndUpdate(subscription.userId, { plan });
    }

    await subscription.save();

    res.json({
      message: 'Subscription updated successfully',
      subscription
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
};

// Cancel subscription - Admin only
const cancelSubscription = async (req, res) => {
  try {
    const { reason, feedback, effectiveDate, refundEligible } = req.body;
    
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    subscription.cancellation = {
      reason,
      feedback,
      cancelledAt: new Date(),
      effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
      refundEligible: refundEligible || false
    };

    await subscription.save();

    res.json({
      message: 'Subscription cancelled successfully',
      subscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

// Get subscription analytics - Admin only
const getSubscriptionAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Subscription growth over time
    const growthData = await Subscription.aggregate([
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
            day: period === 'week' ? { $dayOfMonth: '$createdAt' } : null
          },
          newSubscriptions: { $sum: 1 },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Churn analysis
    const churnData = await Subscription.aggregate([
      {
        $match: {
          status: 'cancelled',
          'cancellation.cancelledAt': { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$cancellation.reason',
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenue by plan
    const revenueByPlan = await Subscription.aggregate([
      {
        $group: {
          _id: '$plan',
          totalRevenue: { $sum: '$amount' },
          activeSubscriptions: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          averageRevenue: { $avg: '$amount' }
        }
      }
    ]);

    // Usage analytics
    const usageStats = await Subscription.aggregate([
      {
        $group: {
          _id: null,
          avgDraftsCreated: { $avg: '$usage.draftsCreated' },
          avgDraftsShared: { $avg: '$usage.draftsShared' },
          totalLogins: { $sum: '$usage.totalLogins' },
          activeUsers: {
            $sum: {
              $cond: [
                { $gte: ['$usage.lastAccess', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Subscription health overview
    const healthOverview = await Subscription.aggregate([
      {
        $addFields: {
          daysRemaining: {
            $divide: [
              { $subtract: ['$endDate', new Date()] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $addFields: {
          healthStatus: {
            $switch: {
              branches: [
                { case: { $in: ['$status', ['expired', 'cancelled']] }, then: 'expired' },
                { case: { $eq: ['$status', 'suspended'] }, then: 'suspended' },
                { case: { $lte: ['$daysRemaining', 3] }, then: 'critical' },
                { case: { $lte: ['$daysRemaining', 7] }, then: 'warning' },
                { case: { $lte: ['$daysRemaining', 30] }, then: 'caution' }
              ],
              default: 'healthy'
            }
          }
        }
      },
      {
        $group: {
          _id: '$healthStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Expiring subscriptions
    const expiringSubscriptions = await Subscription.findExpiring(7);

    res.json({
      summary: {
        totalSubscriptions: await Subscription.countDocuments(),
        activeSubscriptions: await Subscription.countDocuments({ status: 'active' }),
        totalRevenue: await Subscription.aggregate([
          { $match: { status: 'active' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]).then(result => result[0]?.total || 0),
        churnRate: await calculateChurnRate(startDate)
      },
      charts: {
        growthData,
        churnData,
        revenueByPlan,
        healthOverview: healthOverview.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      usageStats: usageStats[0] || {},
      expiringSubscriptions: expiringSubscriptions.length,
      expiringList: expiringSubscriptions.slice(0, 10) // Show top 10
    });
  } catch (error) {
    console.error('Get subscription analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription analytics' });
  }
};

// Helper function to calculate churn rate
const calculateChurnRate = async (startDate) => {
  try {
    const totalAtStart = await Subscription.countDocuments({
      createdAt: { $lt: startDate },
      status: 'active'
    });
    
    const churned = await Subscription.countDocuments({
      status: 'cancelled',
      'cancellation.cancelledAt': { $gte: startDate }
    });
    
    return totalAtStart > 0 ? (churned / totalAtStart * 100) : 0;
  } catch (error) {
    return 0;
  }
};

// Bulk update subscriptions - Admin only
const bulkUpdateSubscriptions = async (req, res) => {
  try {
    const { ids, action, data } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid IDs provided' });
    }

    let result;
    switch (action) {
      case 'cancel':
        result = await Subscription.updateMany(
          { _id: { $in: ids } },
          { 
            status: 'cancelled',
            autoRenew: false,
            'cancellation.cancelledAt': new Date(),
            'cancellation.reason': data.reason || 'Bulk cancellation'
          }
        );
        break;
        
      case 'extend':
        const extensionDays = data.days || 30;
        const subscriptions = await Subscription.find({ _id: { $in: ids } });
        for (const sub of subscriptions) {
          sub.endDate = new Date(sub.endDate.getTime() + extensionDays * 24 * 60 * 60 * 1000);
          await sub.save();
        }
        result = { modifiedCount: subscriptions.length };
        break;
        
      case 'changePlan':
        result = await Subscription.updateMany(
          { _id: { $in: ids } },
          { plan: data.newPlan }
        );
        // Update users' plans too
        const subUsers = await Subscription.find({ _id: { $in: ids } }).select('userId');
        await User.updateMany(
          { _id: { $in: subUsers.map(s => s.userId) } },
          { plan: data.newPlan }
        );
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    res.json({
      message: `Successfully ${action} ${result.modifiedCount} subscriptions`,
      modified: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk update subscriptions error:', error);
    res.status(500).json({ error: 'Failed to bulk update subscriptions' });
  }
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionDetails,
  updateSubscription,
  cancelSubscription,
  getSubscriptionAnalytics,
  bulkUpdateSubscriptions
};
