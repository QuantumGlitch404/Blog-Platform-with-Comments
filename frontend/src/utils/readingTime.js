export const calculateReadingTime = (text) => {
  if (!text) return 1;
  const wordsPerMinute = 200;
  const textOnly = text.replace(/<[^>]*>?/gm, ' ');
  const noOfWords = textOnly.trim().split(/\s+/).length;
  const minutes = noOfWords / wordsPerMinute;
  return Math.ceil(minutes);
};
