const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  plan: {
    type: String,
    required: true,
    default: 'free'
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'suspended', 'cancelled', 'expired', 'trial'],
    default: 'active',
    index: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'lifetime'],
    default: 'monthly'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  nextBillingDate: {
    type: Date
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  trialUsed: {
    type: Boolean,
    default: false
  },
  trialEndDate: {
    type: Date
  },
  paymentHistory: [{
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    amount: Number,
    paymentDate: Date,
    status: String
  }],
  features: {
    maxDrafts: { type: Number, default: 5 },
    maxSharing: { type: Number, default: 2 },
    customWallSizes: { type: Boolean, default: false },
    premiumDecors: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    exportOptions: { type: Boolean, default: false },
    collaborativeEditing: { type: Boolean, default: false }
  },
  usage: {
    draftsCreated: { type: Number, default: 0 },
    draftsShared: { type: Number, default: 0 },
    lastAccess: { type: Date, default: Date.now },
    totalLogins: { type: Number, default: 0 }
  },
  discounts: [{
    code: String,
    type: { type: String, enum: ['percentage', 'fixed'] },
    value: Number,
    appliedDate: Date,
    description: String
  }],
  cancellation: {
    reason: String,
    feedback: String,
    cancelledAt: Date,
    effectiveDate: Date,
    refundEligible: { type: Boolean, default: false }
  },
  notes: [{
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes for performance
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1, plan: 1 });
subscriptionSchema.index({ endDate: 1 });
subscriptionSchema.index({ nextBillingDate: 1 });

// Virtual for days remaining
subscriptionSchema.virtual('daysRemaining').get(function() {
  if (!this.endDate) return 0;
  const now = new Date();
  const diff = this.endDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Virtual for subscription health status
subscriptionSchema.virtual('healthStatus').get(function() {
  const daysRemaining = this.daysRemaining;
  
  if (this.status === 'expired' || this.status === 'cancelled') return 'expired';
  if (this.status === 'suspended') return 'suspended';
  if (daysRemaining <= 3) return 'critical';
  if (daysRemaining <= 7) return 'warning';
  if (daysRemaining <= 30) return 'caution';
  return 'healthy';
});

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && new Date() < this.endDate;
};

// Method to update usage
subscriptionSchema.methods.updateUsage = function(type, increment = 1) {
  if (this.usage[type] !== undefined) {
    this.usage[type] += increment;
  }
  this.usage.lastAccess = new Date();
  return this.save();
};

// Static method to find expiring subscriptions
subscriptionSchema.statics.findExpiring = function(days = 7) {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  
  return this.find({
    status: 'active',
    endDate: { $lte: expiryDate, $gte: new Date() }
  }).populate('userId', 'name email');
};

subscriptionSchema.set('toJSON', { virtuals: true });
subscriptionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
