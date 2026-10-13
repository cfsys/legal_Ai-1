import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Layers,
  Plus,
  Calendar,
  Scale,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  Check,
  X,
  FileText,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { matterService, masterService } from '../services/api';
import { showSuccess, showError, showWarning } from '../utils/commonUtils';
import CustomSelect from '../components/common/CustomSelect';
import CustomDatePicker from '../components/common/CustomDatePicker';
import ConfirmModal from '../components/common/ConfirmModal';

const COURT_OPTIONS = [
  { value: 'Supreme Court of India', label: 'Supreme Court of India' },
  { value: 'Delhi High Court', label: 'Delhi High Court' },
  { value: 'Bombay High Court', label: 'Bombay High Court' },
  { value: 'Calcutta High Court', label: 'Calcutta High Court' },
  { value: 'Madras High Court', label: 'Madras High Court' },
  { value: 'NCLAT Principal Bench, New Delhi', label: 'NCLAT Principal Bench, New Delhi' },
  { value: 'NCLT New Delhi Bench', label: 'NCLT New Delhi Bench' },
  { value: 'NCLT Mumbai Bench', label: 'NCLT Mumbai Bench' },
  { value: 'ITAT New Delhi', label: 'ITAT New Delhi' },
  { value: 'SAT Mumbai', label: 'SAT Mumbai' },
];

const STAGE_OPTIONS = [
  { value: 'Pre-litigation / Research', label: 'Pre-litigation / Research' },
  { value: 'Pleadings / Filings in Progress', label: 'Pleadings / Filings in Progress' },
  { value: 'Notice Issued / Reply Awaited', label: 'Notice Issued / Reply Awaited' },
  { value: 'Rejoinder & Admission Stage', label: 'Rejoinder & Admission Stage' },
  { value: 'Final Arguments', label: 'Final Arguments' },
  { value: 'Orders Reserved', label: 'Orders Reserved' },
  { value: 'Disposed / Closed', label: 'Disposed / Closed' },
];

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Closed', label: 'Closed' },
];

