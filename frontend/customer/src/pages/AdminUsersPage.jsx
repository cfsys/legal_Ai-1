import React, { useState, useEffect } from 'react';
import { Users, Shield, Check, X, ShieldAlert, Award, Key, Trash2, Binary } from 'lucide-react';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_LABELS, PERMISSION_LIST, hasPermission } from '../constants/enums';
import { APP_STRINGS } from '../constants/appStrings';
import { toast } from '../context/ToastContext';

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.warn('Fallback users for admin management:', err.message);
      setUsers([
        {
          _id: 'user_admin',
          firstName: 'System',
          lastName: 'Administrator',
          email: 'admin@legalai.in',
          role: 1, // ROLES.ADMIN
          plan: 'Enterprise Admin',
          credits: 99999,
          permissions: 127,
        },
        {
          _id: 'user_cfsys',
          firstName: 'Chirag',
          lastName: 'Poshiya',
          email: 'cfsys.xyz@gmail.com',
          role: 2, // ROLES.CUSTOMER
          plan: 'Enterprise',
          credits: 500,
          permissions: 63,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle numeric permission bit: newMask = currentMask ^ bit
  const handleToggleNumericBit = async (userId, bitValue, bitLabel) => {
    const targetUser = users.find((u) => u._id === userId);
    if (!targetUser) return;

    const currentMask = typeof targetUser.permissions === 'number' ? targetUser.permissions : 63;
    const newMask = currentMask ^ bitValue; // bitwise XOR to toggle

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, permissions: newMask } : u))
    );

    try {
      await adminService.updatePermissions(userId, { numericMask: newMask });
      const msg = APP_STRINGS.ADMIN.PERMISSION_UPDATED(bitLabel, bitValue, newMask);
      setSaveMessage(msg);
      toast.success(msg, 'Permission Updated');
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (err) {
      setSaveMessage(APP_STRINGS.ADMIN.LOCAL_FALLBACK);
      toast.error(err.friendlyMessage || 'Failed to update user permission');
      setTimeout(() => setSaveMessage(''), 2500);
    }
  };

  // Toggle numeric role (1 = Admin, 2 = Customer)
  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = (currentRole === 1 || currentRole === 'admin') ? ROLES.CUSTOMER : ROLES.ADMIN;
    try {
      await adminService.updateUser(userId, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      const msg = APP_STRINGS.ADMIN.ROLE_UPDATED(ROLE_LABELS[newRole], newRole);
      setSaveMessage(msg);
      toast.success(msg, 'Role Updated');
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (err) {
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      toast.error(err.friendlyMessage || 'Failed to update user role');
    }
  };

  const handleAddCredits = async (userId, currentCredits) => {
    const newCredits = (currentCredits || 0) + 250;
    try {
      await adminService.updateUser(userId, { credits: newCredits });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, credits: newCredits } : u)));
      setSaveMessage(APP_STRINGS.ADMIN.CREDITS_ADDED);
      toast.success(APP_STRINGS.ADMIN.CREDITS_ADDED, 'AI Credits Added');
      setTimeout(() => setSaveMessage(''), 2500);
    } catch (err) {
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, credits: newCredits } : u)));
      toast.error(err.friendlyMessage || 'Failed to add credits');
    }
  };

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingBottom: '2.5rem',
      }}
    >
      {/* Top Banner (Matching modern workspace aesthetic) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={19} strokeWidth={2.2} />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Practitioners & Advocates Directory
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Manage practitioner accounts, role assignments, credit allocations, and granular RBAC permissions.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {saveMessage && (
            <div
              style={{
                backgroundColor: '#ecfdf5',
                color: '#059669',
                border: '1px solid #a7f3d0',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              {saveMessage}
            </div>
          )}
        </div>
      </div>

      {/* Users & Permissions Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Registered Users ({users.length})
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {APP_STRINGS.ADMIN.BIT_HINT}
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem 1.5rem' }}>USER</th>
              <th style={{ padding: '1rem 1rem' }}>ROLE (NUM)</th>
              <th style={{ padding: '1rem 1rem' }}>MASK</th>
              {PERMISSION_LIST.map((p) => (
                <th key={p.key} style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                  {p.label.toUpperCase()} [{p.bit}]
                </th>
              ))}
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const roleNumber = typeof u.role === 'number' ? u.role : (u.role === 'admin' ? 1 : 2);
              const isAdmin = roleNumber === ROLES.ADMIN; // 1
              const mask = typeof u.permissions === 'number' ? u.permissions : (isAdmin ? 127 : 63);

              return (
                <tr key={u._id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '0.85rem' }}>
                  {/* User info */}
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      {u.firstName} {u.lastName}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.775rem' }}>{u.email}</div>
                  </td>

                  {/* Role */}
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <button
                      onClick={() => handleRoleToggle(u._id, roleNumber)}
                      title="Click to switch numeric role (1 <-> 2)"
                      style={{
                        padding: '3px 9px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: isAdmin ? '#dbeafe' : '#f1f5f9',
                        color: isAdmin ? '#1e40af' : '#475569',
                      }}
                    >
                      {ROLE_LABELS[roleNumber] || 'Customer'} ({roleNumber})
                    </button>
                  </td>

                  {/* Numeric Bitmask */}
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '2px 7px', borderRadius: '4px', color: '#1e293b' }}>
                      {mask}
                    </span>
                  </td>

                  {/* Permission Bit Toggles */}
                  {PERMISSION_LIST.map((p) => {
                    const isGranted = isAdmin || hasPermission(mask, p.bit);
                    return (
                      <td key={p.key} style={{ padding: '1.25rem 0.75rem', textAlign: 'center' }}>
                        <button
                          onClick={() => !isAdmin && handleToggleNumericBit(u._id, p.bit, p.label)}
                          disabled={isAdmin}
                          title={isAdmin ? 'Admin has all permissions by default' : `Toggle Bit ${p.bit}`}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: `1px solid ${isGranted ? '#a7f3d0' : '#e2e8f0'}`,
                            backgroundColor: isGranted ? '#ecfdf5' : '#f8fafc',
                            color: isGranted ? '#059669' : '#94a3b8',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isAdmin ? 'default' : 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isGranted ? <Check size={16} strokeWidth={2.5} /> : <X size={14} />}
                        </button>
                      </td>
                    );
                  })}

                  {/* Action buttons */}
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleAddCredits(u._id, u.credits)}
                      className="btn-social"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', gap: '0.3rem' }}
                    >
                      <span>+250 Cr</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
