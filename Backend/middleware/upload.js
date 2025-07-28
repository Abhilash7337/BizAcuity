const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`);
    }
  })
});

module.exports = upload;
