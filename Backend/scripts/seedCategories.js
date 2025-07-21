const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
  { name: 'clocks' },
  { name: 'tables' },
  { name: 'plants' },
  { name: 'fruits' },
  { name: 'garlands' },
  { name: 'lamps' },
  { name: 'chairs' },
  { name: 'flowers' },
  { name: 'frames' },
  { name: 'other' }
];

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/walldesigner');
};

const seed = async () => {
  try {
    await connectDB();
    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        console.log('Added:', cat.name);
      } else {
        console.log('Exists:', cat.name);
      }
    }
    await mongoose.disconnect();
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
