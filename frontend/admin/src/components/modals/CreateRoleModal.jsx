import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import CustomDropdown from '../CustomDropdown';
import { createDefaultCategoryPermissions } from '../../constants/masterCategories';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const SYSTEM_MODULES = [
  { id: 'overview', name: 'Dashboard' },
  { id: 'users', name: 'Advocates' },
  { id: 'masters', name: 'Master Data' },
  { id: 'subadmins', name: 'Administrators' },
  { id: 'roles', name: 'Roles & Permissions' },
];

export default function CreateRoleModal({ onCreated }) {
  const { closeModal, addToast } = useAdmin();

  const [roleName, setRoleName] = useState('');
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(false);

  // Category permissions for Master Data
  const [categoryPermissions, setCategoryPermissions] = useState(() =>
    createDefaultCategoryPermissions({ read: true, create: false, edit: false, delete: false })
  );

  // Expanded modules state: tracking which accordion rows are open
  // By default, expand the first module (Master Data) like in reference screenshot
  const [expandedModules, setExpandedModules] = useState({
    masters: true,
  });

  // Permissions state: { [moduleId]: { read: bool, create: bool, edit: bool, delete: bool } }
  const [permissions, setPermissions] = useState(() => {
    const initial = {};
    SYSTEM_MODULES.forEach((m) => {
      initial[m.id] = {
        read: m.id === 'masters', // Pre-select read for masters as requested
        create: false,
        edit: false,
        delete: false,
      };
    });
    return initial;
  });

  const toggleExpand = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  // Check if all permissions for a module are active
  const isModuleAllChecked = (modId) => {
    const p = permissions[modId];
    return p && p.read && p.create && p.edit && p.delete;
  };

  // Check if at least one permission is active
  const isModuleAnyChecked = (modId) => {
    const p = permissions[modId];
    return p && (p.read || p.create || p.edit || p.delete);
  };

  // Toggle master module checkbox
  const handleToggleModule = (modId) => {
    const isCurrentlyAll = isModuleAllChecked(modId);
    const nextVal = !isCurrentlyAll;

    setPermissions((prev) => ({
      ...prev,
      [modId]: {
        read: nextVal,
        create: nextVal,
        edit: nextVal,
        delete: nextVal,
      },
    }));

    if (modId === 'masters') {
      const updatedCats = {};
      Object.keys(categoryPermissions).forEach((c) => {
        updatedCats[c] = {
          read: nextVal,
          create: nextVal,
          edit: nextVal,
          delete: nextVal,
        };
      });
      setCategoryPermissions(updatedCats);
    }

    // Auto expand when checked
    if (nextVal) {
      setExpandedModules((prev) => ({ ...prev, [modId]: true }));
    }
  };

  // Toggle individual CRUD action checkbox
  const handleToggleAction = (modId, action) => {
    setPermissions((prev) => ({
      ...prev,
      [modId]: {
        ...prev[modId],
        [action]: !prev[modId][action],
      },
    }));
  };

  // Global "Select all" toggle matching Screenshot 2
  const isAllGlobalChecked = SYSTEM_MODULES.every((m) => isModuleAllChecked(m.id));

  const handleToggleSelectAll = () => {
    const nextVal = !isAllGlobalChecked;
    const nextPerms = {};
    SYSTEM_MODULES.forEach((m) => {
      nextPerms[m.id] = {
        read: nextVal,
        create: nextVal,
        edit: nextVal,
        delete: nextVal,
      };
    });
    setPermissions(nextPerms);

    const updatedCats = {};
    Object.keys(categoryPermissions).forEach((c) => {
      updatedCats[c] = {
        read: nextVal,
        create: nextVal,
        edit: nextVal,
        delete: nextVal,
      };
    });
    setCategoryPermissions(updatedCats);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      addToast('Please enter a role name', 'error');
      return;
    }

    setLoading(true);
    try {
      const generatedCode = roleName.trim().toUpperCase().replace(/\s+/g, '_').slice(0, 10);

      // Build module permissions payload
      const modulesPayload = {};
      for (const mod of SYSTEM_MODULES) {
        const p = permissions[mod.id] || { read: false, create: false, edit: false, delete: false };
        const hasAny = p.read || p.create || p.edit || p.delete;
        const isFull = p.read && p.create && p.edit && p.delete;

        modulesPayload[mod.id] = {
          read: Boolean(p.read),
          canView: Boolean(p.read),
          create: Boolean(p.create),
          canCreate: Boolean(p.create),
          edit: Boolean(p.edit),
          canEdit: Boolean(p.edit),
          delete: Boolean(p.delete),
          canDelete: Boolean(p.delete),
          access: isFull ? 'full' : (p.read ? 'view' : (hasAny ? 'view' : 'none')),
          ...(mod.id === 'masters' ? { categories: categoryPermissions } : {}),
        };
      }

      const res = await adminApi.createRole({
        name: roleName.trim(),
        code: generatedCode,
        description: `${roleName.trim()} administrative role`,
        status,
        permissions: {
          canView: Object.values(modulesPayload).some((m) => m.canView),
          canCreate: Object.values(modulesPayload).some((m) => m.canCreate),
          canEdit: Object.values(modulesPayload).some((m) => m.canEdit),
          canDelete: Object.values(modulesPayload).some((m) => m.canDelete),
          modules: modulesPayload,
        },
      });

      if (res.success) {
        addToast(`Role '${roleName}' created successfully!`);
        if (onCreated) onCreated(res.role);
        closeModal();
      }
    } catch (err) {
      addToast('Failed to create role: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="drawer-backdrop" onClick={closeModal}>
      <div
        className="drawer-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '540px',
          maxWidth: '100vw',
          height: '100vh',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Header - Matching Screenshot 2: "New Admin Role" and close icon */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            flexShrink: 0,
          }}
        >
          <h2 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            New Admin Role
          </h2>

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

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: '1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.35rem',
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Top Form Fields: Role Name & Status side-by-side matching Screenshot 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '1rem', alignItems: 'flex-start' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '3px' }}>
                Role Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Partner / Legal Counsel"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                required
                style={{
                  width: '100%',
                  height: '36px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  padding: '0 10px',
                  fontSize: '0.84rem',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)';
                }}
              />
            </div>

            <div>
              <CustomDropdown
                label="Status"
                searchable={false}
                options={[
                  { value: 'Active', label: 'Active' },
                  { value: 'Inactive', label: 'Inactive' },
                ]}
                value={status}
                onChange={(val) => setStatus(val)}
              />
            </div>
          </div>

          {/* Permissions Section Header - Matching Screenshot 2 */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Permissions
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: 0, marginTop: '0.15rem' }}>
                  Choose what this role can access.
                </p>
              </div>

              {/* Select all checkbox matching Screenshot 2 */}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontSize: '0.82rem', color: '#374151', fontWeight: 500, userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={isAllGlobalChecked}
                  onChange={handleToggleSelectAll}
                  style={{ width: '15px', height: '15px', accentColor: '#2563eb', cursor: 'pointer' }}
                />
                <span>Select all</span>
              </label>
            </div>

            {/* Permissions Accordion Container - Matching Screenshot 2 */}
            <div
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
              }}
            >
              {SYSTEM_MODULES.map((mod, idx) => {
                const isExpanded = Boolean(expandedModules[mod.id]);
                const isAnyChecked = isModuleAnyChecked(mod.id);
                const isAllChecked = isModuleAllChecked(mod.id);
                const modPerms = permissions[mod.id] || { read: false, create: false, edit: false, delete: false };

                return (
                  <div
                    key={mod.id}
                    style={{
                      borderBottom: idx === SYSTEM_MODULES.length - 1 ? 'none' : '1px solid #f1f5f9',
                    }}
                  >
                    {/* Module Title Row with Master Checkbox & Right Chevron */}
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        backgroundColor: isExpanded ? '#fafafa' : '#ffffff',
                        transition: 'background-color 0.12s ease',
                      }}
                      onClick={() => toggleExpand(mod.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <input
                          type="checkbox"
                          checked={isAllChecked || isAnyChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleModule(mod.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#2563eb',
                            cursor: 'pointer',
                          }}
                        />
                        <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1f2937' }}>
                          {mod.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(mod.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    {/* Sub-Checkboxes: Read, Create, Edit, Delete (matching Screenshot 2) */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: '0.65rem 1rem 0.85rem 1rem',
                          backgroundColor: '#fafafa',
                          borderTop: '1px solid #f3f4f6',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.25rem',
                            flexWrap: 'wrap',
                            marginBottom: mod.id === 'masters' ? '0.5rem' : '0',
                          }}
                        >
                          {/* Read */}
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', userSelect: 'none' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(modPerms.read)}
                              onChange={() => handleToggleAction(mod.id, 'read')}
                              style={{ width: '15px', height: '15px', accentColor: '#2563eb', cursor: 'pointer' }}
                            />
                            <span
                              style={{
                                backgroundColor: modPerms.read ? '#2563eb' : '#f1f5f9',
                                color: modPerms.read ? '#ffffff' : '#64748b',
                                padding: '0.15rem 0.55rem',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                transition: 'all 0.12s ease',
                              }}
                            >
                              Read
                            </span>
                          </label>

                          {/* Create */}
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', userSelect: 'none' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(modPerms.create)}
                              onChange={() => handleToggleAction(mod.id, 'create')}
                              style={{ width: '15px', height: '15px', accentColor: '#2563eb', cursor: 'pointer' }}
                            />
                            <span
                              style={{
                                backgroundColor: modPerms.create ? '#2563eb' : '#f1f5f9',
                                color: modPerms.create ? '#ffffff' : '#64748b',
                                padding: '0.15rem 0.55rem',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                transition: 'all 0.12s ease',
                              }}
                            >
                              Create
                            </span>
                          </label>

                          {/* Edit */}
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', userSelect: 'none' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(modPerms.edit)}
                              onChange={() => handleToggleAction(mod.id, 'edit')}
                              style={{ width: '15px', height: '15px', accentColor: '#2563eb', cursor: 'pointer' }}
                            />
                            <span
                              style={{
                                backgroundColor: modPerms.edit ? '#2563eb' : '#f1f5f9',
                                color: modPerms.edit ? '#ffffff' : '#64748b',
                                padding: '0.15rem 0.55rem',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                transition: 'all 0.12s ease',
                              }}
                            >
                              Edit
                            </span>
                          </label>

                          {/* Delete */}
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', userSelect: 'none' }}>
                            <input
                              type="checkbox"
                              checked={Boolean(modPerms.delete)}
                              onChange={() => handleToggleAction(mod.id, 'delete')}
                              style={{ width: '15px', height: '15px', accentColor: '#2563eb', cursor: 'pointer' }}
                            />
                            <span
                              style={{
                                backgroundColor: modPerms.delete ? '#2563eb' : '#f1f5f9',
                                color: modPerms.delete ? '#ffffff' : '#64748b',
                                padding: '0.15rem 0.55rem',
                                borderRadius: '4px',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                transition: 'all 0.12s ease',
                              }}
                            >
                              Delete
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions - Save & Cancel */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.65rem 1.6rem',
                borderRadius: '8px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              <span>{loading ? 'Saving...' : 'Save Role'}</span>
            </button>

            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#374151',
                fontWeight: 600,
                fontSize: '0.88rem',
                border: '1px solid #d1d5db',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
