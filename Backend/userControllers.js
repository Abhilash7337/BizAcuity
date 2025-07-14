const User = require('./models/User');
const { generateToken } = require('./middleware/auth');

// ======================
// AUTHENTICATION CONTROLLERS
// ======================

// Register user (fallback - auth routes handle OTP-based registration)
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user (password will be hashed by the model middleware)
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({ 
      message: 'Registration successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user (fallback - auth routes handle verified user login)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password using the model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send user data and token
    res.json({ 
      message: 'Login successful', 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ======================
// USER MANAGEMENT CONTROLLERS
// ======================

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
    
    // Ensure user can only update their own profile
    if (req.params.id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

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
    
    if (!plan || !['regular', 'pro'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan selection' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user's plan
    user.plan = plan;
    await user.save();

    res.json({
      message: 'Plan selected successfully',
      plan: user.plan,
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

module.exports = {
  // Auth controllers
  registerUser,
  loginUser,
  
  // User controllers  
  getUserById,
  updatePassword,
  updateProfile,
  choosePlan,
  searchUsers
};
