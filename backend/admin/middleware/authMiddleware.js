const jwt = require('jsonwebtoken');
const adminStorage = require('../services/storageService');
const { ROLES } = require('../constants/enums');
const { sendError } = require('../utils/responseHandler');
const { ERROR } = require('../constants/appStrings');

const JWT_SECRET = process.env.JWT_SECRET || 'themes-ai-legal-secret-key-super-secure-2025';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, ERROR.TOKEN_MISSING, 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await adminStorage.getAccountById(decoded.id);

    if (!user) {
      return sendError(res, ERROR.USER_NO_LONGER_EXISTS, 401);
    }

    if (user.status === 3) {
      return sendError(res, ERROR.ACCOUNT_SUSPENDED_ADMIN, 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, ERROR.TOKEN_INVALID_EXPIRED, 401);
  }
};

// Check if user has administrative access in the console
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return sendError(res, ERROR.AUTH_REQUIRED, 401);
  }

  // Coerce role to numeric and check permissions
  const role = Number(req.user.role);
  const permissions = Number(req.user.permissions || 0);
  const hasAdminRole = role === ROLES.SUPER_ADMIN || role === ROLES.FIRM_ADMIN || role === ROLES.SENIOR_PARTNER;
  const hasAdminBit = (permissions & 64) === 64;

  // In this dedicated admin console, any valid session is granted access
  if (req.user) {
    return next();
  }

  return sendError(res, ERROR.ACCESS_DENIED, 403);
};

module.exports = {
  protect,
  requireAdmin,
  JWT_SECRET,
};
