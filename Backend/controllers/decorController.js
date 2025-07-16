const Decor = require('../models/Decor');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for decor uploads
const decorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const decorDir = path.join(__dirname, '../../uploads/decors');
    if (!fs.existsSync(decorDir)) {
      fs.mkdirSync(decorDir, { recursive: true });
    }
    cb(null, decorDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: decorStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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

      const decor = new Decor({
        name,
        category,
        description,
        imageUrl: `/uploads/decors/${req.file.filename}`,
        isActive: true,
        createdBy: req.user.id
      });

      await decor.save();
      res.status(201).json(decor);
    } catch (error) {
      console.error('Error creating decor:', error);
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
