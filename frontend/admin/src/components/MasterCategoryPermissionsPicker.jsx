import React, { useState } from 'react';
import { MASTER_DATA_CATEGORIES } from '../constants/masterCategories';
import { Search, Zap, CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';

export default function MasterCategoryPermissionsPicker({
  categoryPermissions = {},
  onChange,
  disabled = false,
}) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const filteredCategories = MASTER_DATA_CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (catId, action) => {
    if (disabled) return;
    const current = categoryPermissions[catId] || {
      read: false,
      create: false,
      edit: false,
      delete: false,
    };
    const nextVal = !current[action];
    
    // If enabling create, edit, or delete, ensure read/view is also enabled
    const updated = {
      ...current,
      [action]: nextVal,
      read: (action !== 'read' && nextVal) ? true : (action === 'read' ? nextVal : current.read),
    };

    onChange({
      ...categoryPermissions,
      [catId]: updated,
    });
  };

  const handleToggleAllForCategory = (catId) => {
    if (disabled) return;
    const current = categoryPermissions[catId] || { read: false, create: false, edit: false, delete: false };
    const allActive = current.read && current.create && current.edit && current.delete;
    const next = !allActive;
    onChange({
      ...categoryPermissions,
      [catId]: {
        read: next,
        create: next,
        edit: next,
        delete: next,
      },
    });
  };

  // Preset: Court can Edit & View only (No Add, No Delete)
  const applyCourtViewAndEditOnly = () => {
    if (disabled) return;
    const updated = { ...categoryPermissions };
    updated['Court'] = {
      read: true,
      create: false,
      edit: true,
      delete: false,
    };
    onChange(updated);
  };

  return (
    <div
      style={{
        border: '1px solid #e0e7ff',
        borderRadius: '10px',
        backgroundColor: '#f8faff',
        overflow: 'hidden',
        marginTop: '0.75rem',
      }}
    >
      {/* Accordion Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#eff6ff',
          borderBottom: isOpen ? '1px solid #e0e7ff' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap size={16} style={{ color: '#3b82f6' }} />
          <div>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e3a8a' }}>
              Granular Category Permissions (Court, Bench, Judge & All)
            </span>
            <span
              style={{
                marginLeft: '0.5rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                padding: '0.12rem 0.45rem',
                borderRadius: '999px',
              }}
            >
              15 Categories
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isOpen ? <ChevronUp size={16} color="#3b82f6" /> : <ChevronDown size={16} color="#3b82f6" />}
        </div>
      </div>

      {isOpen && (
        <div style={{ padding: '0.85rem 1rem' }}>
          {/* Top toolbar with search and preset button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap',
              marginBottom: '0.85rem',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '0.7rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                placeholder="Filter categories (e.g. Court, Bench, Judge)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  height: '34px',
                  paddingLeft: '2rem',
                  paddingRight: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="button"
              onClick={applyCourtViewAndEditOnly}
              title="Apply: Court View & Edit Only (No Add, No Delete)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #93c5fd',
                color: '#1d4ed8',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              <Zap size={13} color="#2563eb" />
              <span>Preset: Court View & Edit Only</span>
            </button>
          </div>

          {/* Categories Grid / Rows */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxHeight: '320px',
              overflowY: 'auto',
              paddingRight: '0.25rem',
            }}
          >
            {filteredCategories.map((cat) => {
              const perms = categoryPermissions[cat.id] || {
                read: false,
                create: false,
                edit: false,
                delete: false,
              };
              const isAllChecked = perms.read && perms.create && perms.edit && perms.delete;
              const isAnyChecked = perms.read || perms.create || perms.edit || perms.delete;

              // Highlight Court special preset if active
              const isCourtPresetActive =
                cat.id === 'Court' && perms.read && perms.edit && !perms.create && !perms.delete;

              return (
                <div
                  key={cat.id}
                  style={{
                    backgroundColor: isCourtPresetActive ? '#eff6ff' : '#ffffff',
                    border: isCourtPresetActive ? '1.5px solid #93c5fd' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                          {cat.name}
                        </span>
                        {isCourtPresetActive && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              backgroundColor: '#dbeafe',
                              color: '#1d4ed8',
                              padding: '0.1rem 0.45rem',
                              borderRadius: '4px',
                            }}
                          >
                            View & Edit Only
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>
                        {cat.desc}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleAllForCategory(cat.id)}
                      disabled={disabled}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isAllChecked ? '#2563eb' : '#94a3b8',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        padding: '0.15rem 0.35rem',
                        borderRadius: '4px',
                      }}
                    >
                      {isAllChecked ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  {/* 4 CRUD Actions for this Category */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      flexWrap: 'wrap',
                      paddingTop: '0.25rem',
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    {/* Read / View */}
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(perms.read)}
                        onChange={() => handleToggle(cat.id, 'read')}
                        disabled={disabled}
                        style={{ width: '14px', height: '14px', accentColor: '#2563eb' }}
                      />
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '0.12rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: perms.read ? '#2563eb' : '#f1f5f9',
                          color: perms.read ? '#ffffff' : '#64748b',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        Read / View
                      </span>
                    </label>

                    {/* Create / Add */}
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(perms.create)}
                        onChange={() => handleToggle(cat.id, 'create')}
                        disabled={disabled}
                        style={{ width: '14px', height: '14px', accentColor: '#059669' }}
                      />
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '0.12rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: perms.create ? '#059669' : '#f1f5f9',
                          color: perms.create ? '#ffffff' : '#64748b',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        Create / Add
                      </span>
                    </label>

                    {/* Edit */}
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(perms.edit)}
                        onChange={() => handleToggle(cat.id, 'edit')}
                        disabled={disabled}
                        style={{ width: '14px', height: '14px', accentColor: '#4f46e5' }}
                      />
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '0.12rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: perms.edit ? '#4f46e5' : '#f1f5f9',
                          color: perms.edit ? '#ffffff' : '#64748b',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        Edit
                      </span>
                    </label>

                    {/* Delete */}
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(perms.delete)}
                        onChange={() => handleToggle(cat.id, 'delete')}
                        disabled={disabled}
                        style={{ width: '14px', height: '14px', accentColor: '#dc2626' }}
                      />
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          padding: '0.12rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: perms.delete ? '#dc2626' : '#f1f5f9',
                          color: perms.delete ? '#ffffff' : '#64748b',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        Delete
                      </span>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
