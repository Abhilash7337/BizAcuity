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
const newAdminRoutes = require('./routes/admin');
const sharingRoutes = require('./routes/sharing');
const decorRoutes = require('./routes/decor');
const categoryRoutes = require('./routes/category');


const app = express();
const PORT = 5001;
const HTTPS_PORT = 5443; // You can change this if needed

// SSL certificate paths from environment variables (optional)
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || './ssl/key.pem';
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || './ssl/cert.pem';
let httpsOptions = null;
try {
  if (fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
    httpsOptions = {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH)
    };
    console.log('SSL certificates loaded for HTTPS.');
  } else {
    console.log('SSL cert or key not found, HTTPS will not be enabled.');
  }
} catch (err) {
  console.error('Error loading SSL certs:', err);
}

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
app.use('/admin', newAdminRoutes);          // Admin endpoints (plan upgrade requests, email, etc)
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

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// SPA fallback: serve index.html for non-API, non-upload, non-health routes
app.get('*', (req, res, next) => {
  if (
    req.originalUrl.startsWith('/api') ||
    req.originalUrl.startsWith('/uploads') ||
    req.originalUrl.startsWith('/health')
  ) {
    return next();
  }
  res.sendFile(path.join(__dirname,'../Frontend/dist/index.html'));
});

// 404 handler for undefined API routes
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
const http = require('http');
const https = require('https');

const startServer = async () => {
  try {
    await connectDB();

    // Start HTTP server
    http.createServer(app).listen(PORT, '0.0.0.0', () => {
      console.log(`HTTP server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });

    // Start HTTPS server if certs are available
    if (httpsOptions) {
      https.createServer(httpsOptions, app).listen(HTTPS_PORT, '0.0.0.0', () => {
        console.log(`HTTPS server running on port ${HTTPS_PORT}`);
        console.log(`Health check: https://localhost:${HTTPS_PORT}/health`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
