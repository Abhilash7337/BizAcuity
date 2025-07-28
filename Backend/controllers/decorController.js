const Decor = require('../models/Decor');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/decors/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all decors
const getAllDecors = async (req, res) => {
  try {
    const decors = await Decor.find({ isActive: true });
    res.json(decors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch decors' });
  }
};

// Create new decor (admin only)
const createDecor = (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    try {
      const { name, category, description } = req.body;
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }
      const imageUrl = `/uploads/decors/${req.file.filename}`;
      const decor = new Decor({
        name,
        category,
        description,
        imageUrl,
        isActive: true,
        createdBy: req.user.id
      });
      await decor.save();
      res.status(201).json(decor);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create decor' });
    }
  });
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
        updateData.imageUrl = `/uploads/decors/${req.file.filename}`;
      } else {
        // If no new image, preserve the existing imageUrl
        const existingDecor = await Decor.findById(id);
        if (existingDecor && existingDecor.imageUrl) {
          updateData.imageUrl = existingDecor.imageUrl;
        }
      }
      const decor = await Decor.findByIdAndUpdate(id, updateData, { new: true });
      if (!decor) {
        return res.status(404).json({ error: 'Decor not found' });
      }
      res.json(decor);
    } catch (error) {
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
    res.status(500).json({ error: 'Failed to delete decor' });
  }
};

module.exports = {
  getAllDecors,
  createDecor,
  updateDecor,
  deleteDecor,
  upload
};
