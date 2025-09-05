const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getCategories, addCategory, deleteCategory } = require('../controllers/categoryController');

// Get all categories (public)
router.get('/categories', getCategories);

// Add new category (admin only)
router.post('/admin/categories', verifyToken, addCategory);

// Delete category (admin only)
router.delete('/admin/categories/:id', verifyToken, deleteCategory);

module.exports = router;
