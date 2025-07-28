const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const decorUpload = require('../middleware/decorUpload');
const { 
  getAllDecors,
  createDecor,
  updateDecor,
  deleteDecor
} = require('../controllers/decorController');

// Get all decors (public endpoint)
router.get('/decors', getAllDecors);

// Admin protected routes
router.post('/admin/decors', verifyToken, decorUpload.single('image'), createDecor);
router.post('/', decorUpload.single('image'), createDecor);
router.put('/admin/decors/:id', verifyToken, updateDecor);
router.delete('/admin/decors/:id', verifyToken, deleteDecor);

module.exports = router;
