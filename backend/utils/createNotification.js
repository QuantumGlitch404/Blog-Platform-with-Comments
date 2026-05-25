const Notification = require('../models/Notification');
let io;

const setSocketIo = (socketIoInstance) => {
  io = socketIoInstance;
};

const createNotification = async ({ recipient, sender, type, post, comment, data }) => {
  try {
    // Don't notify self
    if (recipient.toString() === sender?.toString()) return null;

    // Check if duplicate notification exists (within 24h)
    const existing = await Notification.findOne({
      recipient,
      sender,
      type,
      post,
      comment,
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (existing) return existing;

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      post,
      comment,
      data,
    });

    // Populate sender info for real-time emit
    await notification.populate('sender', 'name profileImage');

    // Real-time push via WebSocket
    if (io) {
      io.to(recipient.toString()).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

module.exports = {
  setSocketIo,
  createNotification,
};
