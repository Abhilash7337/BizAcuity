const Category = require('../models/Category');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Add new category (admin only)
const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    // Check for duplicate
    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    const category = new Category({ name: name.trim() });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
};


const Decor = require('../models/Decor');

// Delete category (admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    // Check if any decor uses this category
    const decorUsing = await Decor.findOne({ category: category.name });
    if (decorUsing) {
      return res.status(400).json({ error: 'Cannot delete: Category is in use by one or more decors.' });
    }
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

module.exports = { getCategories, addCategory, deleteCategory };
