const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { 
  getAllDecors,
  createDecor,
  updateDecor,
  deleteDecor,
  upload,
  checkDecorData
} = require('../controllers/decorController');

// Get all decors (public endpoint)
router.get('/decors', getAllDecors);

// Admin protected routes
router.post('/admin/decors', verifyToken, upload.single('image'), createDecor);
router.put('/admin/decors/:id', verifyToken, updateDecor);
router.delete('/admin/decors/:id', verifyToken, deleteDecor);
router.get('/admin/check-decor-data', verifyToken, checkDecorData);

module.exports = router;
