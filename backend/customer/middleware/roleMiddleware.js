const { ROLES, PERMISSIONS, hasNumericPermission } = require('../constants/enums');
const APP_STRINGS = require('../constants/appStrings');
const { sendError } = require('./responseHandler');

// Check if user is Admin (role === 1)
const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === ROLES.ADMIN || req.user.role === 'admin' || req.user.role === 1)) {
    return next();
  }
  return sendError(res, APP_STRINGS.PERMISSIONS.ADMIN_REQUIRED, 403);
};

// Check if user has specific numeric permission
const requirePermission = (permissionKeyOrNum) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, APP_STRINGS.PERMISSIONS.AUTH_REQUIRED, 401);
    }

    // Admins (role === 1) have all permissions
    if (req.user.role === ROLES.ADMIN || req.user.role === 1 || req.user.role === 'admin') {
      return next();
    }

    // Resolve permission number
    let requiredNum = typeof permissionKeyOrNum === 'number'
      ? permissionKeyOrNum
      : PERMISSIONS[permissionKeyOrNum] || PERMISSIONS[`CAN_${permissionKeyOrNum.toUpperCase().replace(/^CAN_?/, '')}`];

    if (!requiredNum && typeof permissionKeyOrNum === 'string') {
      const map = {
        canResearch: PERMISSIONS.CAN_RESEARCH,
        canJudgments: PERMISSIONS.CAN_JUDGMENTS,
        canDocuments: PERMISSIONS.CAN_DOCUMENTS,
        canContracts: PERMISSIONS.CAN_CONTRACTS,
        canDrafting: PERMISSIONS.CAN_DRAFTING,
        canMatters: PERMISSIONS.CAN_MATTERS,
        canAdmin: PERMISSIONS.CAN_ADMIN,
      };
      requiredNum = map[permissionKeyOrNum];
    }

    const userPerm = req.user.permissions;

    // Check if numeric bitmask matches
    if (typeof userPerm === 'number' && requiredNum) {
      if (hasNumericPermission(userPerm, requiredNum)) {
        return next();
      }
    } else if (typeof userPerm === 'object' && userPerm !== null) {
      if (userPerm[permissionKeyOrNum]) {
        return next();
      }
    }

    return sendError(
      res,
      APP_STRINGS.PERMISSIONS.PERMISSION_DENIED(permissionKeyOrNum, requiredNum),
      403
    );
  };
};

module.exports = { isAdmin, requirePermission };
