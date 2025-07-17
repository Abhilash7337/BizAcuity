const mongoose = require('mongoose');
const Plan = require('../models/Plan');
require('dotenv').config();

const samplePlans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for getting started with basic design tools',
    features: [
      'Create up to 5 designs per month',
      'Basic template library',
      'Standard export quality',
      'Community support'
    ],
    limits: {
      designsPerMonth: 5,
      exportResolution: 'HD',
      storageGB: 1,
      supportLevel: 'basic'
    },
    isActive: true
  },
  {
    name: 'Pro',
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    description: 'Enhanced features for professional designers',
    features: [
      'Create up to 100 designs per month',
      'Premium template library',
      'HD export quality',
      'Priority support',
      'Custom fonts',
      'Advanced editing tools',
      'Cloud storage sync'
    ],
    limits: {
      designsPerMonth: 100,
      exportResolution: 'FHD',
      storageGB: 25,
      supportLevel: 'priority'
    },
    isActive: true
  },
  {
    name: 'Premium',
    monthlyPrice: 39.99,
    yearlyPrice: 399.99,
    description: 'Everything you need for professional design work',
    features: [
      'Unlimited designs',
      'Full template library access',
      '4K export quality',
      'Premium support',
      'Custom fonts',
      'Advanced editing tools',
      'Team collaboration',
      'API access',
      'White label options',
      'Commercial license'
    ],
    limits: {
      designsPerMonth: -1, // Unlimited
      exportResolution: '4K',
      storageGB: 100,
      supportLevel: 'premium'
    },
    isActive: true
  },
  {
    name: 'Enterprise',
    monthlyPrice: 99.99,
    yearlyPrice: 999.99,
    description: 'Complete solution for large teams and organizations',
    features: [
      'Unlimited designs',
      'Full template library access',
      '4K export quality',
      'Dedicated support',
      'Custom fonts',
      'Advanced editing tools',
      'Team collaboration',
      'API access',
      'White label options',
      'Commercial license',
      'Advanced analytics',
      'Custom integrations',
      'Priority onboarding'
    ],
    limits: {
      designsPerMonth: -1, // Unlimited
      exportResolution: '4K',
      storageGB: 500,
      supportLevel: 'premium'
    },
    isActive: true
  }
];

async function createSamplePlans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bizacuity');
    console.log('Connected to MongoDB');

    // Clear existing plans (optional)
    await Plan.deleteMany({});
    console.log('Cleared existing plans');

    // Create sample plans
    const createdPlans = await Plan.insertMany(samplePlans);
    console.log(`Created ${createdPlans.length} sample plans:`);
    
    createdPlans.forEach(plan => {
      console.log(`- ${plan.name}: ₹${plan.monthlyPrice}/month (${plan.features.length} features)`);
    });

    console.log('\nSample plans created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample plans:', error);
    process.exit(1);
  }
}

// Run the script
createSamplePlans();
