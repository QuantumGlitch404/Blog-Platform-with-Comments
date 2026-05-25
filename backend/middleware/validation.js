const { validationResult } = require('express-validator');
const { VALIDATION_ERROR } = require('../constants/errorCodes');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors for consistency
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errorCode: VALIDATION_ERROR,
      errors: formattedErrors,
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

module.exports = validate;
