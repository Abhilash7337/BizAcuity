const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable

const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// Admin middleware - checks if user is admin with specific email
const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user is admin and has the specific admin email
        if (user.userType !== 'admin' || user.email !== 'admin@gmail.com') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }

        req.adminUser = user;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error while verifying admin status' });
    }
};

module.exports = {
    generateToken,
    verifyToken,
    verifyAdmin,
    JWT_SECRET
};