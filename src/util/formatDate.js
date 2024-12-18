/**
 * Formats the date/time the post was created into nice readable text.
 * @param {Date} date - A date in UTC time (the date/time the post was created).
 * @returns {String} - The date/time the post was created.
 */
const formatDate = (date) => {
  let timeElapsed = new Date(date);
  let formattedDate = timeElapsed.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  let formattedTime = timeElapsed.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return formattedDate + ', ' + formattedTime;
};

export default formatDate;