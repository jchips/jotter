/**
 * Counts words in markdown content. If the string is empty, return 0
 * @param {String} str - Markdown content
 * @returns {Integer} - Amount of words in the markdown content
 */
const getWordCount = (str) => {
  if (!str) {
    return 0;
  }
  return str.match(/(\w+)/g).length;
};

export default getWordCount;