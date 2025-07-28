const multer = require('multer');
// Removed multer-s3, using only multer.memoryStorage()
const s3 = require('../config/s3');

const upload = multer({
  storage: multerS3({
    s3,
    // Removed S3 bucket config
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`);
    }
  })
});

module.exports = upload;
