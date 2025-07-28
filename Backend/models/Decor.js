const mongoose = require('mongoose');

const decorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['clocks', 'tables', 'plants', 'fruits', 'garlands', 'lamps', 'chairs', 'flowers', 'frames', 'other']
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    data: { type: String, required: true }, // base64 string
    contentType: { type: String, required: true }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

decorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Decor', decorSchema);
