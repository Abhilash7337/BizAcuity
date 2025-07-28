const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    profilePhoto: {
        type: String,
        default: null
    },
    userType: {
        type: String,
        enum: ['regular', 'admin'],
        default: 'regular'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    plan: {
        type: String,
        default: 'free'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        code: {
            type: String,
            default: null
        },
        expiresAt: {
            type: Date,
            default: null
        }
    },
    wall: {
        wallColor: String,
        wallWidth: Number,
        wallHeight: Number,
        wallImage: {
            data: String, // base64 string
            contentType: String
        },
        images: [{
            data: String, // base64 string
            contentType: String
        }],
        imageStates: [{
            x: Number,
            y: Number,
            width: Number,
            height: Number,
            shape: String,
            frame: String,
            isDecor: Boolean,
            zIndex: Number
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp.code = otp;
    this.otp.expiresAt = new Date(Date.now() + 1 * 60 * 1000); // OTP expires in 1 minute
    return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(code) {
    return this.otp.code === code && 
           this.otp.expiresAt > new Date() &&
           !this.isVerified;
};

const User = mongoose.model('User', userSchema);

module.exports = User;