const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsMongooseConnected } = require('../config/db');
const { memoryStore } = require('../services/storage');
const APP_STRINGS = require('../constants/appStrings');
const { sendError } = require('./responseHandler');

const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'legal_ai_super_secret_jwt_key_2026');

      if (getIsMongooseConnected()) {
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(decoded.id)) {
          req.user = await User.findById(decoded.id).select('-password');
        } else {
          // Graceful fallback for demo tokens
          req.user = await User.findOne({ email: 'cfsys.xyz@gmail.com' }).select('-password');
        }
      } else {
        const found = memoryStore.users.find((u) => u._id.toString() === decoded.id.toString());
        if (found) {
          const { password, ...safeUser } = found;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        logger.warn('AuthMiddleware', `User not found for token id: ${decoded.id}`);
        return sendError(res, APP_STRINGS.AUTH.USER_NOT_FOUND, 401);
      }

      return next();
    } catch (error) {
      logger.error('AuthMiddleware', `JWT token verification failed: ${error.message}`);
      return sendError(res, APP_STRINGS.AUTH.TOKEN_FAILED, 401, error);
    }
  }

  if (!token) {
    logger.warn('AuthMiddleware', `Access denied: No token provided on ${req.method} ${req.originalUrl}`);
    return sendError(res, APP_STRINGS.AUTH.TOKEN_NOT_PROVIDED, 401);
  }
};

const optionalProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'legal_ai_super_secret_jwt_key_2026');

      if (getIsMongooseConnected()) {
        const mongoose = require('mongoose');
        if (mongoose.Types.ObjectId.isValid(decoded.id)) {
          req.user = await User.findById(decoded.id).select('-password');
        } else {
          req.user = await User.findOne({ email: 'cfsys.xyz@gmail.com' }).select('-password');
        }
      } else {
        const found = memoryStore.users.find((u) => u._id.toString() === decoded.id.toString());
        if (found) {
          const { password, ...safeUser } = found;
          req.user = safeUser;
        }
      }
    } catch (error) {
      // Ignored for optional auth
    }
  }
  return next();
};

module.exports = { protect, optionalProtect };

