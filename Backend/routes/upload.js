const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken } = require('../middleware/auth');
const { multerConfig } = require('../config/middleware');
const { uploadImage } = require('../controllers/uploadController');

// Configure multer for in-memory uploads only
const upload = multer({ storage: multer.memoryStorage() });

// Image upload endpoint - Protected
router.post('/upload', verifyToken, upload.single('image'), uploadImage);

module.exports = router;
