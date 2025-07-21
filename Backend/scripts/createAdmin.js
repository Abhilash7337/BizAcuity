const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/walldesigner');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    let adminUser = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        userType: 'admin',
        role: 'admin',
        isVerified: true
      });
      await adminUser.save();
      console.log('Created admin user: admin@gmail.com');
    } else {
      // Update userType and role if needed
      let updated = false;
      if (adminUser.userType !== 'admin') {
        adminUser.userType = 'admin';
        updated = true;
      }
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        updated = true;
      }
      if (updated) {
        await adminUser.save();
        console.log('Updated userType/role to admin');
      } else {
        console.log('Admin user already exists: admin@gmail.com');
      }
    }

    console.log(`Admin user details:`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: admin123`);
    console.log(`Role: ${adminUser.role}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const main = async () => {
  await connectDB();
  await createAdminUser();
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
};

main();