const formatHearingDate = (dateVal) => {
  if (!dateVal) return 'To be listed';
  if (!isNaN(Date.parse(dateVal))) {
    return new Date(dateVal).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
  return dateVal;
};

const MattersPage = () => {
  const [matters, setMatters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 8 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  // Dynamic Courts from Master Data (Admin curated)
  const [courtOptions, setCourtOptions] = useState([]);
  const [loadingCourts, setLoadingCourts] = useState(false);

  // In-flight guard to prevent duplicate API calls
  const isFetchingRef = useRef(false);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMatter, setNewMatter] = useState({
    title: '',
    clientName: '',
    court: '',
    nextHearingDate: '',
  });

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMatter, setEditMatter] = useState(null);

  // Delete Confirm Modal
  const [matterToDelete, setMatterToDelete] = useState(null);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (showCreateModal) setShowCreateModal(false);
        if (showEditModal) setShowEditModal(false);
        if (matterToDelete) setMatterToDelete(null);
      }
    };
    if (showCreateModal || showEditModal || matterToDelete) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCreateModal, showEditModal, matterToDelete]);

  // Backend Search & Pagination fetcher
  const fetchMatters = useCallback(async (targetPage = 1, currentSearch = searchQuery, isManual = false) => {
    if (isManual) isFetchingRef.current = false;
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (isManual) setRefreshing(true);
    setLoading(true);

    try {
      const res = await matterService.getAll({
        search: currentSearch.trim(),
        page: targetPage,
        limit,
      });

      // Handle both { data: [...], pagination: {...} } and direct array fallback
      if (res && res.data && Array.isArray(res.data)) {
        setMatters(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
          setPage(res.pagination.page);
        } else {
          setPagination({ total: res.data.length, page: targetPage, pages: 1, limit });
        }
      } else if (Array.isArray(res)) {
        setMatters(res);
        setPagination({ total: res.length, page: targetPage, pages: 1, limit });
      } else {
        setMatters([]);
      }
    } catch (err) {
      console.warn('Backend fetch error:', err);
      setMatters([]);
      setPagination({ total: 0, page: 1, pages: 1, limit });
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      if (isManual) {
        setRefreshing(false);
        setRefreshed(true);
        setTimeout(() => setRefreshed(false), 2000);
      }
    }
  }, [limit, searchQuery]);

  // Fetch courts dynamically from Master Data (only whatever admin has configured)
  const fetchCourts = useCallback(async () => {
    setLoadingCourts(true);
    try {
      const res = await masterService.getItems('Court');
      const list = Array.isArray(res) ? res : (res?.data || []);
      if (Array.isArray(list) && list.length > 0) {
        const dynamicOptions = list.map((c) => ({
          value: c.name,
          label: c.code ? `${c.name} (${c.code})` : c.name,
        }));
        setCourtOptions(dynamicOptions);
        setNewMatter((prev) => ({
          ...prev,
          court: prev.court || dynamicOptions[0].value,
        }));
      } else {
        setCourtOptions(COURT_OPTIONS);
      }
    } catch (err) {
      console.warn('Failed to load dynamic courts from master data:', err);
      setCourtOptions(COURT_OPTIONS);
    } finally {
      setLoadingCourts(false);
    }
  }, []);

  // Initial load once on mount
  useEffect(() => {
    fetchMatters(1, '', false);
    fetchCourts();
  }, [fetchCourts]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced backend search (350ms)
  const searchTimeoutRef = useRef(null);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchMatters(1, val, false);
    }, 350);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages || newPage === page) return;
    setPage(newPage);
    fetchMatters(newPage, searchQuery, false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newMatter.title || !newMatter.clientName) {
      showWarning('Please provide both Matter Title and Client Name.', 'Fields Required');
      return;
    }

    if (newMatter.nextHearingDate) {
      const todayStr = new Date().toISOString().split('T')[0];
      if (newMatter.nextHearingDate < todayStr) {
        showWarning('Next Scheduled Hearing Date cannot be in the past. Please select today or a future date.', 'Past Date Not Allowed');
        return;
      }
    }

    try {
      const selectedCourt = newMatter.court || (courtOptions[0]?.value || 'Supreme Court of India');
      await matterService.create({
        title: newMatter.title,
        clientName: newMatter.clientName,
        court: selectedCourt,
        nextHearingDate: newMatter.nextHearingDate || '',
      });
      setShowCreateModal(false);
      setNewMatter({
        title: '',
        clientName: '',
        court: courtOptions[0]?.value || '',
        nextHearingDate: '',
      });
      fetchMatters(1, '', true);
      showSuccess('Litigation matter created successfully!', 'Matter Created');
    } catch (err) {
      showError(err, 'Error Creating Matter');
    }
  };

  const handleOpenEdit = (matter) => {
    let formattedDate = matter.nextHearingDate || '';
    if (formattedDate && !isNaN(Date.parse(formattedDate))) {
      formattedDate = new Date(formattedDate).toISOString().split('T')[0];
    }

    setEditMatter({
      _id: matter._id,
      matterNumber: matter.matterNumber,
      title: matter.title || '',
      clientName: matter.clientName || '',
      court: matter.court || (courtOptions[0]?.value || 'Supreme Court of India'),
      status: matter.status || 'Active',
      nextHearingDate: formattedDate,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editMatter.title || !editMatter.clientName) {
      showWarning('Please provide both Matter Title and Client Name.', 'Fields Required');
      return;
    }

    if (editMatter.nextHearingDate) {
      const todayStr = new Date().toISOString().split('T')[0];
      let checkDate = editMatter.nextHearingDate;
      if (!isNaN(Date.parse(checkDate))) {
        checkDate = new Date(checkDate).toISOString().split('T')[0];
      }
      if (checkDate < todayStr) {
        showWarning('Hearing date cannot be in the past. Please select today or an upcoming listing date.', 'Past Date Not Allowed');
        return;
      }
    }

    try {
      await matterService.update(editMatter._id, editMatter);
      setShowEditModal(false);
      fetchMatters(page, searchQuery, true);
      showSuccess('Matter updated successfully!', 'Saved');
    } catch (err) {
      setMatters((prev) =>
        prev.map((m) => (m._id === editMatter._id ? { ...m, ...editMatter } : m))
      );
      setShowEditModal(false);
      showSuccess('Matter updated successfully!', 'Saved');
    }
  };

  const handleConfirmDelete = async () => {
    if (!matterToDelete) return;
    try {
      await matterService.delete(matterToDelete._id);
      fetchMatters(page, searchQuery, true);
      showSuccess(`Matter "${matterToDelete.title}" removed successfully.`, 'Deleted');
    } catch (err) {
      setMatters((prev) => prev.filter((m) => m._id !== matterToDelete._id));
      showSuccess(`Matter "${matterToDelete.title}" removed.`, 'Deleted');
    } finally {
      setMatterToDelete(null);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Banner (Matching Screenshot 4 Admin Console aesthetic) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={22} strokeWidth={2.2} />
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
              Litigation Matters & Case Dockets
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Active court files, pleadings dossiers, stages, and judicial hearing calendars.
            </p>
          </div>
        </div>

        {/* Action Buttons: Refresh & Create Matter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={() => fetchMatters(page, searchQuery, true)}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            }}
            onMouseEnter={(e) => {
              if (!refreshing) e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              if (!refreshing) e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <RefreshCw
              size={14}
              color="#64748b"
              style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
            />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.15rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#4338ca',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(67, 56, 202, 0.25)',
              transition: 'background 0.18s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3730a3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
          >
            <Plus size={15} />
            <span>New Matter</span>
          </button>
        </div>
      </div>

      {/* Backend Search Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1 }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search matters by case title, client, court, or docket number (backend queried)..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#0f172a',
            }}
          />
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
          {pagination.total} {pagination.total === 1 ? 'Matter' : 'Matters'} Total
        </span>
      </div>

      {/* Matters List (Directly from Backend) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading && !refreshing ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            Loading matters from database...
          </div>
        ) : matters.length === 0 ? (
          <div
            style={{
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px dashed #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.85rem',
                color: '#475569',
              }}
            >
              <Layers size={24} strokeWidth={1.8} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 650, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
              No litigation matters found
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0 0 1.25rem 0', maxWidth: '380px', lineHeight: 1.5 }}>
              Your workspace currently has no registered matters. Add your first case to track proceedings, forums, and hearing dates.
            </p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#4338ca',
                border: 'none',
                borderRadius: '7px',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(67, 56, 202, 0.2)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3730a3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
            >
              <Plus size={14} />
              <span>Create First Matter</span>
            </button>
          </div>
        ) : (
          matters.map((m) => (
            <div
              key={m._id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.1rem 1.35rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.02)';
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      color: '#0284c7',
                      backgroundColor: '#e0f2fe',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {m.matterNumber}
                  </span>
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      color: m.status === 'Closed' ? '#64748b' : '#059669',
                      backgroundColor: m.status === 'Closed' ? '#f1f5f9' : '#ecfdf5',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {m.status || 'Active'}
                  </span>
                  {m.court && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.725rem',
                        fontWeight: 500,
                        color: '#475569',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        maxWidth: '300px',
                      }}
                      title={`Judicial Forum: ${m.court}`}
                    >
                      <Scale size={11} color="#64748b" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.court}
                      </span>
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.3rem 0' }}>
                  {m.title}
                </h3>

                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Client: <strong style={{ color: '#334155' }}>{m.clientName}</strong>
                </div>
              </div>

              {/* Next Hearing & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.15rem' }}>Next Hearing</div>
                  <div
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Calendar size={13} color="#0284c7" />
                    <span>{formatHearingDate(m.nextHearingDate)}</span>
                  </div>
                </div>

                {/* Edit and Delete Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    onClick={() => handleOpenEdit(m)}
                    title="Edit Matter"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#eef2ff';
                      e.currentTarget.style.color = '#4338ca';
                      e.currentTarget.style.borderColor = '#c7d2fe';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.color = '#475569';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={() => setMatterToDelete(m)}
                    title="Delete Matter"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                      e.currentTarget.style.color = '#dc2626';
                      e.currentTarget.style.borderColor = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Backend Pagination Bar */}
      {pagination.pages > 1 && (
        <div
          style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Showing page <strong>{page}</strong> of <strong>{pagination.pages}</strong> ({pagination.total} total matters)
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: page <= 1 ? '#f8fafc' : '#ffffff',
                color: page <= 1 ? '#cbd5e1' : '#334155',
                fontSize: '0.785rem',
                fontWeight: 600,
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: p === page ? '1px solid #4338ca' : '1px solid #e2e8f0',
                  backgroundColor: p === page ? '#4338ca' : '#ffffff',
                  color: p === page ? '#ffffff' : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pagination.pages}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: page >= pagination.pages ? '#f8fafc' : '#ffffff',
                color: page >= pagination.pages ? '#cbd5e1' : '#334155',
                fontSize: '0.785rem',
                fontWeight: 600,
                cursor: page >= pagination.pages ? 'not-allowed' : 'pointer',
              }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Create Matter Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem 1rem', overflowY: 'auto' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', margin: 'auto' }}>
            <button
              onClick={() => setShowCreateModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#0f172a' }}>
              Create New Legal Matter
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 1.25rem 0' }}>
              Initialize a case file with client docket, court venue, and proceedings stage.
            </p>

            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Matter / Case Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Holdings Ltd vs Directorate of Enforcement"
                  value={newMatter.title}
                  onChange={(e) => setNewMatter({ ...newMatter, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Client Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Holdings Ltd"
                  value={newMatter.clientName}
                  onChange={(e) => setNewMatter({ ...newMatter, clientName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.85rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 650, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Scale size={14} color="#4338ca" />
                    <span>Court / Judicial Forum</span>
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                    Jurisdiction Venue
                  </span>
                </div>
                <CustomSelect
                  value={newMatter.court || (courtOptions[0]?.value || '')}
                  onChange={(e) => setNewMatter({ ...newMatter, court: e.target.value })}
                  icon={Scale}
                  options={courtOptions.length > 0 ? courtOptions : COURT_OPTIONS}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 650, color: '#334155' }}>
                    <Calendar size={13} color="#4338ca" />
                    <span>Next Scheduled Hearing Date</span>
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Upcoming dates only
                  </span>
                </div>
                <CustomDatePicker
                  name="nextHearingDate"
                  value={newMatter.nextHearingDate}
                  minDate={new Date()}
                  placeholder="Select court hearing date..."
                  onChange={(e) => {
                    const val = e.target.value;
                    const todayStr = new Date().toISOString().split('T')[0];
                    if (val && val < todayStr) {
                      showWarning('Hearing date cannot be a past date. Please select today or a future date.', 'Past Date Not Allowed');
                      return;
                    }
                    setNewMatter({ ...newMatter, nextHearingDate: val });
                  }}
                />
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem' }}>
                  Select the upcoming court listing date from the interactive calendar.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{ padding: '0.55rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: '#475569', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', backgroundColor: '#4338ca', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Create Matter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Matter Modal */}
      {showEditModal && editMatter && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem 1rem', overflowY: 'auto' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.75rem', width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', margin: 'auto' }}>
            <button
              onClick={() => setShowEditModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Edit Legal Matter
              </h3>
              <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 7px', borderRadius: '4px' }}>
                {editMatter.matterNumber}
              </span>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 1.25rem 0' }}>
              Update case details, forum venue, litigation stage, and hearing dates.
            </p>

            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Matter Title *
                </label>
                <input
                  type="text"
                  value={editMatter.title}
                  onChange={(e) => setEditMatter({ ...editMatter, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Client Name *
                </label>
                <input
                  type="text"
                  value={editMatter.clientName}
                  onChange={(e) => setEditMatter({ ...editMatter, clientName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  required
                />
              </div>

              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.85rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 650, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Scale size={14} color="#0284c7" />
                    <span>Court / Judicial Forum</span>
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                    Jurisdiction Venue
                  </span>
                </div>
                <CustomSelect
                  value={editMatter.court}
                  onChange={(e) => setEditMatter({ ...editMatter, court: e.target.value })}
                  icon={Scale}
                  options={courtOptions.length > 0 ? courtOptions : COURT_OPTIONS}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                  Status
                </label>
                <CustomSelect
                  value={editMatter.status}
                  onChange={(e) => setEditMatter({ ...editMatter, status: e.target.value })}
                  icon={Layers}
                  options={STATUS_OPTIONS}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 650, color: '#334155' }}>
                    <Calendar size={13} color="#0284c7" />
                    <span>Next Scheduled Hearing Date</span>
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Upcoming dates only
                  </span>
                </div>
                <CustomDatePicker
                  name="nextHearingDate"
                  value={
                    editMatter.nextHearingDate && !isNaN(Date.parse(editMatter.nextHearingDate))
                      ? new Date(editMatter.nextHearingDate).toISOString().split('T')[0]
                      : (editMatter.nextHearingDate || '')
                  }
                  minDate={new Date()}
                  placeholder="Select court hearing date..."
                  onChange={(e) => {
                    const val = e.target.value;
                    const todayStr = new Date().toISOString().split('T')[0];
                    if (val && val < todayStr) {
                      showWarning('Hearing date cannot be a past date. Please select today or a future date.', 'Past Date Not Allowed');
                      return;
                    }
                    setEditMatter({ ...editMatter, nextHearingDate: val });
                  }}
                />
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.35rem' }}>
                  Select the upcoming court listing date from the interactive calendar.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: '0.55rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: '#475569', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.55rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', backgroundColor: '#0284c7', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup Modal */}
      <ConfirmModal
        isOpen={Boolean(matterToDelete)}
        title="Delete Litigation Matter?"
        message={
          matterToDelete
            ? `Are you sure you want to permanently delete "${matterToDelete.title}" (${matterToDelete.matterNumber})? All associated documents and filings will be unlinked.`
            : ''
        }
        confirmText="Delete Matter"
        cancelText="Keep Matter"
        danger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setMatterToDelete(null)}
      />
    </div>
  );
};

export default MattersPage;
