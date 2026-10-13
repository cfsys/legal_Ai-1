import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useAdmin();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        zIndex: 200,
      }}
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        return (
          <div
            key={toast.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              border: '1px solid',
              borderColor: isError ? '#fecdd3' : '#bfdbfe',
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.1)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              minWidth: '280px',
              maxWidth: '420px',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {isError ? (
                <AlertTriangle size={18} style={{ color: '#e11d48' }} />
              ) : (
                <CheckCircle2 size={18} style={{ color: 'var(--accent-blue)' }} />
              )}
              <span style={{ fontWeight: 500 }}>{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
