const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Plan = require('../models/Plan');
const User = require('../models/User');
const Draft = require('../models/Draft');

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
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Server error while verifying admin status' });
  }
};

// Get admin dashboard stats
router.get('/dashboard', verifyToken, checkAdmin, async (req, res) => {
  try {
    // Get actual stats from database
    const totalUsers = await User.countDocuments();
    const totalDrafts = await Draft.countDocuments();
    const totalPlans = await Plan.countDocuments();
    const activePlans = await Plan.countDocuments({ isActive: true });
    
    // Get recent users (last 10)
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email plan createdAt');
    
    // Get plan distribution
    const planDistribution = await User.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);
    
    const stats = {
      totalUsers,
      totalDrafts,
      totalPlans,
      activePlans,
      recentUsers,
      planDistribution: planDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
    
    res.json({ stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get all plans
router.get('/plans', verifyToken, checkAdmin, async (req, res) => {
  try {
    const plans = await Plan.find({}).sort({ createdAt: -1 });
    res.json({ plans });
  } catch (error) {
    console.error('Plans fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Create new plan
router.post('/plans', verifyToken, checkAdmin, async (req, res) => {
  try {
    const planData = req.body;
    
    const newPlan = new Plan(planData);
    await newPlan.save();
    
    res.status(201).json({ plan: newPlan });
  } catch (error) {
    console.error('Plan creation error:', error);
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// Update existing plan
router.put('/plans/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const planData = req.body;
    
    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      planData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    res.json({ plan: updatedPlan });
  } catch (error) {
    console.error('Plan update error:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Delete plan
router.delete('/plans/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if the plan exists and if it's deletable
    const planToDelete = await Plan.findById(id);
    
    if (!planToDelete) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Check if plan is deletable
    if (planToDelete.isDeletable === false || planToDelete.isDefault === true) {
      return res.status(400).json({ 
        error: 'This plan cannot be deleted as it is a system default plan' 
      });
    }
    
    const deletedPlan = await Plan.findByIdAndDelete(id);
    
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Plan deletion error:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

module.exports = router;
