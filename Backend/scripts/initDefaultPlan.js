const mongoose = require('mongoose');
const Plan = require('../models/Plan');

// Initialize default free plan
async function initDefaultPlan() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name');
    console.log('Connected to MongoDB');

    // Check if default plan already exists
    const existingDefaultPlan = await Plan.findOne({ isDefault: true });
    
    if (existingDefaultPlan) {
      console.log('Default plan already exists:', existingDefaultPlan.name);
      return;
    }

    // Check if FREE plan exists and update it, or create new one
    let freePlan = await Plan.findOne({ name: 'FREE' });
    
    if (freePlan) {
      // Update existing FREE plan to be the default
      freePlan.isDefault = true;
      freePlan.isDeletable = false;
      freePlan.isActive = true;
      // Ensure basic free plan features
      freePlan.monthlyPrice = 0;
      freePlan.yearlyPrice = 0;
      freePlan.description = 'Basic free plan with limited features';
      freePlan.limits = {
        designsPerMonth: 3,
        imageUploadsPerDesign: 2
      };
      freePlan.exportDrafts = false;
      freePlan.features = ['Basic Wall Design', 'Limited Templates'];
      
      await freePlan.save();
      console.log('Updated existing FREE plan to be the default plan');
    } else {
      // Create new default free plan
      const defaultPlan = new Plan({
        name: 'FREE',
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: 'Basic free plan with limited features',
        features: ['Basic Wall Design', 'Limited Templates'],
        limits: {
          designsPerMonth: 3,
          imageUploadsPerDesign: 2
        },
        exportDrafts: false,
        isActive: true,
        isDefault: true,
        isDeletable: false,
        categoryLimits: {}
      });

      await defaultPlan.save();
      console.log('Created new default FREE plan');
    }

    console.log('Default plan initialization completed successfully');
  } catch (error) {
    console.error('Error initializing default plan:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  initDefaultPlan();
}

module.exports = initDefaultPlan;
