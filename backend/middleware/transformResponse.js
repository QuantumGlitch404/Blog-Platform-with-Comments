const transformResponse = (req, res, next) => {
  const originalJson = res.json;

  res.success = function (data, message = 'Success', meta = {}) {
    originalJson.call(this, {
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    });
  };

  res.error = function (message = 'Error', statusCode = 500, errors = []) {
    this.status(statusCode);
    originalJson.call(this, {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  };

  next();
};

module.exports = transformResponse;
