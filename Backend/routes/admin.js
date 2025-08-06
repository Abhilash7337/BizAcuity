const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Plan = require('../models/Plan');
const User = require('../models/User');
const Draft = require('../models/Draft');
const PlanUpgradeRequest = require('../models/PlanUpgradeRequest');

// Admin authentication middleware (must be defined before any route uses it)
const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is admin
    if (user.userType !== 'admin' && user.email !== 'abhilashpodisetty@gmail.com') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error while verifying admin status' });
  }
};

// Admin dashboard stats
router.get('/dashboard', verifyToken, checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDrafts = await Draft.countDocuments();
    const totalPlans = await Plan.countDocuments();
    const activePlans = await Plan.countDocuments({ isActive: true });

    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email plan createdAt');

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
// ...existing code...

// CATEGORY NUMBER ENDPOINTS
const Category = require('../models/Category');
const Decor = require('../models/Decor');

// Update category number
router.put('/categories/:id/number', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { number } = req.body;
    const category = await Category.findByIdAndUpdate(id, { number }, { new: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category number' });
  }
});

// Set all decors in a category to -1 (requires a 'number' field in Decor, or just a dummy update)
router.put('/decors/category/:categoryName/set-all-minus-one', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { categoryName } = req.params;
    // If you want to update a 'number' field in Decor, add it to the schema. Otherwise, just a dummy update.
    // Here, we just update a dummy field or do nothing, but you can expand as needed.
    // For now, just return success.
    // Optionally, you could deactivate all decors in this category, or add a 'number' field to Decor and set it to -1.
    res.json({ message: `Set all decors in category '${categoryName}' to -1 (dummy endpoint, expand as needed)` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set all decors to -1' });
  }
});

// ...existing code...

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
    // Ensure categoryLimits is always present in the response for each plan
    const plansWithCategoryLimits = plans.map(plan => {
      const obj = plan.toObject();
      if (!obj.categoryLimits) obj.categoryLimits = {};
      return obj;
    });
    res.json({ success: true, plans: plansWithCategoryLimits });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Create new plan
// Create new plan
router.post('/plans', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { name, monthlyPrice, yearlyPrice, description, features, limits, isActive, exportDrafts, categoryLimits } = req.body;

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

    // Handle categoryLimits properly
    let cleanedCategoryLimits = {};
    if (categoryLimits && typeof categoryLimits === 'object') {
      Object.entries(categoryLimits).forEach(([key, value]) => {
        if (/^[a-fA-F0-9]{24}$/.test(key)) {
          // Handle different value types: string numbers, actual numbers, -1, etc.
          let numValue;
          if (value === '' || value === null || value === undefined) {
            numValue = 0;
          } else if (value === '-1' || value === -1) {
            numValue = -1;
          } else {
            numValue = parseInt(value, 10);
            if (isNaN(numValue)) numValue = 0;
          }
          cleanedCategoryLimits[key] = numValue;
        }
      });
    }

    // Sync decors array with categoryLimits
    const Decor = require('../models/Decor');
    let allowedDecorIds = [];
    if (Object.keys(cleanedCategoryLimits).length > 0) {
      for (const [catId, limit] of Object.entries(cleanedCategoryLimits)) {
        const Category = require('../models/Category');
        const categoryDoc = await Category.findById(catId);
        if (!categoryDoc) continue;
        const categoryName = categoryDoc.name;
        const decorsInCategory = await Decor.find({ category: categoryName }).sort({ createdAt: 1 });
        if (parseInt(limit) === -1) {
          allowedDecorIds.push(...decorsInCategory.map(d => d._id));
        } else {
          allowedDecorIds.push(...decorsInCategory.slice(0, parseInt(limit)).map(d => d._id));
        }
      }
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
      decors: allowedDecorIds,
      categoryLimits: cleanedCategoryLimits
    });

    const savedPlan = await newPlan.save();
    
    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      plan: savedPlan.toObject()
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
    const { name, monthlyPrice, yearlyPrice, description, features, limits, isActive, exportDrafts, categoryLimits } = req.body;

    // Validate category IDs
    const Category = require('../models/Category');
    let invalidCategoryIds = [];
    if (categoryLimits && typeof categoryLimits === 'object') {
      for (const catId of Object.keys(categoryLimits)) {
        const exists = await Category.exists({ _id: catId });
        if (!exists) invalidCategoryIds.push(catId);
      }
    }
    if (invalidCategoryIds.length > 0) {
      return res.status(400).json({ error: 'Invalid category IDs in categoryLimits', invalidCategoryIds });
    }

    // Build updateData without decors for now
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
      exportDrafts: exportDrafts !== undefined ? exportDrafts : undefined
    };

    // Handle categoryLimits separately to ensure proper saving
    if (categoryLimits !== undefined) {
      let cleanedCategoryLimits = {};
      if (categoryLimits && typeof categoryLimits === 'object') {
        Object.entries(categoryLimits).forEach(([key, value]) => {
          if (/^[a-fA-F0-9]{24}$/.test(key)) {
            // Handle different value types: string numbers, actual numbers, -1, etc.
            let numValue;
            if (value === '' || value === null || value === undefined) {
              numValue = 0;
            } else if (value === '-1' || value === -1) {
              numValue = -1;
            } else {
              numValue = parseInt(value, 10);
              if (isNaN(numValue)) numValue = 0;
            }
            cleanedCategoryLimits[key] = numValue;
          }
        });
      }
      updateData.categoryLimits = cleanedCategoryLimits;
    }

    // Sync decors array with categoryLimits
    const Decor = require('../models/Decor');
    let allowedDecorIds = [];
    if (categoryLimits && typeof categoryLimits === 'object' && Object.keys(categoryLimits).length > 0) {
      for (const [catId, limit] of Object.entries(categoryLimits)) {
        const categoryDoc = await Category.findById(catId);
        if (!categoryDoc) {
          console.error(`Category not found for ID: ${catId}`);
          continue;
        }
        const categoryName = categoryDoc.name;
        const decorsInCategory = await Decor.find({ category: categoryName }).sort({ createdAt: 1 });
        if (parseInt(limit) === -1) {
          allowedDecorIds.push(...decorsInCategory.map(d => d._id));
        } else {
          allowedDecorIds.push(...decorsInCategory.slice(0, parseInt(limit)).map(d => d._id));
        }
      }
    }
    updateData.decors = allowedDecorIds;

    // Use findById and save instead of findByIdAndUpdate to ensure markModified works
    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Update all fields
    Object.keys(updateData).forEach(key => {
      plan[key] = updateData[key];
    });

    // Mark categoryLimits as modified to ensure it saves properly
    if (updateData.categoryLimits !== undefined) {
      plan.markModified('categoryLimits');
    }

    const updatedPlan = await plan.save();

    res.json({
      success: true,
      message: 'Plan updated successfully',
      plan: updatedPlan ? updatedPlan.toObject() : null
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ error: 'Failed to update plan', details: error.message, stack: error.stack });
  }
});

