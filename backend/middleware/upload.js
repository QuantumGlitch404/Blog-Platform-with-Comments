const multer = require('multer');
const fileFilter = require('./fileFilter');

// Store in memory for Cloudinary upload processing
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter,
});

module.exports = upload;
