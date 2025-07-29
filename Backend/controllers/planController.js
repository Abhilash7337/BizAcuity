const Plan = require('../models/Plan');

// Create a new subscription plan
const createPlan = async (req, res) => {
  try {
    const { name, monthlyPrice, yearlyPrice, description, features, limits, isActive, exportDrafts, categoryLimits, decors } = req.body;

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
      categoryLimits: categoryLimits || {},
      decors: Array.isArray(decors) ? decors : [],
      isActive: isActive !== undefined ? isActive : true,
      exportDrafts: exportDrafts === true // default false if not provided
    });

    const savedPlan = await newPlan.save();
    
    res.status(201).json({
      message: 'Subscription plan created successfully',
      plan: savedPlan
    });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ 
      error: 'Failed to create subscription plan',
      details: error.message 
    });
  }
};

// Get all subscription plans
const getAllPlans = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      isActive,
      search
    } = req.query;

    const query = {};
    
    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const plans = await Plan.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalPlans = await Plan.countDocuments(query);
    const totalPages = Math.ceil(totalPlans / parseInt(limit));

    // Get some basic statistics
    const stats = {
      totalPlans,
      activePlans: await Plan.countDocuments({ isActive: true }),
      inactivePlans: await Plan.countDocuments({ isActive: false })
    };

    res.json({
      plans,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPlans,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      },
      stats
    });
  } catch (error) {
    console.error('Get all plans error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch subscription plans',
      details: error.message 
    });
  }
};

// Get a specific subscription plan
const getPlanById = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    res.json({ plan });
  } catch (error) {
    console.error('Get plan by ID error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch subscription plan',
      details: error.message 
    });
  }
};

// Update a subscription plan
const updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const { name, monthlyPrice, yearlyPrice, description, features, limits, isActive, exportDrafts, categoryLimits, decors } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    // Check if the new name already exists (excluding current plan)
    if (name && name.trim() !== plan.name) {
      const existingPlan = await Plan.findOne({ 
        name: name.trim(), 
        _id: { $ne: planId } 
      });
      if (existingPlan) {
        return res.status(400).json({ 
          error: 'A plan with this name already exists' 
        });
      }
    }

    // Update fields
    if (name !== undefined) plan.name = name.trim();
    if (monthlyPrice !== undefined) plan.monthlyPrice = parseFloat(monthlyPrice);
    if (yearlyPrice !== undefined) plan.yearlyPrice = parseFloat(yearlyPrice);
    if (description !== undefined) plan.description = description.trim();
    if (features !== undefined) plan.features = features;
    if (isActive !== undefined) plan.isActive = isActive;
    if (exportDrafts !== undefined) plan.exportDrafts = exportDrafts;
    
    if (limits) {
      plan.limits = {
        designsPerMonth: limits.designsPerMonth ?? plan.limits.designsPerMonth,
        imageUploadsPerDesign: limits.imageUploadsPerDesign ?? plan.limits.imageUploadsPerDesign
      };
    }

    if (categoryLimits !== undefined) {
      plan.categoryLimits = categoryLimits;
    }
    if (decors !== undefined) {
      plan.decors = Array.isArray(decors) ? decors : [];
    }
    plan.updatedAt = new Date();

    const updatedPlan = await plan.save();
    
    res.json({
      message: 'Subscription plan updated successfully',
      plan: updatedPlan
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ 
      error: 'Failed to update subscription plan',
      details: error.message 
    });
  }
};

// Delete a subscription plan
const deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    // Check if any users are currently subscribed to this plan
    const User = require('../models/User');
    const usersWithThisPlan = await User.countDocuments({ plan: plan.name });
    
    if (usersWithThisPlan > 0) {
      return res.status(400).json({ 
        error: `Cannot delete plan. ${usersWithThisPlan} user(s) are currently subscribed to this plan.`,
        activeSubscriptions: usersWithThisPlan
      });
    }

    await Plan.findByIdAndDelete(planId);
    
    res.json({
      message: 'Subscription plan deleted successfully',
      deletedPlan: plan
    });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ 
      error: 'Failed to delete subscription plan',
      details: error.message 
    });
  }
};

// Toggle plan active status
const togglePlanStatus = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: 'Subscription plan not found' });
    }

    plan.isActive = !plan.isActive;
    plan.updatedAt = new Date();

    const updatedPlan = await plan.save();
    
    res.json({
      message: `Plan ${updatedPlan.isActive ? 'activated' : 'deactivated'} successfully`,
      plan: updatedPlan
    });
  } catch (error) {
    console.error('Toggle plan status error:', error);
    res.status(500).json({ 
      error: 'Failed to toggle plan status',
      details: error.message 
    });
  }
};

// Get plans analytics
const getPlansAnalytics = async (req, res) => {
  try {
    const totalPlans = await Plan.countDocuments();
    const activePlans = await Plan.countDocuments({ isActive: true });
    const inactivePlans = await Plan.countDocuments({ isActive: false });

    // Get plans distribution by price range
    const priceRanges = await Plan.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $eq: ['$monthlyPrice', 0] }, then: 'Free' },
                { case: { $lte: ['$monthlyPrice', 10] }, then: 'Basic ($0-$10)' },
                { case: { $lte: ['$monthlyPrice', 25] }, then: 'Standard ($11-$25)' },
                { case: { $lte: ['$monthlyPrice', 50] }, then: 'Professional ($26-$50)' },
                { case: { $gt: ['$monthlyPrice', 50] }, then: 'Enterprise ($50+)' }
              ],
              default: 'Unknown'
            }
          },
          count: { $sum: 1 },
          avgPrice: { $avg: '$monthlyPrice' }
        }
      }
    ]);

    // Get average features per plan
    const featureStats = await Plan.aggregate([
      {
        $project: {
          featureCount: { $size: '$features' }
        }
      },
      {
        $group: {
          _id: null,
          avgFeatures: { $avg: '$featureCount' },
          maxFeatures: { $max: '$featureCount' },
          minFeatures: { $min: '$featureCount' }
        }
      }
    ]);

    res.json({
      analytics: {
        totalPlans,
        activePlans,
        inactivePlans,
        priceRanges,
        featureStats: featureStats[0] || { avgFeatures: 0, maxFeatures: 0, minFeatures: 0 }
      }
    });
  } catch (error) {
    console.error('Get plans analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch plans analytics',
      details: error.message 
    });
  }
};

// Get active subscription plans for users (public)
const getPublicPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true })
      .sort({ monthlyPrice: 1 })
      .select('name monthlyPrice yearlyPrice description features limits exportDrafts decors');

    res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Get public plans error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch subscription plans',
      details: error.message 
    });
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  getPlansAnalytics,
  getPublicPlans
};
