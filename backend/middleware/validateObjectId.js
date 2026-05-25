const mongoose = require('mongoose');

const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return res.error(`Invalid ID format for parameter ${paramName}`, 400);
    }
    next();
  };
};

module.exports = validateObjectId;
