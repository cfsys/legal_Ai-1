import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText,
  confirmLabel,
  cancelText = 'Cancel',
  danger = true,
  isDanger,
  confirmVariant,
  icon = null,
  isLoading = false,
  onConfirm,
  onCancel,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const origBodyOverflow = document.body.style.overflow;
    const origHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Hide sidebar and scrollbars so slidebar is not visible during confirm
    const sidebarEl = document.querySelector('.sidebar');
    const origSidebarVis = sidebarEl ? sidebarEl.style.visibility : '';
    if (sidebarEl) {
      sidebarEl.style.visibility = 'hidden';
    }

    const pageWrapper = document.querySelector('.page-wrapper');
    const origPageWrapperOverflow = pageWrapper ? pageWrapper.style.overflow : '';
    if (pageWrapper) {
      pageWrapper.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = origBodyOverflow;
      document.documentElement.style.overflow = origHtmlOverflow;
      if (sidebarEl) {
        sidebarEl.style.visibility = origSidebarVis;
      }
      if (pageWrapper) {
        pageWrapper.style.overflow = origPageWrapperOverflow;
      }
    };
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (onCancel) onCancel();
        else if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onCancel, onClose]);

  if (!isOpen) return null;

  const handleCancel = onCancel || onClose;
  const resolvedConfirmText = confirmText || confirmLabel || 'Confirm';
  const resolvedDanger = isDanger !== undefined ? isDanger : confirmVariant ? confirmVariant === 'danger' : danger;

  const modalNode = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          animation: 'scaleUp 0.15s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: resolvedDanger ? '#fef2f2' : '#f1f5f9',
              border: `1px solid ${resolvedDanger ? '#fee2e2' : '#e2e8f0'}`,
              color: resolvedDanger ? '#dc2626' : '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon ? icon : resolvedDanger ? <AlertTriangle size={22} /> : <Trash2 size={22} />}
          </div>

          <div style={{ flex: 1 }}>
            <h3
              style={{
                margin: 0,
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                margin: '0.4rem 0 0 0',
                fontSize: '0.86rem',
                color: '#64748b',
                lineHeight: 1.5,
              }}
            >
              {message}
            </p>
          </div>

          <button
            onClick={isLoading ? undefined : handleCancel}
            disabled={isLoading}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.25rem' }}>
          <button
            type="button"
            onClick={isLoading ? undefined : handleCancel}
            disabled={isLoading}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={isLoading ? undefined : onConfirm}
            disabled={isLoading}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: resolvedDanger ? '#dc2626' : '#0f172a',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.75 : 1,
              boxShadow: resolvedDanger ? '0 1px 3px rgba(220, 38, 38, 0.3)' : '0 1px 3px rgba(15, 23, 42, 0.2)',
              transition: 'background-color 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = resolvedDanger ? '#b91c1c' : '#1e293b')}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = resolvedDanger ? '#dc2626' : '#0f172a')}
          >
            {isLoading && (
              <span
                style={{
                  width: '13px',
                  height: '13px',
                  border: '2px solid #ffffff',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.65s linear infinite',
                  display: 'inline-block',
                }}
              />
            )}
            {resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
}
