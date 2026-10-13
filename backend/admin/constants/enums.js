// Numeric Enums & Permissions for Legal AI Admin Platform

const ROLES = {
  SUPER_ADMIN: 1,
  FIRM_ADMIN: 2,
  SENIOR_PARTNER: 3,
  ADVOCATE: 4,
  LEGAL_RESEARCHER: 5,
  PARALEGAL: 6,
  COMPLIANCE: 7,
  CLIENT: 8,
};

const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.FIRM_ADMIN]: 'Firm Admin',
  [ROLES.SENIOR_PARTNER]: 'Senior Partner',
  [ROLES.ADVOCATE]: 'Advocate',
  [ROLES.LEGAL_RESEARCHER]: 'Legal Researcher',
  [ROLES.PARALEGAL]: 'Paralegal',
  [ROLES.COMPLIANCE]: 'Compliance Officer',
  [ROLES.CLIENT]: 'Client / Observer',
};

const USER_STATUS = {
  ACTIVE: 1,
  PENDING: 2,
  SUSPENDED: 3,
};

const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Active',
  [USER_STATUS.PENDING]: 'Pending',
  [USER_STATUS.SUSPENDED]: 'Suspended',
};

// Numeric Bitmask Permissions
const PERMISSIONS = {
  CAN_RESEARCH: 1,      // 1 << 0: Ask Themes AI & Legal Research Memos
  CAN_JUDGMENTS: 2,     // 1 << 1: Indian Case Law & Precedents Search
  CAN_DOCUMENTS: 4,     // 1 << 2: Document Scanning & AI Clause Breakdown
  CAN_CONTRACTS: 8,     // 1 << 3: Contract Risk Scoring & Redline Review
  CAN_DRAFTING: 16,     // 1 << 4: Legal Notice & Petition Drafter
  CAN_MATTERS: 32,      // 1 << 5: Litigation Matters & Case Files
  CAN_ADMIN: 64,        // 1 << 6: Admin Console & User Permissions
  CAN_BILLING: 128,     // 1 << 7: Manage Credits & Invoicing
  CAN_AUDIT: 256,       // 1 << 8: View Security Audit Trails
  CAN_EXPORT: 512,      // 1 << 9: Bulk Export Case Law & Analysis
};

const PERMISSION_DEFINITIONS = [
  { id: 'canResearch', bit: PERMISSIONS.CAN_RESEARCH, label: 'Legal Research & AI Memos', category: 'Core AI', desc: 'Ask Themes AI, generate structured citation memorandums' },
  { id: 'canJudgments', bit: PERMISSIONS.CAN_JUDGMENTS, label: 'Indian Case Law Precedents', category: 'Research', desc: 'Search Supreme Court & High Court judgments, headnotes & ratio' },
  { id: 'canDocuments', bit: PERMISSIONS.CAN_DOCUMENTS, label: 'Document Clause Analyzer', category: 'Analysis', desc: 'AI breakdown, clause risks, dates, and chronology generation' },
  { id: 'canContracts', bit: PERMISSIONS.CAN_CONTRACTS, label: 'Contract Risk & Redlines', category: 'Analysis', desc: 'Automated contract risk scoring and redline clause rewrites' },
  { id: 'canDrafting', bit: PERMISSIONS.CAN_DRAFTING, label: 'Legal Notice & Petition Drafter', category: 'Drafting', desc: 'Generate customized legal notices, plaints, and affidavits' },
  { id: 'canMatters', bit: PERMISSIONS.CAN_MATTERS, label: 'Litigation Case Files', category: 'Management', desc: 'Manage hearing calendars, active dockets, and case stages' },
  { id: 'canAdmin', bit: PERMISSIONS.CAN_ADMIN, label: 'Platform Administration', category: 'Administration', desc: 'User provisioning, permissions management, and role assignments' },
  { id: 'canBilling', bit: PERMISSIONS.CAN_BILLING, label: 'Credit & Subscription Control', category: 'Administration', desc: 'Top up firm tokens, view credit logs and subscription status' },
  { id: 'canAudit', bit: PERMISSIONS.CAN_AUDIT, label: 'Security & Audit Logs', category: 'Security', desc: 'Inspect audit trail of AI generations, logins, and permission changes' },
  { id: 'canExport', bit: PERMISSIONS.CAN_EXPORT, label: 'Data Export & Reports', category: 'Compliance', desc: 'Export matter dossiers, research PDFs, and compliance reports' },
];

const DEFAULT_CUSTOMER_PERMISSIONS = 63; // 1|2|4|8|16|32
const DEFAULT_ADMIN_PERMISSIONS = 1023; // All permissions

const maskToPermissionsMap = (mask) => {
  const m = typeof mask === 'number' ? mask : 63;
  return {
    canResearch: Boolean(m & PERMISSIONS.CAN_RESEARCH),
    canJudgments: Boolean(m & PERMISSIONS.CAN_JUDGMENTS),
    canDocuments: Boolean(m & PERMISSIONS.CAN_DOCUMENTS),
    canContracts: Boolean(m & PERMISSIONS.CAN_CONTRACTS),
    canDrafting: Boolean(m & PERMISSIONS.CAN_DRAFTING),
    canMatters: Boolean(m & PERMISSIONS.CAN_MATTERS),
    canAdmin: Boolean(m & PERMISSIONS.CAN_ADMIN),
    canBilling: Boolean(m & PERMISSIONS.CAN_BILLING),
    canAudit: Boolean(m & PERMISSIONS.CAN_AUDIT),
    canExport: Boolean(m & PERMISSIONS.CAN_EXPORT),
    numericMask: m,
  };
};

const permissionsMapToMask = (map = {}) => {
  let mask = 0;
  if (map.canResearch) mask |= PERMISSIONS.CAN_RESEARCH;
  if (map.canJudgments) mask |= PERMISSIONS.CAN_JUDGMENTS;
  if (map.canDocuments) mask |= PERMISSIONS.CAN_DOCUMENTS;
  if (map.canContracts) mask |= PERMISSIONS.CAN_CONTRACTS;
  if (map.canDrafting) mask |= PERMISSIONS.CAN_DRAFTING;
  if (map.canMatters) mask |= PERMISSIONS.CAN_MATTERS;
  if (map.canAdmin) mask |= PERMISSIONS.CAN_ADMIN;
  if (map.canBilling) mask |= PERMISSIONS.CAN_BILLING;
  if (map.canAudit) mask |= PERMISSIONS.CAN_AUDIT;
  if (map.canExport) mask |= PERMISSIONS.CAN_EXPORT;
  return mask;
};

module.exports = {
  ROLES,
  ROLE_LABELS,
  USER_STATUS,
  USER_STATUS_LABELS,
  PERMISSIONS,
  PERMISSION_DEFINITIONS,
  DEFAULT_CUSTOMER_PERMISSIONS,
  DEFAULT_ADMIN_PERMISSIONS,
  maskToPermissionsMap,
  permissionsMapToMask,
};
