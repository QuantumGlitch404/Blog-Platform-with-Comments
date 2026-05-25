const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  // Checking MIME type
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed');
    error.statusCode = 400;
    return cb(error, false);
  }

  cb(null, true);
};

module.exports = fileFilter;
