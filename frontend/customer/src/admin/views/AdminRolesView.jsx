
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/api';

import {
  Shield,
  Plus,
  RefreshCw,
  Search,
  LockKeyhole,
  Trash2,
  Pencil,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListFilter,
} from 'lucide-react';

import ConfirmModal from '../components/modals/ConfirmModal';

const styles = `
  .roles-page {
    --rp-primary: #0f172a;
    --rp-border: #e2e8f0;
    --rp-muted: #64748b;

    display: flex;
    flex-direction: column;
    gap: 17px;
    width: 100%;
    min-width: 0;
    color: #172033;
    font-family: inherit;
    position: relative;
    isolation: isolate;
  }

  .roles-page *,
  .roles-page *::before,
  .roles-page *::after {
    box-sizing: border-box;
  }

  /* PAGE HEADER */

  .roles-page .rp-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    flex-wrap: wrap;
  }

  .roles-page .rp-page-heading h1 {
    margin: 0;
    color: #172033;
    font-size: 21px;
    font-weight: 750;
    letter-spacing: -.55px;
  }

  .roles-page .rp-page-heading p {
    margin: 5px 0 0;
    color: #718096;
    font-size: 12px;
    line-height: 1.5;
  }

  /* MAIN CARD */

  .roles-page .rp-main-card {
    position: relative;
    width: 100%;
    min-width: 0;
    background: #fff;
    border: 1px solid #dfe5ee;
    border-radius: 11px;
    box-shadow: 0 1px 3px rgba(15, 23, 42, .06);
    overflow: hidden;
  }

  /* TOOLBAR */

  .roles-page .rp-toolbar {
    min-height: 73px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 14px 17px;
    background: #fff;
    border-bottom: 1px solid #e9edf3;
  }

  .roles-page .rp-search-wrapper {
    position: relative;
    width: 390px;
    max-width: 100%;
    flex: 0 1 390px;
  }

  .roles-page .rp-search-input {
    width: 100%;
    height: 40px;
    padding: 0 38px 0 13px;
    border: 1px solid #dce2ed;
    border-radius: 8px;
    outline: none;
    background: #fff;
    color: #263248;
    font-family: inherit;
    font-size: 12px;
    transition: all .2s ease;
  }

  .roles-page .rp-search-input::placeholder {
    color: #94a3b8;
  }

  .roles-page .rp-search-input:hover {
    border-color: #a5a0f5;
  }

  .roles-page .rp-search-input:focus {
    border-color: #635bff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, .09);
  }

  .roles-page .rp-search-icon {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  .roles-page .rp-clear-btn {
    position: absolute;
    right: 9px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border: none;
    background: transparent;
    color: #94a3b8;
    cursor: pointer;
  }

  .roles-page .rp-clear-btn:hover {
    color: #ef4444;
  }

  .roles-page .rp-toolbar-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 9px;
    flex-shrink: 0;
  }

  .roles-page .rp-btn {
    height: 39px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 0 13px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 11px;
    font-weight: 650;
    white-space: nowrap;
    cursor: pointer;
    transition: all .2s ease;
  }

  .roles-page .rp-btn-refresh {
    width: 39px;
    padding: 0;
    background: #fff;
    color: #64748b;
    border: 1px solid #e2e8f0;
  }

  .roles-page .rp-btn-refresh:hover:not(:disabled) {
    color: #0f172a;
    border-color: #cbd5e1;
    background: #f8fafc;
  }

  .roles-page .rp-btn-refresh:disabled {
    opacity: .55;
    cursor: not-allowed;
  }

  .roles-page .rp-btn-create {
    color: #fff;
    background: #0f172a;
    border: 1px solid #0f172a;
    box-shadow: 0 1px 2px rgba(15, 23, 42, .15);
  }

  .roles-page .rp-btn-create:hover {
    background: #1e293b;
    border-color: #1e293b;
    box-shadow: 0 4px 9px rgba(15, 23, 42, .2);
    transform: translateY(-1px);
  }

  /* TABLE */

  .roles-page .rp-table-container {
    position: relative;
    width: 100%;
    overflow-x: auto;
  }

  .roles-page .rp-table {
    width: 100%;
    min-width: 730px;
    border-collapse: collapse;
    text-align: left;
  }

  .roles-page .rp-table thead {
    background: #f8fafc;
  }

  .roles-page .rp-table th {
    height: 43px;
    padding: 0 18px;
    color: #8490a4;
    font-size: 10px;
    font-weight: 750;
    letter-spacing: .55px;
    text-transform: uppercase;
    white-space: nowrap;
    border-bottom: 1px solid #e9edf3;
  }

  .roles-page .rp-table td {
    height: 65px;
    padding: 11px 18px;
    border-bottom: 1px solid #edf0f5;
    vertical-align: middle;
  }

  .roles-page .rp-table tbody tr {
    transition: background .15s ease;
  }

  .roles-page .rp-table tbody tr:hover {
    background: #fafbff;
  }

  .roles-page .rp-table tbody tr:last-child td {
    border-bottom: none;
  }

  /* ROLE INFORMATION */

  .roles-page .rp-role-info {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 180px;
  }

  .roles-page .rp-role-icon {
    width: 37px;
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #0f172a;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 9px;
  }

  .roles-page .rp-role-name {
    margin-bottom: 4px;
    color: #1e293b;
    font-size: 12px;
    font-weight: 700;
  }

  .roles-page .rp-role-subtitle {
    color: #94a3b8;
    font-size: 10px;
  }

  .roles-page .rp-master-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #059669;
    font-size: 10px;
    font-weight: 650;
  }

  .roles-page .rp-role-code {
    display: inline-block;
    padding: 6px 9px;
    border: 1px solid #e5e9f0;
    border-radius: 5px;
    background: #f8fafc;
    color: #475569;
    font-family: monospace;
    font-size: 10px;
    font-weight: 650;
    white-space: nowrap;
  }

  .roles-page .rp-role-description {
    max-width: 350px;
    color: #64748b;
    font-size: 11px;
    line-height: 1.6;
  }

  /* ACTIONS */

  .roles-page .rp-row-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 7px;
  }

  .roles-page .rp-action-btn {
    height: 31px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 0 10px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #fff;
    color: #0f172a;
    font-family: inherit;
    font-size: 10px;
    font-weight: 650;
    cursor: pointer;
    transition: all .2s ease;
  }

  .roles-page .rp-action-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  .roles-page .rp-delete-btn {
    width: 31px;
    padding: 0;
    color: #dc555f;
    border-color: #f3e1e3;
  }

  .roles-page .rp-delete-btn:hover {
    background: #fff1f2;
    border-color: #fecdd3;
  }

  .roles-page .rp-system-icon {
    width: 31px;
    height: 31px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    background: #f8fafc;
    border: 1px solid #e9edf3;
    border-radius: 7px;
  }

  /* EMPTY / LOADING */

  .roles-page .rp-empty {
    min-height: 205px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 25px 15px;
  }

  .roles-page .rp-empty-icon {
    width: 45px;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 11px;
    background: #f1f5f9;
    color: #64748b;
  }

  .roles-page .rp-empty h4 {
    margin: 0;
    color: #1e293b;
    font-size: 13px;
    font-weight: 700;
  }

  .roles-page .rp-empty p {
    margin: 0;
    color: #94a3b8;
    font-size: 11px;
    text-align: center;
  }

  .roles-page .rp-loading {
    height: 205px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #64748b;
    font-size: 12px;
  }

  .roles-page .rp-spin {
    animation: rp-spin 1s linear infinite;
  }

  @keyframes rp-spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* PAGINATION */

  .roles-page .rp-pagination {
    min-height: 65px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
    padding: 12px 17px;
    border-top: 1px solid #e9edf3;
    background: #fff;
  }

  .roles-page .rp-pagination-info {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
    color: #8490a4;
    font-size: 11px;
  }

  .roles-page .rp-pagination-info strong {
    color: #475569;
    font-weight: 700;
  }

  .roles-page .rp-page-size-wrapper {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .roles-page .rp-page-size {
    height: 36px;
    min-width: 76px;
    padding: 0 10px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    color: #0f172a;
    font-family: inherit;
    font-size: 12px;
    font-weight: 550;
    outline: none;
    cursor: pointer;
    transition: all .15s ease;
  }

  .roles-page .rp-page-size:hover {
    border-color: #a5a0f5;
  }

  .roles-page .rp-page-size:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, .12);
  }

  .roles-page .rp-pagination-controls {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
  }

  .roles-page .rp-page-btn {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #fff;
    color: #64748b;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s ease;
  }

  .roles-page .rp-page-btn:hover:not(:disabled):not(.active) {
    color: #0f172a;
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .roles-page .rp-page-btn.active {
    color: #fff;
    background: #0f172a;
    border-color: #0f172a;
  }

  .roles-page .rp-page-btn:disabled {
    opacity: .4;
    cursor: not-allowed;
  }

  /* RESPONSIVE */

  @media (max-width: 768px) {
    .roles-page .rp-toolbar {
      align-items: stretch;
      flex-wrap: wrap;
    }

    .roles-page .rp-search-wrapper {
      flex: 1 1 100%;
      width: 100%;
    }

    .roles-page .rp-toolbar-actions {
      width: 100%;
      justify-content: flex-end;
    }

    .roles-page .rp-pagination {
      align-items: flex-start;
    }
  }

  @media (max-width: 480px) {
    .roles-page .rp-page-heading h1 {
      font-size: 19px;
    }

    .roles-page .rp-page-heading p {
      font-size: 11px;
    }

    .roles-page .rp-pagination {
      flex-direction: column;
      align-items: stretch;
    }

    .roles-page .rp-pagination-controls {
      width: 100%;
      justify-content: flex-end;
    }

    .roles-page .rp-pagination-info {
      width: 100%;
      justify-content: space-between;
    }
  }
`;

