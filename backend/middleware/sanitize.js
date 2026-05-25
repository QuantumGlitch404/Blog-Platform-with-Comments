const sanitizeHtml = require('sanitize-html');

const sanitize = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string' && key !== 'content') { // Don't strip HTML from rich text content here
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [], // No tags allowed for regular fields
          allowedAttributes: {},
        });
      }
    }
  }
  next();
};

module.exports = sanitize;
