const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Bearer token in headers (for testing/mobile)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.error('Not authorized to access this route', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    const user = await User.findById(decoded.id).select('+passwordHistory');
    
    if (!user) {
      return res.error('User not found', 404);
    }

    if (!user.isActive) {
      return res.error('Account is deactivated', 403);
    }

    if (user.suspendedUntil && user.suspendedUntil > Date.now()) {
      return res.error(`Account suspended until ${user.suspendedUntil}`, 403);
    }

    req.user = user;
    next();
  } catch (err) {
    return res.error('Not authorized to access this route', 401);
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.error(`User role ${req.user.role} is not authorized to access this route`, 403);
    }
    next();
  };
};

module.exports = { protect, authorize };
