const mongoose = require('mongoose');

const flaggedContentSchema = new mongoose.Schema({
  contentType: {
    type: String,
    required: true,
    enum: ['draft', 'user', 'shared_draft'],
    // ...existing code...
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'contentModel'
  },
  contentModel: {
    type: String,
    required: true,
    enum: ['Draft', 'User', 'SharedDraft']
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'inappropriate_content',
      'spam',
      'copyright_violation', 
      'harassment',
      'fake_account',
      'violence',
      'hate_speech',
      'other'
    ]
  },
  description: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected', 'resolved'],
    default: 'pending',
    // ...existing code...
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
    // ...existing code...
  },
  adminNotes: {
    type: String,
    maxlength: 2000
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  resolution: {
    type: String,
    enum: ['no_action', 'content_removed', 'user_warned', 'user_suspended', 'user_banned'],
  },
  metadata: {
    reporterIP: String,
    userAgent: String,
    reportCount: { type: Number, default: 1 },
    relatedReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FlaggedContent' }]
  }
}, {
  timestamps: true
});

// Indexes for performance
flaggedContentSchema.index({ contentType: 1, contentId: 1 });
flaggedContentSchema.index({ status: 1, priority: 1 });
flaggedContentSchema.index({ reportedBy: 1 });
flaggedContentSchema.index({ createdAt: -1 });

// Virtual to get content details
flaggedContentSchema.virtual('contentDetails', {
  ref: function() { return this.contentModel; },
  localField: 'contentId',
  foreignField: '_id',
  justOne: true
});

flaggedContentSchema.set('toJSON', { virtuals: true });
flaggedContentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('FlaggedContent', flaggedContentSchema);
