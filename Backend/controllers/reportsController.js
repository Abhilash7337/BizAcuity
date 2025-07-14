const User = require('../models/User');
const Draft = require('../models/Draft');
const Payment = require('../models/Payment');
const Subscription = require('../models/Subscription');
const FlaggedContent = require('../models/FlaggedContent');
const SharedDraft = require('../models/SharedDraft');

// Generate comprehensive admin report - Admin only
const generateAdminReport = async (req, res) => {
  try {
    const { 
      reportType, 
      startDate, 
      endDate, 
      format = 'json',
      includeDetails = false 
    } = req.query;

    // Convert includeDetails string to boolean
    const includeDetailsBoolean = includeDetails === 'true' || includeDetails === true;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    // Set end date to end of day (23:59:59.999) to include all records from that day
    if (endDate) {
      end.setHours(23, 59, 59, 999);
    }

    let reportData = {};

    switch (reportType) {
      case 'users':
        reportData = await generateUsersReport(start, end, includeDetailsBoolean);
        break;
      case 'payments':
        reportData = await generatePaymentsReport(start, end, includeDetailsBoolean);
        break;
      case 'subscriptions':
        reportData = await generateSubscriptionsReport(start, end, includeDetailsBoolean);
        break;
      case 'content':
        reportData = await generateContentReport(start, end, includeDetailsBoolean);
        break;
      case 'flagged':
        reportData = await generateFlaggedContentReport(start, end, includeDetailsBoolean);
        break;
      case 'comprehensive':
        reportData = await generateComprehensiveReport(start, end, includeDetailsBoolean);
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    // Add metadata
    reportData.metadata = {
      generatedAt: new Date(),
      generatedBy: req.userId,
      reportType,
      dateRange: { start, end },
      format,
      includeDetails: includeDetailsBoolean
    };

    if (format === 'csv') {
      const csv = await convertToCSV(reportData, reportType);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}_report_${Date.now()}.csv"`);
      return res.send(csv);
    }

    res.json(reportData);
  } catch (error) {
    console.error('Generate admin report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};

// Users report
const generateUsersReport = async (start, end, includeDetails) => {
  const summary = {
    totalUsers: await User.countDocuments(),
    newUsers: await User.countDocuments({ 
      createdAt: { $gte: start, $lte: end } 
    }),
    verifiedUsers: await User.countDocuments({ isVerified: true }),
    adminUsers: await User.countDocuments({ userType: 'admin' })
  };

  const usersByPlan = await User.aggregate([
    { $group: { _id: '$plan', count: { $sum: 1 } } }
  ]);

  const usersOverTime = await User.aggregate([
    {
      $match: { createdAt: { $gte: start, $lte: end } }
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

  let details = null;
  if (includeDetails) {
    details = await User.find({
      createdAt: { $gte: start, $lte: end }
    }).select('name email plan userType isVerified createdAt').sort({ createdAt: -1 });
  }

  return {
    summary,
    charts: {
      usersByPlan: usersByPlan.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      usersOverTime
    },
    details
  };
};

// Payments report
const generatePaymentsReport = async (start, end, includeDetails) => {
  const summary = {
    totalPayments: await Payment.countDocuments(),
    totalRevenue: await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).then(result => result[0]?.total || 0),
    periodPayments: await Payment.countDocuments({
      paymentDate: { $gte: start, $lte: end }
    }),
    periodRevenue: await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          paymentDate: { $gte: start, $lte: end }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).then(result => result[0]?.total || 0)
  };

  const paymentsByPlan = await Payment.aggregate([
    {
      $match: { 
        status: 'completed',
        paymentDate: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: '$plan',
        count: { $sum: 1 },
        revenue: { $sum: '$amount' }
      }
    }
  ]);

  const revenueOverTime = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paymentDate: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$paymentDate' },
          month: { $month: '$paymentDate' },
          day: { $dayOfMonth: '$paymentDate' }
        },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  let details = null;
  if (includeDetails) {
    details = await Payment.find({
      paymentDate: { $gte: start, $lte: end }
    }).populate('userId', 'name email').sort({ paymentDate: -1 });
  }

  return {
    summary,
    charts: {
      paymentsByPlan,
      revenueOverTime
    },
    details
  };
};

// Subscriptions report
const generateSubscriptionsReport = async (start, end, includeDetails) => {
  const summary = {
    totalSubscriptions: await Subscription.countDocuments(),
    activeSubscriptions: await Subscription.countDocuments({ status: 'active' }),
    expiredSubscriptions: await Subscription.countDocuments({ status: 'expired' }),
    cancelledSubscriptions: await Subscription.countDocuments({ status: 'cancelled' })
  };

  const subscriptionsByPlan = await Subscription.aggregate([
    {
      $group: {
        _id: '$plan',
        count: { $sum: 1 },
        revenue: { $sum: '$amount' }
      }
    }
  ]);

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

  let details = null;
  if (includeDetails) {
    details = await Subscription.find({
      createdAt: { $gte: start, $lte: end }
    }).populate('userId', 'name email').sort({ createdAt: -1 });
  }

  return {
    summary,
    charts: {
      subscriptionsByPlan,
      subscriptionHealth: subscriptionHealth.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    },
    details
  };
};

// Content report
const generateContentReport = async (start, end, includeDetails) => {
  const summary = {
    totalDrafts: await Draft.countDocuments(),
    newDrafts: await Draft.countDocuments({
      createdAt: { $gte: start, $lte: end }
    }),
    sharedDrafts: await SharedDraft.countDocuments({ isActive: true }),
    totalShares: await SharedDraft.countDocuments()
  };

  const draftsOverTime = await Draft.aggregate([
    {
      $match: { createdAt: { $gte: start, $lte: end } }
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

  const topCreators = await Draft.aggregate([
    {
      $match: { createdAt: { $gte: start, $lte: end } }
    },
    {
      $group: {
        _id: '$userId',
        draftCount: { $sum: 1 }
      }
    },
    { $sort: { draftCount: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    }
  ]);

  let details = null;
  if (includeDetails) {
    details = await Draft.find({
      createdAt: { $gte: start, $lte: end }
    }).populate('userId', 'name email').sort({ createdAt: -1 }).limit(100);
  }

  return {
    summary,
    charts: {
      draftsOverTime,
      topCreators
    },
    details
  };
};

// Flagged content report
const generateFlaggedContentReport = async (start, end, includeDetails) => {
  const summary = {
    totalReports: await FlaggedContent.countDocuments(),
    pendingReports: await FlaggedContent.countDocuments({ status: 'pending' }),
    resolvedReports: await FlaggedContent.countDocuments({ status: 'resolved' }),
    newReports: await FlaggedContent.countDocuments({
      createdAt: { $gte: start, $lte: end }
    })
  };

  const reportsByReason = await FlaggedContent.aggregate([
    {
      $match: { createdAt: { $gte: start, $lte: end } }
    },
    {
      $group: {
        _id: '$reason',
        count: { $sum: 1 }
      }
    }
  ]);

  const reportsByType = await FlaggedContent.aggregate([
    {
      $match: { createdAt: { $gte: start, $lte: end } }
    },
    {
      $group: {
        _id: '$contentType',
        count: { $sum: 1 }
      }
    }
  ]);

  let details = null;
  if (includeDetails) {
    details = await FlaggedContent.find({
      createdAt: { $gte: start, $lte: end }
    }).populate('reportedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });
  }

  return {
    summary,
    charts: {
      reportsByReason,
      reportsByType
    },
    details
  };
};

// Comprehensive report
const generateComprehensiveReport = async (start, end, includeDetails) => {
  const [users, payments, subscriptions, content, flagged] = await Promise.all([
    generateUsersReport(start, end, includeDetails),
    generatePaymentsReport(start, end, includeDetails),
    generateSubscriptionsReport(start, end, includeDetails),
    generateContentReport(start, end, includeDetails),
    generateFlaggedContentReport(start, end, includeDetails)
  ]);

  return {
    users,
    payments,
    subscriptions,
    content,
    flagged,
    summary: {
      totalUsers: users.summary.totalUsers,
      totalRevenue: payments.summary.totalRevenue,
      activeSubscriptions: subscriptions.summary.activeSubscriptions,
      totalDrafts: content.summary.totalDrafts,
      pendingReports: flagged.summary.pendingReports
    }
  };
};

// Convert data to CSV format
const convertToCSV = async (data, reportType) => {
  let csvContent = '';
  
  switch (reportType) {
    case 'users':
      if (data.details) {
        csvContent = 'Name,Email,Plan,User Type,Verified,Created At\n';
        data.details.forEach(user => {
          csvContent += `"${user.name}","${user.email}","${user.plan}","${user.userType}","${user.isVerified}","${user.createdAt}"\n`;
        });
      }
      break;
      
    case 'payments':
      if (data.details) {
        csvContent = 'User Name,User Email,Amount,Plan,Status,Payment Date,Transaction ID\n';
        data.details.forEach(payment => {
          csvContent += `"${payment.userId?.name || 'N/A'}","${payment.userId?.email || 'N/A'}","${payment.amount}","${payment.plan}","${payment.status}","${payment.paymentDate}","${payment.transactionId}"\n`;
        });
      }
      break;
      
    case 'subscriptions':
      if (data.details) {
        csvContent = 'User Name,User Email,Plan,Status,Amount,Start Date,End Date,Auto Renew\n';
        data.details.forEach(sub => {
          csvContent += `"${sub.userId?.name || 'N/A'}","${sub.userId?.email || 'N/A'}","${sub.plan}","${sub.status}","${sub.amount}","${sub.startDate}","${sub.endDate}","${sub.autoRenew}"\n`;
        });
      }
      break;
      
    case 'content':
      if (data.details) {
        csvContent = 'Draft Name,Owner Name,Owner Email,Category,Privacy,Created At,Last Updated\n';
        data.details.forEach(draft => {
          csvContent += `"${draft.name}","${draft.userId?.name || 'N/A'}","${draft.userId?.email || 'N/A'}","${draft.category}","${draft.privacy}","${draft.createdAt}","${draft.updatedAt}"\n`;
        });
      }
      break;
      
    case 'flagged':
      if (data.details) {
        csvContent = 'Content Type,Content ID,Reason,Reporter Email,Status,Flagged At,Resolution\n';
        data.details.forEach(flagged => {
          csvContent += `"${flagged.contentType}","${flagged.contentId}","${flagged.reason}","${flagged.reportedBy?.email || 'N/A'}","${flagged.status}","${flagged.createdAt}","${flagged.resolution || 'N/A'}"\n`;
        });
      }
      break;
      
    case 'comprehensive':
      if (data.users && data.users.details) {
        csvContent = 'USERS DATA\n';
        csvContent += 'Name,Email,Plan,User Type,Verified,Created At\n';
        data.users.details.forEach(user => {
          csvContent += `"${user.name}","${user.email}","${user.plan}","${user.userType}","${user.isVerified}","${user.createdAt}"\n`;
        });
        
        if (data.payments && data.payments.details) {
          csvContent += '\nPAYMENTS DATA\n';
          csvContent += 'User Name,User Email,Amount,Plan,Status,Payment Date,Transaction ID\n';
          data.payments.details.forEach(payment => {
            csvContent += `"${payment.userId?.name || 'N/A'}","${payment.userId?.email || 'N/A'}","${payment.amount}","${payment.plan}","${payment.status}","${payment.paymentDate}","${payment.transactionId}"\n`;
          });
        }
        
        if (data.drafts && data.drafts.details) {
          csvContent += '\nDRAFTS DATA\n';
          csvContent += 'Draft Name,Owner Name,Owner Email,Category,Privacy,Created At,Last Updated\n';
          data.drafts.details.forEach(draft => {
            csvContent += `"${draft.name}","${draft.userId?.name || 'N/A'}","${draft.userId?.email || 'N/A'}","${draft.category}","${draft.privacy}","${draft.createdAt}","${draft.updatedAt}"\n`;
          });
        }
      }
      break;
      
    default:
      csvContent = 'Report data not available in CSV format for this report type\n';
  }
  
  return csvContent;
};

// Export user data - Admin only
const exportUserData = async (req, res) => {
  try {
    const { userIds, format = 'json' } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: 'User IDs required' });
    }

    const users = await User.find({ _id: { $in: userIds } })
      .select('-password')
      .lean();

    // Get additional data for each user
    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const [drafts, payments, subscription] = await Promise.all([
        Draft.find({ userId: user._id }).lean(),
        Payment.find({ userId: user._id }).lean(),
        Subscription.findOne({ userId: user._id }).lean()
      ]);

      return {
        ...user,
        stats: {
          totalDrafts: drafts.length,
          totalPayments: payments.length,
          totalSpent: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
          subscription: subscription ? {
            plan: subscription.plan,
            status: subscription.status,
            endDate: subscription.endDate
          } : null
        },
        drafts: drafts.map(d => ({
          id: d._id,
          name: d.name,
          createdAt: d.createdAt
        })),
        payments: payments.map(p => ({
          id: p._id,
          amount: p.amount,
          plan: p.plan,
          status: p.status,
          paymentDate: p.paymentDate
        }))
      };
    }));

    if (format === 'csv') {
      let csvContent = 'Name,Email,Plan,User Type,Verified,Total Drafts,Total Payments,Total Spent,Created At\n';
      enrichedUsers.forEach(user => {
        csvContent += `"${user.name}","${user.email}","${user.plan}","${user.userType}","${user.isVerified}","${user.stats.totalDrafts}","${user.stats.totalPayments}","${user.stats.totalSpent}","${user.createdAt}"\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="user_export_${Date.now()}.csv"`);
      return res.send(csvContent);
    }

    res.json({
      users: enrichedUsers,
      exportedAt: new Date(),
      count: enrichedUsers.length
    });
  } catch (error) {
    console.error('Export user data error:', error);
    res.status(500).json({ error: 'Failed to export user data' });
  }
};

module.exports = {
  generateAdminReport,
  exportUserData
};
