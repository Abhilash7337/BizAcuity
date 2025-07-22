// Sample script to test SharedDraft model functionality
// Run with: node scripts/testSharedDraft.js

const mongoose = require('mongoose');
const SharedDraft = require('../models/SharedDraft');
const User = require('../models/User'); // Register User model for populate

// Replace with your MongoDB URI
const MONGO_URI = 'mongodb://localhost:27017/picture-wall-test';

async function testSharedDraft() {
  await mongoose.connect(MONGO_URI);

  // Dummy ObjectIds (replace with real ones from your DB for a real test)
  const draftId = new mongoose.Types.ObjectId();
  const sharedBy = new mongoose.Types.ObjectId();
  const sharedWith = new mongoose.Types.ObjectId();

  // Create a new SharedDraft
  const sharedDraft = new SharedDraft({
    draftId,
    draftName: 'Test Wall Layout',
    sharedBy,
    sharedWith,
    permissions: {
      canEdit: false,
      canView: true,
      canShare: false
    },
    notes: 'Sample sharing note.'
  });

  await sharedDraft.save();
  console.log('SharedDraft created:', sharedDraft);

  // Fetch all shared drafts for sharedWith user
  const foundDrafts = await SharedDraft.find({ sharedWith }).populate('sharedBy', 'name email');
  console.log('Drafts shared with user:', foundDrafts);

  // Clean up (delete test draft)
  await SharedDraft.deleteOne({ _id: sharedDraft._id });
  await mongoose.disconnect();
}

testSharedDraft().catch(err => {
  console.error('Test failed:', err);
  mongoose.disconnect();
});
