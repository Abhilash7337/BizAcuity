const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const { sendOTPEmail, sendPlanSubscriptionEmail } = require('../utils/emailService');

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');
      
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      userType: user.userType,
      plan: user.plan
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Update user password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Ensure user can only update their own password
    if (req.params.id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Input validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare password using the model method
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, userType, profilePhoto } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (userType) user.userType = userType;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Choose plan
const choosePlan = async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Validate plan selection against database
    if (!plan) {
      return res.status(400).json({ 
        error: 'No plan specified',
        receivedPlan: plan
      });
    }

    // Find the plan in the database (case-insensitive)
    const planDetails = await Plan.findOne({ name: { $regex: new RegExp('^' + plan + '$', 'i') } });
    if (!planDetails) {
      const allPlans = await Plan.find({}).select('name -_id');
      return res.status(400).json({ 
        error: 'Invalid plan selection',
        validPlans: allPlans.map(p => p.name),
        receivedPlan: plan
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user's plan to the canonical plan name
    user.plan = planDetails.name;
    await user.save();

    // Create or update user's subscription
    let subscription = await Subscription.findOne({ userId: req.userId });
    const planPrice = planDetails.monthlyPrice;
    
    if (!subscription) {
      // Create new subscription
      subscription = new Subscription({
        userId: req.userId,
        plan: planDetails.name,
        status: 'active',
        billingCycle: 'monthly',
        amount: planPrice,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        autoRenew: false
      });
    } else {
      // Update existing subscription
      subscription.plan = planDetails.name;
      subscription.amount = planPrice;
      subscription.status = 'active';
      subscription.startDate = new Date();
      subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
    
    await subscription.save();

    // Send plan subscription confirmation email
    if (user.email && planDetails) {
      sendPlanSubscriptionEmail(
        user.email,
        user.name,
        {
          name: planDetails.name,
          monthlyPrice: planDetails.monthlyPrice,
          yearlyPrice: planDetails.yearlyPrice,
          description: planDetails.description,
          features: planDetails.features,
          limits: planDetails.limits
        }
      );
    }

    res.json({
      message: 'Plan selected successfully',
      plan: user.plan,
      subscription: {
        plan: subscription.plan,
        amount: subscription.amount,
        status: subscription.status
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        userType: user.userType,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Choose plan error:', error);
    res.status(500).json({ error: 'Failed to select plan' });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('_id name email')
    .limit(10);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
};

// Get current user profile (from authenticated token)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password');
      
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      userType: user.userType,
      plan: user.plan
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

module.exports = {
  getUserById,
  updatePassword,
  updateProfile,
  choosePlan,
  searchUsers,
  getUserProfile
};
