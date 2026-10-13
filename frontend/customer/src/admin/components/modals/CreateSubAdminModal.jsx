import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import CustomDropdown from '../CustomDropdown';
import { X, Shield } from 'lucide-react';

export default function CreateSubAdminModal({ onCreated }) {
  const { closeModal, addToast } = useAdmin();

  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    role: 'Super Admin',
    status: 'Active',
  });

  const [loading, setLoading] = useState(false);

  // Fetch available roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await adminApi.getRoles();
        if (res.success && res.roles && res.roles.length > 0) {
          setRoles(res.roles);
          // Default to first role or Super Admin
          const defaultRole = res.roles[0].name;
          setFormData((prev) => ({ ...prev, role: defaultRole }));
        }
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleRoleChange = (roleName) => {
    setFormData((prev) => ({ ...prev, role: roleName }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      addToast('Please enter a username', 'error');
      return;
    }
    if (!formData.email.trim()) {
      addToast('Please enter an email address', 'error');
      return;
    }
    if (!formData.password) {
      addToast('Please set a login password', 'error');
      return;
    }

    setLoading(true);
    try {
      const cleanUsername = formData.username.trim();
      const cleanEmail = formData.email.trim();
      const matchedRole = roles.find((r) => r.name === formData.role);

      const finalPermissions = matchedRole?.permissions || {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      };

      const res = await adminApi.createSubAdmin({
        username: cleanUsername,
        email: cleanEmail,
        name: formData.name.trim() || cleanUsername,
        fullName: formData.name.trim() || cleanUsername,
        password: formData.password,
        role: formData.role,
        roleTitle: formData.role,
        code: matchedRole?.code || 'SUPER_ADM',
        status: formData.status === 'Active' ? 1 : 3,
        permissions: finalPermissions,
      });

      if (res.success) {
        addToast(`Administrator '${cleanEmail}' created successfully with customized privileges!`);
        if (onCreated) onCreated();
        closeModal();
      }
    } catch (err) {
      addToast('Failed to create admin user: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = roles.map((r) => ({
    value: r.name,
    label: r.name,
  }));

  if (roleOptions.length === 0) {
    roleOptions.push({ value: 'Super Admin', label: 'Super Admin' });
  }

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '100%',
          overflow: 'visible',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={17} />
            </div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              New Administrator
            </h2>
          </div>

          <button
            onClick={closeModal}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#ffffff',
            borderRadius: '0 0 12px 12px',
            overflow: 'visible',
          }}
        >
          {/* Row 1: Username & Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '3px' }}>
                Username *
              </label>
              <input
                type="text"
                placeholder="e.g. karan_admin"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                style={{
                  width: '100%',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '0 10px',
                  fontSize: '0.84rem',
                  color: '#111827',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '3px' }}>
                Email Address *
              </label>
              <input
                type="email"
                placeholder="e.g. karan@lawfirm.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '0 10px',
                  fontSize: '0.84rem',
                  color: '#111827',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Row 2: Full Name & Password */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '3px' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Karan Verma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '0 10px',
                  fontSize: '0.84rem',
                  color: '#111827',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '3px' }}>
                Login Password *
              </label>
              <input
                type="password"
                placeholder="Set password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{
                  width: '100%',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '0 10px',
                  fontSize: '0.84rem',
                  color: '#111827',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Row 3: Role & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <CustomDropdown
                label="Assigned Role *"
                options={roleOptions}
                value={formData.role}
                onChange={handleRoleChange}
                placeholder="Select role..."
                searchPlaceholder="Search role from backend..."
                onSearch={async (query) => {
                  const res = await adminApi.getRoles({ search: query });
                  if (res.success && res.roles) {
                    return res.roles.map((r) => ({ value: r.name, label: r.name }));
                  }
                }}
              />
            </div>

            <div>
              <CustomDropdown
                label="Account Status *"
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Suspended', label: 'Inactive / Suspended' },
                ]}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
                searchPlaceholder="Search status..."
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#374151',
                fontWeight: 600,
                fontSize: '0.82rem',
                border: '1px solid #d1d5db',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '7px 18px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.82rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Shield size={15} />
              <span>{loading ? 'Creating...' : 'Create Administrator'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
