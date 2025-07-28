// Script to create an admin user in MongoDB Atlas
// Usage: node scripts/createAdminUser.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const MONGODB_URI = 'mongodb+srv://Abhilash:asdfghjkl@cluster0.peppppx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const adminDetails = {
  name: 'Admin',
  email: 'abhilashpodisetty@gmail.com',
  password: 'admin123', // Change this to a secure password
  userType: 'admin',
  role: 'admin',
  isVerified: true,
  isActive: true
};

async function createAdmin() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const existing = await User.findOne({ email: adminDetails.email });
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    process.exit(0);
  }
  const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
  const adminUser = new User({
    name: adminDetails.name,
    email: adminDetails.email,
    password: hashedPassword,
    userType: adminDetails.userType,
    role: adminDetails.role,
    isVerified: adminDetails.isVerified,
    isActive: adminDetails.isActive
  });
  await adminUser.save();
  console.log('Admin user created:', adminUser.email);
  mongoose.disconnect();
}

createAdmin().catch(err => {
  console.error('Error creating admin user:', err);
  mongoose.disconnect();
});
