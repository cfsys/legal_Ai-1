const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Rate limiter for authentication routes (login, register, otp, etc.)
// Prevents brute-force, password guessing, and OTP enumeration attacks
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 20, // Limit each IP to 20 attempts per window
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* legacy headers
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes for security.',
    status: 429,
  },
  skipSuccessfulRequests: false,
});

// General API Rate Limiter
// Prevents Denial of Service (DoS) and automated API scraping
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 600, // Limit each IP to 600 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many API requests from this IP. Please slow down and try again shortly.',
    status: 429,
  },
});

// NoSQL injection sanitizer middleware
// Strips prohibited MongoDB query operators ($gt, $ne, etc.) from body, params, and query
const sanitizeMongo = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[Security Alert] Sanitized suspicious NoSQL character in key "${key}" from IP ${req.ip}`);
  },
});

module.exports = {
  authRateLimiter,
  generalApiLimiter,
  sanitizeMongo,
};
