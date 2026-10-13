/**
 * Application Strings & Response Messages Dictionary
 * Centralized repository for all API success, error, and validation messages.
 */

const APP_STRINGS = {
  // ==========================================
  // SUCCESS MESSAGES
  // ==========================================
  SUCCESS: {
    // Authentication
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'You have been safely logged out',

    // Database Connection
    DB_CONNECTED: (host) => `Successfully connected to MongoDB host: ${host}`,
    DB_MODE_LIVE: 'MongoDB Live',

    // Advocates & Users
    USER_CREATED: 'User account created and dynamically persisted',
    USER_UPDATED: 'User updated in database',
    PERMISSIONS_UPDATED: 'User permissions dynamically updated in database',
    CREDITS_ADJUSTED: (amount) => `Credits successfully adjusted (${amount >= 0 ? '+' : ''}${amount})`,
    USER_DELETED: 'User deleted permanently from database',

    // Law Firm Chambers
    FIRM_CREATED: 'Firm tenant created and persisted',
    FIRM_UPDATED: 'Law firm details updated successfully',
    FIRM_DELETED: 'Law firm deleted successfully',

    // Sub-Administrators
    SUBADMIN_CREATED: 'Admin user created successfully',
    SUBADMIN_UPDATED: 'Sub-Admin updated successfully',
    SUBADMIN_PERMISSIONS_UPDATED: 'Sub-Admin permissions updated successfully',
    SUBADMIN_DELETED: 'Sub-Admin removed successfully',

    // Roles & RBAC Matrix
    ROLE_CREATED: 'Role created successfully',
    ROLE_UPDATED: 'Role updated successfully',
    ROLE_DELETED: 'Role deleted successfully',
    ROLE_APPLIED: (role) => `Role '${role}' applied successfully and synchronized with Atlas`,

    // Master Data & Legal Taxonomies
    MASTER_RECORD_CREATED: 'Master record created successfully',
    MASTER_RECORD_UPDATED: 'Master record updated successfully',
    MASTER_RECORD_DELETED: (msg) => msg || 'Master record deleted',

    // Organization & Platform Settings
    ORGANISATION_UPDATED: 'Organisation profile updated successfully',
    SUBSCRIPTION_UPDATED: 'Subscription tier and billing updated successfully',
    SECURITY_UPDATED: 'Security policy settings updated successfully',
    INTEGRATION_UPDATED: 'Integration credentials saved successfully',
  },

  // ==========================================
  // ERROR & VALIDATION MESSAGES
  // ==========================================
  ERROR: {
    // Authentication & Tokens
    AUTH_REQUIRED: 'Authentication required',
    ACCESS_DENIED: 'Access denied: Requires administrative privileges',
    ACCESS_DENIED_PERM: 'Access denied: You do not have permission to perform this action',
    TOKEN_MISSING: 'Not authorized: Access token missing',
    TOKEN_INVALID_EXPIRED: 'Invalid or expired session token',
    USER_NO_LONGER_EXISTS: 'The user belonging to this token no longer exists',
    ACCOUNT_SUSPENDED: 'Account is suspended. Please contact Super Administrator.',
    ACCOUNT_SUSPENDED_ADMIN: 'Your account has been suspended by administration',
    INVALID_CREDENTIALS: 'Invalid email/username or password',
    SERVER_LOGIN_ERROR: 'Server login error',
    INTERNAL_SERVER_ERROR: 'Internal Admin Server Error',

    // Form & Input Validations
    EMAIL_PASSWORD_REQUIRED: 'Please provide email (or username) and password',
    NAME_EMAIL_REQUIRED: 'First name, last name, and email are required',
    EMAIL_EXISTS: 'User with this email already exists',
    CREDIT_AMOUNT_REQUIRED: 'Credit amount is required',
    MONGO_URI_REQUIRED: 'MongoDB URI is required',
    FIRM_NAME_REQUIRED: 'Firm name is required',
    USERNAME_OR_NAME_REQUIRED: 'Username or Name is required',
    PERMISSIONS_OBJECT_REQUIRED: 'Permissions object required',
    ROLE_NAME_REQUIRED: 'Role name is required',

    // Entity Not Found
    USER_NOT_FOUND: 'User not found',
    FIRM_NOT_FOUND: 'Law firm not found',
    SUBADMIN_NOT_FOUND: 'Sub-admin account not found',
    ROLE_NOT_FOUND: 'Role not found',
    MASTER_NOT_FOUND: 'Master record not found',

    // Database
    CONNECTION_FAILED: (err) => `Connection failed: ${err}`,

    // Dynamic Master Taxonomies Permission Denials
    CAT_ADD_DENIED: (category) => `Access Denied: Your assigned role does not have permission to add ${category || 'Master'} records.`,
    CAT_EDIT_DENIED: (category) => `Access Denied: Your assigned role does not have permission to edit ${category || 'Master'} records.`,
    CAT_DELETE_DENIED: (category) => `Access Denied: Your assigned role does not have permission to delete ${category || 'Master'} records.`,
  },
};

module.exports = APP_STRINGS;
