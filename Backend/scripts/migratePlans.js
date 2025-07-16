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

const migratePlans = async () => {
  try {
    console.log('Starting plan migration...');
    
    // Find all users with old plan values
    const users = await User.find();
    console.log(`Found ${users.length} users to check`);
    
    let updatedCount = 0;
    
    for (const user of users) {
      let needsUpdate = false;
      let newPlan = user.plan;
      
      // Map old plan values to new ones if needed
      if (user.plan === 'regular' && user.userType !== 'admin') {
        // Keep regular as regular
        newPlan = 'regular';
      } else if (user.plan === 'pro') {
        // Keep pro as pro
        newPlan = 'pro';
      } else if (!user.plan || !['free', 'regular', 'pro', 'enterprise'].includes(user.plan)) {
        // Default to free for any invalid or missing plans
        newPlan = 'free';
        needsUpdate = true;
      }
      
      if (needsUpdate || user.plan !== newPlan) {
        try {
          await User.findByIdAndUpdate(user._id, { plan: newPlan });
          console.log(`Updated user ${user.email}: ${user.plan} -> ${newPlan}`);
          updatedCount++;
        } catch (error) {
          console.error(`Failed to update user ${user.email}:`, error.message);
        }
      }
    }
    
    console.log(`Migration completed. Updated ${updatedCount} users.`);
    
  } catch (error) {
    console.error('Migration error:', error);
  }
};

const main = async () => {
  await connectDB();
  await migratePlans();
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
};

main();
