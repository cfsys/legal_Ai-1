import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { ROLES, PERMISSIONS, hasPermission as checkPermission } from '../constants/enums';
import { toast } from './ToastContext';
import { LogoutConfirmModal } from '../components/shared/LogoutConfirmModal';

const AuthContext = createContext();

// 2 hours session duration in milliseconds (2 hours * 60 mins * 60 secs * 1000 ms)
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('legal_ai_token') || null);
  const [loading, setLoading] = useState(true);

  // Helper to test if a session has expired (passed 2 hours or expired JWT)
  const isSessionExpired = (storedToken) => {
    const expiresAtStr = localStorage.getItem('legal_ai_session_expires_at');
    const loginTimeStr = localStorage.getItem('legal_ai_login_time');
    const now = Date.now();

    if (expiresAtStr) {
      const expiresAt = parseInt(expiresAtStr, 10);
      if (!isNaN(expiresAt) && now >= expiresAt) return true;
    }

    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      if (!isNaN(loginTime) && now - loginTime >= SESSION_DURATION_MS) return true;
    }

    // Also check decoded JWT token expiry claim if available
    if (storedToken) {
      try {
        const parts = storedToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.exp && now >= payload.exp * 1000) {
            return true;
          }
        }
      } catch (_) {}
    }

    return false;
  };

  // Helper to persist session with 2-hour lifetime
  const saveSession = (data) => {
    const now = Date.now();
    const expiresAt = now + SESSION_DURATION_MS;
    setUser(data);
    setToken(data.token);
    localStorage.setItem('legal_ai_token', data.token);
    localStorage.setItem('legal_ai_user', JSON.stringify(data));
    localStorage.setItem('legal_ai_login_time', String(now));
    localStorage.setItem('legal_ai_session_expires_at', String(expiresAt));
  };

  // Helper to clear session data from local storage
  const clearSession = (showNotification = false) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('legal_ai_token');
    localStorage.removeItem('legal_ai_user');
    localStorage.removeItem('legal_ai_login_time');
    localStorage.removeItem('legal_ai_session_expires_at');
    if (showNotification) {
      toast.info('Your 2-hour session has expired. Please sign in again.', 'Session Expired');
    }
  };

  // Initialize or verify user on load (with 2-hour timeout check)
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('legal_ai_token');
      const storedUser = localStorage.getItem('legal_ai_user');

      if (storedToken && storedUser) {
        if (isSessionExpired(storedToken)) {
          clearSession(true);
          setLoading(false);
          return;
        }

        // If login_time was not recorded yet, establish it now
        if (!localStorage.getItem('legal_ai_login_time')) {
          const now = Date.now();
          localStorage.setItem('legal_ai_login_time', String(now));
          localStorage.setItem('legal_ai_session_expires_at', String(now + SESSION_DURATION_MS));
        }

        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          const freshUser = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem('legal_ai_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Session verification fallback to stored session:', err.message);
          if (err.response?.status === 401) {
            clearSession(true);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Monitor 2-hour timeout: check every 30s and when window/tab is focused
  useEffect(() => {
    const checkActiveSession = () => {
      const storedToken = localStorage.getItem('legal_ai_token');
      if (storedToken && isSessionExpired(storedToken)) {
        clearSession(true);
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/app')) {
          window.location.href = '/login';
        }
      }
    };

    const intervalId = setInterval(checkActiveSession, 30 * 1000);

    const handleFocusOrVisible = () => {
      if (!document.hidden) {
        checkActiveSession();
      }
    };

    window.addEventListener('visibilitychange', handleFocusOrVisible);
    window.addEventListener('focus', handleFocusOrVisible);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('visibilitychange', handleFocusOrVisible);
      window.removeEventListener('focus', handleFocusOrVisible);
    };
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (data.requiresOtp) {
        toast.info(data.message || 'Security verification code dispatched to your email', 'Two-Factor Verification');
        return {
          success: true,
          requiresOtp: true,
          email: data.email,
          purpose: 'login',
        };
      }
      saveSession(data);
      toast.success(`Welcome back, ${data.firstName || data.email}!`, 'Signed In Successfully');
      return { success: true, user: data };
    } catch (error) {
      const msg = error.friendlyMessage || error.response?.data?.message || (error.isNetworkError ? 'Legal AI backend service is offline (port 5000).' : 'Login failed. Please check your credentials.');
      if (!error.isNetworkError) {
        toast.error(msg, 'Sign In Failed');
      }
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const data = await authService.register(formData);
      if (data.requiresOtp) {
        toast.info(data.message || 'A 6-digit verification code has been dispatched to your email.', 'Email Verification');
        return {
          success: true,
          requiresOtp: true,
          email: data.email,
          purpose: 'register',
        };
      }
      saveSession(data);
      toast.success('Your Legal AI workspace account has been created successfully!', 'Account Created');
      return { success: true, user: data };
    } catch (error) {
      const msg = error.friendlyMessage || error.response?.data?.message || (error.isNetworkError ? 'Legal AI backend service is offline (port 5000).' : 'Registration failed.');
      if (!error.isNetworkError) {
        toast.error(msg, 'Registration Failed');
      }
      return { success: false, message: msg };
    }
  };

  const verifyOtp = async (email, otp, purpose = 'login') => {
    try {
      const data = await authService.verifyOtp(email, otp, purpose);
      saveSession(data);
      toast.success(
        purpose === 'register' ? 'Account verified and ready to use!' : `Welcome back, ${data.firstName || data.email}!`,
        'Verification Successful'
      );
      return { success: true, user: data };
    } catch (error) {
      const msg = error.friendlyMessage || error.response?.data?.message || 'Invalid or expired verification code.';
      return { success: false, message: msg };
    }
  };

  const resendOtp = async (email, purpose = 'login') => {
    try {
      const data = await authService.resendOtp(email, purpose);
      toast.success('A fresh 6-digit verification code has been dispatched to your email.', 'Code Resent');
      return { success: true, message: data.message };
    } catch (error) {
      const msg = error.friendlyMessage || error.response?.data?.message || 'Failed to resend code.';
      toast.error(msg, 'Resend Failed');
      return { success: false, message: msg };
    }
  };

  const googleLogin = async (googleProfile) => {
    try {
      const data = await authService.googleLogin(googleProfile);
      saveSession(data);
      toast.success('Signed in with Google successfully!', 'Google Authentication');
      return { success: true, user: data };
    } catch (error) {
      const msg = error.friendlyMessage || error.response?.data?.message || 'Google Auth failed';
      if (!error.isNetworkError) {
        toast.error(msg, 'Google Auth Failed');
      }
      return { success: false, message: msg };
    }
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [pendingLogoutUrl, setPendingLogoutUrl] = useState('/');

  const promptLogout = (redirectUrl = '/') => {
    setPendingLogoutUrl(redirectUrl);
    setIsLogoutModalOpen(true);
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout(pendingLogoutUrl);
  };

  const logout = (redirectUrl = '/') => {
    clearSession(false);
    toast.info('You have been signed out of Legal AI.', 'Signed Out');
    if (redirectUrl && typeof window !== 'undefined') {
      window.location.href = redirectUrl;
    }
  };

  // Check if current user has permission (accepts bit number e.g. 1, or string key e.g. 'canResearch')
  const hasUserPermission = (permKeyOrBit) => {
    if (!user) return false;
    // Admin (role 1) has all permissions
    if (user.role === ROLES.ADMIN || user.role === 1 || user.role === 'admin') return true;

    let requiredBit = typeof permKeyOrBit === 'number' ? permKeyOrBit : null;

    if (!requiredBit) {
      const bitMap = {
        canResearch: PERMISSIONS.CAN_RESEARCH,
        canJudgments: PERMISSIONS.CAN_JUDGMENTS,
        canDocuments: PERMISSIONS.CAN_DOCUMENTS,
        canContracts: PERMISSIONS.CAN_CONTRACTS,
        canDrafting: PERMISSIONS.CAN_DRAFTING,
        canMatters: PERMISSIONS.CAN_MATTERS,
        canAdmin: PERMISSIONS.CAN_ADMIN,
      };
      requiredBit = bitMap[permKeyOrBit];
    }

    if (!requiredBit) return true;

    // Check numeric mask
    if (typeof user.permissions === 'number') {
      return checkPermission(user.permissions, requiredBit);
    }

    // Fallback if object
    if (user.permissionsMap && typeof user.permissionsMap === 'object') {
      return Boolean(user.permissionsMap[permKeyOrBit]);
    }
    if (user.permissions && typeof user.permissions === 'object') {
      return Boolean(user.permissions[permKeyOrBit]);
    }

    return true;
  };

  // Helper for quick demonstration
  const switchToDemoUser = (type = 'customer') => {
    const now = Date.now();
    localStorage.setItem('legal_ai_login_time', String(now));
    localStorage.setItem('legal_ai_session_expires_at', String(now + SESSION_DURATION_MS));
    if (type === 'admin') {
      const admin = {
        _id: 'user_admin',
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@legalai.in',
        role: ROLES.ADMIN, // 1
        plan: 'Enterprise Admin',
        credits: 99999,
        permissions: 127, // full numeric bitmask
        permissionsMap: {
          canResearch: true,
          canJudgments: true,
          canDocuments: true,
          canContracts: true,
          canDrafting: true,
          canMatters: true,
          canAdmin: true,
        },
      };
      setUser(admin);
      localStorage.setItem('legal_ai_user', JSON.stringify(admin));
    } else {
      const customer = {
        _id: 'user_cfsys',
        firstName: 'Chirag',
        lastName: 'Poshiya',
        email: 'cfsys.xyz@gmail.com',
        role: ROLES.CUSTOMER, // 2
        plan: 'Enterprise',
        credits: 500,
        permissions: 63, // numeric bitmask (1|2|4|8|16|32)
        permissionsMap: {
          canResearch: true,
          canJudgments: true,
          canDocuments: true,
          canContracts: true,
          canDrafting: true,
          canMatters: true,
          canAdmin: false,
        },
      };
      setUser(customer);
      localStorage.setItem('legal_ai_user', JSON.stringify(customer));
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      let updatedUser = { ...user, ...profileData };
      try {
        const res = await authService.updateProfile(profileData);
        const data = res?.data || res;
        if (data && (data.email || data._id)) {
          updatedUser = { ...user, ...data, ...profileData };
        }
      } catch (apiErr) {
        console.warn('API update fallback to local state:', apiErr.message);
      }
      setUser(updatedUser);
      localStorage.setItem('legal_ai_user', JSON.stringify(updatedUser));
      toast.success('Your profile details have been saved successfully!', 'Profile Updated');
      return { success: true, user: updatedUser };
    } catch (err) {
      toast.error(err.message || 'Failed to update profile', 'Update Error');
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        register,
        verifyOtp,
        resendOtp,
        googleLogin,
        logout,
        promptLogout,
        cancelLogout,
        confirmLogout,
        isLogoutModalOpen,
        hasPermission: hasUserPermission,
        switchToDemoUser,
        updateUserProfile,

      }}
    >
      {children}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        user={user}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
