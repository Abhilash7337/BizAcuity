const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Register user (fallback - auth routes handle OTP-based registration)
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Find the default plan first, fallback to FREE plan by name
    const Plan = require('../models/Plan');
    let defaultPlan = await Plan.findOne({ isDefault: true, isActive: true });
    
    if (!defaultPlan) {
      // Fallback to finding a plan named 'FREE'
      defaultPlan = await Plan.findOne({ name: 'FREE', isActive: true });
    }
    
    let planName = defaultPlan ? defaultPlan.name : 'FREE';
    // Set userType to 'admin' if registering with the admin email
    const userType = email === 'abhilashpodisetty@gmail.com' ? 'admin' : undefined;
    const user = new User({ name, email, password, plan: planName, ...(userType && { userType }) });
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({ 
      message: 'Registration successful',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        userType: user.userType,
        plan: user.plan,
        profilePhoto: user.profilePhoto
      },
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
        email: user.email,
        userType: user.userType,
        plan: user.plan,
        profilePhoto: user.profilePhoto
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = {
  registerUser,
  loginUser
};
