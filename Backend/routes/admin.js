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
    res.status(500).json({ error: 'Server error while verifying admin status' });
  }
};

// Get admin dashboard stats
router.get('/dashboard', verifyToken, checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDrafts = await Draft.countDocuments();
    const totalPlans = await Plan.countDocuments();
    const activePlans = await Plan.countDocuments({ isActive: true });

    // Get recent users (last 10)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email createdAt plan userType');

    // Get plan distribution
    const planDistribution = await User.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      totalUsers,
      totalDrafts,
      totalPlans,
      activePlans,
      recentUsers,
      planDistribution
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
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
    const { name, monthlyPrice, yearlyPrice, description, features, limits, isActive } = req.body;

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
        exportResolution: limits?.exportResolution || 'HD',
        storageGB: limits?.storageGB || 10,
        supportLevel: limits?.supportLevel || 'basic'
      },
      isActive: isActive !== undefined ? isActive : true
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
    const { name, monthlyPrice, yearlyPrice, description, features, limits, isActive } = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      {
        name: name?.trim(),
        monthlyPrice: parseFloat(monthlyPrice),
        yearlyPrice: yearlyPrice ? parseFloat(yearlyPrice) : 0,
        description: description?.trim() || '',
        features: features || [],
        limits: {
          designsPerMonth: limits?.designsPerMonth ?? -1,
          exportResolution: limits?.exportResolution || 'HD',
          storageGB: limits?.storageGB || 10,
          supportLevel: limits?.supportLevel || 'basic'
        },
        isActive: isActive !== undefined ? isActive : true
      },
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
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

module.exports = router;
