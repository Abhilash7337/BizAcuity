const multer = require('multer');
// Only use multer.memoryStorage for uploads
const upload = multer({
  storage: multer.memoryStorage(),
});
module.exports = upload;
