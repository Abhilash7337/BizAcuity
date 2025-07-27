const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure uploads directory exists

// Ensure uploads/images directory exists
const createUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  const imagesDir = path.join(uploadsDir, 'images');
  if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(imagesDir)){
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  return imagesDir;
};

// Save uploaded file with hash-based naming
const saveUploadedFile = (fileBuffer, originalname, PORT) => {
  const imagesDir = createUploadsDir();
  // Create hash from file content
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const ext = path.extname(originalname);
  const filename = `${hash}${ext}`;
  const fullPath = path.join(imagesDir, filename);

  // Check if file already exists
  if (fs.existsSync(fullPath)) {
    // File already exists, return existing URL
    const fileUrl = `/uploads/images/${filename}`;
    return { 
      url: fileUrl, 
      message: 'Image already exists',
      isNew: false 
    };
  }

  // Save new file
  fs.writeFileSync(fullPath, fileBuffer);
  const fileUrl = `/uploads/images/${filename}`;
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
