const APP_STRINGS = require('../constants/appStrings');
const { sendError } = require('./responseHandler');

const errorHandler = (err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return sendError(res, err.message || APP_STRINGS.SERVER.INTERNAL_ERROR, statusCode, err);
};

module.exports = errorHandler;
