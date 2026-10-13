// Centralized Frontend AppStrings & Display Messages

export const APP_STRINGS = {
  // Brand & Slogans
  BRAND: {
    NAME: 'Legal AI',
    SLOGAN_LINE1: 'Legal Intelligence.',
    SLOGAN_LINE2: 'Reimagined.',
    HERO_SUBTITLE: 'Research Indian law, discover judgments, analyse documents and draft — in one intelligent workspace.',
    TAGLINE: 'AI-Powered Legal Research & Analytics',
    COPYRIGHT: '© 2026 Legal AI · Indian Law & Precedents',
  },

  // Auth & Login/Register Screen Messages
  AUTH: {
    CREATE_ACCOUNT_TITLE: 'Create account',
    CREATE_ACCOUNT_SUBTITLE: 'Start your free Legal AI workspace.',
    WELCOME_BACK_TITLE: 'Welcome back',
    WELCOME_BACK_SUBTITLE: 'Sign in to your Legal AI workspace.',
    FIELDS_REQUIRED: 'Please fill in all mandatory fields.',
    EMAIL_PASSWORD_REQUIRED: 'Please provide both email and password.',
    PASSWORDS_MISMATCH: 'Passwords do not match.',
    TERMS_REQUIRED: 'Please agree to the Terms of Use and Privacy Policy to proceed.',
    SIGNIN_SUCCESS: 'Signed in successfully.',
    LOGIN_FAILED: 'Invalid email or password.',
    REGISTRATION_FAILED: 'Failed to create account.',
    FORGOT_PASSWORD_SENT: 'Password reset link has been dispatched to your email.',
    MICROSOFT_AUTH_CONNECTED: 'Microsoft OAuth authentication connected.',
    GOOGLE_AUTH_FAILED: 'Google authentication failed.',
    SAVED_TO_MATTER: 'Precedent saved to Matter briefcase.',
    BOOKMARKED: 'Saved to practitioner bookmarks.',
    COPIED_TO_CLIPBOARD: 'Copied to clipboard!',
  },

  // Admin & User Permissions Messages
  ADMIN: {
    PAGE_TITLE: 'Administration & Numeric Permissions',
    PAGE_SUBTITLE: 'Roles and permissions are stored as numbers: Admin (1), Customer (2), with bitmask flags [1, 2, 4, 8, 16, 32].',
    BADGE: 'NUMERIC PERMISSIONS ARCHITECTURE',
    TABLE_HEADER: 'Registered Users',
    BIT_HINT: 'Click bit toggles to dynamically recalculate numeric masks in MongoDB',
    PERMISSION_UPDATED: (label, bit, newMask) => `Updated ${label} [Bit: ${bit}] ➔ New Mask: ${newMask}`,
    ROLE_UPDATED: (roleName, roleCode) => `Role updated to ${roleName} [Code: ${roleCode}]`,
    CREDITS_ADDED: '+250 credits added successfully.',
    LOCAL_FALLBACK: 'Permission updated locally.',
    FETCH_FAILED: 'Failed to retrieve registered users list.',
  },

  // Dashboard Messages
  DASHBOARD: {
    GREETING: (name) => `Good morning, ${name}`,
    WELCOME_MSG: 'Welcome to your Legal AI workspace. All judicial archives and analysis engines are ready.',
    STATUS_BADGE: 'WORKSPACE ACTIVE · INDIAN JURISDICTION',
    NO_MATTERS: 'No matters yet',
    NO_MATTERS_DESC: 'Create your first matter to organise your work.',
    NO_RESEARCH: 'No research yet',
    NO_RESEARCH_DESC: 'Start your first legal research session.',
    ASK_AI_BUTTON: 'Ask Legal AI',
  },

  // Ask Legal AI
  AI_CHAT: {
    TITLE: 'Ask Legal AI a legal question...',
    SUBTITLE: 'Research issues, find judgments, analyse documents, review contracts and draft — all grounded in Indian law.',
    ANALYZING: 'Legal AI Reasoning Engine is analyzing...',
    ANALYZING_SUB: 'Scanning Indian Supreme Court, High Courts, and Central Acts',
    DISCLAIMER: 'Legal AI is AI-assisted and may be inaccurate. Verify with a qualified professional.',
    PROMPT_PLACEHOLDER: 'Ask Legal AI a legal question...',
    RESET: 'Reset',
    COPY: 'Copy',
    COPIED: 'Copied to clipboard!',
    SAVED_TO_BRIEFCASE: 'Saved to Matters briefcase.',
  },

  // Judgments Search & Detail
  JUDGMENTS: {
    FILTER_ACTIVE: 'Filter drawer: Act, Judge, Bench, and Date filters active.',
    SAVED_BOOKMARKS: 'Judgment saved to bookmarks.',
    SAVED_BRIEFCASE: 'Judgment added to Matter briefcase.',
    ASK_PROMPT: 'Ask This Judgment: What would you like to query regarding this precedent?',
    COMPARATOR_ACTIVE: 'Precedent comparator active: Select another judgment to compare doctrines.',
    DOWNLOADING_CITATION: 'Downloading official citation copy...',
  },

  // Document Analysis
  DOCUMENTS: {
    TITLE: 'Documents',
    SUBTITLE: 'Upload and analyse legal documents.',
    UPLOAD_TITLE: 'Upload Legal Document',
    UPLOAD_SUBTITLE: 'Files will be scanned and structured by Legal AI.',
    ANALYZING_MSG: 'Analyzing document clauses...',
    DEFAULT_HINT: 'Select an action above or ask a question about this document.',
    UPLOAD_PROCESSED: 'Document upload processed and indexed.',
  },

  // Contract Review
  CONTRACTS: {
    TITLE: 'Contract Review',
    SUBTITLE: 'AI-powered risk analysis and redline recommendations for your agreements.',
    COMPARE_ACTIVE: 'Contract comparison tool enabled.',
    NEW_MODAL_TITLE: 'New Contract Risk Review',
    NEW_MODAL_SUBTITLE: 'Select agreement type to compute risk scoring and clause redlines.',
  },

  // Research
  RESEARCH: {
    QUESTION_REQUIRED: 'Please formulate a legal question.',
  },
};

export default APP_STRINGS;
