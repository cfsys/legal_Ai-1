import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import CustomDropdown from '../CustomDropdown';
import { createDefaultCategoryPermissions } from '../../constants/masterCategories';
import { X, Shield, Sliders, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export default function EditSubAdminModal({ subAdmin, onUpdated }) {
  const { closeModal, addToast } = useAdmin();

  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    username: subAdmin?.username || '',
    email: subAdmin?.email || '',
    name: subAdmin?.fullName || subAdmin?.name || '',
    password: '',
    role: subAdmin?.role || subAdmin?.roleTitle || 'Super Admin',
    status: subAdmin?.status === 1 ? 'Active' : 'Suspended',
  });

  const [loading, setLoading] = useState(false);

  const [customizePermissions, setCustomizePermissions] = useState(() => {
    // Check if subadmin already has customized master permissions
    return Boolean(
      subAdmin?.permissions?.modules?.masters?.categories ||
      subAdmin?.permissions?.modules?.masters?.access === 'custom'
    );
  });

  const [categoryPermissions, setCategoryPermissions] = useState(() => {
    const existing = subAdmin?.permissions?.modules?.masters?.categories;
    if (existing && typeof existing === 'object') {
      const base = createDefaultCategoryPermissions();
      Object.keys(existing).forEach((k) => {
        base[k] = {
          read: Boolean(existing[k]?.read ?? existing[k]?.canView),
          create: Boolean(existing[k]?.create ?? existing[k]?.canCreate),
          edit: Boolean(existing[k]?.edit ?? existing[k]?.canEdit),
          delete: Boolean(existing[k]?.delete ?? existing[k]?.canDelete),
        };
      });
      return base;
    }
    return createDefaultCategoryPermissions({
      read: Boolean(subAdmin?.permissions?.modules?.masters?.read ?? subAdmin?.permissions?.canView ?? true),
      create: Boolean(subAdmin?.permissions?.modules?.masters?.create ?? subAdmin?.permissions?.canCreate ?? false),
      edit: Boolean(subAdmin?.permissions?.modules?.masters?.edit ?? subAdmin?.permissions?.canEdit ?? false),
      delete: Boolean(subAdmin?.permissions?.modules?.masters?.delete ?? subAdmin?.permissions?.canDelete ?? false),
    });
  });

  const [mastersCRUD, setMastersCRUD] = useState(() => {
    const m = subAdmin?.permissions?.modules?.masters || {};
    return {
      read: Boolean(m.read ?? subAdmin?.permissions?.canView ?? true),
      create: Boolean(m.create ?? subAdmin?.permissions?.canCreate ?? false),
      edit: Boolean(m.edit ?? subAdmin?.permissions?.canEdit ?? false),
      delete: Boolean(m.delete ?? subAdmin?.permissions?.canDelete ?? false),
    };
  });

  // Fetch available roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await adminApi.getRoles();
        if (res.success && res.roles && res.roles.length > 0) {
          setRoles(res.roles);
        }
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleRoleChange = (roleName) => {
    setFormData((prev) => ({ ...prev, role: roleName }));
    const matched = roles.find((r) => r.name === roleName);
    if (!customizePermissions) {
      if (matched?.permissions?.modules?.masters?.categories) {
        setCategoryPermissions(matched.permissions.modules.masters.categories);
      }
      if (matched?.permissions?.modules?.masters) {
        const m = matched.permissions.modules.masters;
        setMastersCRUD({
          read: Boolean(m.read ?? m.canView ?? true),
          create: Boolean(m.create ?? m.canCreate ?? false),
          edit: Boolean(m.edit ?? m.canEdit ?? false),
          delete: Boolean(m.delete ?? m.canDelete ?? false),
        });
      }
    }
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

    const subAdminId = subAdmin?.id || subAdmin?._id;
    if (!subAdminId) {
      addToast('Administrator ID not found', 'error');
      return;
    }

    setLoading(true);
    try {
      const cleanUsername = formData.username.trim();
      const cleanEmail = formData.email.trim();
      const matchedRole = roles.find((r) => r.name === formData.role);

      let finalPermissions;
      if (customizePermissions) {
        const baseRolePerms = matchedRole?.permissions || subAdmin?.permissions || {};
        const baseModules = baseRolePerms.modules || {};
        finalPermissions = {
          canView: true,
          canCreate: Boolean(mastersCRUD.create || Object.values(categoryPermissions).some((c) => c.create)),
          canEdit: Boolean(mastersCRUD.edit || Object.values(categoryPermissions).some((c) => c.edit)),
          canDelete: Boolean(mastersCRUD.delete || Object.values(categoryPermissions).some((c) => c.delete)),
          modules: {
            ...baseModules,
            masters: {
              read: Boolean(mastersCRUD.read),
              canView: Boolean(mastersCRUD.read),
              create: Boolean(mastersCRUD.create),
              canCreate: Boolean(mastersCRUD.create),
              edit: Boolean(mastersCRUD.edit),
              canEdit: Boolean(mastersCRUD.edit),
              delete: Boolean(mastersCRUD.delete),
              canDelete: Boolean(mastersCRUD.delete),
              access: 'custom',
              categories: categoryPermissions,
            },
          },
        };
      } else {
        finalPermissions = matchedRole?.permissions || subAdmin?.permissions || {
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
        };
      }

      const payload = {
        username: cleanUsername,
        email: cleanEmail,
        name: formData.name.trim() || cleanUsername,
        fullName: formData.name.trim() || cleanUsername,
        role: formData.role,
        roleTitle: formData.role,
        code: matchedRole?.code || subAdmin?.code || 'SUPER_ADM',
        status: formData.status === 'Active' ? 1 : 3,
        permissions: finalPermissions,
      };

      if (formData.password && formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const res = await adminApi.updateSubAdmin(subAdminId, payload);

      if (res.success) {
        addToast(`Administrator '${formData.name.trim() || cleanUsername}' updated successfully!`);
        if (onUpdated) onUpdated();
        closeModal();
      } else {
        throw new Error(res.message || 'Failed to update administrator');
      }
    } catch (err) {
      addToast('Failed to update administrator: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = roles.map((r) => ({
    value: r.name,
    label: r.name,
  }));

  if (roleOptions.length === 0) {
    roleOptions.push({ value: formData.role || 'Super Admin', label: formData.role || 'Super Admin' });
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
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                Edit Administrator
              </h2>
            </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
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
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '0 0.75rem',
                  fontSize: '0.88rem',
                  color: '#111827',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
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
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '0 0.75rem',
                  fontSize: '0.88rem',
                  color: '#111827',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row 2: Full Name & New Password */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Karan Verma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '0 0.75rem',
                  fontSize: '0.88rem',
                  color: '#111827',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                Change Password (Optional)
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '0 0.75rem',
                  fontSize: '0.88rem',
                  color: '#111827',
                  backgroundColor: '#ffffff',
                  outline: 'none',
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
              <span>{loading ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
