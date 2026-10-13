// Frontend API Service for Legal AI Enterprise Admin Platform

const API_BASE = import.meta.env?.VITE_API_BASE || '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('legal_ai_admin_token');

  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      cache: 'no-store',
      headers,
    });

    const text = await res.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!res.ok) {
      if (res.status === 401 && !endpoint.includes('login')) {
        localStorage.removeItem('legal_ai_admin_token');
        localStorage.removeItem('legal_ai_admin_user');
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`[API] Call to ${endpoint} failed:`, error.message);
    throw error;
  }
}

export const adminApi = {
  // Dedicated Admin Side Login API
  login: (identifier, password) => request('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: identifier, username: identifier, password }),
  }),
  getMe: () => request('/admin/auth/me'),

  // Overview & Database
  getOverview: () => request('/admin/overview'),
  getDbStatus: () => request('/admin/db-status'),
  connectCustomDb: (mongoUri) => request('/admin/connect-db', {
    method: 'POST',
    body: JSON.stringify({ mongoUri }),
  }),

  // Users
  getUsers: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.firmId) query.append('firmId', params.firmId);
    if (params.role) query.append('role', params.role);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const queryString = query.toString();
    return request(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getUser: (id) => request(`/admin/users/${id}`),
  getUserLoginHistory: (id) => request(`/admin/users/${id}/login-history`),

  createUser: (data) => request('/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateUser: (id, data) => request(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  updateUserPermissions: (id, { permissions, permissionsMap, numericMask }) => request(`/admin/users/${id}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissions, permissionsMap, numericMask }),
  }),

  allocateCredits: (id, amount, reason) => request(`/admin/users/${id}/credits`, {
    method: 'POST',
    body: JSON.stringify({ amount, reason }),
  }),

  deleteUser: (id) => request(`/admin/users/${id}`, {
    method: 'DELETE',
  }),

  // Multi-Tenant Law Firms
  getFirms: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return request(`/admin/firms${qs ? `?${qs}` : ''}`);
  },
  getFirm: (id) => request(`/admin/firms/${id}`),
  createFirm: (data) => request('/admin/firms', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Permissions Matrix
  getPermissionsMatrix: () => request('/admin/permissions-matrix'),

  // Security & Audit Logs
  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.action) query.append('action', params.action);
    if (params.limit) query.append('limit', params.limit);
    const queryString = query.toString();
    return request(`/admin/audit-logs${queryString ? `?${queryString}` : ''}`);
  },

  // AI Models & Quotas
  getAiQuotas: () => request('/admin/ai-quotas'),

  // Sub-Admins & CRUD Delegation (Super Admin)
  getSubAdmins: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.role) query.append('role', params.role);
    if (params.status !== undefined && params.status !== '') query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const qs = query.toString();
    return request(`/admin/sub-admins${qs ? `?${qs}` : ''}`);
  },
  createSubAdmin: (data) => request('/admin/sub-admins', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSubAdmin: (id, data) => request(`/admin/sub-admins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  updateSubAdminPermissions: (id, permissions) => request(`/admin/sub-admins/${id}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissions }),
  }),
  deleteSubAdmin: (id) => request(`/admin/sub-admins/${id}`, {
    method: 'DELETE',
  }),

  // Admin Roles (Atlas Synchronized)
  getRoles: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const qs = query.toString();
    return request(`/admin/roles${qs ? `?${qs}` : ''}`);
  },
  createRole: (data) => request('/admin/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateRole: (id, data) => request(`/admin/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteRole: (id) => request(`/admin/roles/${id}`, {
    method: 'DELETE',
  }),
  applyRole: (data) => request('/admin/apply-role', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Legal System Modules from existing Legal AI Platform
  getSystemModules: () => request('/admin/modules'),

  // Masters Data Management
  getMasterCategories: () => request('/admin/masters/categories'),
  getMasterData: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const queryString = query.toString();
    return request(`/admin/masters${queryString ? `?${queryString}` : ''}`);
  },
  createMasterData: (data) => request('/admin/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMasterData: (id, data) => request(`/admin/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteMasterData: (id) => request(`/admin/masters/${id}`, {
    method: 'DELETE',
  }),

  // Organisation Settings
  getOrganisation: () => request('/admin/organisation'),
  updateOrganisation: (data) => request('/admin/organisation', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Subscriptions & Usage
  getSubscriptions: () => request('/admin/subscriptions'),
  updateSubscriptions: (data) => request('/admin/subscriptions', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getUsage: () => request('/admin/usage'),

  // Security Policies
  getSecuritySettings: () => request('/admin/security'),
  updateSecuritySettings: (data) => request('/admin/security', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Integrations
  getIntegrations: () => request('/admin/integrations'),
  updateIntegration: (id, data) => request(`/admin/integrations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Customer Inquiries & Demo Requests
  getLeads: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.kind) query.append('kind', params.kind);
    if (params.status) query.append('status', params.status);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const queryString = query.toString();
    return request(`/admin/leads${queryString ? `?${queryString}` : ''}`);
  },
  updateLead: (id, data) => request(`/admin/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteLead: (id) => request(`/admin/leads/${id}`, {
    method: 'DELETE',
  }),

  // Health
  checkHealth: () => request('/health'),
};
