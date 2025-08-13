const mongoose = require('mongoose');
require('dotenv').config();

const Plan = require('./models/Plan');

async function updateFreePlan() {
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

    console.log('Found FREE plan:', freePlan.name);

    // Update with categoryLimits (using actual category IDs from database)
    freePlan.categoryLimits = {
      '689049e89a2ffc016cce73cc': 2, // Fruits: 2 items
      '6889c7280cc605b299a8dad8': 1, // Garlands: 1 item  
      '6889c59caddbe830922e0317': 3  // Plants: 3 items
    };

    freePlan.markModified('categoryLimits');
    await freePlan.save();

    console.log('✅ FREE plan updated with categoryLimits:', freePlan.categoryLimits);

    // Verify the update
    const updatedPlan = await Plan.findById(freePlan._id);
    console.log('✅ Verified categoryLimits:', updatedPlan.categoryLimits);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

updateFreePlan();
