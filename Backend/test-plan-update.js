// Test script to verify plan management fix
// Run this to test the decor limit saving functionality

const mongoose = require('mongoose');
const Plan = require('./models/Plan');

// Test the categoryLimits field handling
async function testPlanUpdate() {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Mialtar');
  
  try {
    // Create a test plan
    const testPlan = new Plan({
      name: 'Test Plan',
      monthlyPrice: 10,
      yearlyPrice: 100,
      description: 'Test plan for decor limits',
      features: ['Test Feature'],
      limits: {
        designsPerMonth: 5,
        imageUploadsPerDesign: 3
      },
      categoryLimits: {
        '507f1f77bcf86cd799439011': 5,  // Test category ID
        '507f1f77bcf86cd799439012': -1  // Unlimited for another category
      }
    });
    
    await testPlan.save();
    console.log('✅ Test plan created successfully');
    console.log('CategoryLimits:', testPlan.categoryLimits);
    
    // Update the plan
    testPlan.categoryLimits = {
      '507f1f77bcf86cd799439011': 10,  // Changed from 5 to 10
      '507f1f77bcf86cd799439012': 3,   // Changed from -1 to 3
      '507f1f77bcf86cd799439013': 7    // New category
    };
    testPlan.markModified('categoryLimits');
    
    await testPlan.save();
    console.log('✅ Test plan updated successfully');
    console.log('Updated CategoryLimits:', testPlan.categoryLimits);
    
    // Verify the update by fetching from database
    const fetchedPlan = await Plan.findById(testPlan._id);
    console.log('✅ Fetched plan from database');
    console.log('Fetched CategoryLimits:', fetchedPlan.categoryLimits);
    
    // Clean up
    await Plan.findByIdAndDelete(testPlan._id);
    console.log('✅ Test plan deleted');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  testPlanUpdate();
}

module.exports = testPlanUpdate;
