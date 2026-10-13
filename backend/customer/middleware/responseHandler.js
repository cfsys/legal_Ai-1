/**
 * Standardized API Response & Error Handling Middleware
 * Provides uniform structure for success and error responses across all controllers.
 */

const APP_STRINGS = require('../constants/appStrings');

/**
 * Send uniform success response
 * @param {Object} res - Express response object
 * @param {*} data - Payload data or entity
 * @param {string} message - Success message from APP_STRINGS
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  const plainData = (data && typeof data.toObject === 'function') ? data.toObject() : data;

  if (Array.isArray(plainData)) {
    return res.status(statusCode).json(plainData);
  }

  const payload = (typeof plainData === 'object' && plainData !== null)
    ? { success: true, message, ...plainData }
    : { success: true, message, data: plainData };

  return res.status(statusCode).json(payload);
};

/**
 * Send uniform error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message from APP_STRINGS
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Error|string|null} error - Raw error object or string
 */
const sendError = (res, message = APP_STRINGS.SERVER.INTERNAL_ERROR, statusCode = 500, error = null) => {
  const errDetails = error?.message || (typeof error === 'string' ? error : null);

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && errDetails ? { details: errDetails } : {}),
  });
};

/**
 * Middleware that mounts sendSuccess and sendError directly on the res object
 */
const responseHandlerMiddleware = (req, res, next) => {
  res.sendSuccess = (data, message, statusCode) => sendSuccess(res, data, message, statusCode);
  res.sendError = (message, statusCode, error) => sendError(res, message, statusCode, error);
  next();
};

module.exports = {
  sendSuccess,
  sendError,
  responseHandlerMiddleware,
};
