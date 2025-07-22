const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Plan = require('../models/Plan');
const User = require('../models/User');
const Draft = require('../models/Draft');
const PlanUpgradeRequest = require('../models/PlanUpgradeRequest');

// Admin authentication middleware
const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is admin
    if (user.userType !== 'admin' && user.email !== 'admin@gmail.com') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error while verifying admin status' });
  }
};

// Get all plan upgrade requests (optionally filter by status)
router.get('/plan-upgrade-requests', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await PlanUpgradeRequest.find(filter)
      .populate('user', 'name email plan')
      .populate('admin', 'name email');
    res.json({ success: true, requests });
  } catch (error) {
    console.error('Get plan upgrade requests error:', error);
    res.status(500).json({ error: 'Failed to fetch plan upgrade requests' });
  }
});

// Approve a plan upgrade request
router.post('/plan-upgrade-requests/:id/approve', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await PlanUpgradeRequest.findById(id).populate('user');
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Request is not pending' });
    // Update user plan and subscription
    const user = await User.findById(request.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.plan = request.requestedPlan;
    await user.save();
    // Update or create subscription
    const Subscription = require('../models/Subscription');
    const Plan = require('../models/Plan');
    const planDetails = await Plan.findOne({ name: request.requestedPlan });
    let subscription = await Subscription.findOne({ userId: user._id });
    const planPrice = planDetails ? planDetails.monthlyPrice : 0;
    if (!subscription) {
      subscription = new Subscription({
        userId: user._id,
        plan: request.requestedPlan,
        billingCycle: 'monthly',
        amount: planPrice,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        autoRenew: false
      });
    } else {
      subscription.plan = request.requestedPlan;
      subscription.amount = planPrice;
      subscription.status = 'active';
      subscription.startDate = new Date();
    }
    await subscription.save();
    // Mark request as approved
    request.status = 'approved';
    request.admin = req.adminUser._id;
    await request.save();
    // Send plan subscription email to user
    const { sendPlanSubscriptionEmail } = require('../utils/emailService');
    if (user.email && planDetails) {
      sendPlanSubscriptionEmail(user.email, user.name, planDetails);
    }
    res.json({ success: true, message: 'Plan upgrade approved and applied.', request });
  } catch (error) {
    console.error('Approve plan upgrade error:', error);
    res.status(500).json({ error: 'Failed to approve plan upgrade' });
  }
});

// Reject a plan upgrade request
router.post('/plan-upgrade-requests/:id/reject', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const request = await PlanUpgradeRequest.findById(id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Request is not pending' });
    request.status = 'rejected';
    request.admin = req.adminUser._id;
    await request.save();
    res.json({ success: true, message: 'Plan upgrade request rejected.', request });
  } catch (error) {
    console.error('Reject plan upgrade error:', error);
    res.status(500).json({ error: 'Failed to reject plan upgrade' });
  }
});


// Get all plans
// Get all plans
router.get('/plans', verifyToken, checkAdmin, async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json({ success: true, plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Create new plan
// Create new plan
router.post('/plans', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { name, monthlyPrice, yearlyPrice, description, features, limits, isActive, exportDrafts, decors } = req.body;

    // Validate required fields
    if (!name || monthlyPrice === undefined) {
      return res.status(400).json({ 
        error: 'Plan name and monthly price are required' 
      });
    }

    // Check if plan name already exists
    const existingPlan = await Plan.findOne({ name: name.trim() });
    if (existingPlan) {
      return res.status(400).json({ 
        error: 'A plan with this name already exists' 
      });
    }

    const newPlan = new Plan({
      name: name.trim(),
      monthlyPrice: parseFloat(monthlyPrice),
      yearlyPrice: yearlyPrice ? parseFloat(yearlyPrice) : 0,
      description: description?.trim() || '',
      features: features || [],
      limits: {
        designsPerMonth: limits?.designsPerMonth ?? -1,
        imageUploadsPerDesign: limits?.imageUploadsPerDesign ?? 3
      },
      isActive: isActive !== undefined ? isActive : true,
      exportDrafts: exportDrafts === true,
      decors: Array.isArray(decors) ? decors : []
    });

    const savedPlan = await newPlan.save();
    
    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      plan: savedPlan
    });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ 
      error: 'Failed to create plan',
      details: error.message 
    });
  }
});

// Update plan
// Update existing plan
router.put('/plans/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, monthlyPrice, yearlyPrice, description, features, limits, isActive, exportDrafts, decors } = req.body;

    const updateData = {
      name: name?.trim(),
      monthlyPrice: parseFloat(monthlyPrice),
      yearlyPrice: yearlyPrice ? parseFloat(yearlyPrice) : 0,
      description: description?.trim() || '',
      features: features || [],
      limits: {
        designsPerMonth: limits?.designsPerMonth ?? -1,
        imageUploadsPerDesign: limits?.imageUploadsPerDesign ?? 3
      },
      isActive: isActive !== undefined ? isActive : true,
      exportDrafts: exportDrafts !== undefined ? exportDrafts : undefined,
      decors: Array.isArray(decors) ? decors : []
    };

    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({
      success: true,
      message: 'Plan updated successfully',
      plan: updatedPlan
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Delete plan
// Delete plan
router.delete('/plans/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPlan = await Plan.findByIdAndDelete(id);
    
    if (!deletedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.json({
      success: true,
      message: 'Plan deleted successfully'
    });
// Send email to users (single, multiple, all, or test to self)
router.post('/', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { userIds = [], subject, body, sendTest = false } = req.body;
    if (!subject || !body) {
      return res.status(400).json({ error: 'Subject and body are required.' });
    }

    let recipients = [];
    if (sendTest) {
      recipients = [{ name: req.adminUser.name, email: req.adminUser.email }];
    } else if (Array.isArray(userIds) && userIds.length > 0) {
      recipients = await User.find({ _id: { $in: userIds } }).select('name email');
    } else {
      recipients = await User.find({}).select('name email');
    }

    const { sendCustomEmail } = require('../utils/emailService');
    let results = [];
    for (const user of recipients) {
      try {
        await sendCustomEmail(user.email, user.name, subject, body);
        results.push({ email: user.email, success: true });
      } catch (err) {
        results.push({ email: user.email, success: false, error: err.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);
    res.json({ success: true, sent: successCount, failed });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send emails', details: error.message });
  }
});
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// Delete plan upgrade request
router.delete('/plan-upgrade-requests/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const PlanUpgradeRequest = require('../models/PlanUpgradeRequest');
    const deletedRequest = await PlanUpgradeRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    res.json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete request' });
  }
});
// Update user details (name, email, plan)
router.put('/users/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, plan } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.name = name || user.name;
    user.email = email || user.email;
    user.plan = plan || user.plan;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
