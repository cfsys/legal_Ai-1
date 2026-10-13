/**
 * Common Backend Utilities
 * Standardized response handlers (sendSuccess, sendError) and helper functions.
 */

const APP_STRINGS = require('../constants/appStrings');
const { sendSuccess, sendError, responseHandlerMiddleware } = require('../middleware/responseHandler');

/**
 * Format standard API success response
 * @param {Object} res - Express response object
 * @param {*} data - Payload data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return sendSuccess(res, data, message, statusCode);
};

/**
 * Format standard API error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} error - Original error
 */
const errorResponse = (res, message = APP_STRINGS.SERVER.INTERNAL_ERROR, statusCode = 500, error = null) => {
  return sendError(res, message, statusCode, error);
};

/**
 * Clean pagination helper
 * @param {number|string} page 
 * @param {number|string} limit 
 */
const getPagination = (page = 1, limit = 10) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (p - 1) * l;
  return { page: p, limit: l, skip };
};

module.exports = {
  sendSuccess,
  sendError,
  successResponse,
  errorResponse,
  responseHandlerMiddleware,
  getPagination,
};
