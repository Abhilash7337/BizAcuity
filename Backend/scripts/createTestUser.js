const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
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

const createTestUser = async () => {
  try {
    // Accept email and password from command line arguments
    const email = process.argv[2] || 'testuser@example.com';
    const password = process.argv[3] || 'password123';
    const name = process.argv[4] || 'Test User';

    // Check if test user already exists
    let testUser = await User.findOne({ email });
    
    if (!testUser) {
      testUser = new User({
        name,
        email,
        password,
        userType: 'regular',
        isVerified: true
      });
      await testUser.save();
      console.log(`Created test user: ${email}`);
    } else {
      console.log(`Test user already exists: ${email}`);
    }

    // Create/Update subscription for test user to free plan (1 draft limit)
    let subscription = await Subscription.findOne({ userId: testUser._id });
    
    if (!subscription) {
      subscription = new Subscription({
        userId: testUser._id,
        plan: 'free',
        status: 'active',
        billingCycle: 'monthly',
        amount: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        autoRenew: false
      });
      await subscription.save();
      console.log('Created subscription for test user with free plan (1 draft limit)');
    } else {
      subscription.plan = 'free';
      subscription.amount = 0;
      await subscription.save();
      console.log('Updated test user subscription to free plan (1 draft limit)');
    }

    console.log(`Test user details:`);
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: password123`);
    console.log(`Plan: ${subscription.plan} (1 draft limit)`);
    console.log(`\nLogin with these credentials to test the draft limit functionality!`);

  } catch (error) {
    console.error('Error creating test user:', error);
  }
};

const main = async () => {
  await connectDB();
  await createTestUser();
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
};

main();
