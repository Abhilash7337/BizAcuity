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

const testLogin = async () => {
  try {
    // Check if our test user exists
    const testUser = await User.findOne({ email: 'testuser@example.com' });
    
    if (testUser) {
      console.log('✅ Test user found:');
      console.log(`   Email: ${testUser.email}`);
      console.log(`   Name: ${testUser.name}`);
      console.log(`   Plan: ${testUser.plan}`);
      console.log(`   Verified: ${testUser.isVerified}`);
      console.log(`   User Type: ${testUser.userType}`);
      
      // Test password comparison
      const isPasswordValid = await testUser.comparePassword('password123');
      console.log(`   Password valid: ${isPasswordValid}`);
    } else {
      console.log('❌ Test user not found. Creating one...');
      
      const newUser = new User({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        isVerified: true,
        plan: 'free'
      });
      
      await newUser.save();
      console.log('✅ Test user created successfully!');
    }

    // Check admin user
    const adminUser = await User.findOne({ email: 'admin@gmail.com' });
    
    if (adminUser) {
      console.log('\n✅ Admin user found:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   User Type: ${adminUser.userType}`);
      console.log(`   Verified: ${adminUser.isVerified}`);
    } else {
      console.log('\n❌ Admin user not found. Please create one.');
    }

    console.log('\n🔐 You can now test login with:');
    console.log('   Regular User: testuser@example.com / password123');
    if (adminUser) {
      console.log('   Admin User: admin@gmail.com / [your admin password]');
    }

  } catch (error) {
    console.error('Test error:', error);
  }
};

const main = async () => {
  await connectDB();
  await testLogin();
  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
};

main();
