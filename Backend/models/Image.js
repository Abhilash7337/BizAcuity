const mongoose = require('mongoose');
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['background', 'gallery'], required: true },
  uploadedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Image', imageSchema);
