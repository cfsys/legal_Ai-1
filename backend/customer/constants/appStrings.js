// Centralized Backend AppStrings & Messages

const APP_STRINGS = {
  // Auth Messages
  AUTH: {
    REQUIRED_FIELDS: 'Please provide all required fields.',
    EMAIL_PASSWORD_REQUIRED: 'Please provide both email and password.',
    USER_EXISTS: 'A user with this email already exists.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    GOOGLE_AUTH_FAILED: 'Google authentication failed.',
    USER_NOT_FOUND: 'User not found or authorization revoked.',
    TOKEN_NOT_PROVIDED: 'Not authorized, no token provided.',
    TOKEN_FAILED: 'Not authorized, token verification failed.',
    UNAUTHORIZED: 'User not authenticated.',
    REGISTRATION_FAILED: 'Registration failed.',
    LOGIN_FAILED: 'Login failed.',
  },

  // Permissions & Roles Messages
  PERMISSIONS: {
    ADMIN_REQUIRED: 'Access denied: Administrator privilege (Role 1) required.',
    AUTH_REQUIRED: 'Authentication required to access this resource.',
    PERMISSION_DENIED: (perm, num) => `Access denied: Permission flag [${perm} / ${num}] has not been granted by administrator.`,
    UPDATE_SUCCESS: 'Numeric permissions updated successfully.',
    ROLE_UPDATE_SUCCESS: 'User role updated successfully.',
    CREDITS_UPDATE_SUCCESS: 'Credits updated successfully.',
    REQUIRED_MASK: 'Numeric permissions bitmask required.',
    UPDATE_FAILED: 'Failed to update permissions.',
  },

  // User Management
  USER: {
    NOT_FOUND: 'User not found.',
    UPDATED: 'User updated successfully.',
    DELETED: 'User removed successfully.',
    FETCH_FAILED: 'Failed to fetch users.',
    UPDATE_FAILED: 'Failed to update user.',
    DELETE_FAILED: 'Failed to delete user.',
  },

  // Legal Research Messages
  RESEARCH: {
    QUESTION_REQUIRED: 'Legal question is required.',
    QUESTION_PROMPT_REQUIRED: 'Question prompt is required.',
    CREATE_SUCCESS: 'Legal research memorandum generated successfully.',
    FETCH_FAILED: 'Failed to fetch research items.',
    CREATE_FAILED: 'Failed to create research session.',
    AI_REASONING_ERROR: 'Legal AI legal reasoning error.',
  },

  // Judgment Search & Detail Messages
  JUDGMENT: {
    NOT_FOUND: 'Judgment not found.',
    SEARCH_FAILED: 'Failed to search judgments.',
    RETRIEVE_FAILED: 'Failed to retrieve judgment.',
  },

  // Document Messages
  DOCUMENT: {
    TITLE_REQUIRED: 'Document title/file name is required.',
    NOT_FOUND: 'Document not found.',
    FETCH_FAILED: 'Failed to fetch documents.',
    RETRIEVE_FAILED: 'Failed to retrieve document.',
    UPLOAD_SUCCESS: 'Document uploaded and indexed successfully.',
    UPLOAD_FAILED: 'Failed to upload document.',
    ACTION_SUCCESS: 'Document analysis executed successfully.',
    ACTION_FAILED: 'AI document analysis failed.',
  },

  // Contract Messages
  CONTRACT: {
    TITLE_REQUIRED: 'Contract title is required.',
    NOT_FOUND: 'Contract review not found.',
    FETCH_FAILED: 'Failed to fetch contracts.',
    RETRIEVE_FAILED: 'Failed to retrieve contract.',
    ANALYSIS_FAILED: 'Failed to analyze contract.',
  },

  // Matter Messages
  MATTER: {
    FIELDS_REQUIRED: 'Matter title and client name are required.',
    NOT_FOUND: 'Matter file not found.',
    FETCH_FAILED: 'Failed to fetch matters.',
    CREATE_FAILED: 'Failed to create matter.',
    CREATE_SUCCESS: 'Matter created successfully.',
  },

  // Task Messages
  TASK: {
    TASK_REQUIRED: 'Task title/description is required.',
    NOT_FOUND: 'Task not found.',
    FETCH_FAILED: 'Failed to fetch tasks.',
    CREATE_FAILED: 'Failed to create task.',
    CREATE_SUCCESS: 'Task created successfully.',
    UPDATE_SUCCESS: 'Task updated successfully.',
    UPDATE_FAILED: 'Failed to update task.',
    DELETE_SUCCESS: 'Task removed successfully.',
    DELETE_FAILED: 'Failed to delete task.',
  },

  // Calendar Event Messages
  EVENT: {
    TITLE_DATE_REQUIRED: 'Event title and date are required.',
    NOT_FOUND: 'Calendar event not found.',
    FETCH_FAILED: 'Failed to fetch calendar events.',
    CREATE_FAILED: 'Failed to create calendar event.',
    CREATE_SUCCESS: 'Calendar event scheduled successfully.',
    UPDATE_SUCCESS: 'Calendar event updated successfully.',
    UPDATE_FAILED: 'Failed to update calendar event.',
    DELETE_SUCCESS: 'Calendar event removed successfully.',
    DELETE_FAILED: 'Failed to delete calendar event.',
  },

  // AI Draft Messages
  DRAFT: {
    TYPE_CONTENT_REQUIRED: 'Draft type and content are required.',
    NOT_FOUND: 'Draft not found.',
    FETCH_FAILED: 'Failed to fetch drafts.',
    CREATE_FAILED: 'Failed to save draft.',
    CREATE_SUCCESS: 'Draft saved successfully.',
    DELETE_SUCCESS: 'Draft removed successfully.',
    DELETE_FAILED: 'Failed to delete draft.',
  },

  // Admin & System Stats
  STATS: {
    FETCH_FAILED: 'Failed to fetch system stats.',
  },

  // General Server Messages
  SERVER: {
    INTERNAL_ERROR: 'Internal Server Error',
    ONLINE: 'Legal AI Legal Intelligence Backend is online.',
  },
};

module.exports = APP_STRINGS;
