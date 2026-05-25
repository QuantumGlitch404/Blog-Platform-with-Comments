const Notification = require('../models/Notification');
const { NOT_FOUND } = require('../constants/errorCodes');

exports.getNotifications = async (req, res, next) => {
  try {
    // Pagination middleware handles querying and paginating
    res.success(res.paginatedResults);
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { read: true, readAt: Date.now() },
      { new: true }
    );

    if (!notification) return res.error('Notification not found', 404, NOT_FOUND);

    res.success(notification);
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true, readAt: Date.now() }
    );

    res.success({}, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });

    if (!notification) return res.error('Notification not found', 404, NOT_FOUND);

    res.success({}, 'Notification deleted');
  } catch (err) {
    next(err);
  }
};
