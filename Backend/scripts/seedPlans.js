const mongoose = require('mongoose');
require('dotenv').config();

// Import the Plan model
const Plan = require('../models/Plan');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/walldesigner');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample subscription plans
const samplePlans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Get started with basic wall design features',
    features: [
      'Create up to 3 designs per month',
      'Basic templates',
      'SD export quality',
      'Community support'
    ],
    limits: {
      designsPerMonth: 3,
      exportResolution: 'SD',
      storageGB: 1,
      supportLevel: 'basic'
    },
    isActive: true
  },
  {
    name: 'Pro',
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    description: 'Perfect for individual designers and small projects',
    features: [
      'Create up to 25 designs per month',
      'Premium templates',
      'HD export quality',
      'Priority support',
      'Custom fonts',
      'Advanced editing tools'
    ],
    limits: {
      designsPerMonth: 25,
      exportResolution: 'HD',
      storageGB: 10,
      supportLevel: 'priority'
    },
    isActive: true
  },
  {
    name: 'Premium',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    description: 'For professional designers and design agencies',
    features: [
      'Unlimited designs',
      'All premium templates',
      '4K export quality',
      'Premium support',
      'Custom fonts',
      'Advanced editing tools',
      'Team collaboration',
      'Commercial license',
      'API access'
    ],
    limits: {
      designsPerMonth: -1, // unlimited
      exportResolution: '4K',
      storageGB: 100,
      supportLevel: 'premium'
    },
    isActive: true
  },
  {
    name: 'Enterprise',
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    description: 'For large teams and organizations with advanced needs',
    features: [
      'Unlimited designs',
      'All premium templates',
      '4K export quality',
      'Premium support',
      'Custom fonts',
      'Advanced editing tools',
      'Team collaboration',
      'Commercial license',
      'API access',
      'White label solution',
      'Advanced analytics',
      'Custom integrations'
    ],
    limits: {
      designsPerMonth: -1, // unlimited
      exportResolution: '4K',
      storageGB: -1, // unlimited
      supportLevel: 'premium'
    },
    isActive: true
  }
];

// Seed function
const seedPlans = async () => {
  try {
    console.log('Seeding subscription plans...');
    
    // Clear existing plans
    await Plan.deleteMany({});
    console.log('Cleared existing plans');

    // Insert sample plans
    const insertedPlans = await Plan.insertMany(samplePlans);
    console.log(`Successfully inserted ${insertedPlans.length} subscription plans:`);
    
    insertedPlans.forEach(plan => {
      console.log(`- ${plan.name}: ₹${plan.monthlyPrice}/month (${plan.features.length} features)`);
    });

    console.log('\nSubscription plans seeded successfully!');
  } catch (error) {
    console.error('Error seeding plans:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seeder
const runSeeder = async () => {
  await connectDB();
  await seedPlans();
};

runSeeder();