export default function AdminRolesView() {
  const { openModal, addToast, canPerform } = useAdmin();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDeleteRole, setConfirmDeleteRole] = useState(null);

  // Pagination: default 10
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRoles, setTotalRoles] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // LOAD ROLES FROM DATABASE WITH PAGINATION
  const loadRoles = useCallback(async (queryParam) => {
    setLoading(true);

    try {
      const q = typeof queryParam === 'string' ? queryParam : search;
      const res = await adminApi.getRoles({
        search: q,
        page: currentPage,
        limit: pageSize,
      });

      if (res.success) {
        setRoles(res.roles || []);
        const total = res.total ?? (res.roles || []).length;
        setTotalRoles(total);
        setTotalPages(res.totalPages ?? Math.max(1, Math.ceil(total / pageSize)));
      }
    } catch (err) {
      addToast(
        'Failed to load roles: ' + err.message,
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, pageSize, addToast]);

  // Dedicated refresh handler with feedback
  const handleRefresh = async () => {
    setIsRefreshed(false);
    await loadRoles(search);
    setIsRefreshed(true);
    setTimeout(() => setIsRefreshed(false), 2000);
  };

  // Debounced database query on search change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadRoles(search);
    }, 280);
    return () => clearTimeout(timer);
  }, [search, loadRoles]);

  // PAGINATION CALCULATIONS ON DATABASE RESULTS
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = totalRoles === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + roles.length, totalRoles);
  const paginatedRoles = roles;

  // SEARCH

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // PAGE SIZE

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // PAGE NUMBERS

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, safePage - 1);
      let end = Math.min(totalPages, start + 2);

      if (end - start < 2) {
        start = Math.max(1, end - 2);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // CREATE ROLE

  const handleCreateRole = () => {
    openModal('createRole', {
      onCreated: loadRoles,
    });
  };

  // EDIT ROLE
  // Requires an editRole modal registered in AdminContext.

  const handleEditRole = (role) => {
    openModal('editRole', {
      role,
      onUpdated: loadRoles,
    });
  };

  // DELETE ROLE

  const handleDeleteRole = (role) => {
    if (role.isSystem || role.code === 'SUPER_ADM') {
      addToast(
        'System-defined default roles cannot be deleted',
        'error'
      );
      return;
    }

    setConfirmDeleteRole(role);
  };

  const executeDeleteRole = async () => {
    if (!confirmDeleteRole) return;

    const role = confirmDeleteRole;
    setConfirmDeleteRole(null);

    try {
      const res = await adminApi.deleteRole(role.id);

      if (res.success) {
        addToast(
          `Role '${role.name}' deleted successfully`
        );

        await loadRoles();
      }
    } catch (err) {
      addToast(
        'Failed to delete role: ' + err.message,
        'error'
      );
    }
  };

  return (
    <div className="roles-page">
      <style>{styles}</style>

      {/* PAGE HEADER - CFSYS Business Style */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', margin: 0 }}>
            Roles & Permissions
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {canPerform('roles', 'create') && (
            <button
              type="button"
              onClick={handleCreateRole}
              style={{
                height: '38px',
                padding: '0 18px',
                fontSize: '13px',
                fontWeight: 600,
                gap: '6px',
                borderRadius: '8px',
                backgroundColor: '#4338ca',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 1px 2px rgba(67, 56, 202, 0.2)',
              }}
            >
              <Plus size={16} />
              <span>New Role</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="rp-main-card" style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        {/* TOOLBAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #f1f5f9', gap: '14px', flexWrap: 'wrap' }}>
          {/* SEARCH */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search roles..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search administrative roles"
              style={{
                width: '100%',
                height: '38px',
                paddingLeft: '38px',
                paddingRight: '32px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '9999px',
                fontSize: '13px',
                color: '#1e293b',
                outline: 'none',
              }}
            />

            {search && (
              <button
                type="button"
                onClick={() => handleSearch('')}
                title="Clear search"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh roles"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* TABLE */}

        <div className={`rp-table-container ${isRefreshed ? 'data-refreshed-pulse' : ''}`}>
          <table className="rp-table">

            <thead>
              <tr>
                <th style={{ width: '25%' }}>
                  Role Name
                </th>

                <th style={{ width: '17%' }}>
                  Role Code
                </th>

                <th>Description</th>

                <th style={{
                  width: '145px',
                  textAlign: 'right',
                }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">
                    <div className="rp-loading">
                      <RefreshCw
                        size={18}
                        className="rp-spin"
                      />
                      Loading administrative roles...
                    </div>
                  </td>
                </tr>
              ) : paginatedRoles.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="rp-empty">
                      <div className="rp-empty-icon">
                        {search ? (
                          <Search size={21} />
                        ) : (
                          <Shield size={21} />
                        )}
                      </div>

                      <h4>
                        {search
                          ? 'No matching roles found'
                          : 'No administrative roles found'}
                      </h4>

                      <p>
                        {search
                          ? 'Try another search keyword.'
                          : 'Create a new role to get started.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRoles.map((role) => {
                  const isSystem =
                    role.isSystem ||
                    role.code === 'SUPER_ADM';

                  return (
                    <tr key={role.id || role.name}>

                      {/* ROLE NAME */}

                      <td>
                        <div className="rp-role-info">
                          <div className="rp-role-icon">
                            <Shield size={18} />
                          </div>

                          <div>
                            <div className="rp-role-name">
                              {role.name}
                            </div>

                            {role.name === 'Super Admin' ? (
                              <div className="rp-master-label">
                                <LockKeyhole size={10} />
                                Master Authority
                              </div>
                            ) : (
                              <div className="rp-role-subtitle">
                                Administrative access
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* ROLE CODE */}

                      <td>
                        <span className="rp-role-code">
                          {role.code || 'SUPER_ADM'}
                        </span>
                      </td>

                      {/* DESCRIPTION */}

                      <td>
                        <div className="rp-role-description">
                          {role.description ||
                            'Unrestricted full access across all platform entities and security.'}
                        </div>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="rp-row-actions">

                          {isSystem ? (
                            <span
                              className="rp-system-icon"
                              title="System role"
                            >
                              <LockKeyhole size={14} />
                            </span>
                          ) : (
                            <>
                              {canPerform('roles', 'edit') && (
                                <button
                                  type="button"
                                  className="rp-action-btn"
                                  onClick={() => handleEditRole(role)}
                                  title="Edit role and permissions"
                                >
                                  <Pencil size={13} />
                                  Edit
                                </button>
                              )}

                              {canPerform('roles', 'delete') && (
                                <button
                                  type="button"
                                  className="rp-action-btn rp-delete-btn"
                                  onClick={() => handleDeleteRole(role)}
                                  title="Delete role"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}

                              {!canPerform('roles', 'edit') && !canPerform('roles', 'delete') && (
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                  View Only
                                </span>
                              )}
                            </>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        {/* CFSYS PAGINATION FOOTER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderTop: '1px solid #f1f5f9',
          background: '#ffffff',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Showing <span style={{ fontWeight: 700, color: '#1e293b' }}>{totalRoles === 0 ? '0' : `${startIndex + 1}-${endIndex}`}</span> of {totalRoles}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
              <span>Show</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                style={{
                  height: '32px',
                  padding: '0 8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  background: '#ffffff',
                  fontWeight: 600,
                  color: '#1e293b',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
                  color: safePage <= 1 ? '#cbd5e1' : '#64748b',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                Page {safePage} / {Math.max(1, totalPages)}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
                  color: safePage >= totalPages ? '#cbd5e1' : '#64748b',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* DELETE CONFIRMATION */}

      <ConfirmModal
        isOpen={Boolean(confirmDeleteRole)}
        title="Delete Administrative Role"
        message={`Are you sure you want to permanently delete the role '${confirmDeleteRole?.name}'? Administrator accounts assigned to this role will need new permissions.`}
        confirmText="Delete Role"
        cancelText="Cancel"
        danger={true}
        onConfirm={executeDeleteRole}
        onCancel={() => setConfirmDeleteRole(null)}
      />

    </div>
  );
}