const logger = require('../utils/logger');
const { VALIDATION_ERROR, INTERNAL_SERVER_ERROR, BAD_REQUEST, CONFLICT } = require('../constants/errorCodes');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for dev
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400, errorCode: CONFLICT };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { message, statusCode: 400, errorCode: VALIDATION_ERROR };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Not authorized to access this route';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired, please log in again';
    error = { message, statusCode: 401 };
  }
  
  // File upload size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File is too large (max 5MB)';
    error = { message, statusCode: 400, errorCode: BAD_REQUEST };
  }

  const statusCode = error.statusCode || err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Server Error',
    errorCode: error.errorCode || (statusCode === 500 ? INTERNAL_SERVER_ERROR : BAD_REQUEST),
    errors: error.errors || [], // For express-validator arrays
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
