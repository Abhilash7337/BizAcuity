const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/walldesigner');

const Plan = require('../models/Plan');

async function migratePlans() {
  try {
    console.log('Starting plan migration...');
    
    // Find all plans that don't have imageUploadsPerDesign field
    const plansToUpdate = await Plan.find({
      'limits.imageUploadsPerDesign': { $exists: false }
    });
    
    console.log(`Found ${plansToUpdate.length} plans to update`);
    
    for (const plan of plansToUpdate) {
      console.log(`Updating plan: ${plan.name}`);
      
      // Set default image upload limit based on plan type
      let imageUploadsPerDesign = 3; // default
      
      if (plan.name.toLowerCase().includes('free') || plan.monthlyPrice === 0) {
        imageUploadsPerDesign = 1;
      } else if (plan.name.toLowerCase().includes('premium') || plan.monthlyPrice > 500) {
        imageUploadsPerDesign = 10;
      } else if (plan.name.toLowerCase().includes('business') || plan.monthlyPrice > 1000) {
        imageUploadsPerDesign = -1; // unlimited
      }
      
      // Update the plan
      await Plan.findByIdAndUpdate(plan._id, {
        $set: {
          'limits.imageUploadsPerDesign': imageUploadsPerDesign
        }
      });
      
      console.log(`✓ Updated ${plan.name} with ${imageUploadsPerDesign === -1 ? 'unlimited' : imageUploadsPerDesign} image uploads per design`);
    }
    
    console.log('Migration completed successfully!');
    
    // Verify the migration
    const updatedPlans = await Plan.find({});
    console.log('\nUpdated plans:');
    updatedPlans.forEach(plan => {
      console.log(`- ${plan.name}: ${plan.limits.imageUploadsPerDesign === -1 ? 'unlimited' : plan.limits.imageUploadsPerDesign} images per design`);
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

migratePlans();
