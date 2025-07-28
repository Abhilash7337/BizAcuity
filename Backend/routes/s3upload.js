const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadToS3 = require('../utils/s3Upload');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Use memory storage for multer to access file.buffer
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload: Upload image to S3 and save URL to MongoDB
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Upload to S3
    let imageUrl;
    // If using multer-s3, req.file.location is set. Otherwise, use uploadToS3 result.
    if (req.file.location) {
      imageUrl = req.file.location;
    } else {
      imageUrl = await uploadToS3(req.file);
    }
    // Save image URL to MongoDB (profilePhoto and uploadedImages array)
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePhoto: imageUrl,
        $push: { uploadedImages: imageUrl }
      },
      { new: true }
    );
    res.json({ imageUrl, uploadedImages: updatedUser.uploadedImages });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

module.exports = router;
