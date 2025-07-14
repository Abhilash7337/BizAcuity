const User = require('../models/User');
const Draft = require('../models/Draft');
const Payment = require('../models/Payment');
const SharedDraft = require('../models/SharedDraft');
const FlaggedContent = require('../models/FlaggedContent');
const Subscription = require('../models/Subscription');

// Get all users - Admin only
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', plan = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (plan) {
      query.plan = plan;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user details - Admin only
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's drafts count
    const draftsCount = await Draft.countDocuments({ userId: req.params.userId });
    
    // Get user's payments
    const payments = await Payment.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      stats: {
        draftsCount,
        totalPayments: payments.length,
        lastPayment: payments[0] || null
      },
      recentPayments: payments
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

// Update user - Admin only
const updateUser = async (req, res) => {
  try {
    const { name, email, userType, plan, isVerified } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (userType) user.userType = userType;
    if (plan) user.plan = plan;
    if (typeof isVerified === 'boolean') user.isVerified = isVerified;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        plan: user.plan,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user - Admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't allow deleting admin users or the specific admin email
    if (user.userType === 'admin' || user.email === 'admin@gmail.com') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    // Delete user's drafts and payments
    await Draft.deleteMany({ userId: req.params.userId });
    await Payment.deleteMany({ userId: req.params.userId });
    
    // Delete user
    await user.deleteOne();

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get all payments - Admin only
const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', plan = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (status) query.status = status;
    if (plan) query.plan = plan;

    const payments = await Payment.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    // Calculate revenue
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPayments: total,
        hasNext: skip + payments.length < total,
        hasPrev: page > 1
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        currency: 'INR'
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Create payment - Admin only
const createPayment = async (req, res) => {
  try {
    const { 
      userId, 
      amount, 
      plan, 
      paymentMethod = 'manual',
      status = 'completed',
      validUntil 
    } = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;

    const payment = new Payment({
      userId,
      transactionId,
      amount,
      plan,
      paymentMethod,
      status,
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      metadata: {
        createdBy: 'admin',
        adminId: req.userId
      }
    });

    await payment.save();

    // Update user's plan if payment is completed
    if (status === 'completed') {
      user.plan = plan;
      await user.save();
    }

    res.status(201).json({
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Get dashboard stats - Admin only
const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalDrafts = await Draft.countDocuments();
    const totalPayments = await Payment.countDocuments();
    
    // Get users by plan
    const usersByPlan = await User.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);

    // Get revenue
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Get recent activities
    const recentUsers = await User.find()
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentPayments = await Payment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          paymentDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' }
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalDrafts,
        totalPayments,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      usersByPlan: usersByPlan.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentActivity: {
        recentUsers,
        recentPayments
      },
      monthlyRevenue
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

// Advanced dashboard stats with new features - Admin only
const getAdvancedDashboardStats = async (req, res) => {
  try {
    // Get basic counts
    const totalUsers = await User.countDocuments();
    const totalDrafts = await Draft.countDocuments();
    const totalPayments = await Payment.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();
    
    // Get flagged content stats
    const flaggedContentStats = await FlaggedContent.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get subscription health overview
    const subscriptionHealth = await Subscription.aggregate([
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

    // Get users by plan
    const usersByPlan = await User.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);

    // Get revenue
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Monthly revenue trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          paymentDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' }
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Content moderation alerts
    const pendingReports = await FlaggedContent.countDocuments({ status: 'pending' });
    const highPriorityReports = await FlaggedContent.countDocuments({ 
      status: 'pending', 
      priority: { $in: ['high', 'critical'] }
    });

    // Subscription alerts
    const expiringSubscriptions = await Subscription.findExpiring(7);
    const suspendedSubscriptions = await Subscription.countDocuments({ status: 'suspended' });

    // Recent activity data
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentPayments = await Payment.find({ status: 'completed' })
      .populate('userId', 'name email')
      .sort({ paymentDate: -1 })
      .limit(5)
      .select('amount plan paymentDate userId');

    res.json({
      stats: {
        totalUsers,
        totalDrafts,
        totalPayments,
        totalSubscriptions,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      usersByPlan: usersByPlan.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      flaggedContent: {
        byStatus: flaggedContentStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        pendingReports,
        highPriorityReports
      },
      subscriptionHealth: subscriptionHealth.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      alerts: {
        pendingReports,
        highPriorityReports,
        expiringSubscriptions: expiringSubscriptions.length,
        suspendedSubscriptions
      },
      recentActivity: {
        recentUsers,
        recentPayments
      },
      monthlyRevenue
    });
  } catch (error) {
    console.error('Get advanced dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch advanced dashboard stats' });
  }
};

// Get all drafts - Admin only
const getAllDrafts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const drafts = await Draft.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Draft.countDocuments(query);

    res.json({
      drafts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDrafts: total,
        hasNext: skip + drafts.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get drafts error:', error);
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
};

// Delete draft - Admin only
const deleteDraft = async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    await draft.deleteOne();
    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Delete draft error:', error);
    res.status(500).json({ error: 'Failed to delete draft' });
  }
};

module.exports = {
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
};
