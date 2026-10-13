import axios from 'axios';
import { toast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env?.VITE_API_BASE || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Attach Authorization header if token exists & log outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('legal_ai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.metadata = { startTime: Date.now() };

  console.log(
    `%c[Legal AI 🚀 API]%c ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    'color: #6366f1; font-weight: bold;',
    'color: inherit;',
    config.params || config.data ? { params: config.params, data: config.data } : ''
  );

  return config;
});

// Centralized Response & Network Error Interceptor with logging
api.interceptors.response.use(
  (response) => {
    const duration = response.config?.metadata?.startTime
      ? Date.now() - response.config.metadata.startTime
      : 0;

    console.log(
      `%c[Legal AI ✅ API]%c ${response.config?.method?.toUpperCase()} ${response.config?.url} -> %c${response.status} OK%c (${duration}ms)`,
      'color: #059669; font-weight: bold;',
      'color: inherit;',
      'color: #059669; font-weight: bold;',
      'color: #64748b;',
      response.data
    );

    return response;
  },
  (error) => {
    const duration = error.config?.metadata?.startTime
      ? Date.now() - error.config.metadata.startTime
      : 0;

    let friendlyMessage = 'An unexpected error occurred';
    let isNetworkError = false;

    // Detect if backend is offline / network failure / connection refused
    if (
      !error.response &&
      (error.code === 'ERR_NETWORK' ||
       error.message === 'Network Error' ||
       error.code === 'ECONNREFUSED')
    ) {
      isNetworkError = true;
      friendlyMessage = 'Legal AI backend service is offline or unreachable. Please verify that the backend server is running on port 5000.';
      toast.error(friendlyMessage, 'Backend Service Offline', 5000, true);
    } else if (error.code === 'ECONNABORTED') {
      friendlyMessage = 'Request timed out while connecting to the database. Please refresh or retry.';
      toast.error(friendlyMessage, 'Request Timeout', 4000, false);
    } else {
      const status = error.response.status;
      const backendMsg = error.response.data?.message;

      if (backendMsg) {
        friendlyMessage = backendMsg;
      } else if (status === 401) {
        friendlyMessage = 'Authentication required or 2-hour session expired. Please sign in again.';
        try {
          localStorage.removeItem('legal_ai_token');
          localStorage.removeItem('legal_ai_user');
          localStorage.removeItem('legal_ai_login_time');
          localStorage.removeItem('legal_ai_session_expires_at');
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/app')) {
            window.location.href = '/login';
          }
        } catch (_) {}
      } else if (status === 403) {
        friendlyMessage = 'Access denied. You do not have permission to perform this action.';
      } else if (status === 404) {
        friendlyMessage = 'The requested legal resource was not found.';
      } else if (status >= 500) {
        friendlyMessage = 'Legal AI backend encountered an error. Please try again.';
      }

      // Show toast on 5xx server failures
      if (status >= 500) {
        toast.error(friendlyMessage, 'Server Error');
      }
    }

    console.warn(
      `%c[Legal AI ❌ API]%c ${error.config?.method?.toUpperCase()} ${error.config?.url} -> %c${error.response?.status || 'NETWORK ERROR'}%c (${duration}ms): ${friendlyMessage}`,
      'color: #dc2626; font-weight: bold;',
      'color: inherit;',
      'color: #dc2626; font-weight: bold;',
      'color: #64748b;',
      error.response?.data || error.message
    );

    error.friendlyMessage = friendlyMessage;
    error.isNetworkError = isNetworkError;

    return Promise.reject(error);
  }
);


export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  verifyOtp: async (email, otp, purpose) => {
    const res = await api.post('/auth/verify-otp', { email, otp, purpose });
    return res.data;
  },
  resendOtp: async (email, purpose) => {
    const res = await api.post('/auth/resend-otp', { email, purpose });
    return res.data;
  },
  googleLogin: async (data) => {
    const res = await api.post('/auth/google', data);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },
};


export const judgmentService = {
  search: async (params) => {
    const res = await api.get('/judgments', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/judgments/${id}`);
    return res.data;
  },
};

export const researchService = {
  getAll: async () => {
    const res = await api.get('/research');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/research', data);
    return res.data;
  },
  ask: async (data) => {
    const res = await api.post('/research/ask', data);
    return res.data;
  },
};

export const documentService = {
  getAll: async (params) => {
    const res = await api.get('/documents', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/documents/${id}`);
    return res.data;
  },
  upload: async (data) => {
    const res = await api.post('/documents', data);
    return res.data;
  },
  runAction: async (id, action, question) => {
    const res = await api.post(`/documents/${id}/action`, { action, question });
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  },
};

export const contractService = {
  getAll: async () => {
    const res = await api.get('/contracts');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/contracts/${id}`);
    return res.data;
  },
  createReview: async (data) => {
    const res = await api.post('/contracts', data);
    return res.data;
  },
};

export const matterService = {
  getAll: async (params) => {
    const res = await api.get('/matters', { params });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/matters', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/matters/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/matters/${id}`);
    return res.data;
  },
};

export const taskService = {
  getAll: async (params) => {
    const res = await api.get('/tasks', { params });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/tasks', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};

export const eventService = {
  getAll: async () => {
    const res = await api.get('/events');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/events', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/events/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/events/${id}`);
    return res.data;
  },
};

export const draftService = {
  getAll: async () => {
    const res = await api.get('/drafts');
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/drafts', data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/drafts/${id}`);
    return res.data;
  },
};

export const adminService = {
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  updatePermissions: async (id, permissions) => {
    const res = await api.put(`/admin/users/${id}/permissions`, { permissions });
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
};

export const masterService = {
  getStats: async () => {
    const res = await api.get('/masters/stats');
    return res.data;
  },
  getItems: async (category, search) => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    const res = await api.get('/masters', { params });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/masters', data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/masters/${id}`);
    return res.data;
  },
};

export const inquiryService = {
  submit: async (data) => {
    const res = await api.post('/contact', data);
    return res.data;
  },
  getAll: async (params) => {
    const res = await api.get('/contact', { params });
    return res.data;
  },
  updateStatus: async (id, data) => {
    const res = await api.patch(`/contact/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/contact/${id}`);
    return res.data;
  },
};

export const searchService = {
  globalSearch: async (q = '') => {
    const res = await api.get('/search', { params: { q } });
    return res.data;
  },
};

export default api;
