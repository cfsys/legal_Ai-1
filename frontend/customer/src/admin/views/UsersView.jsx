import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/api';
import CustomDropdown from '../components/CustomDropdown';
import {
  Search,
  Plus,
  RefreshCw,
  Building2,
  UserCheck,
  UserX,
  Users,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Edit2,
} from 'lucide-react';
import ConfirmModal from '../components/modals/ConfirmModal';
import LoginHistoryModal from '../components/modals/LoginHistoryModal';

const styles = `
  .users-view-page {
    --uv-primary: #0f172a;
    --uv-border: #e2e8f0;
    --uv-muted: #64748b;

    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 0;
    color: #172033;
    font-family: inherit;
    position: relative;
    isolation: isolate;
    overflow: hidden;
  }

  .users-view-page *,
  .users-view-page *::before,
  .users-view-page *::after {
    box-sizing: border-box;
  }

  /* Header */
  .users-view-page .uv-page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .users-view-page .uv-header-title h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 750;
    color: #172033;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .users-view-page .uv-header-title p {
    margin: 3px 0 0;
    font-size: 12px;
    color: #64748b;
    line-height: 1.4;
  }

  .users-view-page .uv-header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Quick Stat Strip */
  .users-view-page .uv-stats-strip {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .users-view-page .uv-stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 12px;
    background: #ffffff;
    border: 1px solid #dfe5ee;
    border-radius: 9999px;
    font-size: 11.5px;
    color: #475569;
    font-weight: 600;
  }

  .users-view-page .uv-stat-pill strong {
    color: #1e293b;
    font-weight: 750;
  }

  .users-view-page .uv-stat-dot-active {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
  }

  /* Filter Bar */
  .users-view-page .uv-filter-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: #ffffff;
    border: 1px solid #dfe5ee;
    border-radius: 10px;
    flex-shrink: 0;
    flex-wrap: wrap;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  }

  .users-view-page .uv-search-box {
    position: relative;
    flex: 1 1 240px;
    min-width: 200px;
  }

  .users-view-page .uv-search-input {
    width: 100%;
    height: 36px;
    padding: 0 32px 0 34px;
    border: 1px solid #dce2ed;
    border-radius: 8px;
    font-size: 11.5px;
    background: #f8fafc;
    color: #1e293b;
    outline: none;
    transition: all 0.15s ease;
    font-family: inherit;
  }

  .users-view-page .uv-search-input:focus {
    background: #ffffff;
    border-color: #635bff;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }

  .users-view-page .uv-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }

  .users-view-page .uv-clear-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px;
  }

  .users-view-page .uv-clear-btn:hover {
    color: #ef4444;
  }

  /* Table Card Box */
  .users-view-page .uv-table-box {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid #dfe5ee;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
    overflow: hidden;
  }

  .users-view-page .uv-table-viewport {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: auto;
    width: 100%;
  }

  .users-view-page .uv-table {
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;
    text-align: left;
  }

  .users-view-page .uv-table thead {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #f8fafc;
  }

  .users-view-page .uv-table th {
    height: 38px;
    padding: 0 16px;
    color: #64748b;
    font-size: 10.5px;
    font-weight: 750;
    letter-spacing: .55px;
    text-transform: uppercase;
    white-space: nowrap;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  .users-view-page .uv-table td {
    height: 56px;
    padding: 8px 16px;
    border-bottom: 1px solid #edf0f5;
    vertical-align: middle;
    font-size: 12px;
  }

  .users-view-page .uv-table tbody tr {
    transition: background 0.15s ease;
  }

  .users-view-page .uv-table tbody tr:hover {
    background: #fafbff;
  }

  .users-view-page .uv-table tbody tr:last-child td {
    border-bottom: none;
  }

  /* Table cells */
  .users-view-page .uv-user-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .users-view-page .uv-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #e2e8f0;
    flex-shrink: 0;
  }

  .users-view-page .uv-user-name {
    font-weight: 750;
    color: #172033;
    font-size: 12.5px;
    line-height: 1.3;
  }

  .users-view-page .uv-user-meta {
    font-size: 11px;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 1px;
  }

  .users-view-page .uv-firm-name {
    font-weight: 650;
    color: #1e293b;
    font-size: 12px;
  }

  .users-view-page .uv-plan-pill {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    background: #f1f5f9;
    color: #475569;
    margin-top: 2px;
  }

  .users-view-page .uv-type-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #334155;
    font-size: 11px;
    font-weight: 600;
  }

  /* Action Buttons */
  .users-view-page .uv-actions-row {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-end;
  }

  .users-view-page .uv-action-btn {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .users-view-page .uv-action-btn:hover {
    background: #f8fafc;
    color: #1e293b;
    border-color: #cbd5e1;
  }

  .users-view-page .uv-action-btn-edit:hover {
    background: #eff6ff;
    color: #2563eb;
    border-color: #bfdbfe;
  }

  .users-view-page .uv-action-btn-suspend:hover {
    background: #fff1f2;
    color: #e11d48;
    border-color: #fecdd3;
  }

  .users-view-page .uv-action-btn-activate:hover {
    background: #ecfdf5;
    color: #059669;
    border-color: #a7f3d0;
  }

  .users-view-page .uv-action-btn-delete:hover {
    background: #fff1f2;
    color: #e11d48;
    border-color: #fecdd3;
  }

  /* Pagination */
  .users-view-page .uv-pagination {
    min-height: 50px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 16px;
    border-top: 1px solid #e9edf3;
    background: #ffffff;
    flex-wrap: wrap;
  }

  .users-view-page .uv-pagination-info {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #8490a4;
    font-size: 11.5px;
    flex-wrap: wrap;
  }

  .users-view-page .uv-pagination-info strong {
    color: #475569;
    font-weight: 750;
  }

  .users-view-page .uv-page-size-wrap {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .users-view-page .uv-page-size {
    height: 30px;
    min-width: 64px;
    padding: 0 6px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #fff;
    color: #0f172a;
    font-size: 11px;
    font-weight: 600;
    outline: none;
    cursor: pointer;
  }

  .users-view-page .uv-pagination-controls {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .users-view-page .uv-page-btn {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #fff;
    color: #64748b;
    font-size: 11px;
    font-weight: 650;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .users-view-page .uv-page-btn:hover:not(:disabled) {
    border-color: #cbd5e1;
    color: #0f172a;
    background: #f1f5f9;
  }

  .users-view-page .uv-page-btn.active {
    background: #0f172a;
    border-color: #0f172a;
    color: #fff;
  }

  .users-view-page .uv-page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Empty State */
  .users-view-page .uv-empty-box {
    min-height: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 30px;
  }

  .users-view-page .uv-empty-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #f1f5f9;
    color: #64748b;
  }

  .users-view-page .uv-empty-title {
    margin: 0;
    color: #1e293b;
    font-size: 13.5px;
    font-weight: 700;
  }

  .users-view-page .uv-empty-desc {
    margin: 0;
    color: #94a3b8;
    font-size: 11.5px;
    text-align: center;
  }
`;

