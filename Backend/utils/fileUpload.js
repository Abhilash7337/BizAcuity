const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure uploads directory exists
const createUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// Save uploaded file with hash-based naming
const saveUploadedFile = (fileBuffer, originalname, PORT) => {
  const uploadsDir = createUploadsDir();
  
  // Create hash from file content
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const ext = path.extname(originalname);
  const filename = `${hash}${ext}`;
  const fullPath = path.join(uploadsDir, filename);

  // Check if file already exists
  if (fs.existsSync(fullPath)) {
    // File already exists, return existing URL
    const fileUrl = `http://localhost:${PORT}/uploads/${filename}`;
    return { 
      url: fileUrl, 
      message: 'Image already exists',
      isNew: false 
    };
  }

  // Save new file
  fs.writeFileSync(fullPath, fileBuffer);
  const fileUrl = `http://localhost:${PORT}/uploads/${filename}`;
  
  return { 
    url: fileUrl, 
    message: 'Image uploaded successfully',
    isNew: true 
  };
};

module.exports = {
  createUploadsDir,
  saveUploadedFile
};
