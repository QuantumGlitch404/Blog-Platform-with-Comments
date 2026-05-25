const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const pagination = require('../middleware/pagination');
const Notification = require('../models/Notification');
const validateObjectId = require('../middleware/validateObjectId');
const ENDPOINTS = require('../constants/apiEndpoints');

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

router.get(
  ENDPOINTS.NOTIFICATIONS.BASE,
  (req, res, next) => {
    // Modify req.query to only show notifications for the logged in user
    req.query.recipient = req.user.id;
    next();
  },
  pagination(Notification, [{ path: 'sender', select: 'name profileImage' }, { path: 'post', select: 'title slug' }]),
  getNotifications
);

router.put(ENDPOINTS.NOTIFICATIONS.READ_ALL, markAllAsRead);

router
  .route(ENDPOINTS.NOTIFICATIONS.BY_ID)
  .delete(validateObjectId('id'), deleteNotification);

router.put(ENDPOINTS.NOTIFICATIONS.READ, validateObjectId('id'), markAsRead);

module.exports = router;
