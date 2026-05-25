const ROLES = require('../constants/roles');

/**
 * Checks if the current user owns the resource or is an admin
 * Requires req.user (from protect middleware) and the resource object to check
 */
const checkOwnership = (resource, userIdField = 'user') => {
  return (req, res, next) => {
    // Admins can do anything
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    // Check ownership
    const resourceOwnerId = resource[userIdField].toString();
    const currentUserId = req.user._id.toString();

    if (resourceOwnerId !== currentUserId) {
      return res.error('Not authorized to access this resource', 403);
    }

    next();
  };
};

module.exports = checkOwnership;
