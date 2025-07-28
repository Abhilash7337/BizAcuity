const Decor = require('../models/Decor');
const multer = require('multer');
const uploadToS3 = require('../utils/s3Upload');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all decors
const getAllDecors = async (req, res) => {
  try {
    const decors = await Decor.find({ isActive: true });
    res.json(decors);
  } catch (error) {
    console.error('Error fetching decors:', error);
    res.status(500).json({ error: 'Failed to fetch decors' });
  }
};

// Create new decor (admin only)
const createDecor = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    if (!req.file) {
      console.error('🎯 No file received!');
      return res.status(400).json({ error: 'Image file is required' });
    }
    // Upload to S3
    const s3Url = await uploadToS3(req.file);
    const decor = new Decor({
      name,
      category,
      description,
      imageUrl: s3Url,
      isActive: true,
      createdBy: req.user.id
    });
    await decor.save();
    console.log('🎯 Decor saved successfully:', decor);
    res.status(201).json(decor);
  } catch (error) {
    console.error('🎯 Error creating decor:', error);
    res.status(500).json({ error: 'Failed to create decor' });
  }
};

// Update decor (admin only)
const updateDecor = (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id } = req.params;
      const { name, category, description, isActive } = req.body;
      
      const updateData = { name, category, description, isActive };
      
      if (req.file) {
        // Upload new image to S3
        const s3Url = await uploadToS3(req.file);
        updateData.imageUrl = s3Url;
      }

      const decor = await Decor.findByIdAndUpdate(id, updateData, { new: true });
      
      if (!decor) {
        return res.status(404).json({ error: 'Decor not found' });
      }

      res.json(decor);
    } catch (error) {
      console.error('Error updating decor:', error);
      res.status(500).json({ error: 'Failed to update decor' });
    }
  });
};

// Delete decor (admin only)
const deleteDecor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const decor = await Decor.findByIdAndUpdate(
      id, 
      { isActive: false }, 
      { new: true }
    );
    
    if (!decor) {
      return res.status(404).json({ error: 'Decor not found' });
    }

    res.json({ message: 'Decor deleted successfully' });
  } catch (error) {
    console.error('Error deleting decor:', error);
    res.status(500).json({ error: 'Failed to delete decor' });
  }
};

module.exports = {
  getAllDecors,
  createDecor,
  updateDecor,
  deleteDecor
};
