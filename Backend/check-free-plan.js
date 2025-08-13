const mongoose = require('mongoose');
require('dotenv').config();

const Plan = require('./models/Plan');

async function checkFreePlan() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the FREE plan
    const freePlan = await Plan.findOne({ name: 'FREE' });
    if (!freePlan) {
      console.log('❌ FREE plan not found');
      return;
    }

    console.log('FREE plan details:');
    console.log('- Name:', freePlan.name);
    console.log('- isActive:', freePlan.isActive);
    console.log('- CategoryLimits:', freePlan.categoryLimits);
    console.log('- Full plan:', JSON.stringify(freePlan, null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

checkFreePlan();
