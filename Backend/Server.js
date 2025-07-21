const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import configuration
const connectDB = require('./config/database');
const { corsOptions, bodyParserConfig } = require('./config/middleware');
const { createUploadsDir } = require('./utils/fileUpload');

// Import routes
const authRoutes = require('./routes/auth');
const fallbackAuthRoutes = require('./routes/fallbackAuth');
const userRoutes = require('./routes/user');
const draftRoutes = require('./routes/draft');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin-simple');
const newAdminRoutes = require('./routes/admin');
const sharingRoutes = require('./routes/sharing');
const decorRoutes = require('./routes/decor');
const categoryRoutes = require('./routes/category');

const app = express();
const PORT = 5001;

// Ensure uploads directory exists
createUploadsDir();

// CORS configuration
app.use(cors(corsOptions));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Body parser configuration
app.use(bodyParser.json(bodyParserConfig.json));
app.use(bodyParser.urlencoded(bodyParserConfig.urlencoded));

// Routes
app.use('/', authRoutes);                    // Primary auth routes with OTP verification
app.use('/', fallbackAuthRoutes);           // Fallback auth routes (direct login/register)
app.use('/', userRoutes);                   // User management routes
app.use('/', draftRoutes);                  // Draft management routes
app.use('/', uploadRoutes);                 // File upload routes
app.use('/admin', adminRoutes);             // Admin management routes
app.use('/admin', newAdminRoutes);          // New admin endpoints (plan upgrade requests, etc)
app.use('/', sharingRoutes);                // Sharing management routes
app.use('/', decorRoutes);                  // Decor management routes
app.use('/', categoryRoutes);               // Category management routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
