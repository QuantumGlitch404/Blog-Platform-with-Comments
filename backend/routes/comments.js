const express = require('express');
const {
  getComments,
  createComment,
  editComment,
  deleteComment,
  likeComment,
  unlikeComment,
  replyToComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { commentValidation } = require('../utils/validators');
const validateObjectId = require('../middleware/validateObjectId');
const ENDPOINTS = require('../constants/apiEndpoints');

const router = express.Router();

router.get(ENDPOINTS.COMMENTS.BY_POST, validateObjectId('postId'), getComments);
router.post(ENDPOINTS.COMMENTS.BASE, protect, commentValidation, validate, createComment);

router
  .route(ENDPOINTS.COMMENTS.BY_ID)
  .put(protect, validateObjectId('id'), commentValidation, validate, editComment)
  .delete(protect, validateObjectId('id'), deleteComment);

router.post(ENDPOINTS.COMMENTS.REPLY, protect, validateObjectId('id'), commentValidation, validate, replyToComment);
router.put(ENDPOINTS.COMMENTS.LIKE, protect, validateObjectId('id'), likeComment);
router.put(ENDPOINTS.COMMENTS.UNLIKE, protect, validateObjectId('id'), unlikeComment);

module.exports = router;