export default function UsersView() {
  const { selectedFirmId, setSelectedFirmId, firms, openModal, addToast, canPerform, usersVersion } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [confirmStatusUser, setConfirmStatusUser] = useState(null);
  const [loginHistoryUser, setLoginHistoryUser] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input to query backend directly
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 280);
    return () => clearTimeout(timer);
  }, [search]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({
        search: debouncedSearch,
        firmId: selectedFirmId,
        role: roleFilter,
        status: statusFilter,
        page: currentPage,
        limit: pageSize,
      });

      if (res.success) {
        const advocates = (res.users || []).filter((u) => u.role !== 1);
        setUsers(advocates);
        const total = res.total ?? advocates.length;
        setTotalCount(total);
        setTotalPages(res.totalPages ?? Math.max(1, Math.ceil(total / pageSize)));
      }
    } catch (err) {
      addToast('Failed to load users: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedFirmId, roleFilter, statusFilter, currentPage, pageSize, usersVersion, addToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Real-time synchronization when a new user is provisioned
  useEffect(() => {
    const handleUserCreated = (e) => {
      const newUser = e.detail;
      if (newUser) {
        setUsers((prev) => [newUser, ...prev.filter((u) => u.id !== newUser.id && u._id !== newUser._id)]);
        setTotalCount((c) => c + 1);
      }
      loadUsers();
    };

    window.addEventListener('legal_ai_user_created', handleUserCreated);
    return () => window.removeEventListener('legal_ai_user_created', handleUserCreated);
  }, [loadUsers]);

  const handleRefresh = async () => {
    setIsRefreshed(false);
    await loadUsers();
    setIsRefreshed(true);
    setTimeout(() => setIsRefreshed(false), 2000);
  };

  const handleToggleStatus = (user) => {
    const isCurrentlyActive = user.status === 1;
    setConfirmStatusUser({
      user,
      newStatus: isCurrentlyActive ? 3 : 1,
      action: isCurrentlyActive ? 'suspend' : 'activate',
    });
  };

  const executeToggleStatus = async () => {
    if (!confirmStatusUser) return;
    const { user, newStatus, action } = confirmStatusUser;
    setConfirmStatusUser(null);
    try {
      const res = await adminApi.updateUser(user.id, { status: newStatus });
      if (res.success) {
        addToast(`Practitioner account '${user.fullName || 'User'}' ${action === 'suspend' ? 'suspended' : 'activated'} successfully`);
        loadUsers();
      }
    } catch (err) {
      addToast('Failed to change status: ' + err.message, 'error');
    }
  };

  const handleDeleteUser = (user) => {
    setConfirmDeleteUser(user);
  };

  const executeDeleteUser = async () => {
    if (!confirmDeleteUser) return;
    const target = confirmDeleteUser;
    setConfirmDeleteUser(null);
    try {
      const res = await adminApi.deleteUser(target.id);
      if (res.success) {
        addToast(`Practitioner '${target.fullName || 'User'}' deleted permanently`);
        loadUsers();
      }
    } catch (err) {
      addToast('Failed to delete user: ' + err.message, 'error');
    }
  };

  const firmOptions = [
    { value: '', label: 'All Law Firms' },
    ...firms.map((f) => ({ value: f.id, label: f.name, subtext: f.tier })),
  ];

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: '2', label: 'Firm Admin' },
    { value: '3', label: 'Senior Partner' },
    { value: '4', label: 'Advocate' },
    { value: '5', label: 'Legal Researcher' },
    { value: '6', label: 'Paralegal' },
    { value: '7', label: 'Compliance Officer' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: '1', label: 'Active' },
    { value: '2', label: 'Pending' },
    { value: '3', label: 'Suspended' },
  ];

  // Quick statistics
  const activeCount = users.filter((u) => u.status === 1).length;
  const firmCount = new Set(users.map((u) => u.firmName).filter(Boolean)).size;

  // Pagination calculation from backend response
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = totalCount === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + users.length, totalCount);
  const paginatedUsers = users;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, safePage - 1);
      let end = Math.min(totalPages, start + 2);
      if (end - start < 2) start = Math.max(1, end - 2);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '-';
    }
  };

  return (
    <div className="users-view-page">
      <style>{styles}</style>

      {/* Header - CFSYS Business Style */}
      <div className="uv-page-header" style={{ marginBottom: '16px' }}>
        <div className="uv-header-title">
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', margin: 0 }}>
            Advocates
          </h1>
        </div>

        <div className="uv-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {canPerform('users', 'create') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                openModal('createUser', {
                  onCreated: (newUser) => {
                    if (newUser) {
                      setUsers((prev) => [newUser, ...prev.filter((u) => u.id !== newUser.id && u._id !== newUser._id)]);
                      setTotalCount((c) => c + 1);
                    }
                    loadUsers();
                  },
                })
              }
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
              <span>New Advocate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Box / Card */}
      <div className="uv-table-box" style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        {/* Top Card Toolbar (CFSYS Search + Icons) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #f1f5f9', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
              <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search advocates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                  onClick={() => setSearch('')}
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

            {/* Compact Filters */}
            <div style={{ width: '160px' }}>
              <CustomDropdown
                options={roleOptions}
                value={roleFilter}
                onChange={(val) => setRoleFilter(val)}
                placeholder="All Roles"
                searchPlaceholder="Search role..."
              />
            </div>
          </div>

          {/* Right Tool Buttons (Refresh, Filter, List) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh"
              disabled={loading}
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
        <div className={`uv-table-viewport ${isRefreshed ? 'data-refreshed-pulse' : ''}`}>
          <table className="uv-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>ADVOCATE / USER</th>
                <th style={{ width: '22%' }}>LAW FIRM & PLAN</th>
                <th style={{ width: '16%' }}>ASSIGNED ROLE</th>
                <th style={{ width: '16%' }}>PRACTICE TYPE</th>
                <th style={{ width: '180px' }}>JOINED DATE</th>
                <th style={{ width: '110px' }}>STATUS</th>
                <th style={{ textAlign: 'right', width: '90px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="uv-empty-box">
                      <RefreshCw size={20} className="animate-spin" style={{ color: '#0f172a' }} />
                      <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>Loading practitioners directory...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="uv-empty-box">
                      <div className="uv-empty-icon">
                        <Search size={22} />
                      </div>
                      <h4 className="uv-empty-title">No advocates or users found</h4>
                      <p className="uv-empty-desc">
                        {search || roleFilter || statusFilter || selectedFirmId
                          ? 'No results matched your filter criteria. Try resetting filters.'
                          : 'No practitioners have been enrolled in the directory yet.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isSuspended = user.status === 3;
                  const isPending = user.status === 2;

                  return (
                    <tr key={user.id} style={{ opacity: isSuspended ? 0.65 : 1 }}>
                      {/* Name & Contact */}
                      <td>
                        <div className="uv-user-cell">
                          <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="uv-avatar"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.fullName || 'User'
                              )}&background=0f172a&color=ffffff`;
                            }}
                          />
                          <div>
                            <div className="uv-user-name">{user.fullName}</div>
                            <div className="uv-user-meta">
                              <span>{user.email}</span>
                              {user.mobile && <span>• {user.mobile}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Firm & Plan */}
                      <td>
                        <div className="uv-firm-name">{user.firmName || 'Independent Practice'}</div>
                        <span className="uv-plan-pill">{user.plan || 'Trial plan'}</span>
                      </td>

                      {/* Role */}
                      <td>
                        <span
                          className={`badge ${
                            user.role === 1
                              ? 'badge-dark'
                              : user.role === 2
                              ? 'badge-primary'
                              : user.role === 3
                              ? 'badge-primary'
                              : user.role === 7
                              ? 'badge-amber'
                              : 'badge-primary'
                          }`}
                          style={{ fontSize: '11px', fontWeight: 650 }}
                        >
                          {user.roleLabel}
                        </span>
                      </td>

                      {/* Practice Type */}
                      <td>
                        <span className="uv-type-badge">
                          <Briefcase size={12} style={{ color: '#475569' }} />
                          <span>{user.professionalType || 'Advocate'}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td>
                        <span style={{ color: '#64748b', fontSize: '11.5px' }}>
                          {formatDate(user.createdAt)}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isSuspended ? '#e11d48' : isPending ? '#d97706' : '#059669',
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 500,
                              color: isSuspended ? '#e11d48' : isPending ? '#d97706' : '#0f172a',
                            }}
                          >
                            {isSuspended ? 'Suspended' : isPending ? 'Pending' : 'Active'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div className="uv-actions-row">
                          {canPerform('users', 'edit') && (
                            <button
                              type="button"
                              className="uv-action-btn uv-action-btn-edit"
                              onClick={() => openModal('editUser', { user, onUpdated: loadUsers })}
                              title="Edit advocate record"
                            >
                              <Edit2 size={13} style={{ color: '#0f172a' }} />
                            </button>
                          )}

                          <button
                            type="button"
                            className="uv-action-btn"
                            onClick={() => setLoginHistoryUser(user)}
                            title="View Login History & IP Logs"
                          >
                            <Clock size={14} style={{ color: '#0f172a' }} />
                          </button>

                          {canPerform('users', 'edit') && (
                            <button
                              type="button"
                              className={`uv-action-btn ${isSuspended ? 'uv-action-btn-activate' : 'uv-action-btn-suspend'}`}
                              onClick={() => handleToggleStatus(user)}
                              title={isSuspended ? 'Activate account' : 'Suspend account'}
                            >
                              {isSuspended ? (
                                <UserCheck size={14} style={{ color: '#059669' }} />
                              ) : (
                                <UserX size={14} style={{ color: '#e11d48' }} />
                              )}
                            </button>
                          )}

                          {canPerform('users', 'delete') && (
                            <button
                              type="button"
                              className="uv-action-btn uv-action-btn-delete"
                              onClick={() => handleDeleteUser(user)}
                              title="Delete practitioner record"
                            >
                              <Trash2 size={14} />
                            </button>
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

        {/* CFSYS Pagination Footer */}
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
            Showing <span style={{ fontWeight: 700, color: '#1e293b' }}>{totalCount === 0 ? '0' : `${startIndex + 1}-${endIndex}`}</span> of {totalCount}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
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
                <option value={10}>10</option>
                <option value={25}>25</option>
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

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(confirmDeleteUser)}
        title="Delete Practitioner Record"
        message={`Are you sure you want to permanently delete practitioner '${
          confirmDeleteUser?.fullName || confirmDeleteUser?.firstName
        }'? Their account and matter access will be revoked.`}
        confirmText="Delete Practitioner"
        danger={true}
        onConfirm={executeDeleteUser}
        onCancel={() => setConfirmDeleteUser(null)}
      />

      {/* Suspend / Activate Account Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(confirmStatusUser)}
        title={confirmStatusUser?.action === 'suspend' ? 'Suspend Practitioner Account' : 'Activate Practitioner Account'}
        message={
          confirmStatusUser?.action === 'suspend'
            ? `Are you sure you want to suspend account access for '${
                confirmStatusUser?.user?.fullName || confirmStatusUser?.user?.firstName || 'this practitioner'
              }'? The user will be immediately logged out and prevented from signing in.`
            : `Are you sure you want to activate account access for '${
                confirmStatusUser?.user?.fullName || confirmStatusUser?.user?.firstName || 'this practitioner'
              }'?`
        }
        confirmText={confirmStatusUser?.action === 'suspend' ? 'Suspend Account' : 'Activate Account'}
        danger={confirmStatusUser?.action === 'suspend'}
        onConfirm={executeToggleStatus}
        onCancel={() => setConfirmStatusUser(null)}
      />

      {/* Login History & IP Logs Modal */}
      <LoginHistoryModal
        isOpen={Boolean(loginHistoryUser)}
        userId={loginHistoryUser?.id}
        userName={loginHistoryUser?.fullName || `${loginHistoryUser?.firstName || ''} ${loginHistoryUser?.lastName || ''}`.trim()}
        userCode={loginHistoryUser?.customerCode || loginHistoryUser?.code || (loginHistoryUser?.id ? `ADV-${String(loginHistoryUser.id).slice(-4).toUpperCase()}` : 'ADV-101')}
        onClose={() => setLoginHistoryUser(null)}
      />
    </div>
  );
}
