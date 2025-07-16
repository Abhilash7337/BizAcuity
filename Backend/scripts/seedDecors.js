const mongoose = require('mongoose');
const Decor = require('../models/Decor');
const User = require('../models/User');
require('dotenv').config();

// Database connection
const connectDB = require('../config/database');

const seedDecors = async () => {
  try {
    await connectDB();
    
    // Find an admin user to assign as creator
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Clear existing decors
    await Decor.deleteMany({});

    // Default decors based on existing assets
    const defaultDecors = [
      {
        name: 'Black Table',
        category: 'tables',
        description: 'Modern black table',
        imageUrl: '/decors/Black.png',
        createdBy: adminUser._id
      },
      {
        name: 'Black Table 2',
        category: 'tables',
        description: 'Another black table variant',
        imageUrl: '/decors/Blackt.png',
        createdBy: adminUser._id
      },
      {
        name: 'White Table',
        category: 'tables',
        description: 'Clean white table',
        imageUrl: '/decors/White.png',
        createdBy: adminUser._id
      },
      {
        name: 'Wooden Table',
        category: 'tables',
        description: 'Large wooden table',
        imageUrl: '/decors/table4.png',
        createdBy: adminUser._id
      },
      {
        name: 'Flower Plant',
        category: 'plants',
        description: 'Beautiful flowering plant',
        imageUrl: '/decors/Flowerplant.png',
        createdBy: adminUser._id
      },
      {
        name: 'Flower Pot',
        category: 'plants',
        description: 'Decorative flower pot',
        imageUrl: '/decors/Flowerpot2.png',
        createdBy: adminUser._id
      },
      {
        name: 'Fruit Bowl',
        category: 'fruits',
        description: 'Fresh fruit arrangement',
        imageUrl: '/decors/Fruit.png',
        createdBy: adminUser._id
      },
      {
        name: 'Flower Garland',
        category: 'garlands',
        description: 'Decorative flower garland',
        imageUrl: '/decors/Garland1.png',
        createdBy: adminUser._id
      },
      {
        name: 'Vintage Clock',
        category: 'clocks',
        description: 'Classic vintage wall clock',
        imageUrl: '/decors/Vintage_Clock.png',
        createdBy: adminUser._id
      }
    ];

    // Insert decors
    const insertedDecors = await Decor.insertMany(defaultDecors);
    
    console.log(`Successfully seeded ${insertedDecors.length} decors to the database:`);
    insertedDecors.forEach(decor => {
      console.log(`- ${decor.name} (${decor.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding decors:', error);
    process.exit(1);
  }
};

seedDecors();
