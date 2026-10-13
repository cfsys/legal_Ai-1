// Numeric Enums & Permissions for Legal AI

// User Roles
const ROLES = {
  ADMIN: 1,
  CUSTOMER: 2,
};

// User Account Status
const USER_STATUS = {
  ACTIVE: 1,
  PENDING: 2,
  SUSPENDED: 3,
};

// Authentication Provider
const AUTH_PROVIDER = {
  LOCAL: 1,
  GOOGLE: 2,
};

// Numeric Permissions Bitmask / Keys
const PERMISSIONS = {
  CAN_RESEARCH: 1,   // 1 << 0
  CAN_JUDGMENTS: 2,  // 1 << 1
  CAN_DOCUMENTS: 4,  // 1 << 2
  CAN_CONTRACTS: 8,  // 1 << 3
  CAN_DRAFTING: 16,  // 1 << 4
  CAN_MATTERS: 32,   // 1 << 5
  CAN_ADMIN: 64,     // 1 << 6
};

// All permissions mask for customer defaults: 1 | 2 | 4 | 8 | 16 | 32 = 63
const CUSTOMER_DEFAULT_PERMISSIONS = 63;
// All permissions for admin: 1 | 2 | 4 | 8 | 16 | 32 | 64 = 127
const ADMIN_DEFAULT_PERMISSIONS = 127;

// Document Processing Status
const DOCUMENT_STATUS = {
  READY: 1,
  PROCESSING: 2,
  FAILED: 3,
};

// Legal Judgment Precedent Status
const JUDGMENT_STATUS = {
  GOOD_LAW: 1,
  DISTINGUISHED: 2,
  OVERRULED: 3,
};

// Contract Risk Level
const CONTRACT_RISK = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

// Research Depth
const RESEARCH_DEPTH = {
  QUICK: 1,
  STANDARD: 2,
  DEEP: 3,
};

// Helper: Check if numeric permission mask has a specific permission number
const hasNumericPermission = (userMask, requiredPermission) => {
  return (userMask & requiredPermission) === requiredPermission;
};

// Helper: Convert numeric permission mask to object map
const maskToPermissionsMap = (mask) => {
  return {
    canResearch: Boolean(mask & PERMISSIONS.CAN_RESEARCH),
    canJudgments: Boolean(mask & PERMISSIONS.CAN_JUDGMENTS),
    canDocuments: Boolean(mask & PERMISSIONS.CAN_DOCUMENTS),
    canContracts: Boolean(mask & PERMISSIONS.CAN_CONTRACTS),
    canDrafting: Boolean(mask & PERMISSIONS.CAN_DRAFTING),
    canMatters: Boolean(mask & PERMISSIONS.CAN_MATTERS),
    canAdmin: Boolean(mask & PERMISSIONS.CAN_ADMIN),
    numericMask: mask,
  };
};

// Helper: Convert object map to numeric mask
const permissionsMapToMask = (permMap) => {
  let mask = 0;
  if (permMap.canResearch) mask |= PERMISSIONS.CAN_RESEARCH;
  if (permMap.canJudgments) mask |= PERMISSIONS.CAN_JUDGMENTS;
  if (permMap.canDocuments) mask |= PERMISSIONS.CAN_DOCUMENTS;
  if (permMap.canContracts) mask |= PERMISSIONS.CAN_CONTRACTS;
  if (permMap.canDrafting) mask |= PERMISSIONS.CAN_DRAFTING;
  if (permMap.canMatters) mask |= PERMISSIONS.CAN_MATTERS;
  if (permMap.canAdmin) mask |= PERMISSIONS.CAN_ADMIN;
  return mask;
};

module.exports = {
  ROLES,
  USER_STATUS,
  AUTH_PROVIDER,
  PERMISSIONS,
  CUSTOMER_DEFAULT_PERMISSIONS,
  ADMIN_DEFAULT_PERMISSIONS,
  DOCUMENT_STATUS,
  JUDGMENT_STATUS,
  CONTRACT_RISK,
  RESEARCH_DEPTH,
  hasNumericPermission,
  maskToPermissionsMap,
  permissionsMapToMask,
};
