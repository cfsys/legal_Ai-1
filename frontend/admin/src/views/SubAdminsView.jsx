import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/api';

import {
  User,
  Shield,
  Plus,
  RefreshCw,
  Search,
  LockKeyhole,
  Key,
  Pencil,
  Trash2,
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

  /* USER / ADMINISTRATOR INFORMATION */

  .roles-page .rp-user-info {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 200px;
  }

  .roles-page .rp-user-icon {
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

  .roles-page .rp-user-name {
    margin-bottom: 3px;
    color: #1e293b;
    font-size: 12px;
    font-weight: 700;
  }

  .roles-page .rp-user-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 11px;
  }

  .roles-page .rp-username-tag {
    display: inline-block;
    padding: 1px 6px;
    background: #f1f5f9;
    color: #475569;
    border-radius: 4px;
    font-size: 10px;
    font-family: monospace;
    font-weight: 600;
  }

  /* ASSIGNED ROLE BUTTON */

  .roles-page .rp-role-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .roles-page .rp-role-btn:hover {
    background: #e2e8f0;
    color: #0f172a;
    border-color: #cbd5e1;
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

  /* STATUS PILL */

  .roles-page .rp-status-btn {
    border: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
  }

  .roles-page .rp-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
    transition: all 0.15s ease;
  }

  .roles-page .rp-status-pill.active {
    background: #ecfdf5;
    color: #059669;
    border: 1px solid #a7f3d0;
  }

  .roles-page .rp-status-pill.suspended {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  .roles-page .rp-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .roles-page .rp-status-dot.active {
    background: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }

  .roles-page .rp-status-dot.suspended {
    background: #ef4444;
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

const formatRoleName = (name) => {
  if (!name) return 'Super Admin';
  return name.replace(/\s+\d{10,}$/, '').trim();
};

export default function SubAdminsView() {
  const { openModal, addToast, canPerform } = useAdmin();
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmStatusTarget, setConfirmStatusTarget] = useState(null);

  // Pagination state matching Administrative Roles
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Query database directly from backend with pagination
  const loadData = useCallback(async (queryParam) => {
    setLoading(true);
    try {
      const q = typeof queryParam === 'string' ? queryParam : search;
      const adminRes = await adminApi.getSubAdmins({
        search: q,
        page: currentPage,
        limit: pageSize,
      });
      if (adminRes.success) {
        setSubAdmins(adminRes.subAdmins || []);
        const total = adminRes.total ?? (adminRes.subAdmins || []).length;
        setTotalUsers(total);
        setTotalPages(adminRes.totalPages ?? Math.max(1, Math.ceil(total / pageSize)));
      }
    } catch (err) {
      addToast('Failed to load admin users: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, currentPage, pageSize, addToast]);

  // Dedicated refresh handler with user feedback
  const handleRefresh = async () => {
    setIsRefreshed(false);
    await loadData(search);
    setIsRefreshed(true);
    setTimeout(() => setIsRefreshed(false), 2000);
  };

  // Debounced database query on search change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(search);
    }, 280);
    return () => clearTimeout(timer);
  }, [search, loadData]);

  // Pagination calculations on database search results
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = totalUsers === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + subAdmins.length, totalUsers);

  const paginatedUsers = subAdmins;

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

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

  // Status Toggle Confirmation
  const handleToggleStatus = (subAdmin) => {
    if (subAdmin.code === 'SUPER_ADM' || subAdmin.role === 'Super Admin') {
      addToast('Cannot suspend master Super Administrator account', 'error');
      return;
    }
    const isCurrentlyActive = subAdmin.status === 1;
    setConfirmStatusTarget({
      subAdmin,
      newStatus: isCurrentlyActive ? 3 : 1,
      action: isCurrentlyActive ? 'suspend' : 'activate',
    });
  };

  const handleConfirmToggleStatus = async () => {
    if (!confirmStatusTarget) return;
    const { subAdmin, newStatus, action } = confirmStatusTarget;
    setConfirmStatusTarget(null);
    try {
      const res = await adminApi.updateSubAdmin(subAdmin.id, { status: newStatus });
      if (res.success) {
        addToast(`Administrator "${subAdmin.username || subAdmin.fullName}" ${action === 'suspend' ? 'suspended' : 'activated'} successfully`);
        loadData();
      }
    } catch (err) {
      addToast('Failed to update status: ' + err.message, 'error');
    }
  };

  // Revoke Deletion
  const handleDelete = (subAdmin) => {
    if (subAdmin.code === 'SUPER_ADM' || subAdmin.role === 'Super Admin') {
      addToast('System Super Administrator account cannot be revoked', 'error');
      return;
    }
    setConfirmTarget(subAdmin);
  };

  const handleConfirmRevoke = async () => {
    if (!confirmTarget) return;
    const target = confirmTarget;
    setConfirmTarget(null);

    try {
      const res = await adminApi.deleteSubAdmin(target.id);
      if (res.success) {
        addToast(`Admin access revoked for ${target.username || target.fullName}`);
        loadData();
      }
    } catch (err) {
      addToast('Failed to revoke admin user: ' + err.message, 'error');
    }
  };

  return (
    <div className="roles-page">
      <style>{styles}</style>

      {/* PAGE HEADER - CFSYS Business Style */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', margin: 0 }}>
            Administrators
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {canPerform('subadmins', 'create') && (
            <button
              type="button"
              onClick={() => openModal('createSubAdmin', { onCreated: () => loadData(search) })}
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
              <span>New Administrator</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="rp-main-card" style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        {/* TOOLBAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #f1f5f9', gap: '14px', flexWrap: 'wrap' }}>
          {/* SEARCH WRAPPER */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search administrators..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search admin users"
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

          {/* TOOLBAR ACTIONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh admin users"
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
                <th style={{ width: '28%' }}>ADMINISTRATOR</th>
                <th style={{ width: '18%' }}>ASSIGNED ROLE</th>
                <th style={{ width: '14%' }}>ROLE CODE</th>
                <th style={{ width: '14%' }}>STATUS</th>
                <th style={{ width: '26%', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="rp-loading">
                      <RefreshCw size={18} className="rp-spin" />
                      Loading administrator accounts...
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="rp-empty">
                      <div className="rp-empty-icon">
                        {search ? <Search size={21} /> : <User size={21} />}
                      </div>

                      <h4>
                        {search
                          ? 'No matching administrators found'
                          : 'No administrator accounts configured'}
                      </h4>

                      <p>
                        {search
                          ? 'Try another search keyword.'
                          : 'Click "New Administrator" to add your first admin.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((admin) => {
                  const isSuperAdmin =
                    admin.code === 'SUPER_ADM' ||
                    admin.role === 'Super Admin';

                  return (
                    <tr key={admin.id || admin._id || admin.username}>
                      {/* ADMINISTRATOR INFO */}
                      <td>
                        <div className="rp-user-info">
                          <div className="rp-user-icon">
                            <User size={18} />
                          </div>

                          <div>
                            <div className="rp-user-name">
                              {admin.name || admin.fullName || admin.username}
                            </div>

                            <div className="rp-user-meta">
                              <span className="rp-username-tag">
                                {admin.username || 'admin'}
                              </span>
                              <span>&bull;</span>
                              <span>{admin.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ASSIGNED ROLE */}
                      <td>
                        <button
                          type="button"
                          className="rp-role-btn"
                          onClick={() =>
                            openModal('applyRole', {
                              targetUser: admin,
                              onUpdated: loadData,
                            })
                          }
                          title="Click to Change Role"
                        >
                          <Key size={11} />
                          <span>{formatRoleName(admin.role || admin.roleTitle || 'Super Admin')}</span>
                        </button>
                      </td>

                      {/* ROLE CODE */}
                      <td>
                        <span className="rp-role-code">
                          {admin.code || 'SUPER_ADM'}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <button
                          type="button"
                          className="rp-status-btn"
                          onClick={() => handleToggleStatus(admin)}
                          title="Click to toggle Active / Suspended status"
                        >
                          <span
                            className={`rp-status-pill ${
                              admin.status === 1 ? 'active' : 'suspended'
                            }`}
                          >
                            <span
                              className={`rp-status-dot ${
                                admin.status === 1 ? 'active' : 'suspended'
                              }`}
                            />
                            <span>{admin.status === 1 ? 'Active' : 'Suspended'}</span>
                          </span>
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <div className="rp-row-actions">
                          {!isSuperAdmin ? (
                            <>
                              {canPerform('subadmins', 'edit') && (
                                <button
                                  type="button"
                                  className="rp-action-btn"
                                  onClick={() =>
                                    openModal('editSubAdmin', {
                                      subAdmin: admin,
                                      onUpdated: () => loadData(search),
                                    })
                                  }
                                  title="Edit Administrator"
                                >
                                  <Pencil size={12} />
                                  <span>Edit</span>
                                </button>
                              )}

                              {canPerform('subadmins', 'delete') && (
                                <button
                                  type="button"
                                  className="rp-action-btn rp-delete-btn"
                                  onClick={() => handleDelete(admin)}
                                  title="Revoke access"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}

                              {!canPerform('subadmins', 'edit') && !canPerform('subadmins', 'delete') && (
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                                  View Only
                                </span>
                              )}
                            </>
                          ) : (
                            <span
                              className="rp-system-icon"
                              title="System-protected Super Administrator"
                            >
                              <LockKeyhole size={13} />
                            </span>
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
            Showing <span style={{ fontWeight: 700, color: '#1e293b' }}>{totalUsers === 0 ? '0' : `${startIndex + 1}-${endIndex}`}</span> of {totalUsers}
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

      {/* CONFIRM REVOKE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmTarget)}
        title="Revoke Administrator Access"
        message={
          confirmTarget
            ? `Are you sure you want to revoke administrator access for "${confirmTarget.username || confirmTarget.fullName}"? This action cannot be undone.`
            : ''
        }
        confirmText="Revoke Access"
        danger={true}
        onConfirm={handleConfirmRevoke}
        onCancel={() => setConfirmTarget(null)}
      />

      {/* CONFIRM SUSPEND / ACTIVATE MODAL */}
      <ConfirmModal
        isOpen={Boolean(confirmStatusTarget)}
        title={confirmStatusTarget?.action === 'suspend' ? 'Suspend Administrator Account' : 'Activate Administrator Account'}
        message={
          confirmStatusTarget?.action === 'suspend'
            ? `Are you sure you want to suspend administrator account "${confirmStatusTarget?.subAdmin?.username || confirmStatusTarget?.subAdmin?.fullName}"? They will lose access to administrative tools until reactivated.`
            : `Are you sure you want to activate administrator account "${confirmStatusTarget?.subAdmin?.username || confirmStatusTarget?.subAdmin?.fullName}"?`
        }
        confirmText={confirmStatusTarget?.action === 'suspend' ? 'Suspend Admin' : 'Activate Admin'}
        danger={confirmStatusTarget?.action === 'suspend'}
        onConfirm={handleConfirmToggleStatus}
        onCancel={() => setConfirmStatusTarget(null)}
      />
    </div>
  );
}
