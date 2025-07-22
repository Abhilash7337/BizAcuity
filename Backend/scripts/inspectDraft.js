// inspectDraft.js
const mongoose = require('mongoose');
const Draft = require('../models/Draft'); // Adjust path if needed

const MONGO_URI = 'mongodb://localhost:27017/YOUR_DB_NAME'; // Replace with your DB name

async function inspectDraft(draftId) {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const draft = await Draft.findById(draftId)
    .populate('userId')
    .populate('sharedWith')
    .populate('sharedBy');
  if (!draft) {
    console.log('Draft not found');
    process.exit(1);
  }
  console.log('Draft:', {
    _id: draft._id,
    name: draft.name,
    isPublic: draft.isPublic,
    shareToken: draft.shareToken,
    shareTokenExpires: draft.shareTokenExpires,
    sharedWith: draft.sharedWith,
    sharedBy: draft.sharedBy,
    userId: draft.userId,
  });
  mongoose.disconnect();
}

const draftId = process.argv[2];
if (!draftId) {
  console.log('Usage: node inspectDraft.js <draftId>');
  process.exit(1);
}
inspectDraft(draftId);
