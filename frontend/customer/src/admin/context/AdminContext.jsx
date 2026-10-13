import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../services/api';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem('legal_ai_admin_token') || '');
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('legal_ai_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const VALID_TABS = useMemo(() => [
    'overview',
    'users',
    'masters',
    'sub-admins',
    'admin-roles',
    'inquiries',
  ], []);

  const [currentTab, setCurrentTabState] = useState(() => {
    try {
      const pathname = window.location.pathname.replace(/^\/admin\/?/, '').trim().toLowerCase();
      if (pathname && ['overview', 'users', 'masters', 'sub-admins', 'admin-roles', 'inquiries'].includes(pathname)) {
        return pathname;
      }
      const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      if (hash && ['overview', 'users', 'masters', 'sub-admins', 'admin-roles', 'inquiries'].includes(hash)) {
        return hash;
      }
      const saved = localStorage.getItem('legal_ai_admin_tab');
      if (saved && ['overview', 'users', 'masters', 'sub-admins', 'admin-roles', 'inquiries'].includes(saved)) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'overview';
  });

  const setCurrentTab = useCallback((tab) => {
    if (VALID_TABS.includes(tab)) {
      setCurrentTabState(tab);
      try {
        localStorage.setItem('legal_ai_admin_tab', tab);
        const target = `/admin/${tab}`;
        if (window.location.pathname !== target) {
          window.history.pushState(null, '', target);
        }
      } catch {
        // Storage safe fallback
      }
    } else {
      setCurrentTabState(tab);
    }
  }, [VALID_TABS]);

  // Synchronize on mount and handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/admin\/?/, '').trim().toLowerCase();
      if (path && VALID_TABS.includes(path)) {
        setCurrentTabState(path);
        try {
          localStorage.setItem('legal_ai_admin_tab', path);
        } catch {}
      }
    };

    try {
      if (window.location.pathname.startsWith('/admin')) {
        const subpath = window.location.pathname.replace(/^\/admin\/?/, '').trim().toLowerCase();
        if (subpath && VALID_TABS.includes(subpath)) {
          setCurrentTabState(subpath);
        } else if (token && (!subpath || subpath === 'login')) {
          const targetTab = currentTab && VALID_TABS.includes(currentTab) ? currentTab : 'overview';
          setCurrentTabState(targetTab);
          window.history.replaceState(null, '', `/admin/${targetTab}`);
        }
      }
    } catch {}

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentTab, VALID_TABS]);

  const [selectedFirmId, setSelectedFirmId] = useState('');
  const [firms, setFirms] = useState([]);
  const [overview, setOverview] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [backendStatus, setBackendStatus] = useState({ online: true, port: 5000 });

  // Theme State: 'navy' (Themes AI Signature) | 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('legal_ai_theme') || 'navy');

  // Modal States
  const [activeModal, setActiveModal] = useState(null); // 'createUser' | 'createFirm' | 'permissions' | 'credits' | 'database'
  const [modalTargetUser, setModalTargetUser] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('legal_ai_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'navy' ? 'light' : 'navy'));
  };

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loginUser = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('legal_ai_admin_token', newToken);
    localStorage.setItem('legal_ai_admin_user', JSON.stringify(newUser));
  };

  const logoutUser = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('legal_ai_admin_token');
    localStorage.removeItem('legal_ai_admin_user');
    localStorage.removeItem('legal_ai_admin_tab');
    setCurrentTabState('overview');
    try {
      window.history.replaceState(null, '', '/admin');
    } catch {}
    addToast('You have been safely logged out');
  };

  const requestLogout = () => {
    setActiveModal('confirmLogout');
  };

  const refreshFirms = useCallback(async () => {
    try {
      const res = await adminApi.getFirms();
      if (res.success) {
        setFirms(res.firms);
      }
    } catch (err) {
      console.error('Error fetching firms:', err);
    }
  }, []);

  const refreshDbStatus = useCallback(async () => {
    try {
      const res = await adminApi.getDbStatus();
      if (res.success) {
        setDbStatus(res);
      }
    } catch (err) {
      console.warn('DB status error:', err);
    }
  }, []);

  const [usersVersion, setUsersVersion] = useState(0);

  const refreshUsers = useCallback(() => {
    setUsersVersion((prev) => prev + 1);
  }, []);

  const refreshOverview = useCallback(async () => {
    try {
      const res = await adminApi.getOverview();
      if (res.success) {
        setOverview(res.data);
        setBackendStatus({ online: true, port: 5000 });
      }
    } catch (err) {
      console.warn('Overview fetch error:', err);
      setBackendStatus({ online: false, port: 5000 });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (token) {
        setLoading(true);
        await refreshOverview();
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    init();
  }, [token, refreshOverview]);

  const openModal = (modalName, targetUser = null) => {
    setModalTargetUser(targetUser);
    setActiveModal(modalName);
  };

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalTargetUser(null);
  }, []);

  // Global Escape key handler to close any active modal
  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [activeModal, closeModal]);

  const isSuperAdmin = useMemo(() => {
    if (!user) return false;
    return (
      user.role === 1 ||
      user.role === 'Super Admin' ||
      user.roleTitle === 'Super Admin' ||
      user.code === 'SUPER_ADM' ||
      user.username === 'superadmin' ||
      user.email === 'admin@themes.ai'
    );
  }, [user]);

  const canAccessModule = useCallback(
    (moduleId) => {
      if (isSuperAdmin) return true;
      if (!user) return false;
      const modules = user.permissions?.modules || {};

      let mod = modules[moduleId];
      if (!mod && moduleId === 'admin-roles') mod = modules['roles'];
      if (!mod && moduleId === 'roles') mod = modules['admin-roles'];
      if (!mod && moduleId === 'sub-admins') mod = modules['subadmins'];
      if (!mod && moduleId === 'subadmins') mod = modules['sub-admins'];
      if (!mod && moduleId === 'firms') mod = modules['tenants'];
      if (!mod && moduleId === 'tenants') mod = modules['firms'];
      if (!mod && moduleId === 'permissions') mod = modules['roles'] || modules['subadmins'];
      if (!mod && moduleId === 'ai-quotas') mod = modules['reports'] || modules['system'];

      if (!mod) {
        return user.permissions?.canView !== false;
      }
      if (mod.access === 'none') return false;
      return Boolean(mod.access === 'view' || mod.access === 'full' || mod.canView === true || mod.read === true);
    },
    [isSuperAdmin, user]
  );

  const canPerform = useCallback(
    (moduleName, action = 'view') => {
      if (isSuperAdmin) return true;
      if (!user) return false;
      const modules = user.permissions?.modules || {};

      let mod = modules[moduleName];
      if (!mod && moduleName === 'sub-admins') mod = modules['subadmins'];
      if (!mod && moduleName === 'subadmins') mod = modules['sub-admins'];
      if (!mod && moduleName === 'admin-roles') mod = modules['roles'];
      if (!mod && moduleName === 'roles') mod = modules['admin-roles'];
      if (!mod && moduleName === 'firms') mod = modules['tenants'];
      if (!mod && moduleName === 'tenants') mod = modules['firms'];
      if (!mod && moduleName === 'advocates') mod = modules['users'];
      if (!mod && moduleName === 'users') mod = modules['advocates'];

      if (!mod) {
        if (action === 'create') return user.permissions?.canCreate !== false;
        if (action === 'edit') return user.permissions?.canEdit !== false;
        if (action === 'delete') return user.permissions?.canDelete !== false;
        return user.permissions?.canView !== false;
      }

      if (mod.access === 'none') return false;
      if (mod.access === 'full') return true;

      if (action === 'view' || action === 'read') {
        return Boolean(mod.read || mod.canView || mod.access === 'view' || mod.access === 'full');
      }
      if (action === 'create') return Boolean(mod.create || mod.canCreate);
      if (action === 'edit') return Boolean(mod.edit || mod.canEdit);
      if (action === 'delete') return Boolean(mod.delete || mod.canDelete);
      return false;
    },
    [isSuperAdmin, user]
  );

  return (
    <AdminContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        isSuperAdmin,
        canAccessModule,
        canPerform,
        loginUser,
        logoutUser,
        requestLogout,
        currentTab,
        setCurrentTab,
        selectedFirmId,
        setSelectedFirmId,
        firms,
        refreshFirms,
        overview,
        refreshOverview,
        usersVersion,
        refreshUsers,
        dbStatus,
        refreshDbStatus,
        theme,
        toggleTheme,
        loading,
        toasts,
        addToast,
        removeToast,
        activeModal,
        modalTargetUser,
        openModal,
        closeModal,
        backendStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
