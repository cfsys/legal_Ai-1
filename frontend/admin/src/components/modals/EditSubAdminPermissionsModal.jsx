import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import { createDefaultCategoryPermissions } from '../../constants/masterCategories';
import {
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const SYSTEM_MODULES = [
  { id: 'overview', name: 'Dashboard', category: 'General' },
  { id: 'users', name: 'Advocates', category: 'Personnel' },
  { id: 'masters', name: 'Master Data', category: 'Legal Database' },
  { id: 'subadmins', name: 'Administrators', category: 'Governance' },
  { id: 'roles', name: 'Roles & Permissions', category: 'Governance' },
];

export default function EditSubAdminPermissionsModal({ subAdmin, onUpdated }) {
  const { closeModal, addToast } = useAdmin();

  const [expandedModules, setExpandedModules] = useState({
    masters: true,
    matters: false,
    documents: false,
    contracts: false,
    drafting: false,
  });

  // Category permissions for Master Data
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
      read: Boolean(subAdmin?.permissions?.modules?.masters?.read ?? subAdmin?.permissions?.canView),
      create: Boolean(subAdmin?.permissions?.modules?.masters?.create ?? subAdmin?.permissions?.canCreate),
      edit: Boolean(subAdmin?.permissions?.modules?.masters?.edit ?? subAdmin?.permissions?.canEdit),
      delete: Boolean(subAdmin?.permissions?.modules?.masters?.delete ?? subAdmin?.permissions?.canDelete),
    });
  });

  const [modulePermissions, setModulePermissions] = useState(() => {
    const existing = subAdmin?.permissions?.modules || {};
    const initial = {};
    SYSTEM_MODULES.forEach((mod) => {
      const p = existing[mod.id] || {};
      initial[mod.id] = {
        read: Boolean(p.read !== undefined ? p.read : (p.view !== undefined ? p.view : subAdmin?.permissions?.canView)),
        create: Boolean(p.create !== undefined ? p.create : (p.add !== undefined ? p.add : subAdmin?.permissions?.canCreate)),
        edit: Boolean(p.edit !== undefined ? p.edit : subAdmin?.permissions?.canEdit),
        delete: Boolean(p.delete !== undefined ? p.delete : subAdmin?.permissions?.canDelete),
      };
    });
    return initial;
  });

  const [loading, setLoading] = useState(false);

  const toggleAccordion = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handlePermissionToggle = (modId, permKey) => {
    setModulePermissions((prev) => ({
      ...prev,
      [modId]: {
        ...prev[modId],
        [permKey]: !prev[modId]?.[permKey],
      },
    }));
  };

  const handleModuleMasterToggle = (modId) => {
    const current = modulePermissions[modId] || {};
    const allChecked = current.read && current.create && current.edit && current.delete;
    const newVal = !allChecked;

    setModulePermissions((prev) => ({
      ...prev,
      [modId]: {
        read: newVal,
        create: newVal,
        edit: newVal,
        delete: newVal,
      },
    }));

    if (modId === 'masters') {
      const updatedCats = {};
      Object.keys(categoryPermissions).forEach((c) => {
        updatedCats[c] = {
          read: newVal,
          create: newVal,
          edit: newVal,
          delete: newVal,
        };
      });
      setCategoryPermissions(updatedCats);
    }
  };

  const isAllSelected = SYSTEM_MODULES.every((mod) => {
    const p = modulePermissions[mod.id] || {};
    return p.read && p.create && p.edit && p.delete;
  });

  const handleSelectAllToggle = () => {
    const newVal = !isAllSelected;
    const updated = {};
    SYSTEM_MODULES.forEach((mod) => {
      updated[mod.id] = {
        read: newVal,
        create: newVal,
        edit: newVal,
        delete: newVal,
      };
    });
    setModulePermissions(updated);

    const updatedCats = {};
    Object.keys(categoryPermissions).forEach((c) => {
      updatedCats[c] = {
        read: newVal,
        create: newVal,
        edit: newVal,
        delete: newVal,
      };
    });
    setCategoryPermissions(updatedCats);
  };

  const handleSave = async () => {
    if (!subAdmin?.id) return;
    setLoading(true);

    const canView = Object.values(modulePermissions).some((m) => m.read);
    const canCreate = Object.values(modulePermissions).some((m) => m.create);
    const canEdit = Object.values(modulePermissions).some((m) => m.edit);
    const canDelete = Object.values(modulePermissions).some((m) => m.delete);

    try {
      const modulesPayload = {
        ...modulePermissions,
        masters: {
          ...modulePermissions.masters,
          categories: categoryPermissions,
        },
      };

      const res = await adminApi.updateSubAdminPermissions(subAdmin.id, {
        canView,
        canCreate,
        canEdit,
        canDelete,
        modules: modulesPayload,
      });

      if (res.success) {
        addToast(`Module permissions updated for ${subAdmin.username || subAdmin.fullName}!`);
        if (onUpdated) onUpdated();
        closeModal();
      }
    } catch (err) {
      addToast('Failed to update permissions: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalReadCount = Object.values(modulePermissions).filter((m) => m.read).length;
  const totalCreateCount = Object.values(modulePermissions).filter((m) => m.create).length;
  const totalEditCount = Object.values(modulePermissions).filter((m) => m.edit).length;
  const totalDeleteCount = Object.values(modulePermissions).filter((m) => m.delete).length;

  return (
    <div className="drawer-backdrop" onClick={closeModal}>
      <div
        className="drawer-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Matching screenshot */}
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
              Edit Permissions: {subAdmin?.username || subAdmin?.fullName}
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '0.2rem 0 0 0' }}>
              Role: <strong style={{ color: '#374151' }}>{subAdmin?.role || 'Custom'}</strong> &bull; Status: {subAdmin?.status === 1 ? 'Active' : 'Inactive'}
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

        {/* Form / Content Body */}
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
          {/* Permissions Card - Matching screenshot */}
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1.25rem',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Card Header with Select All */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                  Permissions
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0.15rem 0 0 0' }}>
                  Choose what this admin user can access.
                </p>
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: '#374151',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllToggle}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#4f46e5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                />
                <span>Select all</span>
              </label>
            </div>

            {/* Module Accordion List */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {SYSTEM_MODULES.map((mod, idx) => {
                const perms = modulePermissions[mod.id] || {};
                const isExpanded = !!expandedModules[mod.id];
                const isFullyChecked = perms.read && perms.create && perms.edit && perms.delete;
                const isPartiallyChecked = !isFullyChecked && (perms.read || perms.create || perms.edit || perms.delete);
                const isLast = idx === SYSTEM_MODULES.length - 1;

                return (
                  <div
                    key={mod.id}
                    style={{
                      borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
                      padding: '0.65rem 0',
                    }}
                  >
                    {/* Module Title Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleAccordion(mod.id)}
                    >
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isFullyChecked}
                          ref={(el) => {
                            if (el) el.indeterminate = isPartiallyChecked;
                          }}
                          onChange={() => handleModuleMasterToggle(mod.id)}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#4f46e5',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        />
                        <span style={{ fontSize: '0.86rem', fontWeight: 500, color: '#1f2937' }}>
                          {mod.name}
                        </span>
                      </div>

                      <div style={{ color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {/* Sub-Actions (Read, Create, Edit, Delete) */}
                    {isExpanded && (
                      <div>
                        <div
                          style={{
                            paddingLeft: '1.65rem',
                            paddingTop: '0.65rem',
                            paddingBottom: '0.35rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.75rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              fontSize: '0.82rem',
                              color: '#4b5563',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={perms.read || false}
                              onChange={() => handlePermissionToggle(mod.id, 'read')}
                              style={{
                                width: '15px',
                                height: '15px',
                                accentColor: '#4f46e5',
                                borderRadius: '3px',
                              }}
                            />
                            <span>Read</span>
                          </label>

                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              fontSize: '0.82rem',
                              color: '#4b5563',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={perms.create || false}
                              onChange={() => handlePermissionToggle(mod.id, 'create')}
                              style={{
                                width: '15px',
                                height: '15px',
                                accentColor: '#4f46e5',
                                borderRadius: '3px',
                              }}
                            />
                            <span>Create</span>
                          </label>

                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              fontSize: '0.82rem',
                              color: '#4b5563',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={perms.edit || false}
                              onChange={() => handlePermissionToggle(mod.id, 'edit')}
                              style={{
                                width: '15px',
                                height: '15px',
                                accentColor: '#4f46e5',
                                borderRadius: '3px',
                              }}
                            />
                            <span>Edit</span>
                          </label>

                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              fontSize: '0.82rem',
                              color: '#4b5563',
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={perms.delete || false}
                              onChange={() => handlePermissionToggle(mod.id, 'delete')}
                              style={{
                                width: '15px',
                                height: '15px',
                                accentColor: '#4f46e5',
                                borderRadius: '3px',
                              }}
                            />
                            <span>Delete</span>
                          </label>
                        </div>
                      </div>
                    )}
                </div>
              );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            <span>{totalReadCount} Read</span> &bull;{' '}
            <span>{totalCreateCount} Create</span> &bull;{' '}
            <span>{totalEditCount} Edit</span> &bull;{' '}
            <span>{totalDeleteCount} Delete</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                color: '#374151',
                padding: '0.55rem 1.25rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              style={{
                backgroundColor: '#4f46e5',
                border: 'none',
                color: '#ffffff',
                padding: '0.55rem 1.35rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
