const uploadToS3 = require('../utils/s3Upload');
const multer = require('multer');

// Handle file upload
const uploadImage = async (req, res) => {
  try {
    console.log('Upload endpoint hit. req.file:', req.file);
    if (!req.file) {
      console.log('No file uploaded in request.');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to S3
    const s3Url = await uploadToS3(req.file);
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const User = require('../models/User');
    const type = req.body.type || 'gallery';
    let update = {};
    if (type === 'profile') {
      update.profilePhoto = s3Url;
    } else if (type === 'background') {
      update['wall.wallImage'] = s3Url;
    } else if (type === 'gallery') {
      update.$push = { 'wall.images': s3Url };
    }
    await User.findByIdAndUpdate(userId, update, { new: true });
    res.json({ url: s3Url, type, message: 'Image uploaded and saved to user' });
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          error: 'File size too large',
          limit: '30MB'
        });
      }
    }
    res.status(500).json({ 
      error: 'Upload failed',
      details: error.message 
    });
  }
};

module.exports = {
  uploadImage
};
