import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, ServerOff } from 'lucide-react';

const ToastContext = createContext(null);

// Global subscriber set so non-React modules (like Axios interceptors in api.js) can trigger toasts without duplicates
const externalToastListeners = new Set();
let lastToastSignature = '';
let lastToastTimestamp = 0;

export const toast = {
  show: (options) => {
    externalToastListeners.forEach((listener) => listener(options));
  },
  success: (message, title = 'Success', duration = 3500) => {
    toast.show({ type: 'success', message, title, duration });
  },
  error: (message, title = 'Error', duration = 4500, isBackendOffline = false) => {
    toast.show({ type: 'error', message, title, duration, isBackendOffline });
  },
  warning: (message, title = 'Warning', duration = 4000) => {
    toast.show({ type: 'warning', message, title, duration });
  },
  info: (message, title = 'Information', duration = 3500) => {
    toast.show({ type: 'info', message, title, duration });
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 3500, isBackendOffline = false }) => {
    // Deduplication safeguard: Ignore identical toasts fired within 500ms
    const signature = `${type}:${title || ''}:${message || ''}`;
    const now = Date.now();
    if (signature === lastToastSignature && (now - lastToastTimestamp) < 500) {
      return;
    }
    lastToastSignature = signature;
    lastToastTimestamp = now;

    const id = now + Math.random().toString(36).substring(2, 9);
    const newToast = { id, type, title, message, duration, isBackendOffline };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  useEffect(() => {
    externalToastListeners.add(addToast);
    return () => {
      externalToastListeners.delete(addToast);
    };
  }, [addToast]);


  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toasts: [],
      addToast: toast.show,
      removeToast: () => {},
      toast,
    };
  }
  return {
    ...context,
    toast,
  };
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '24px',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        maxWidth: '440px',
        width: 'calc(100% - 48px)',
      }}
    >
      {toasts.map((item) => (
        <ToastItem key={item.id} item={item} onRemove={() => onRemove(item.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ item, onRemove }) => {
  const { type, title, message, isBackendOffline } = item;

  const styles = {
    success: {
      bg: '#ffffff',
      border: '1.5px solid #86efac',
      shadow: '0 10px 25px -4px rgba(22, 163, 74, 0.15), 0 4px 10px -2px rgba(22, 163, 74, 0.05)',
      titleColor: '#15803d',
      iconColor: '#16a34a',
      accentBg: '#f0fdf4',
      Icon: CheckCircle2,
    },
    error: {
      bg: '#ffffff',
      border: '1.5px solid #fca5a5',
      shadow: '0 10px 25px -4px rgba(220, 38, 38, 0.18), 0 4px 10px -2px rgba(220, 38, 38, 0.06)',
      titleColor: '#b91c1c',
      iconColor: '#dc2626',
      accentBg: '#fef2f2',
      Icon: isBackendOffline ? ServerOff : AlertCircle,
    },
    warning: {
      bg: '#ffffff',
      border: '1.5px solid #fde047',
      shadow: '0 10px 25px -4px rgba(202, 138, 4, 0.14), 0 4px 10px -2px rgba(202, 138, 4, 0.04)',
      titleColor: '#a16207',
      iconColor: '#d97706',
      accentBg: '#fefce8',
      Icon: AlertTriangle,
    },
    info: {
      bg: '#ffffff',
      border: '1.5px solid #93c5fd',
      shadow: '0 10px 25px -4px rgba(37, 99, 235, 0.14), 0 4px 10px -2px rgba(37, 99, 235, 0.04)',
      titleColor: '#1d4ed8',
      iconColor: '#2563eb',
      accentBg: '#eff6ff',
      Icon: Info,
    },
  };

  const current = styles[type] || styles.info;
  const IconComponent = current.Icon;

  return (
    <div
      style={{
        pointerEvents: 'auto',
        backgroundColor: current.bg,
        border: current.border,
        borderRadius: '0.75rem',
        boxShadow: current.shadow,
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        animation: 'toastSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: current.accentBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '1px',
        }}
      >
        <IconComponent size={18} color={current.iconColor} strokeWidth={2.2} />
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
        {title && (
          <h4
            style={{
              margin: '0 0 0.15rem 0',
              fontSize: '0.875rem',
              fontWeight: 700,
              color: current.titleColor,
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
            }}
          >
            {title}
          </h4>
        )}
        <p
          style={{
            margin: 0,
            fontSize: '0.815rem',
            color: '#475569',
            lineHeight: 1.45,
            wordBreak: 'break-word',
          }}
        >
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        style={{
          background: 'transparent',
          border: 'none',
          padding: '2px',
          cursor: 'pointer',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'color 0.15s ease, background-color 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#334155';
          e.currentTarget.style.backgroundColor = '#f1f5f9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#94a3b8';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export default ToastContext;
