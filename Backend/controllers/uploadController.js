// Placeholder for future base64 encoding logic
const multer = require('multer');

// Handle file upload
const uploadImage = async (req, res) => {
  try {
    console.log('Upload endpoint hit. req.file:', req.file);
    if (!req.file) {
      console.log('No file uploaded in request.');
      return res.status(400).json({ error: 'No file uploaded' });
    }

        // Convert image to base64 and store in MongoDB
        const imageBuffer = req.file.buffer;
        const base64Image = imageBuffer.toString('base64');
        const imageObj = {
          data: base64Image,
          contentType: req.file.mimetype
        };
    const userId = req.user && (req.user._id || req.user.id);
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const User = require('../models/User');
    const type = req.body.type || 'gallery';
    let update = {};
    if (type === 'profile') {
      update.profilePhoto = imageObj;
    } else if (type === 'background') {
      update['wall.wallImage'] = imageObj;
    } else if (type === 'gallery') {
      update.$push = { 'wall.images': imageObj };
    }
    await User.findByIdAndUpdate(userId, update, { new: true });
    res.json({ image: imageObj, type, message: 'Image uploaded and saved to user' });
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
