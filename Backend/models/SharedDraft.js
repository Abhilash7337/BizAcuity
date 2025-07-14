const mongoose = require('mongoose');

const sharedDraftSchema = new mongoose.Schema({
  draftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Draft',
    required: true
  },
  draftName: {
    type: String,
    required: true  // Store draft name for easier admin queries
  },
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedAt: {
    type: Date,
    default: Date.now
  },
  unsharedAt: {
    type: Date,
    default: null  // Track when sharing was revoked
  },
  isActive: {
    type: Boolean,
    default: true  // Track if sharing is still active
  },
  permissions: {
    canEdit: {
      type: Boolean,
      default: false
    },
    canView: {
      type: Boolean,
      default: true
    },
    canShare: {
      type: Boolean,
      default: false
    }
  },
  accessCount: {
    type: Number,
    default: 0  // Track how many times the shared draft was accessed
  },
  lastAccessedAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: 500  // Optional sharing notes
  }
});

// Compound index for efficient queries
sharedDraftSchema.index({ draftId: 1, sharedWith: 1 });
sharedDraftSchema.index({ sharedBy: 1, sharedAt: -1 });
sharedDraftSchema.index({ isActive: 1, sharedAt: -1 });

module.exports = mongoose.model('SharedDraft', sharedDraftSchema);
