import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/api';
import CustomDropdown from '../components/CustomDropdown';
import ConfirmModal from '../components/modals/ConfirmModal';
import {
  Calendar,
  Mail,
  Phone,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw,
  Trash2,
  ChevronRight,
  Eye,
  MessageSquare,
  Sparkles,
  User,
  CalendarCheck,
  Send,
  X,
  FileText,
  Download,
  Layers,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

const inquiriesStyles = `
  .inquiries-page-root {
    --ip-primary: #2563eb;
    --ip-border: #e2e8f0;
    --ip-text-main: #0f172a;
    --ip-text-muted: #64748b;
    --ip-bg-card: #ffffff;

    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--ip-text-main);
    overflow-x: hidden;
  }

  .inquiries-page-root * {
    box-sizing: border-box;
  }

  /* 1. Header */
  .inquiries-page-root .ip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    background: var(--ip-bg-card);
    padding: 14px 20px;
    border-radius: 12px;
    border: 1px solid var(--ip-border);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
    flex-wrap: wrap;
  }

  .inquiries-page-root .ip-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .inquiries-page-root .ip-header-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
    flex-shrink: 0;
  }

  .inquiries-page-root .ip-title {
    margin: 0;
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .inquiries-page-root .ip-subtitle {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--ip-text-muted);
  }

  .inquiries-page-root .ip-header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 2. Top Metric Cards - 4 Equal Compact Columns */
  .inquiries-page-root .ip-metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
  }

  @media (max-width: 1024px) {
    .inquiries-page-root .ip-metrics-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .inquiries-page-root .ip-metric-card {
    background: var(--ip-bg-card);
    border: 1px solid var(--ip-border);
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .inquiries-page-root .ip-metric-card:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(15, 23, 42, 0.05);
  }

  .inquiries-page-root .ip-metric-card.active-card {
    border-color: #2563eb;
    box-shadow: 0 0 0 1.5px #2563eb;
  }

  .inquiries-page-root .ip-metric-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .inquiries-page-root .ip-metric-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--ip-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 2px;
  }

  .inquiries-page-root .ip-metric-val {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .inquiries-page-root .ip-metric-subtext {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 2px;
  }

  .inquiries-page-root .ip-metric-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* 3. Control & Filter Toolbar */
  .inquiries-page-root .ip-filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--ip-bg-card);
    border: 1px solid var(--ip-border);
    border-radius: 10px;
    padding: 8px 12px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.02);
    flex-wrap: wrap;
  }

  .inquiries-page-root .ip-segmented-tabs {
    display: inline-flex;
    align-items: center;
    background: #f1f5f9;
    padding: 3px;
    border-radius: 8px;
    gap: 2px;
  }

  .inquiries-page-root .ip-tab-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 6px;
    border: none;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    background: transparent;
    color: #64748b;
    transition: all 0.15s ease;
  }

  .inquiries-page-root .ip-tab-btn.active {
    background: #ffffff;
    color: #0f172a;
    font-weight: 750;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
  }

  .inquiries-page-root .ip-tab-count {
    font-size: 10.5px;
    font-weight: 750;
    padding: 1px 6px;
    border-radius: 8px;
    background: #e2e8f0;
    color: #475569;
  }

  .inquiries-page-root .ip-tab-btn.active .ip-tab-count {
    background: #eff6ff;
    color: #2563eb;
  }

  .inquiries-page-root .ip-search-box {
    position: relative;
    flex: 1 1 240px;
    max-width: 320px;
    min-width: 200px;
  }

  .inquiries-page-root .ip-search-input {
    width: 100%;
    height: 34px;
    padding: 0 28px 0 32px;
    border: 1px solid #dce2ed;
    border-radius: 7px;
    font-size: 12px;
    background: #f8fafc;
    color: #0f172a;
    outline: none;
    transition: all 0.15s ease;
    font-family: inherit;
  }

  .inquiries-page-root .ip-search-input:focus {
    background: #ffffff;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }

  /* 4. Table Box */
  .inquiries-page-root .ip-table-box {
    background: var(--ip-bg-card);
    border: 1px solid var(--ip-border);
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .inquiries-page-root .ip-table-viewport {
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    max-height: calc(100vh - 310px);
    min-height: 280px;
  }

  .inquiries-page-root .ip-table-viewport::-webkit-scrollbar {
    width: 6px;
  }
  .inquiries-page-root .ip-table-viewport::-webkit-scrollbar-track {
    background: #f8fafc;
  }
  .inquiries-page-root .ip-table-viewport::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  .inquiries-page-root .ip-table-viewport::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  .inquiries-page-root .ip-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    text-align: left;
    font-size: 12.5px;
  }

  .inquiries-page-root .ip-table thead {
    background: #f8fafc;
    border-bottom: 1px solid var(--ip-border);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .inquiries-page-root .ip-table-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: #f8fafc;
    border-top: 1px solid var(--ip-border);
    flex-shrink: 0;
  }

  .inquiries-page-root .ip-table th {
    padding: 10px 14px;
    color: #64748b;
    font-size: 10.5px;
    font-weight: 750;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .inquiries-page-root .ip-table td {
    padding: 12px 14px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
    overflow: hidden;
  }

  .inquiries-page-root .ip-table tbody tr {
    transition: background-color 0.12s ease;
  }

  .inquiries-page-root .ip-table tbody tr:hover {
    background-color: #f8fafc;
  }

  .inquiries-page-root .ip-table tbody tr:last-child td {
    border-bottom: none;
  }

  /* Status Pills */
  .inquiries-page-root .ip-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }

  .inquiries-page-root .ip-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  /* Two-line text clamp helper */
  .ip-line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.35;
  }
`;

const STATUS_CONFIG = {
  New: {
    bg: '#fef3c7',
    color: '#92400e',
    border: '#fde68a',
    dot: '#d97706',
    label: 'New Request',
  },
  Contacted: {
    bg: '#eff6ff',
    color: '#1d4ed8',
    border: '#bfdbfe',
    dot: '#2563eb',
    label: 'Contacted',
  },
  Scheduled: {
    bg: '#f3e8ff',
    color: '#7e22ce',
    border: '#e9d5ff',
    dot: '#9333ea',
    label: 'Demo Booked',
  },
  'In Progress': {
    bg: '#e0f2fe',
    color: '#0369a1',
    border: '#bae6fd',
    dot: '#0284c7',
    label: 'In Progress',
  },
  Resolved: {
    bg: '#ecfdf5',
    color: '#065f46',
    border: '#a7f3d0',
    dot: '#10b981',
    label: 'Resolved',
  },
  Completed: {
    bg: '#ecfdf5',
    color: '#065f46',
    border: '#a7f3d0',
    dot: '#10b981',
    label: 'Completed',
  },
  Closed: {
    bg: '#f1f5f9',
    color: '#475569',
    border: '#cbd5e1',
    dot: '#64748b',
    label: 'Closed',
  },
};

export default function InquiriesView() {
  const { addToast } = useAdmin();

  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, demo: 0, contact: 0, newRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'demo' | 'contact'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteTargetLead, setDeleteTargetLead] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [modalNotes, setModalNotes] = useState('');
  const [modalStatus, setModalStatus] = useState('New');

  // Close details modal on Escape
  useEffect(() => {
    if (!selectedLead) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setSelectedLead(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [selectedLead]);

  const fetchLeads = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      if (typeof adminApi?.getLeads !== 'function') {
        return;
      }
      const res = await adminApi.getLeads({
        kind: activeTab === 'all' ? '' : activeTab,
        status: statusFilter === 'all' ? '' : statusFilter,
        search: searchQuery.trim(),
        limit: 100,
      });

      if (res?.success) {
        setLeads(res.leads || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching customer inquiries:', err);
      addToast(err.message || 'Failed to fetch customer inquiries', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, statusFilter, searchQuery, addToast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleOpenDetails = (lead) => {
    setSelectedLead(lead);
    setModalStatus(lead.status || 'New');
    setModalNotes(lead.notes || '');
  };

  const handleSaveModalUpdates = async () => {
    if (!selectedLead) return;
    setIsUpdatingStatus(true);
    const leadId = selectedLead.id || selectedLead._id;
    try {
      if (typeof adminApi?.updateLead === 'function') {
        const res = await adminApi.updateLead(leadId, {
          status: modalStatus,
          notes: modalNotes,
        });
        if (res?.success) {
          addToast('Customer request details saved successfully');
          setLeads((prev) =>
            prev.map((l) =>
              (l.id || l._id) === leadId ? { ...l, status: modalStatus, notes: modalNotes } : l
            )
          );
          setSelectedLead((prev) => (prev ? { ...prev, status: modalStatus, notes: modalNotes } : null));
          fetchLeads(true);
        }
      }
    } catch (err) {
      addToast(err.message || 'Failed to update customer request', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!deleteTargetLead || isDeleting) return;
    const leadId = deleteTargetLead.id || deleteTargetLead._id;
    setIsDeleting(true);
    try {
      if (typeof adminApi?.deleteLead === 'function') {
        const res = await adminApi.deleteLead(leadId);
        if (res?.success) {
          addToast('Customer request permanently deleted from database', 'success');
          setLeads((prev) => prev.filter((l) => (l.id || l._id) !== leadId));
          if (selectedLead && (selectedLead.id || selectedLead._id) === leadId) {
            setSelectedLead(null);
          }
          setDeleteTargetLead(null);
          fetchLeads(true);
        } else {
          addToast(res?.message || 'Failed to delete request from database', 'error');
        }
      }
    } catch (err) {
      console.error('Error deleting customer request:', err);
      addToast(err.message || 'Failed to delete request from database', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCsv = () => {
    if (!leads.length) {
      addToast('No inquiries to export', 'info');
      return;
    }

    const headers = ['Type', 'Customer Name', 'Email', 'Mobile', 'Organisation', 'Role', 'Org Size', 'Target Demo Date', 'Use Cases', 'Subject', 'Message', 'Status', 'Submitted At'];
    const rows = leads.map((l) => [
      l.kind === 'demo' ? 'Book a Demo' : 'Contact Us',
      `"${(l.name || `${l.firstName || ''} ${l.lastName || ''}`.trim() || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.mobile || '').replace(/"/g, '""')}"`,
      `"${(l.organisation || '').replace(/"/g, '""')}"`,
      `"${(l.role || '').replace(/"/g, '""')}"`,
      `"${(l.orgSize || '').replace(/"/g, '""')}"`,
      `"${(l.demoDate || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(l.useCases) ? l.useCases.join(', ') : '').replace(/"/g, '""')}"`,
      `"${(l.subject || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      l.status || 'New',
      `"${new Date(l.createdAt || Date.now()).toISOString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `legal_ai_customer_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Inquiries exported as CSV successfully');
  };

  const formatDate = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const getRelativeTime = (isoString) => {
    if (!isoString) return '';
    try {
      const now = new Date();
      const past = new Date(isoString);
      const diffMs = now - past;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return `${diffDays}d ago`;
      if (diffHours > 0) return `${diffHours}h ago`;
      if (diffMins > 0) return `${diffMins}m ago`;
      return 'just now';
    } catch {
      return '';
    }
  };

  const statusDropdownOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'New', label: 'New Requests' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Scheduled', label: 'Demo Booked' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' },
  ];

  const updateStatusDropdownOptions = [
    { value: 'New', label: 'New Request' },
    { value: 'Contacted', label: 'Contacted (Call / Email Sent)' },
    { value: 'Scheduled', label: 'Demo Booked (Meeting Scheduled)' },
    { value: 'In Progress', label: 'In Progress (Active Discussion)' },
    { value: 'Resolved', label: 'Resolved / Client Onboarded' },
    { value: 'Closed', label: 'Closed / Not Interested' },
  ];

  return (
    <div className="inquiries-page-root">
      <style>{inquiriesStyles}</style>

      {/* 1. Header Card */}
      <div className="ip-header">
        <div className="ip-header-left">
          <div className="ip-header-icon">
            <CalendarCheck size={20} />
          </div>
          <div>
            <h1 className="ip-title">Customer Inquiries & Demo Requests</h1>
            <p className="ip-subtitle">
              Incoming visitor submissions from homepage <strong>Book a Demo</strong> and <strong>Contact Us</strong> forms.
            </p>
          </div>
        </div>

        <div className="ip-header-actions">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!leads.length}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '7px',
              border: '1px solid #dce2ed',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 650,
              cursor: leads.length ? 'pointer' : 'not-allowed',
              opacity: leads.length ? 1 : 0.6,
              transition: 'all 0.15s ease',
            }}
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards - 4 Equal Fixed Columns */}
      <div className="ip-metrics-grid">
        {/* Card 1: All Submissions */}
        <div
          className={`ip-metric-card ${activeTab === 'all' && statusFilter === 'all' ? 'active-card' : ''}`}
          onClick={() => {
            setActiveTab('all');
            setStatusFilter('all');
          }}
        >
          <div className="ip-metric-info">
            <span className="ip-metric-label">All Submissions</span>
            <div className="ip-metric-val">{stats.total || leads.length}</div>
            <span className="ip-metric-subtext">Total requests received</span>
          </div>
          <div className="ip-metric-icon-wrap" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Layers size={18} />
          </div>
        </div>

        {/* Card 2: Book a Demo */}
        <div
          className={`ip-metric-card ${activeTab === 'demo' ? 'active-card' : ''}`}
          onClick={() => {
            setActiveTab('demo');
            setStatusFilter('all');
          }}
        >
          <div className="ip-metric-info">
            <span className="ip-metric-label" style={{ color: '#7c3aed' }}>Book a Demo</span>
            <div className="ip-metric-val" style={{ color: '#7c3aed' }}>{stats.demo || 0}</div>
            <span className="ip-metric-subtext">Scheduled consultations</span>
          </div>
          <div className="ip-metric-icon-wrap" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
            <Calendar size={18} />
          </div>
        </div>

        {/* Card 3: Contact Us */}
        <div
          className={`ip-metric-card ${activeTab === 'contact' ? 'active-card' : ''}`}
          onClick={() => {
            setActiveTab('contact');
            setStatusFilter('all');
          }}
        >
          <div className="ip-metric-info">
            <span className="ip-metric-label" style={{ color: '#0284c7' }}>Contact Us</span>
            <div className="ip-metric-val" style={{ color: '#0284c7' }}>{stats.contact || 0}</div>
            <span className="ip-metric-subtext">General inquiries</span>
          </div>
          <div className="ip-metric-icon-wrap" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
            <Mail size={18} />
          </div>
        </div>

        {/* Card 4: Action Required */}
        <div
          className={`ip-metric-card ${statusFilter === 'New' ? 'active-card' : ''}`}
          onClick={() => {
            setStatusFilter((prev) => (prev === 'New' ? 'all' : 'New'));
          }}
          style={{
            borderColor: (stats.newRequests || 0) > 0 ? '#fde68a' : undefined,
            backgroundColor: (stats.newRequests || 0) > 0 ? '#fffdf5' : undefined,
          }}
        >
          <div className="ip-metric-info">
            <span className="ip-metric-label" style={{ color: '#d97706' }}>Action Required</span>
            <div className="ip-metric-val" style={{ color: '#d97706' }}>
              {stats.newRequests || leads.filter((l) => l.status === 'New').length}
            </div>
            <span className="ip-metric-subtext" style={{ color: '#b45309', fontWeight: 600 }}>
              New & awaiting contact
            </span>
          </div>
          <div className="ip-metric-icon-wrap" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <AlertCircle size={18} />
          </div>
        </div>
      </div>

      {/* 3. Control & Filter Toolbar */}
      <div className="ip-filter-bar">
        {/* Segmented Category Buttons */}
        <div className="ip-segmented-tabs">
          <button
            type="button"
            className={`ip-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <Layers size={13} />
            <span>All Requests</span>
            <span className="ip-tab-count">{stats.total || leads.length}</span>
          </button>

          <button
            type="button"
            className={`ip-tab-btn ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => setActiveTab('demo')}
          >
            <Calendar size={13} style={{ color: '#7c3aed' }} />
            <span>Book a Demo</span>
            <span className="ip-tab-count">{stats.demo || 0}</span>
          </button>

          <button
            type="button"
            className={`ip-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <Mail size={13} style={{ color: '#0284c7' }} />
            <span>Contact Us</span>
            <span className="ip-tab-count">{stats.contact || 0}</span>
          </button>
        </div>

        {/* Right side: Search Box and Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 auto', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {/* Search box */}
          <div className="ip-search-box">
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              className="ip-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, firm, email, phone..."
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div style={{ width: '165px' }}>
            <CustomDropdown
              options={statusDropdownOptions}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              placeholder="Filter Status"
            />
          </div>

          {/* Right-side table refresh icon */}
          <button
            type="button"
            onClick={() => fetchLeads(true)}
            title="Refresh submissions"
            disabled={refreshing}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'transparent',
              border: 'none',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 4. Data Table Container - Fixed 100% Responsive Grid */}
      <div className="ip-table-box">
        {loading ? (
          <div
            style={{
              padding: '50px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              color: '#64748b',
            }}
          >
            <RefreshCw size={22} style={{ animation: 'spin 1s linear infinite', color: '#2563eb' }} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Loading customer inquiries...</span>
          </div>
        ) : leads.length === 0 ? (
          <div
            style={{
              padding: '50px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
              }}
            >
              <Mail size={20} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '14.5px', fontWeight: 750, color: '#1e293b' }}>
                No Inquiries Found
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b', maxWidth: '360px' }}>
                {searchQuery || statusFilter !== 'all'
                  ? 'No records match your active search or status filter.'
                  : 'Customer submissions will automatically appear here.'}
              </p>
            </div>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                style={{
                  marginTop: '6px',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid #dce2ed',
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  fontSize: '11.5px',
                  fontWeight: 650,
                  cursor: 'pointer',
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="ip-table-viewport">
            <table className="ip-table">
              <colgroup>
              <col style={{ width: '24%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: '23%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '9%' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Customer & Firm</th>
                <th>Type</th>
                <th>Contact Details</th>
                <th>Requirements / Note</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const leadId = lead.id || lead._id;
                const isDemo = lead.kind === 'demo';
                const statusInfo = STATUS_CONFIG[lead.status] || STATUS_CONFIG.New;

                const customerName = lead.name || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Visitor';
                const initials = (customerName || 'CU')
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                const orgName = lead.organisation || 'Individual Legal Practice';

                return (
                  <tr key={leadId}>
                    {/* Col 1: Customer & Firm (24%) */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: isDemo ? '#f5f3ff' : '#eff6ff',
                            color: isDemo ? '#7c3aed' : '#2563eb',
                            border: `1.5px solid ${isDemo ? '#e9d5ff' : '#dbeafe'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '11.5px',
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                          <div
                            onClick={() => handleOpenDetails(lead)}
                            style={{
                              fontWeight: 750,
                              color: '#0f172a',
                              cursor: 'pointer',
                              fontSize: '12.5px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                            title={customerName}
                          >
                            {customerName}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: '#64748b',
                              marginTop: '1px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                            title={`${orgName} ${lead.role ? `• ${lead.role}` : ''}`}
                          >
                            <Building2 size={11} style={{ flexShrink: 0, color: '#94a3b8' }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {orgName}
                            </span>
                            {lead.role && (
                              <span style={{ color: '#94a3b8', flexShrink: 0 }}>• {lead.role}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Type (11%) */}
                    <td>
                      {isDemo ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f5f3ff',
                            color: '#7c3aed',
                            border: '1px solid #ddd6fe',
                            fontSize: '11px',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Calendar size={11} />
                          <span>Demo</span>
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f0f9ff',
                            color: '#0284c7',
                            border: '1px solid #bae6fd',
                            fontSize: '11px',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Mail size={11} />
                          <span>Contact</span>
                        </span>
                      )}
                    </td>

                    {/* Col 3: Contact Details (22%) */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                        {lead.email ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                            <a
                              href={`mailto:${lead.email}`}
                              style={{
                                color: '#2563eb',
                                textDecoration: 'none',
                                fontSize: '11.5px',
                                fontWeight: 550,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                                flex: 1,
                              }}
                              title={lead.email}
                            >
                              {lead.email}
                            </a>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>—</span>
                        )}

                        {lead.mobile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                            <a
                              href={`tel:${lead.mobile}`}
                              style={{
                                color: '#475569',
                                textDecoration: 'none',
                                fontSize: '11px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                                flex: 1,
                              }}
                            >
                              {lead.mobile}
                            </a>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Col 4: Requirements / Note (23%) */}
                    <td>
                      <div style={{ minWidth: 0 }}>
                        {isDemo ? (
                          <div>
                            {lead.demoDate && (
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  color: '#7c3aed',
                                  backgroundColor: '#f5f3ff',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  marginBottom: '3px',
                                }}
                              >
                                <span>Demo: {lead.demoDate}</span>
                              </div>
                            )}
                            <div
                              className="ip-line-clamp-2"
                              style={{
                                fontSize: '11px',
                                color: '#64748b',
                              }}
                              title={lead.message || (lead.useCases && lead.useCases.join(', ')) || 'General consultation'}
                            >
                              {lead.message || (lead.useCases && lead.useCases.join(', ')) || 'General consultation'}
                            </div>
                          </div>
                        ) : (
                          <div>
                            {lead.subject && (
                              <div
                                style={{
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  color: '#0f172a',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  marginBottom: '2px',
                                }}
                                title={lead.subject}
                              >
                                {lead.subject}
                              </div>
                            )}
                            <div
                              className="ip-line-clamp-2"
                              style={{
                                fontSize: '11px',
                                color: '#64748b',
                              }}
                              title={lead.message || 'Direct contact message'}
                            >
                              {lead.message || 'Direct contact message'}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Col 5: Status (11%) */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span
                          className="ip-status-badge"
                          style={{
                            backgroundColor: statusInfo.bg,
                            color: statusInfo.color,
                            border: `1px solid ${statusInfo.border}`,
                          }}
                        >
                          <span className="ip-status-dot" style={{ backgroundColor: statusInfo.dot }} />
                          <span>{statusInfo.label}</span>
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#94a3b8', paddingLeft: '4px' }}>
                          {getRelativeTime(lead.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Col 6: Action (9%) */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(lead)}
                          title="View Full Details"
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid #dce2ed',
                            backgroundColor: '#ffffff',
                            color: '#1e293b',
                            fontSize: '11px',
                            fontWeight: 650,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            transition: 'all 0.12s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#eff6ff';
                            e.currentTarget.style.borderColor = '#93c5fd';
                            e.currentTarget.style.color = '#2563eb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                            e.currentTarget.style.borderColor = '#dce2ed';
                            e.currentTarget.style.color = '#1e293b';
                          }}
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTargetLead(lead)}
                          title="Delete Request"
                          style={{
                            padding: '4px 6px',
                            borderRadius: '6px',
                            border: '1px solid #fee2e2',
                            backgroundColor: '#fff5f5',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.12s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fecaca';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff5f5';
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pinned Box Footer */}
      {leads.length > 0 && !loading && (
        <div className="ip-table-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#64748b' }}>
            <span>Showing <strong>{leads.length}</strong> inquiries</span>
            <span>•</span>
            <span>Click any customer name or <strong>View</strong> for full details</span>
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
            Scroll vertically inside box to view all records
          </div>
        </div>
      )}
    </div>

      {/* 5. Comprehensive Details Modal */}
      {selectedLead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setSelectedLead(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 20px',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                borderTopLeftRadius: '14px',
                borderTopRightRadius: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: selectedLead.kind === 'demo' ? '#f5f3ff' : '#eff6ff',
                    color: selectedLead.kind === 'demo' ? '#7c3aed' : '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedLead.kind === 'demo' ? <CalendarCheck size={20} /> : <Mail size={20} />}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                    {selectedLead.name || 'Customer Request'}
                  </h2>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    {selectedLead.kind === 'demo' ? 'Book a Demo' : 'Contact Us'} • Received on {formatDate(selectedLead.createdAt)} ({getRelativeTime(selectedLead.createdAt)})
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: '6px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quick Action Contact Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  Direct Response:
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedLead.email && (
                    <a
                      href={`mailto:${selectedLead.email}?subject=Legal AI Platform Demonstration`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 650,
                        textDecoration: 'none',
                      }}
                    >
                      <Send size={12} />
                      <span>Send Email</span>
                    </a>
                  )}
                  {selectedLead.mobile && (
                    <a
                      href={`tel:${selectedLead.mobile}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        color: '#1e293b',
                        border: '1px solid #cbd5e1',
                        fontSize: '11.5px',
                        fontWeight: 650,
                        textDecoration: 'none',
                      }}
                    >
                      <Phone size={12} />
                      <span>Call Client</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Customer Info Card */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                }}
              >
                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Email
                  </div>
                  <div style={{ color: '#2563eb', fontWeight: 600, fontSize: '12.5px', marginTop: '2px' }}>
                    {selectedLead.email || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Mobile
                  </div>
                  <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '12.5px', marginTop: '2px' }}>
                    {selectedLead.mobile || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Organisation / Firm
                  </div>
                  <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '12.5px', marginTop: '2px' }}>
                    {selectedLead.organisation || 'Individual Practice'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Role & Team Size
                  </div>
                  <div style={{ color: '#0f172a', fontWeight: 600, fontSize: '12.5px', marginTop: '2px' }}>
                    {selectedLead.role || 'Legal Professional'} {selectedLead.orgSize ? `(${selectedLead.orgSize})` : ''}
                  </div>
                </div>
              </div>

              {/* Demo Fields */}
              {selectedLead.kind === 'demo' && (
                <div
                  style={{
                    backgroundColor: '#faf5ff',
                    border: '1px solid #e9d5ff',
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CalendarCheck size={14} color="#7c3aed" />
                    <span style={{ fontSize: '12px', fontWeight: 750, color: '#5b21b6' }}>
                      Demo Booking Details
                    </span>
                  </div>

                  {selectedLead.demoDate && (
                    <div style={{ fontSize: '12px', color: '#4c1d95' }}>
                      Preferred Date: <strong>{selectedLead.demoDate}</strong>
                      {selectedLead.extra?.timeSlot && ` • ${selectedLead.extra.timeSlot}`}
                    </div>
                  )}

                  {selectedLead.useCases && selectedLead.useCases.length > 0 && (
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b21a8', marginBottom: '4px' }}>
                        Requested Features:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {selectedLead.useCases.map((uc, i) => (
                          <span
                            key={i}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#ffffff',
                              color: '#6b21a8',
                              border: '1px solid #ddd6fe',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            {uc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Message / Subject */}
              {(selectedLead.subject || selectedLead.message) && (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '14px',
                  }}
                >
                  {selectedLead.subject && (
                    <div style={{ fontSize: '13px', fontWeight: 750, color: '#0f172a', marginBottom: '6px' }}>
                      Subject: {selectedLead.subject}
                    </div>
                  )}
                  {selectedLead.message && (
                    <div
                      style={{
                        fontSize: '12.5px',
                        color: '#334155',
                        lineHeight: 1.55,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {selectedLead.message}
                    </div>
                  )}
                </div>
              )}

              {/* Status Update & Notes */}
              <div
                style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 750, color: '#0f172a' }}>
                    Status:
                  </label>
                  <div style={{ width: '220px' }}>
                    <CustomDropdown
                      options={updateStatusDropdownOptions}
                      value={modalStatus}
                      onChange={(val) => setModalStatus(val)}
                      placeholder="Select status"
                      searchPlaceholder="Search status..."
                      direction="up"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 650, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Internal Admin Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    placeholder="Record notes, call feedback, scheduled meeting link..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '7px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      color: '#0f172a',
                      fontFamily: 'inherit',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                    onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 20px',
                backgroundColor: '#f8fafc',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomLeftRadius: '14px',
                borderBottomRightRadius: '14px',
              }}
            >
              <button
                type="button"
                onClick={() => setDeleteTargetLead(selectedLead)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #fee2e2',
                  backgroundColor: '#ffffff',
                  color: '#dc2626',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalUpdates}
                  disabled={isUpdatingStatus}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 650,
                    cursor: isUpdatingStatus ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isUpdatingStatus ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetLead && (
        <ConfirmModal
          isOpen={Boolean(deleteTargetLead)}
          title="Delete Customer Request"
          message={`Are you sure you want to delete the ${
            deleteTargetLead.kind === 'demo' ? 'demo request' : 'inquiry'
          } from "${deleteTargetLead.name || 'this customer'}"? This will permanently delete the record from the database.`}
          confirmLabel={isDeleting ? 'Deleting...' : 'Delete Permanently'}
          confirmVariant="danger"
          danger={true}
          isDanger={true}
          isLoading={isDeleting}
          onConfirm={handleDeleteLead}
          onCancel={() => !isDeleting && setDeleteTargetLead(null)}
        />
      )}
    </div>
  );
}
