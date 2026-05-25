const express = require('express');
const {
  getUserProfile,
  followUser,
  unfollowUser,
  bookmarkPost,
  unbookmarkPost,
  getBookmarks,
  getUserStats,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const ENDPOINTS = require('../constants/apiEndpoints');

const router = express.Router();

router.get(ENDPOINTS.USERS.BOOKMARKS, protect, getBookmarks);
router.post(ENDPOINTS.USERS.BOOKMARK, protect, validateObjectId('postId'), bookmarkPost);
router.delete(ENDPOINTS.USERS.BOOKMARK, protect, validateObjectId('postId'), unbookmarkPost);

router.get(ENDPOINTS.USERS.BY_ID, validateObjectId('id'), getUserProfile);
router.get(ENDPOINTS.USERS.STATS, validateObjectId('id'), getUserStats);
router.post(ENDPOINTS.USERS.FOLLOW, protect, validateObjectId('id'), followUser);
router.delete(ENDPOINTS.USERS.UNFOLLOW, protect, validateObjectId('id'), unfollowUser);

module.exports = router;
