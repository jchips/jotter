/**
 * Counts words in markdown content. If the string is empty, return 0
 * Does not count words in between angle brackets <  >
 * Counts hyphenated and contractions as one word each
 * @param {String} str - Markdown content
 * @returns {Integer} - Amount of words in the markdown content
 */
const getWordCount = (str) => {
  if (!str) {
    return 0;
  }
  return str.match(/(?<!<[^>]*?)\b\w+(?:['’-]\w+)*\b(?![^<]*?>)/g)?.length;
};

export default getWordCount;