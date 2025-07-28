// Script to delete the admin user from MongoDB Atlas
// Usage: node scripts/deleteAdminUser.js

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const MONGODB_URI = 'mongodb+srv://Abhilash:asdfghjkl@cluster0.peppppx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function deleteAdmin() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await User.deleteOne({ email: 'admin@gmail.com' });
  if (result.deletedCount === 1) {
    console.log('Admin user deleted successfully.');
  } else {
    console.log('Admin user not found.');
  }
  mongoose.disconnect();
}

deleteAdmin().catch(err => {
  console.error('Error deleting admin user:', err);
  mongoose.disconnect();
});
