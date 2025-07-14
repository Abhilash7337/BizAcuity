const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/walldesigner');
        console.log('Connected to MongoDB');

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: 'admin123',
            userType: 'admin',
            plan: 'pro',
            isVerified: true
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@gmail.com');
        console.log('Password: admin123');
        console.log('Please change the password after first login.');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.disconnect();
    }
};

// Run if called directly
if (require.main === module) {
    createAdminUser();
}

module.exports = createAdminUser;
