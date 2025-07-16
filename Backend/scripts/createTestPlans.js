const mongoose = require('mongoose');
const Plan = require('../models/Plan');
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

const createTestPlans = async () => {
  try {
    // Clear existing plans
    await Plan.deleteMany({});
    console.log('Cleared existing plans');

    const testPlans = [
      {
        name: 'free',
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: 'Perfect for getting started with basic design needs',
        features: [
          'Basic Templates',
          'Standard Support'
        ],
        limits: {
          designsPerMonth: 1, // Only 1 draft allowed
          exportResolution: 'HD',
          storageGB: 1,
          supportLevel: 'basic'
        },
        isActive: true
      },
      {
        name: 'regular',
        monthlyPrice: 299,
        yearlyPrice: 2999,
        description: 'Great for individuals and small projects',
        features: [
          'Premium Design Templates',
          '24/7 Priority Support',
          'Remove Watermark'
        ],
        limits: {
          designsPerMonth: 5, // 5 drafts allowed
          exportResolution: 'FHD',
          storageGB: 10,
          supportLevel: 'priority'
        },
        isActive: true
      },
      {
        name: 'pro',
        monthlyPrice: 599,
        yearlyPrice: 5999,
        description: 'Best for professionals and growing businesses',
        features: [
          'Premium Design Templates',
          '24/7 Priority Support',
          'Commercial Usage License',
          'Custom Font Upload',
          'Remove Watermark'
        ],
        limits: {
          designsPerMonth: 25, // 25 drafts allowed
          exportResolution: 'FHD',
          storageGB: 50,
          supportLevel: 'premium'
        },
        isActive: true
      },
      {
        name: 'enterprise',
        monthlyPrice: 1999,
        yearlyPrice: 19999,
        description: 'For large teams and unlimited creative freedom',
        features: [
          'Premium Design Templates',
          '24/7 Priority Support',
          'Commercial Usage License',
          'Custom Font Upload',
          'Team Collaboration Tools',
          'Remove Watermark'
        ],
        limits: {
          designsPerMonth: -1, // Unlimited drafts
          exportResolution: '4K',
          storageGB: 500,
          supportLevel: 'premium'
        },
        isActive: true
      }
    ];

    for (const planData of testPlans) {
      const plan = new Plan(planData);
      await plan.save();
      console.log(`Created plan: ${plan.name} with ${plan.limits.designsPerMonth === -1 ? 'unlimited' : plan.limits.designsPerMonth} draft limit`);
    }

    console.log('Test plans created successfully!');
  } catch (error) {
    console.error('Error creating test plans:', error);
  }
};

const main = async () => {
  await connectDB();
  await createTestPlans();
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
};

main();
