const mongoose = require('mongoose');
const Decor = require('../models/Decor');
require('dotenv').config();

const connectDB = require('../config/database');

const updateDecorImageUrls = async () => {
  try {
    await connectDB();
    
    // Find all decors with incorrect image URLs
    const decors = await Decor.find({});
    
    console.log(`Found ${decors.length} decors to update`);
    
    for (const decor of decors) {
      if (decor.imageUrl.startsWith('/decors/')) {
        // Update to correct path
        const newImageUrl = decor.imageUrl.replace('/decors/', '/uploads/decors/');
        
        await Decor.findByIdAndUpdate(decor._id, {
          imageUrl: newImageUrl
        });
        
        console.log(`Updated ${decor.name}: ${decor.imageUrl} -> ${newImageUrl}`);
      }
    }
    
    console.log('Image URL update completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating image URLs:', error);
    process.exit(1);
  }
};

updateDecorImageUrls();