// Delete plan
const { deletePlan } = require('../controllers/planController');
router.delete('/plans/:id', verifyToken, checkAdmin, deletePlan);

// Initialize default plan
router.post('/plans/init-default', verifyToken, checkAdmin, async (req, res) => {
  try {
    // Check if default plan already exists
    const existingDefaultPlan = await Plan.findOne({ isDefault: true });
    
    if (existingDefaultPlan) {
      return res.json({
        success: true,
        message: 'Default plan already exists',
        plan: existingDefaultPlan
      });
    }

    // Check if FREE plan exists and update it, or create new one
    let freePlan = await Plan.findOne({ name: 'FREE' });
    
    if (freePlan) {
      // Update existing FREE plan to be the default
      freePlan.isDefault = true;
      freePlan.isDeletable = false;
      freePlan.isActive = true;
      freePlan.monthlyPrice = 0;
      freePlan.yearlyPrice = 0;
      freePlan.description = 'Basic free plan with limited features - perfect for getting started';
      freePlan.limits = {
        designsPerMonth: 3,
        imageUploadsPerDesign: 2
      };
      freePlan.exportDrafts = false;
      freePlan.features = ['Basic Wall Design', 'Limited Templates', '3 Saved Drafts'];
      
      await freePlan.save();
      
      res.json({
        success: true,
        message: 'Updated existing FREE plan to be the default plan',
        plan: freePlan
      });
    } else {
      // Create new default free plan
      const defaultPlan = new Plan({
        name: 'FREE',
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: 'Basic free plan with limited features - perfect for getting started',
        features: ['Basic Wall Design', 'Limited Templates', '3 Saved Drafts'],
        limits: {
          designsPerMonth: 3,
          imageUploadsPerDesign: 2
        },
        exportDrafts: false,
        isActive: true,
        isDefault: true,
        isDeletable: false,
        categoryLimits: {}
      });

      const savedPlan = await defaultPlan.save();
      
      res.json({
        success: true,
        message: 'Created new default FREE plan',
        plan: savedPlan
      });
    }
  } catch (error) {
    console.error('Initialize default plan error:', error);
    res.status(500).json({ error: 'Failed to initialize default plan' });
  }
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
