/**
 * Counts words in markdown content. If the string is empty, return 0
 * Does not count words in between angle brackets <  >
 * Does not count checkboxes [x] or [ ]
 * Counts hyphenated and contractions as one word each
 * @param {String} str - Markdown content
 * @returns {Integer} - Amount of words in the markdown content
 */
const getWordCount = (str) => {
  if (!str) {
    return 0;
  }
  const cleanedStr = str
    .replace(/<[^>]*?>/g, '') // Remove words between angle brackets
    .replace(/-\s\[x\]\s?/g, '') // Remove '- [x]'
    .replace(/-\s\[ \]\s?/g, ''); // Remove '- [ ]'
  const words = cleanedStr.match(/\b\w+(?:[''-]\w+)*\b/g);
  return words ? words.length : 0;
};

export default getWordCount;