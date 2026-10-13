import { toast } from '../context/ToastContext';

/**
 * Extracts a human-friendly error message from various error formats (Axios error, Error object, string)
 * @param {any} error 
 * @param {string} defaultMessage 
 * @returns {string}
 */
export const extractErrorMessage = (error, defaultMessage = 'An unexpected error occurred') => {
  if (!error) return defaultMessage;
  if (typeof error === 'string') return error;

  // Custom friendly message set by api interceptor
  if (error.friendlyMessage) return error.friendlyMessage;

  // Axios response data message
  if (error.response?.data?.message) return error.response.data.message;

  // Axios response data error string
  if (typeof error.response?.data?.error === 'string') return error.response.data.error;

  // Standard Error.message
  if (error.message) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return 'Legal AI backend service is offline. Please verify server status on port 5000.';
    }
    return error.message;
  }

  return defaultMessage;
};

/**
 * Common success toast helper
 * @param {string} message 
 * @param {string} title 
 * @param {number} duration 
 */
export const showSuccess = (message, title = 'Success', duration = 3500) => {
  return toast.success(message, title, duration);
};

/**
 * Common error toast and logger helper
 * @param {any} error 
 * @param {string} title 
 * @param {number} duration 
 */
export const showError = (error, title = 'Error', duration = 4500) => {
  const message = extractErrorMessage(error);
  return toast.error(message, title, duration);
};

/**
 * Common warning toast helper
 * @param {string} message 
 * @param {string} title 
 * @param {number} duration 
 */
export const showWarning = (message, title = 'Notice', duration = 4000) => {
  return toast.warning(message, title, duration);
};

/**
 * Common info toast helper
 * @param {string} message 
 * @param {string} title 
 * @param {number} duration 
 */
export const showInfo = (message, title = 'Information', duration = 3500) => {
  return toast.info(message, title, duration);
};

/**
 * Format date string into standard Indian legal format (e.g. 12 Jun 2026)
 * @param {Date|string} date 
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * Format INR currency (e.g. ₹2,499)
 * @param {number|string} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return `₹${amount}`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export default {
  extractErrorMessage,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  formatDate,
  formatCurrency,
};
