const sanitizeHtml = require('sanitize-html');

const cleanHtml = (dirty) => {
  return sanitizeHtml(dirty, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      img: ['src', 'alt', 'title'],
      '*': ['class']
    },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com']
  });
};

module.exports = cleanHtml;
