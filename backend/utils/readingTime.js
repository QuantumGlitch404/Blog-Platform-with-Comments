const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const noOfWords = text.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).length;
  const minutes = noOfWords / wordsPerMinute;
  return Math.ceil(minutes);
};

module.exports = calculateReadingTime;
