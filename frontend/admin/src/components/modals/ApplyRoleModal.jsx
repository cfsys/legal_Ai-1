import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import CustomDropdown from '../CustomDropdown';
import { X, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ApplyRoleModal({ targetUser, onUpdated }) {
  const { closeModal, addToast } = useAdmin();

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(
    targetUser?.role || targetUser?.roleTitle || 'Operations Sub-Admin'
  );
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRoles = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await adminApi.getRoles();
      if (res?.success && res.roles) {
        setRoles(res.roles);
        if (isManual) {
          addToast('Role templates refreshed from database', 'success');
        }
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
      if (isManual) {
        addToast('Failed to refresh roles: ' + err.message, 'error');
      }
    } finally {
      if (isManual) setIsRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRoles(false);
  }, [fetchRoles]);

  const activeRoleData = roles.find((r) => r.name === selectedRole) || {
    permissions: targetUser?.permissions || {
      canView: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
    },
  };

  const handleApply = async () => {
    if (!targetUser?.id) return;

    setLoading(true);
    try {
      if (targetUser.username !== undefined || targetUser.assignedBy !== undefined) {
        const res = await adminApi.updateSubAdmin(targetUser.id, {
          role: selectedRole,
          permissions: activeRoleData.permissions,
        });
        if (res.success) {
          addToast(`Role '${selectedRole}' applied to ${targetUser.fullName || targetUser.username} and saved to Atlas!`);
          if (onUpdated) onUpdated();
          closeModal();
        }
      } else {
        const res = await adminApi.updateUser(targetUser.id, {
          role: selectedRole,
        });
        if (res.success) {
          addToast(`Role '${selectedRole}' applied successfully!`);
          if (onUpdated) onUpdated();
          closeModal();
        }
      }
    } catch (err) {
      addToast('Failed to apply role: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = roles.map((r) => ({
    value: r.name,
    label: r.name,
  }));

  const p = activeRoleData?.permissions || {};

  return (
    <div className="drawer-backdrop" onClick={closeModal}>
      <div
        className="drawer-content"
        style={{ maxWidth: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#111827', margin: 0 }}>
              Apply Role
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0.2rem 0 0 0' }}>
              Assign role & permissions to <strong>{targetUser?.fullName || targetUser?.username}</strong>
            </p>
          </div>

          <button
            onClick={closeModal}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#ffffff',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#374151', marginBottom: '0.35rem' }}>
              Select Role Template
            </label>
            <CustomDropdown
              options={roleOptions}
              value={selectedRole}
              onChange={(val) => setSelectedRole(val)}
              placeholder="Select role..."
              searchPlaceholder="Search role from backend..."
              onSearch={async (query) => {
                const res = await adminApi.getRoles({ search: query });
                if (res.success && res.roles) {
                  return res.roles.map((r) => ({ value: r.name, label: r.name, subtext: r.code }));
                }
              }}
            />
          </div>

          {activeRoleData?.description && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                fontSize: '0.82rem',
                color: '#4b5563',
              }}
            >
              {activeRoleData.description}
            </div>
          )}

          {/* Permissions Overview Card */}
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1.25rem',
              backgroundColor: '#ffffff',
            }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', margin: '0 0 0.5rem 0' }}>
              Role Capabilities
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              <div
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: p.canView ? '#eff6ff' : '#f9fafb',
                  color: p.canView ? '#1e40af' : '#9ca3af',
                  border: p.canView ? '1px solid #bfdbfe' : '1px solid #e5e7eb',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Read: {p.canView ? 'YES' : 'NO'}
              </div>

              <div
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: p.canCreate ? '#eff6ff' : '#f9fafb',
                  color: p.canCreate ? '#1e40af' : '#9ca3af',
                  border: p.canCreate ? '1px solid #bfdbfe' : '1px solid #e5e7eb',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Create: {p.canCreate ? 'YES' : 'NO'}
              </div>

              <div
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: p.canEdit ? '#eff6ff' : '#f9fafb',
                  color: p.canEdit ? '#1e40af' : '#9ca3af',
                  border: p.canEdit ? '1px solid #bfdbfe' : '1px solid #e5e7eb',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Edit: {p.canEdit ? 'YES' : 'NO'}
              </div>

              <div
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: p.canDelete ? '#eff6ff' : '#f9fafb',
                  color: p.canDelete ? '#1e40af' : '#9ca3af',
                  border: p.canDelete ? '1px solid #bfdbfe' : '1px solid #e5e7eb',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Delete: {p.canDelete ? 'YES' : 'NO'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <button
            type="button"
            onClick={() => fetchRoles(true)}
            disabled={loading || isRefreshing}
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#475569',
              padding: '0.55rem 0.95rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: isRefreshing || loading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
            title="Refresh role templates from database"
            onMouseEnter={(e) => {
              if (!isRefreshing && !loading) {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#0f172a';
              }
            }}
            onMouseLeave={(e) => {
              if (!isRefreshing && !loading) {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#475569';
              }
            }}
          >
            <RefreshCw
              size={13}
              className={isRefreshing ? 'animate-spin' : ''}
            />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={closeModal}
              disabled={loading || isRefreshing}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#374151',
                padding: '0.55rem 1.25rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: loading || isRefreshing ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={loading || isRefreshing}
              style={{
                backgroundColor: '#4f46e5',
                border: 'none',
                color: '#ffffff',
                padding: '0.55rem 1.35rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: loading || isRefreshing ? 'not-allowed' : 'pointer',
                opacity: loading || isRefreshing ? 0.7 : 1,
              }}
            >
              {loading ? 'Applying...' : 'Apply Role'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
