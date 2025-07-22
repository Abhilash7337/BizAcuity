const mongoose = require('mongoose');

const planUpgradeRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedPlan: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // who approved/rejected
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

planUpgradeRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('PlanUpgradeRequest', planUpgradeRequestSchema);
