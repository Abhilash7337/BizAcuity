// Script to clean up orphaned SharedDraft records (missing or invalid draftId)
// Usage: node scripts/cleanupOrphanedSharedDrafts.js

const mongoose = require('mongoose');
const SharedDraft = require('../models/SharedDraft');
const Draft = require('../models/Draft');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/YOUR_DB_NAME'; // <-- update if needed

async function cleanupOrphanedSharedDrafts() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Find SharedDrafts with missing draftId or referencing a non-existent Draft
  const allSharedDrafts = await SharedDraft.find({});
  let orphanedIds = [];

  for (const sd of allSharedDrafts) {
    if (!sd.draftId) {
      orphanedIds.push(sd._id);
      continue;
    }
    // Check if referenced Draft exists
    const exists = await Draft.exists({ _id: sd.draftId });
    if (!exists) {
      orphanedIds.push(sd._id);
    }
  }

  if (orphanedIds.length === 0) {
    console.log('No orphaned SharedDraft records found.');
  } else {
    const result = await SharedDraft.deleteMany({ _id: { $in: orphanedIds } });
    console.log(`Deleted ${result.deletedCount} orphaned SharedDraft records.`);
  }

  await mongoose.disconnect();
}

cleanupOrphanedSharedDrafts().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
