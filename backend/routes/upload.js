const express = require('express');
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');
const ENDPOINTS = require('../constants/apiEndpoints');

const router = express.Router();

router.post(ENDPOINTS.UPLOAD.IMAGE, protect, uploadLimiter, upload.single('image'), uploadImage);
router.delete(ENDPOINTS.UPLOAD.IMAGE_BY_ID, protect, deleteImage);

module.exports = router;
