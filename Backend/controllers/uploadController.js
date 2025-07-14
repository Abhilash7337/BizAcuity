const { saveUploadedFile } = require('../utils/fileUpload');
const multer = require('multer');

// Handle file upload
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const result = saveUploadedFile(fileBuffer, req.file.originalname, 5001);

    if (result.isNew) {
      console.log('New image uploaded:', result.url);
    } else {
      console.log('Duplicate image detected, returning existing URL:', result.url);
    }
    
    res.json(result);
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
