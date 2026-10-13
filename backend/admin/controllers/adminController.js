const adminStorage = require('../services/storageService');
const { connectDB, getIsMongooseConnected, getCurrentDbUri } = require('../config/db');
const { PERMISSION_DEFINITIONS, ROLES, ROLE_LABELS, USER_STATUS_LABELS } = require('../constants/enums');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { SUCCESS, ERROR } = require('../constants/appStrings');

// @desc    Platform Overview & DB Metrics
// @route   GET /api/admin/overview
const getOverview = async (req, res) => {
  try {
    const data = await adminStorage.getOverview();
    return sendSuccess(res, { data });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Database Connection Status
// @route   GET /api/admin/db-status
const getDbStatus = async (req, res) => {
  try {
    const isMongo = getIsMongooseConnected();
    const uri = getCurrentDbUri();
    const overview = await adminStorage.getOverview();

    return sendSuccess(res, {
      isMongooseConnected: isMongo,
      dbMode: isMongo ? 'MongoDB Live' : 'Dynamic Persistent DB',
      uri: uri ? uri.replace(/:([^:@]{4,})@/, ':****@') : 'Local',
      counts: {
        users: overview.stats.totalUsers,
        firms: overview.stats.totalFirms,
      },
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Dynamically connect to custom MongoDB (e.g. Atlas)
// @route   POST /api/admin/connect-db
const connectCustomDb = async (req, res) => {
  try {
    const { mongoUri } = req.body;
    if (!mongoUri) {
      return sendError(res, ERROR.MONGO_URI_REQUIRED, 400);
    }

    const result = await connectDB(mongoUri);
    if (result.success) {
      adminStorage.initialized = false;
      await adminStorage.init();
      return sendSuccess(res, { dbMode: SUCCESS.DB_MODE_LIVE }, SUCCESS.DB_CONNECTED(result.host));
    } else {
      return sendError(res, ERROR.CONNECTION_FAILED(result.error), 400);
    }
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get All Users with Filters & Pagination
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const { search, firmId, role, status, page = 1, limit = 10 } = req.query;
    const result = await adminStorage.getUsers({
      search,
      firmId,
      role,
      status,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    if (Array.isArray(result)) {
      return sendSuccess(res, { count: result.length, total: result.length, page: 1, limit: result.length, totalPages: 1, users: result });
    }
    return sendSuccess(res, result);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get Single User
// @route   GET /api/admin/users/:id
const getUser = async (req, res) => {
  try {
    const user = await adminStorage.getUserById(req.params.id);
    if (!user) {
      return sendError(res, ERROR.USER_NOT_FOUND, 404);
    }
    return sendSuccess(res, { user });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get User Login Session History
// @route   GET /api/admin/users/:id/login-history
const getUserLoginHistory = async (req, res) => {
  try {
    const user = await adminStorage.getUserById(req.params.id);
    if (!user) {
      return sendError(res, ERROR.USER_NOT_FOUND, 404);
    }
    const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const history = (await adminStorage.getUserLoginHistory(req.params.id, {
      clientIp,
      userAgent,
    })) || {};

    return sendSuccess(res, {
      userId: user.id,
      userName: user.fullName || user.username || user.email,
      user: history.user || {
        id: user.id,
        fullName: user.fullName,
        username: user.username || (user.email ? user.email.split('@')[0] : 'user'),
        email: user.email,
        mobile: user.mobile,
        customerCode: user.customerCode || user.code || 101,
      },
      stats: history.stats,
      sessions: history.sessions || [],
      count: history.sessions?.length || 0,
      history,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Create User (Advocate)
// @route   POST /api/admin/users
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, firmId, role, professionalType, credits, permissions, password } = req.body;

    if (!firstName || !lastName || !email) {
      return sendError(res, ERROR.NAME_EMAIL_REQUIRED, 400);
    }

    const userRes = await adminStorage.getUsers({ search: email.toLowerCase().trim(), limit: 100 });
    const existingUsers = Array.isArray(userRes) ? userRes : (userRes?.users || []);
    const exactMatch = existingUsers.find((u) => u.email?.toLowerCase() === email.toLowerCase().trim());
    if (exactMatch) {
      return sendError(res, ERROR.EMAIL_EXISTS, 400);
    }

    const newUser = await adminStorage.createUser({
      firstName,
      lastName,
      email,
      mobile,
      firmId,
      role,
      professionalType,
      credits,
      permissions,
      password,
    });

    return sendSuccess(res, { user: newUser }, SUCCESS.USER_CREATED, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Update User
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const updated = await adminStorage.updateUser(req.params.id, req.body);
    if (!updated) {
      return sendError(res, ERROR.USER_NOT_FOUND, 404);
    }
    return sendSuccess(res, { user: updated }, SUCCESS.USER_UPDATED);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Update User Permissions Bitmask
// @route   PUT /api/admin/users/:id/permissions
const updatePermissions = async (req, res) => {
  try {
    const { permissions, permissionsMap, numericMask } = req.body;
    let finalMask = permissions;
    if (numericMask !== undefined) finalMask = Number(numericMask);

    const updated = await adminStorage.updateUserPermissions(req.params.id, {
      permissions: finalMask,
      permissionsMap,
      actorName: req.user ? (req.user.fullName || req.user.username || req.user.email) : 'Super Admin',
    });

    if (!updated) {
      return sendError(res, ERROR.USER_NOT_FOUND, 404);
    }

    return sendSuccess(res, { user: updated }, SUCCESS.PERMISSIONS_UPDATED);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Allocate AI Credits to User
// @route   POST /api/admin/users/:id/credits
const allocateCredits = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    if (amount === undefined || isNaN(Number(amount))) {
      return sendError(res, ERROR.CREDIT_AMOUNT_REQUIRED, 400);
    }

    const user = await adminStorage.allocateCredits(
      req.params.id,
      Number(amount),
      reason || 'Admin Adjustment',
      req.user ? (req.user.fullName || req.user.username || req.user.email) : 'Super Admin'
    );

    if (!user) {
      return sendError(res, ERROR.USER_NOT_FOUND, 404);
    }

    return sendSuccess(res, { user, credits: user.credits }, SUCCESS.CREDITS_ADJUSTED(amount));
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const success = await adminStorage.deleteUser(
      req.params.id,
      req.user ? (req.user.fullName || req.user.username || req.user.email) : 'Super Admin'
    );
    if (!success) {
      return sendError(res, ERROR.USER_NOT_FOUND, 404);
    }
    return sendSuccess(res, null, SUCCESS.USER_DELETED);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get Law Firms
// @route   GET /api/admin/firms
const getFirms = async (req, res) => {
  try {
    const { search } = req.query;
    let firms = await adminStorage.getFirms();
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      firms = firms.filter(f =>
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.tier && f.tier.toLowerCase().includes(q)) ||
        (f.domain && f.domain.toLowerCase().includes(q)) ||
        (f.city && f.city.toLowerCase().includes(q))
      );
    }
    return sendSuccess(res, { count: firms.length, firms });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Create Law Firm Tenant
// @route   POST /api/admin/firms
const createFirm = async (req, res) => {
  try {
    const { name, tier, seatsLimit, domain, address, city, state, contactEmail, contactPhone } = req.body;
    if (!name) {
      return sendError(res, ERROR.FIRM_NAME_REQUIRED, 400);
    }

    const firm = await adminStorage.createFirm({
      name,
      tier,
      seatsLimit,
      domain,
      address,
      city,
      state,
      contactEmail,
      contactPhone,
    });

    return sendSuccess(res, { firm }, SUCCESS.FIRM_CREATED, 201);
  } catch (error) {
    if (error.code === 11000 || error.message?.includes('E11000') || error.message?.includes('duplicate key')) {
      const field = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'domain';
      const duplicateVal = req.body[field] || 'this value';
      return sendError(res, `A law firm with ${field} '${duplicateVal}' is already registered in the system. Please use a unique ${field}.`, 400);
    }
    return sendError(res, error.message, 500);
  }
};

// @desc    Get Permissions Matrix
// @route   GET /api/admin/permissions-matrix
const getPermissionsMatrix = async (req, res) => {
  try {
    const { firmId } = req.query;
    const userRes = await adminStorage.getUsers({ firmId });
    const users = Array.isArray(userRes) ? userRes : (userRes?.users || []);

    const matrix = users.map((u) => {
      const mask = Number(u.permissions || 0);
      const permStates = {};
      PERMISSION_DEFINITIONS.forEach((def) => {
        const key = def.id || def.key;
        permStates[key] = (mask & def.bit) === def.bit;
      });

      return {
        userId: u.id || u._id,
        fullName: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        email: u.email,
        firmId: u.firmId,
        firmName: u.firmName,
        role: u.role,
        roleLabel: u.roleLabel,
        permissionsMask: mask,
        permStates,
      };
    });

    return sendSuccess(res, {
      totalUsers: matrix.length,
      columns: PERMISSION_DEFINITIONS,
      matrix,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get Audit Logs
// @route   GET /api/admin/audit-logs
const getAuditLogs = async (req, res) => {
  try {
    const { search, category, severity, limit } = req.query;
    const logs = await adminStorage.getAuditLogs({
      search,
      category,
      severity,
      limit: limit ? Number(limit) : 50,
    });
    return sendSuccess(res, { count: logs.length, logs });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get AI Quotas & Usage Stats
// @route   GET /api/admin/ai-quotas
const getAiQuotas = async (req, res) => {
  try {
    const quotas = await adminStorage.getAiQuotas();
    return sendSuccess(res, {
      totalDailyLimit: quotas.totalDailyLimit || 2500000,
      usedToday: quotas.usedToday || 1342890,
      quotas,
      models: quotas.models || [],
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get Sub-Admins with Pagination and Search
// @route   GET /api/admin/sub-admins
const getSubAdmins = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;
    const result = await adminStorage.getSubAdmins({
      search,
      role,
      status,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    if (Array.isArray(result)) {
      return sendSuccess(res, { count: result.length, total: result.length, page: 1, limit: result.length, totalPages: 1, subAdmins: result });
    }
    return sendSuccess(res, result);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Create Sub-Admin
// @route   POST /api/admin/sub-admins
const createSubAdmin = async (req, res) => {
  try {
    if (req.user && req.user.role !== 1 && req.user.role !== 'Super Admin' && req.user.roleName !== 'Super Admin') {
      return sendError(res, ERROR.ACCESS_DENIED_PERM, 403);
    }

    const { username, fullName, email, password, role, permissions, status } = req.body;
    if (!username && !fullName) {
      return sendError(res, ERROR.USERNAME_OR_NAME_REQUIRED, 400);
    }

    const result = await adminStorage.createSubAdmin({
      username: username || fullName,
      fullName: fullName || username,
      email,
      password,
      role,
      permissions,
      status,
    });

    return sendSuccess(res, { subAdmin: result }, SUCCESS.SUBADMIN_CREATED, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Update Sub-Admin
// @route   PUT /api/admin/sub-admins/:id
const updateSubAdmin = async (req, res) => {
  try {
    if (req.user && req.user.role !== 1 && req.user.role !== 'Super Admin' && req.user.roleName !== 'Super Admin') {
      return sendError(res, ERROR.ACCESS_DENIED_PERM, 403);
    }

    const result = await adminStorage.updateSubAdmin(req.params.id, req.body);
    return sendSuccess(res, { subAdmin: result }, SUCCESS.SUBADMIN_UPDATED);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Update Sub-Admin Granular Permissions
// @route   PUT /api/admin/sub-admins/:id/permissions
const updateSubAdminPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    if (!permissions || typeof permissions !== 'object') {
      return sendError(res, ERROR.PERMISSIONS_OBJECT_REQUIRED, 400);
    }

    const result = await adminStorage.updateSubAdminPermissions(req.params.id, permissions);
    return sendSuccess(res, { subAdmin: result }, SUCCESS.SUBADMIN_PERMISSIONS_UPDATED);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Delete Sub-Admin
// @route   DELETE /api/admin/sub-admins/:id
const deleteSubAdmin = async (req, res) => {
  try {
    if (req.user && req.user.role !== 1 && req.user.role !== 'Super Admin' && req.user.roleName !== 'Super Admin') {
      return sendError(res, ERROR.ACCESS_DENIED_PERM, 403);
    }

    await adminStorage.deleteSubAdmin(req.params.id);
    return sendSuccess(res, null, SUCCESS.SUBADMIN_DELETED);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Get Roles with Pagination and Search
// @route   GET /api/admin/roles
const getRoles = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const result = await adminStorage.getRoles({
      search,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
    if (Array.isArray(result)) {
      return sendSuccess(res, { count: result.length, total: result.length, page: 1, limit: result.length, totalPages: 1, roles: result });
    }
    return sendSuccess(res, result);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Create Role
// @route   POST /api/admin/roles
const createRole = async (req, res) => {
  try {
    if (req.user && req.user.role !== 1 && req.user.role !== 'Super Admin' && req.user.roleName !== 'Super Admin') {
      return sendError(res, ERROR.ACCESS_DENIED_PERM, 403);
    }

    const { name, code, description, permissions, isDefault } = req.body;
    if (!name) {
      return sendError(res, ERROR.ROLE_NAME_REQUIRED, 400);
    }

    const result = await adminStorage.createRole({ name, code, description, permissions, isDefault });
    return sendSuccess(res, { role: result }, SUCCESS.ROLE_CREATED, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Update Role
// @route   PUT /api/admin/roles/:id
const updateRole = async (req, res) => {
  try {
    if (req.user && req.user.role !== 1 && req.user.role !== 'Super Admin' && req.user.roleName !== 'Super Admin') {
      return sendError(res, ERROR.ACCESS_DENIED_PERM, 403);
    }

    const result = await adminStorage.updateRole(req.params.id, req.body);
    return sendSuccess(res, { role: result }, SUCCESS.ROLE_UPDATED);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Delete Role
// @route   DELETE /api/admin/roles/:id
const deleteRole = async (req, res) => {
  try {
    if (req.user && req.user.role !== 1 && req.user.role !== 'Super Admin' && req.user.roleName !== 'Super Admin') {
      return sendError(res, ERROR.ACCESS_DENIED_PERM, 403);
    }

    await adminStorage.deleteRole(req.params.id);
    return sendSuccess(res, null, SUCCESS.ROLE_DELETED);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Apply Role & Permissions to Target User
// @route   POST /api/admin/roles/apply
const applyRole = async (req, res) => {
  try {
    const { targetUserId, targetUserType, role, roleName, permissions, email, username, id } = req.body;
    const result = await adminStorage.applyRole({
      userId: targetUserId || id,
      id: targetUserId || id,
      targetUserId,
      targetUserType,
      email,
      username,
      role: role || roleName,
      roleName: role || roleName,
      permissions,
    });
    return sendSuccess(res, { data: result }, SUCCESS.ROLE_APPLIED(role || roleName));
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Get Platform Legal System Modules for Permission Matrix
// @route   GET /api/admin/modules
const getSystemModules = (req, res) => {
  try {
    const modules = adminStorage.getSystemModules();
    return sendSuccess(res, { count: modules.length, modules });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get Master Data Categories with counts
// @route   GET /api/admin/masters/categories
const getMasterCategories = async (req, res) => {
  try {
    const categories = await adminStorage.getMasterCategories();
    return sendSuccess(res, { count: categories.length, categories });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get Master Data Items for Category
// @route   GET /api/admin/masters
const getMasterData = async (req, res) => {
  try {
    const { category, search, page, limit } = req.query;
    const result = await adminStorage.getMasterData({
      category,
      search,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 250,
    });
    const itemsList = Array.isArray(result) ? result : (result?.items || []);
    return sendSuccess(res, {
      count: itemsList.length,
      total: result?.total ?? itemsList.length,
      page: result?.page || 1,
      limit: result?.limit || 250,
      items: itemsList,
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// Helper to check user's master data category permission
const checkMasterCategoryPermission = (user, category, action) => {
  if (!user) return true; // default open in local
  const role = Number(user.role);
  if (role === 1 || user.role === 'Super Admin' || user.roleName === 'Super Admin' || user.code === 'SUPER_ADM') {
    return true; // Super Admin has universal access
  }

  const modules = user.permissions?.modules;
  if (!modules) return false;

  const masterPerm = modules.masters;
  if (!masterPerm || masterPerm.access === 'none') {
    return false;
  }
  if (masterPerm.access === 'full') {
    return true;
  }

  // Check category-level granular permissions
  const categories = masterPerm.categories || {};
  const catPerm = categories[category] || modules['masters_' + category];
  if (!catPerm) {
    // If not restricted specifically, inherit module-level setting
    return Boolean(masterPerm[action] ?? masterPerm.access === 'full');
  }

  if (catPerm.access === 'full') return true;
  if (catPerm.access === 'none') return false;
  return Boolean(catPerm[action]);
};

// @desc    Create Master Data Record
// @route   POST /api/admin/masters
const createMasterData = async (req, res) => {
  try {
    const { category, name, code, type, tier, jurisdiction, description, metadata, status } = req.body;

    // Check RBAC permission for category creation
    if (!checkMasterCategoryPermission(req.user, category, 'create')) {
      return sendError(res, ERROR.CAT_ADD_DENIED(category), 403);
    }

    const item = await adminStorage.createMasterData({
      category,
      name,
      code,
      type,
      tier,
      jurisdiction,
      description,
      metadata,
      status,
    });
    return sendSuccess(res, { item }, SUCCESS.MASTER_RECORD_CREATED, 201);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Update Master Data Record
// @route   PUT /api/admin/masters/:id
const updateMasterData = async (req, res) => {
  try {
    const { category } = req.body;

    // Check RBAC permission for category editing
    if (!checkMasterCategoryPermission(req.user, category, 'edit')) {
      return sendError(res, ERROR.CAT_EDIT_DENIED(category), 403);
    }

    const item = await adminStorage.updateMasterData(req.params.id, req.body);
    return sendSuccess(res, { item }, SUCCESS.MASTER_RECORD_UPDATED);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Delete Master Data Record
// @route   DELETE /api/admin/masters/:id
const deleteMasterData = async (req, res) => {
  try {
    const { category } = req.query;

    // Check RBAC permission for category deletion
    if (!checkMasterCategoryPermission(req.user, category, 'delete')) {
      return sendError(res, ERROR.CAT_DELETE_DENIED(category), 403);
    }

    const result = await adminStorage.deleteMasterData(req.params.id, category);
    return sendSuccess(res, null, SUCCESS.MASTER_RECORD_DELETED(result.message));
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Get Organisation Profile
// @route   GET /api/admin/settings/organisation
const getOrganisation = async (req, res) => {
  try {
    const data = await adminStorage.getOrganisation();
    return sendSuccess(res, { organisation: data });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Update Organisation Profile
// @route   PUT /api/admin/settings/organisation
const updateOrganisation = async (req, res) => {
  try {
    const result = await adminStorage.updateOrganisation(req.body);
    return sendSuccess(res, { organisation: result }, SUCCESS.ORGANISATION_UPDATED);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Get Subscription Plans & Active Billing
// @route   GET /api/admin/settings/subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const data = await adminStorage.getSubscriptions();
    return sendSuccess(res, { subscriptions: data });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Update Subscriptions Configuration
// @route   PUT /api/admin/settings/subscriptions
const updateSubscriptions = async (req, res) => {
  try {
    const result = await adminStorage.updateSubscriptions(req.body);
    return sendSuccess(res, { subscriptions: result }, SUCCESS.SUBSCRIPTION_UPDATED);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Get Real-time API & Storage Usage Analytics
// @route   GET /api/admin/settings/usage
const getUsage = async (req, res) => {
  try {
    const data = await adminStorage.getUsage();
    return sendSuccess(res, { usage: data });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get Security & Compliance Policies
// @route   GET /api/admin/settings/security
const getSecuritySettings = async (req, res) => {
  try {
    const data = await adminStorage.getSecuritySettings();
    return sendSuccess(res, { security: data });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Update Security & Compliance Policies
// @route   PUT /api/admin/settings/security
const updateSecuritySettings = async (req, res) => {
  try {
    const result = await adminStorage.updateSecuritySettings(req.body);
    return sendSuccess(res, { security: result }, SUCCESS.SECURITY_UPDATED);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Get Cloud & Judicial Registry Integrations
// @route   GET /api/admin/settings/integrations
const getIntegrations = async (req, res) => {
  try {
    const data = await adminStorage.getIntegrations();
    return sendSuccess(res, { integrations: data });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Update Integration
// @route   PUT /api/admin/settings/integrations/:id
const updateIntegration = async (req, res) => {
  try {
    const result = await adminStorage.updateIntegration(req.params.id, req.body);
    return sendSuccess(res, { integration: result }, SUCCESS.INTEGRATION_UPDATED);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Get Customer Inquiries & Demo Requests
// @route   GET /api/admin/leads
const getLeads = async (req, res) => {
  try {
    const { search, kind, status, page, limit } = req.query;
    const result = await adminStorage.getLeads({ search, kind, status, page, limit });
    return sendSuccess(res, result);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Update Customer Inquiry Status / Notes
// @route   PUT /api/admin/leads/:id
const updateLead = async (req, res) => {
  try {
    const result = await adminStorage.updateLead(req.params.id, req.body);
    return sendSuccess(res, { lead: result }, 'Customer request updated successfully');
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// @desc    Delete Customer Inquiry
// @route   DELETE /api/admin/leads/:id
const deleteLead = async (req, res) => {
  try {
    await adminStorage.deleteLead(req.params.id);
    return sendSuccess(res, null, 'Customer request deleted successfully');
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = {
  getOverview,
  getDbStatus,
  connectCustomDb,
  getUsers,
  getUser,
  getUserLoginHistory,
  createUser,
  updateUser,
  updatePermissions,
  allocateCredits,
  deleteUser,
  getFirms,
  createFirm,
  getPermissionsMatrix,
  getAuditLogs,
  getAiQuotas,
  getSubAdmins,
  createSubAdmin,
  updateSubAdmin,
  updateSubAdminPermissions,
  deleteSubAdmin,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  applyRole,
  getSystemModules,
  getMasterCategories,
  getMasterData,
  createMasterData,
  updateMasterData,
  deleteMasterData,
  getOrganisation,
  updateOrganisation,
  getSubscriptions,
  updateSubscriptions,
  getUsage,
  getSecuritySettings,
  updateSecuritySettings,
  getIntegrations,
  updateIntegration,
  getLeads,
  updateLead,
  deleteLead,
};
