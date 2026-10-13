const logger = require('../utils/logger');

/**
 * Express Middleware for logging incoming HTTP requests & response timing
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const userEmail = req.user?.email || null;
    logger.http(method, originalUrl, res.statusCode, duration, userEmail);
  });

  next();
};

module.exports = requestLogger;
