/**
 * Standard API Response Helper
 * Provides consistent response formats across all controllers and middleware.
 */

const { ERROR } = require('../constants/appStrings');

/**
 * Send standard success response
 * @param {object} res - Express response object
 * @param {object|array|null} data - Payload data to include
 * @param {string|null} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @param {object} extra - Extra attributes to merge into response
 */
const sendSuccess = (res, data = null, message = null, statusCode = 200, extra = {}) => {
  const payload = {
    success: true,
  };

  if (message) {
    payload.message = message;
  }

  if (data !== null && data !== undefined) {
    if (typeof data === 'object' && !Array.isArray(data)) {
      Object.assign(payload, data);
    } else {
      payload.data = data;
    }
  }

  if (extra && typeof extra === 'object') {
    Object.assign(payload, extra);
  }

  return res.status(statusCode).json(payload);
};

/**
 * Send standard error response
 * @param {object} res - Express response object
 * @param {string} message - Error description message
 * @param {number} statusCode - HTTP error code (default: 500)
 * @param {Error|null} error - Optional original error object
 */
const sendError = (res, message = ERROR.INTERNAL_SERVER_ERROR, statusCode = 500, error = null) => {
  let finalMessage = message;

  if (error && error.message && (!message || message === ERROR.INTERNAL_SERVER_ERROR)) {
    finalMessage = error.message;
  } else if (!finalMessage && error && error.message) {
    finalMessage = error.message;
  }

  return res.status(statusCode).json({
    success: false,
    message: finalMessage || ERROR.INTERNAL_SERVER_ERROR,
  });
};

module.exports = {
  sendSuccess,
  sendError,
  successResponse: sendSuccess,
  errorResponse: sendError,
};
