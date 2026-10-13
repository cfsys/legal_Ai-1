// Numeric Enums & Permissions Constants for Legal AI Frontend

export const ROLES = {
  ADMIN: 1,
  CUSTOMER: 2,
};

export const ROLE_LABELS = {
  1: 'Admin',
  2: 'Customer',
};

export const USER_STATUS = {
  ACTIVE: 1,
  PENDING: 2,
  SUSPENDED: 3,
};

export const STATUS_LABELS = {
  1: 'Active',
  2: 'Pending',
  3: 'Suspended',
};

export const PERMISSIONS = {
  CAN_RESEARCH: 1,   // 1 << 0
  CAN_JUDGMENTS: 2,  // 1 << 1
  CAN_DOCUMENTS: 4,  // 1 << 2
  CAN_CONTRACTS: 8,  // 1 << 3
  CAN_DRAFTING: 16,  // 1 << 4
  CAN_MATTERS: 32,   // 32 (1 << 5)
  CAN_ADMIN: 64,     // 64 (1 << 6)
};

export const PERMISSION_LIST = [
  { key: 'canResearch', bit: 1, label: 'Research' },
  { key: 'canJudgments', bit: 2, label: 'Judgments' },
  { key: 'canDocuments', bit: 4, label: 'Documents' },
  { key: 'canContracts', bit: 8, label: 'Contracts' },
  { key: 'canDrafting', bit: 16, label: 'Drafting' },
  { key: 'canMatters', bit: 32, label: 'Matters' },
];

export const DOCUMENT_STATUS = {
  READY: 1,
  PROCESSING: 2,
  FAILED: 3,
};

export const JUDGMENT_STATUS = {
  GOOD_LAW: 1,
  DISTINGUISHED: 2,
  OVERRULED: 3,
};

export const CONTRACT_RISK = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};

// Check if user's numeric permission mask has a specific bit
export const hasPermission = (userMask, requiredBit) => {
  if (typeof userMask !== 'number') return true;
  return (userMask & requiredBit) === requiredBit;
};
