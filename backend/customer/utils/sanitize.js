/**
 * Utility to escape special regex characters to prevent Regular Expression Denial of Service (ReDoS)
 * @param {string} str - Raw user search input
 * @returns {string} - Escaped regex-safe string
 */
const escapeRegex = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
  escapeRegex,
};
