
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { sendOTPEmail, sendWelcomeEmail } = require('../utils/emailService');

// Cleanup expired temp registrations
router.delete('/cleanup-temp-registrations', async (req, res) => {
    try {
        const now = new Date();
        const result = await TempRegistration.deleteMany({
            $or: [
                { 'otp.expiresAt': { $lt: now } },
                { 'otp': { $exists: false } }
            ]
        });
        res.json({ message: 'Expired temp registrations cleaned up', deletedCount: result.deletedCount });
    } catch (error) {
        console.error('Cleanup temp registrations error:', error);
        res.status(500).json({ error: 'Failed to clean up temp registrations' });
    }
});

// Temporary registration model for pending users
const mongoose = require('mongoose');
const tempRegistrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  otp: {
    code: String,
    expiresAt: Date
  },
  createdAt: { type: Date, default: Date.now }
});
const TempRegistration = mongoose.models.TempRegistration || mongoose.model('TempRegistration', tempRegistrationSchema);

// Register new user and send OTP (do not save to User collection yet)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;


        // Check if user already exists (in permanent collection)
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Check for pending registration
        let tempUser = await TempRegistration.findOne({ email });
        if (tempUser) {
            // If OTP expired, delete pending registration and allow new registration
            if (!tempUser.otp || tempUser.otp.expiresAt < new Date()) {
                await TempRegistration.deleteOne({ _id: tempUser._id });
            } else {
                return res.status(400).json({ error: 'Registration already initiated. Please verify your email or request a new OTP.' });
            }
        }

        // Generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 1 * 60 * 1000); // 1 min expiry

        // Save to temp collection
        tempUser = new TempRegistration({
            name,
            email,
            password,
            otp: { code: otpCode, expiresAt: otpExpires }
        });
        await tempUser.save();

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otpCode);
        if (!emailSent) {
            await TempRegistration.deleteOne({ _id: tempUser._id });
            return res.status(500).json({ error: 'Failed to send verification email' });
        }

        res.status(201).json({ 
            message: 'Registration initiated. Please verify your email.',
            tempId: tempUser._id
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { tempId, otp } = req.body;

        // Find temp registration
        const tempUser = await TempRegistration.findById(tempId);
        if (!tempUser) {
            return res.status(404).json({ error: 'Registration not found or already verified' });
        }

        // Check OTP
        if (!tempUser.otp || tempUser.otp.code !== otp || tempUser.otp.expiresAt < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Create user in permanent collection
        // Find the default plan first, fallback to FREE plan by name
        const Plan = require('../models/Plan');
        let defaultPlan = await Plan.findOne({ isDefault: true, isActive: true });
        
        if (!defaultPlan) {
            // Fallback to finding a plan named 'FREE'
            defaultPlan = await Plan.findOne({ name: 'FREE', isActive: true });
        }
        
        let planName = defaultPlan ? defaultPlan.name : 'FREE';

        const newUser = new User({
            name: tempUser.name,
            email: tempUser.email,
            password: tempUser.password,
            isVerified: true,
            plan: planName
        });
        await newUser.save();

        // Send welcome email (non-blocking)
        sendWelcomeEmail(newUser.email, newUser.name);

        // Remove temp registration
        await TempRegistration.deleteOne({ _id: tempUser._id });

        // Generate token for the verified user
        const token = generateToken(newUser._id);

        res.json({ 
            message: 'Email verified successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePhoto: newUser.profilePhoto,
                userType: newUser.userType,
                plan: newUser.plan
            }
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: 'OTP verification failed' });
    }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
    try {
        // Support resending OTP for pending registrations (before verification)
        const { email } = req.body;
        let tempUser = await TempRegistration.findOne({ email });
        if (!tempUser) {
            return res.status(404).json({ error: 'No pending registration found for this email.' });
        }
        // Generate new OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 1 * 60 * 1000); // 1 min expiry
        tempUser.otp = { code: otpCode, expiresAt: otpExpires };
        await tempUser.save();
        // Send new OTP email
        const emailSent = await sendOTPEmail(email, otpCode);
        if (!emailSent) {
            return res.status(500).json({ error: 'Failed to send verification email' });
        }
        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
});

// Login (modified to check email verification)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ error: 'Please verify your email first' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePhoto: user.profilePhoto,
                userType: user.userType,
                plan: user.plan
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});



module.exports = router; 