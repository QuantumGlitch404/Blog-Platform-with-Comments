const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('./utils/logger');
const { setSocketIo } = require('./utils/createNotification');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Export io to be used elsewhere (like createNotification)
  setSocketIo(io);

  io.use((socket, next) => {
    // Get token from auth object (from frontend) or cookies if passed
    const token = socket.handshake.auth?.token || socket.handshake.headers?.cookie?.split('token=')[1]?.split(';')[0];
    
    if (!token) return next(new Error('Authentication required'));
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.debug(`User connected to socket: ${socket.userId}`);
    
    // Join user's personal room for direct notifications
    socket.join(socket.userId);
    
    // Join post-specific rooms for typing indicators
    socket.on('join-post', (postId) => {
      socket.join(`post-${postId}`);
    });

    socket.on('leave-post', (postId) => {
      socket.leave(`post-${postId}`);
    });

    // Typing indicator for comments
    socket.on('typing', ({ postId }) => {
      socket.to(`post-${postId}`).emit('user-typing', { userId: socket.userId });
    });
    
    socket.on('disconnect', () => {
      logger.debug(`User disconnected from socket: ${socket.userId}`);
    });
  });

  return io;
};

module.exports = initSocket;
