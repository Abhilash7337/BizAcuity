const Decor = require('../models/Decor');
const multer = require('multer');
// Placeholder for future base64 encoding logic

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all decors
const getAllDecors = async (req, res) => {
  try {
    console.log('🎯 getAllDecors: Fetching decors from database...');
    const decors = await Decor.find({ isActive: true });
    console.log('🎯 getAllDecors: Found', decors.length, 'decor(s)');
    
    // Ensure image object is always present and well-formed
    const decorsWithImage = decors.map(decor => {
      let image = { data: '', contentType: '' };
      if (decor.image && decor.image.data && decor.image.contentType) {
        // Validate base64 data
        const base64Data = decor.image.data;
        const contentType = decor.image.contentType;
        
        // Check if base64 data is valid
        if (base64Data && typeof base64Data === 'string' && base64Data.length > 0) {
          try {
            // Try to decode a small portion to validate base64
            Buffer.from(base64Data.substring(0, 100), 'base64');
            
            // Check if image is too large (more than 5MB base64)
            if (base64Data.length > 7000000) { // ~5MB in base64
              console.log('🎯 getAllDecors: Decor', decor._id, 'has very large image data:', base64Data.length, 'characters');
            }
            
            image = {
              data: base64Data,
              contentType: contentType
            };
            console.log('🎯 getAllDecors: Decor', decor._id, 'has valid image data, contentType:', contentType, 'data length:', base64Data.length);
          } catch (error) {
            console.log('🎯 getAllDecors: Decor', decor._id, 'has invalid base64 data:', error.message);
          }
        } else {
          console.log('🎯 getAllDecors: Decor', decor._id, 'has empty or invalid image data');
        }
      } else {
        console.log('🎯 getAllDecors: Decor', decor._id, 'has NO image data');
      }
      return {
        ...decor.toObject(),
        image
      };
    });
    
    console.log('🎯 getAllDecors: Sending', decorsWithImage.length, 'decor(s) to client');
    res.json(decorsWithImage);
  } catch (error) {
    console.error('Error fetching decors:', error);
    res.status(500).json({ error: 'Failed to fetch decors' });
  }
};

// Create new decor (admin only)
const createDecor = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    console.log('🎯 createDecor: Received request for decor:', { name, category, description });
    console.log('🎯 createDecor: req.file:', req.file ? 'File received' : 'No file');
    
    if (!req.file) {
      console.error('🎯 No file received!');
      return res.status(400).json({ error: 'Image file is required' });
    }
    
    // Convert image to base64 and store in MongoDB
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');
    const imageObj = {
      data: base64Image,
      contentType: req.file.mimetype
    };
    
    console.log('🎯 createDecor: Image converted to base64, contentType:', req.file.mimetype);
    console.log('🎯 createDecor: Base64 data length:', base64Image.length);
    
    const decor = new Decor({
      name,
      category,
      description,
      image: imageObj,
      isActive: true,
      createdBy: req.user.id
    });
    
    await decor.save();
    console.log('🎯 Decor saved successfully with ID:', decor._id);
    console.log('🎯 Decor image data length:', decor.image.data.length);
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
        // Convert new image to base64 and update
        const imageBuffer = req.file.buffer;
        const base64Image = imageBuffer.toString('base64');
        updateData.image = {
          data: base64Image,
          contentType: req.file.mimetype
        };
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
  deleteDecor,
  upload
};
