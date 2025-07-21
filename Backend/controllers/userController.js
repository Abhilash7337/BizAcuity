// Get the latest plan upgrade request for the logged-in user
const getLatestPlanUpgradeRequest = async (req, res) => {
  try {
    const request = await PlanUpgradeRequest.findOne({ user: req.userId })
      .sort({ createdAt: -1 });
    if (!request) {
      return res.json({ success: true, request: null });
    }
    res.json({ success: true, request });
  } catch (error) {
    console.error('Get latest plan upgrade request error:', error);
    res.status(500).json({ error: 'Failed to fetch plan upgrade request' });
  }
};
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const { sendOTPEmail, sendPlanSubscriptionEmail } = require('../utils/emailService');
const path = require('path');
const { saveUploadedFile } = require('../utils/fileUpload');

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
    if (name) user.name = name;
    if (email) user.email = email;
    if (userType) user.userType = userType;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
    await user.save();
    // Always return full user object including plan
    res.json({
      message: 'Profile updated successfully',
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
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Choose plan (request approval)
const PlanUpgradeRequest = require('../models/PlanUpgradeRequest');
const choosePlan = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!plan) {
      return res.status(400).json({ error: 'No plan specified', receivedPlan: plan });
    }
    // Validate plan exists
    const planDetails = await Plan.findOne({ name: { $regex: new RegExp('^' + plan + '$', 'i') } });
    if (!planDetails) {
      const allPlans = await Plan.find({}).select('name -_id');
      return res.status(400).json({ error: 'Invalid plan selection', validPlans: allPlans.map(p => p.name), receivedPlan: plan });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Check for existing pending request
    const existingPending = await PlanUpgradeRequest.findOne({ user: user._id, status: 'pending' });
    if (existingPending) {
      return res.status(409).json({ error: 'You already have a pending plan change request.' });
    }
    // Create new plan upgrade request
    const upgradeRequest = new PlanUpgradeRequest({
      user: user._id,
      requestedPlan: planDetails.name,
      status: 'pending'
    });
    await upgradeRequest.save();
    res.json({
      message: 'Your plan change request is pending admin approval.',
      request: {
        id: upgradeRequest._id,
        requestedPlan: upgradeRequest.requestedPlan,
        status: upgradeRequest.status
      }
    });
  } catch (error) {
    console.error('Choose plan error:', error);
    res.status(500).json({ error: 'Failed to request plan change' });
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

// Add profile photo upload controller
const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileBuffer = req.file.buffer;
    const result = saveUploadedFile(fileBuffer, req.file.originalname, process.env.PORT || 5001);
    // Update user profilePhoto field
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.profilePhoto = result.url;
    await user.save();
    res.json({
      success: true,
      profilePhotoUrl: result.url,
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
    console.error('Profile photo upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile photo' });
  }
};

// Add profile photo removal controller
const removeProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.profilePhoto = '';
    await user.save();
    res.json({
      success: true,
      message: 'Profile photo removed',
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
    console.error('Profile photo remove error:', error);
    res.status(500).json({ error: 'Failed to remove profile photo' });
  }
};

module.exports = {
  getUserById,
  updatePassword,
  updateProfile,
  choosePlan,
  searchUsers,
  getUserProfile,
  getLatestPlanUpgradeRequest,
  updateProfilePhoto,
  removeProfilePhoto
};
