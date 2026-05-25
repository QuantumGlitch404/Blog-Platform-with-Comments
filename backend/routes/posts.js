const express = require('express');
const {
  getPosts,
  getPost,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  incrementView,
  getRelatedPosts,
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { postValidation } = require('../utils/validators');
const validateObjectId = require('../middleware/validateObjectId');
const { cacheMiddleware } = require('../middleware/cache');
const pagination = require('../middleware/pagination');
const Post = require('../models/Post');
const checkOwnership = require('../middleware/checkOwnership');
const ENDPOINTS = require('../constants/apiEndpoints');

const router = express.Router();

router
  .route(ENDPOINTS.POSTS.BASE)
  .get(cacheMiddleware(300), pagination(Post, [{ path: 'author', select: 'name profileImage' }]), getPosts)
  .post(protect, postValidation, validate, createPost);

router.get(ENDPOINTS.POSTS.BY_SLUG, cacheMiddleware(300), getPostBySlug);

router
  .route(ENDPOINTS.POSTS.BY_ID)
  .get(validateObjectId('id'), cacheMiddleware(300), getPost)
  .put(protect, validateObjectId('id'), postValidation, validate, updatePost)
  .delete(protect, validateObjectId('id'), deletePost);

router.put(ENDPOINTS.POSTS.LIKE, protect, validateObjectId('id'), likePost);
router.put(ENDPOINTS.POSTS.UNLIKE, protect, validateObjectId('id'), unlikePost);
router.put(ENDPOINTS.POSTS.VIEW, validateObjectId('id'), incrementView);
router.get(ENDPOINTS.POSTS.RELATED, validateObjectId('id'), cacheMiddleware(300), getRelatedPosts);

module.exports = router;
