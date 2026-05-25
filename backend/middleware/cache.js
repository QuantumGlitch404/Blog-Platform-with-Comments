const NodeCache = require('node-cache');
// stdTTL is in seconds. Default to 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Don't cache if user is authenticated (to avoid leaking private data)
    if (req.user) {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      return res.json(cachedResponse);
    }

    // Override res.json to cache the response before sending
    const originalJson = res.json;
    res.json = function (body) {
      // Only cache success responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, body, duration);
      }
      originalJson.call(this, body);
    };

    next();
  };
};

module.exports = { cacheMiddleware, cache };
