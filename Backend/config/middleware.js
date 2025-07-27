const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://13.60.37.102'];
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Body parser configuration
const bodyParserConfig = {
  json: { limit: '50mb' },
  urlencoded: { limit: '50mb', extended: true }
};

// Multer configuration for file uploads
const multerConfig = {
  storage: require('multer').memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024 // 30MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
};

module.exports = {
  corsOptions,
  bodyParserConfig,
  multerConfig
};
