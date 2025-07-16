const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const connectDB = require('../config/database');

const generateAdminToken = async () => {
  try {
    await connectDB();
    
    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      console.log('Admin user not found');
      process.exit(1);
    }

    // Generate token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ userId: adminUser._id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('Admin user found:');
    console.log('ID:', adminUser._id);
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('\nGenerated token:');
    console.log(token);
    console.log('\nUse this token in Authorization header: Bearer ' + token);

    process.exit(0);
  } catch (error) {
    console.error('Error generating token:', error);
    process.exit(1);
  }
};

generateAdminToken();
