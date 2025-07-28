const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// GET /images: Fetch all uploaded image URLs for all users
router.get('/images', verifyToken, async (req, res) => {
  try {
    // Find all users and get their uploadedImages arrays
    const users = await User.find({}, 'uploadedImages');
    // Flatten all image URLs into a single array
    const allImages = users.reduce((acc, user) => {
      if (Array.isArray(user.uploadedImages)) {
        acc.push(...user.uploadedImages);
      }
      return acc;
    }, []);
    res.json({ images: allImages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images', details: error.message });
  }
});

module.exports = router;
