const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/Category');
const Decor = require('./models/Decor');

async function syncCategoriesAndDecors() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all unique category names from decors
    const decorCategories = await Decor.distinct('category');
    console.log('📋 Categories found in decors:', decorCategories);

    // Get existing categories
    const existingCategories = await Category.find({});
    const existingCategoryNames = existingCategories.map(cat => cat.name.toLowerCase());
    console.log('📂 Existing categories in database:', existingCategoryNames);

    // Create missing categories
    const missingCategories = decorCategories.filter(
      cat => !existingCategoryNames.includes(cat.toLowerCase())
    );

    console.log('🆕 Missing categories to create:', missingCategories);

    // Create missing categories
    for (const categoryName of missingCategories) {
      const newCategory = new Category({
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1), // Capitalize first letter
        number: -1 // Default to unlimited
      });
      await newCategory.save();
      console.log(`✅ Created category: ${newCategory.name} (ID: ${newCategory._id})`);
    }

    // Now update all decors with proper categoryIds
    console.log('\n🔄 Updating decor categoryIds...');
    
    // Get fresh list of all categories
    const allCategories = await Category.find({});
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
    });

    // Update all decors
    const allDecors = await Decor.find({});
    let updatedCount = 0;

    for (const decor of allDecors) {
      const categoryId = categoryMap[decor.category.toLowerCase()];
      if (categoryId && (!decor.categoryId || decor.categoryId.toString() !== categoryId.toString())) {
        decor.categoryId = categoryId;
        await decor.save();
        updatedCount++;
        console.log(`✅ Updated decor "${decor.name}" (${decor.category}) with categoryId: ${categoryId}`);
      }
    }

    console.log(`\n🎉 Sync complete! Updated ${updatedCount} decors.`);
    
    // Show final state
    const finalCategories = await Category.find({}).sort({ name: 1 });
    console.log('\n📊 Final categories:');
    finalCategories.forEach(cat => {
      console.log(`  - ${cat.name} (ID: ${cat._id})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Also add a function to automatically sync when new decors are added
async function ensureCategoryExists(categoryName) {
  try {
    // Check if category exists (case-insensitive)
    let category = await Category.findOne({ 
      name: { $regex: new RegExp(`^${categoryName}$`, 'i') } 
    });
    
    if (!category) {
      // Create new category
      category = new Category({
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        number: -1
      });
      await category.save();
      console.log(`✅ Auto-created category: ${category.name}`);
    }
    
    return category._id;
  } catch (error) {
    console.error('Error ensuring category exists:', error);
    return null;
  }
}

// Run the sync
if (require.main === module) {
  syncCategoriesAndDecors();
}

module.exports = { syncCategoriesAndDecors, ensureCategoryExists };
