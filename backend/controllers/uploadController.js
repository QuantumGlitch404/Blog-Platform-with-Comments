const { uploadImage, deleteImage } = require('../utils/cloudinaryHelper');
const { BAD_REQUEST } = require('../constants/errorCodes');

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.error('Please upload an image file', 400, BAD_REQUEST);
    }

    // Pass the buffer directly from multer memoryStorage
    const result = await uploadImage(req.file.buffer, 'blog-platform');

    res.success({
      url: result.secure_url,
      publicId: result.public_id,
    }, 'Image uploaded successfully', {}, 201);
  } catch (err) {
    next(err);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.error('Public ID is required', 400, BAD_REQUEST);
    }

    await deleteImage(publicId);

    res.success({}, 'Image deleted successfully');
  } catch (err) {
    next(err);
  }
};
