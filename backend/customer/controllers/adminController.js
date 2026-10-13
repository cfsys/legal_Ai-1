const User = require('../models/User');
const { getIsMongooseConnected } = require('../config/db');
const { memoryStore } = require('../services/storage');
const APP_STRINGS = require('../constants/appStrings');
const { sendSuccess, sendError } = require('../middleware/responseHandler');
const {
  ROLES,
  PERMISSIONS,
  maskToPermissionsMap,
  permissionsMapToMask,
} = require('../constants/enums');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    if (getIsMongooseConnected()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      const enriched = users.map((u) => {
        const doc = u.toObject();
        const mask = typeof doc.permissions === 'number' ? doc.permissions : 63;
        return {
          ...doc,
          permissions: mask,
          permissionsMap: maskToPermissionsMap(mask),
        };
      });
      return sendSuccess(res, enriched, 'Users retrieved successfully');
    } else {
      const users = memoryStore.users.map((u) => {
        const { password, ...safeUser } = u;
        const mask = typeof safeUser.permissions === 'number' ? safeUser.permissions : 63;
        return {
          ...safeUser,
          permissions: mask,
          permissionsMap: maskToPermissionsMap(mask),
        };
      });
      return sendSuccess(res, users, 'Users retrieved successfully');
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.USER.FETCH_FAILED, 500, error);
  }
};

// @desc    Update user permissions by number or map (admin can grant/revoke)
// @route   PUT /api/admin/users/:id/permissions
// @access  Private/Admin
const updateUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions, numericMask } = req.body;

    let targetMask;
    if (typeof numericMask === 'number') {
      targetMask = numericMask;
    } else if (typeof permissions === 'number') {
      targetMask = permissions;
    } else if (typeof permissions === 'object') {
      targetMask = permissionsMapToMask(permissions);
    } else {
      return sendError(res, APP_STRINGS.PERMISSIONS.REQUIRED_MASK, 400);
    }

    if (getIsMongooseConnected()) {
      const user = await User.findById(id);
      if (!user) {
        return sendError(res, APP_STRINGS.USER.NOT_FOUND, 404);
      }

      user.permissions = targetMask;
      await user.save();

      return sendSuccess(
        res,
        {
          permissions: targetMask,
          permissionsMap: maskToPermissionsMap(targetMask),
        },
        APP_STRINGS.PERMISSIONS.UPDATE_SUCCESS
      );
    } else {
      const user = memoryStore.users.find((u) => u._id.toString() === id.toString());
      if (!user) {
        return sendError(res, APP_STRINGS.USER.NOT_FOUND, 404);
      }

      user.permissions = targetMask;

      return sendSuccess(
        res,
        {
          permissions: targetMask,
          permissionsMap: maskToPermissionsMap(targetMask),
        },
        APP_STRINGS.PERMISSIONS.UPDATE_SUCCESS
      );
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.PERMISSIONS.UPDATE_FAILED, 500, error);
  }
};

// @desc    Update user role & credits (numeric role: 1=Admin, 2=Customer)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, credits, plan, status } = req.body;

    // Convert role to number if string supplied
    let roleNum = role;
    if (role === 'admin' || role === 1) roleNum = ROLES.ADMIN; // 1
    if (role === 'customer' || role === 2) roleNum = ROLES.CUSTOMER; // 2

    if (getIsMongooseConnected()) {
      const user = await User.findById(id);
      if (!user) {
        return sendError(res, APP_STRINGS.USER.NOT_FOUND, 404);
      }

      if (roleNum !== undefined) user.role = roleNum;
      if (credits !== undefined) user.credits = credits;
      if (plan) user.plan = plan;
      if (status !== undefined) user.status = status;

      await user.save();
      return sendSuccess(res, { user }, APP_STRINGS.USER.UPDATED);
    } else {
      const user = memoryStore.users.find((u) => u._id.toString() === id.toString());
      if (!user) {
        return sendError(res, APP_STRINGS.USER.NOT_FOUND, 404);
      }

      if (roleNum !== undefined) user.role = roleNum;
      if (credits !== undefined) user.credits = credits;
      if (plan) user.plan = plan;
      if (status !== undefined) user.status = status;

      return sendSuccess(res, { user }, APP_STRINGS.USER.UPDATED);
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.USER.UPDATE_FAILED, 500, error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMongooseConnected()) {
      await User.findByIdAndDelete(id);
    } else {
      memoryStore.users = memoryStore.users.filter((u) => u._id.toString() !== id.toString());
    }

    return sendSuccess(res, {}, APP_STRINGS.USER.DELETED);
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.USER.DELETE_FAILED, 500, error);
  }
};

// @desc    Get system admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    let totalUsers = memoryStore.users.length;
    let totalDocuments = memoryStore.documents.length;
    let totalMatters = memoryStore.matters.length;
    let totalContracts = memoryStore.contracts.length;

    if (getIsMongooseConnected()) {
      totalUsers = await User.countDocuments();
    }

    return sendSuccess(
      res,
      {
        totalUsers,
        totalDocuments,
        totalMatters,
        totalContracts,
        systemHealth: 'Optimal',
        aiModel: 'Legal AI Legal Reasoning Engine v3.8',
      },
      'Admin stats retrieved'
    );
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.STATS.FETCH_FAILED, 500, error);
  }
};

module.exports = {
  getAllUsers,
  updateUserPermissions,
  updateUserProfile,
  deleteUser,
  getAdminStats,
};
