const Decor = require('../models/Decor');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all decors
const getAllDecors = async (req, res) => {
  try {
    const decors = await Decor.find({ isActive: true });
    
    // Ensure image object is always present and well-formed
    const decorsWithImage = decors.map(decor => {
      let image = { data: '', contentType: '' };
      if (decor.image && decor.image.data && decor.image.contentType) {
        image = {
          data: decor.image.data,
          contentType: decor.image.contentType
        };
      }
      return {
        ...decor.toObject(),
        image
      };
    });

    res.json(decorsWithImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} // Closing brace added for getAllDecors function

// Create new decor (admin only)
// Create new decor (admin only)
// Create new decor (admin only)
const createDecor = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    // Use static file path for imageUrl
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
    console.error('Error creating decor:', error);
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
        // Use static file path for imageUrl
        updateData.imageUrl = `/uploads/decors/${req.file.filename}`;
      }
      // Remove legacy base64 image handling
      // If no new image, preserve the existing imageUrl
      if (!req.file) {
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
