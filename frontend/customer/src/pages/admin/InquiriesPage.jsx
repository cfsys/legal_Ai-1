import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  X,
  FileText,
  User,
  Sparkles,
  Inbox,
  Save,
} from 'lucide-react';
import { inquiryService } from '../../services/api';
import { toast } from '../../context/ToastContext';
import CustomSelect from '../../components/common/CustomSelect';

const STATUS_BADGE_STYLES = {
  New: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#1d4ed8',
    dot: '#2563eb',
  },
  Contacted: {
    bg: '#f5f3ff',
    border: '#ddd6fe',
    color: '#6d28d9',
    dot: '#7c3aed',
  },
  Scheduled: {
    bg: '#ecfdf5',
    border: '#a7f3d0',
    color: '#047857',
    dot: '#059669',
  },
  Completed: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    color: '#15803d',
    dot: '#16a34a',
  },
  Closed: {
    bg: '#f8fafc',
    border: '#e2e8f0',
    color: '#64748b',
    dot: '#94a3b8',
  },
};

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [kindFilter, setKindFilter] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (selectedInquiry) setSelectedInquiry(null);
        if (deleteConfirmId) setDeleteConfirmId(null);
      }
    };
    if (selectedInquiry || deleteConfirmId) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInquiry, deleteConfirmId]);

  // Fetch messages from server
  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await inquiryService.getAll();
      const list = res?.leads || [];
      setInquiries(list);
    } catch (err) {
      console.error('[Fetch Inquiries Error]', err);
      toast.error('Unable to load messages at this moment', 'Connection Issue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Update status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await inquiryService.updateStatus(id, { status: newStatus });
      setInquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedInquiry?._id === id) {
        setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Marked as ${newStatus}`);
    } catch (err) {
      console.error('[Update Status Error]', err);
      toast.error('Could not update status');
    }
  };

  // Save admin notes
  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    try {
      await inquiryService.updateStatus(selectedInquiry._id, { notes: adminNotes });
      setInquiries((prev) =>
        prev.map((item) =>
          item._id === selectedInquiry._id ? { ...item, notes: adminNotes } : item
        )
      );
      setSelectedInquiry((prev) => ({ ...prev, notes: adminNotes }));
      toast.success('Notes saved');
    } catch (err) {
      console.error('[Save Notes Error]', err);
      toast.error('Could not save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  // Delete message
  const handleDelete = async (id) => {
    try {
      await inquiryService.delete(id);
      setInquiries((prev) => prev.filter((item) => item._id !== id));
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(null);
      }
      setDeleteConfirmId(null);
      toast.success('Message deleted');
    } catch (err) {
      console.error('[Delete Error]', err);
      toast.error('Could not delete message');
    }
  };

  // Filter messages
  const filtered = inquiries.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.name?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.organisation?.toLowerCase().includes(q) ||
      item.subject?.toLowerCase().includes(q) ||
      item.mobile?.includes(q) ||
      item.message?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesKind = kindFilter === 'All' || item.kind === kindFilter;

    return matchesSearch && matchesStatus && matchesKind;
  });

  // Simple counts
  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === 'New').length;
  const inProgressCount = inquiries.filter((i) => i.status === 'Contacted' || i.status === 'Scheduled').length;
  const completedCount = inquiries.filter((i) => i.status === 'Closed' || i.status === 'Completed').length;

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingBottom: '3rem',
      }}
    >
      {/* Top Banner (Matching modern workspace aesthetic) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquare size={19} strokeWidth={2.2} />
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
              Client Inquiries & Contact Leads
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Review, manage, and respond to incoming inquiries and demo requests submitted via the platform.
            </p>
          </div>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={loading}
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
            cursor: 'pointer',
            transition: 'all 0.18s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
        >
          <RefreshCw size={14} color="#64748b" className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Total Messages
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            All incoming messages
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #bfdbfe',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.04)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase' }}>
            New Messages
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1d4ed8', marginTop: '0.35rem' }}>
            {newCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '0.2rem' }}>
            Needs a reply
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase' }}>
            In Progress
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#6d28d9', marginTop: '0.35rem' }}>
            {inProgressCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginTop: '0.2rem' }}>
            Currently in discussion
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.15rem 1.25rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', textTransform: 'uppercase' }}>
            Completed
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#047857', marginTop: '0.35rem' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.2rem' }}>
            Handled & closed
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by name, email, organisation, or words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#0f172a',
              backgroundColor: 'transparent',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Status Filter */}
          <div style={{ minWidth: '150px' }}>
            <CustomSelect
              size="sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'All', label: 'All Statuses' },
                { value: 'New', label: 'New' },
                { value: 'Contacted', label: 'Contacted' },
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Closed', label: 'Closed' },
              ]}
            />
          </div>

          {/* Type Filter */}
          <div style={{ minWidth: '165px' }}>
            <CustomSelect
              size="sm"
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value)}
              options={[
                { value: 'All', label: 'All Types' },
                { value: 'contact', label: 'Contact Messages' },
                { value: 'demo', label: 'Demo Requests' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Messages List Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
        }}
      >
        {loading ? (
          <div style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.75rem', color: '#2563eb' }} />
            <p style={{ fontSize: '0.85rem' }}>Loading messages...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748b' }}>
            <Inbox size={32} style={{ margin: '0 auto 0.75rem', color: '#94a3b8' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>
              No Messages Found
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '340px', margin: '0 auto' }}>
              {searchQuery || statusFilter !== 'All' || kindFilter !== 'All'
                ? 'No messages match your search. Try changing the filters.'
                : 'No messages have been received yet.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 650, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Sender</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Subject</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Source</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.825rem' }}>
                {filtered.map((item) => {
                  const initials = (item.name || 'User')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  const badge = STATUS_BADGE_STYLES[item.status] || STATUS_BADGE_STYLES.New;
                  const formattedDate = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Recent';

                  return (
                    <tr
                      key={item._id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Sender */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#0f172a',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.725rem',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 650, color: '#0f172a' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span>{item.email}</span>
                              {item.mobile && <span>· {item.mobile}</span>}
                            </div>
                            {item.organisation && (
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                {item.organisation} {item.role ? `(${item.role})` : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '280px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.subject || (item.kind === 'demo' ? 'Product Demo Request' : 'General Inquiry')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.message || 'No message text provided.'}
                        </div>
                      </td>

                      {/* Source */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            fontSize: '0.725rem',
                            fontWeight: 500,
                            color: '#475569',
                            backgroundColor: '#f1f5f9',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '5px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.source || 'Website'}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              backgroundColor: badge.dot,
                              display: 'inline-block',
                            }}
                          />
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item._id, e.target.value)}
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 650,
                              color: badge.color,
                              backgroundColor: badge.bg,
                              border: `1px solid ${badge.border}`,
                              borderRadius: '5px',
                              padding: '0.2rem 0.45rem',
                              cursor: 'pointer',
                              outline: 'none',
                            }}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.775rem', whiteSpace: 'nowrap' }}>
                        {formattedDate}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            onClick={() => {
                              setSelectedInquiry(item);
                              setAdminNotes(item.notes || '');
                            }}
                            title="View message details"
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              backgroundColor: '#ffffff',
                              color: '#334155',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>

                          {deleteConfirmId === item._id ? (
                            <button
                              onClick={() => handleDelete(item._id)}
                              style={{
                                padding: '0.35rem 0.55rem',
                                borderRadius: '6px',
                                border: '1px solid #fecaca',
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                                fontSize: '0.725rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Delete?
                            </button>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(item._id)}
                              title="Delete message"
                              style={{
                                padding: '0.35rem',
                                borderRadius: '6px',
                                border: '1px solid transparent',
                                backgroundColor: 'transparent',
                                color: '#94a3b8',
                                cursor: 'pointer',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#ef4444';
                                e.currentTarget.style.backgroundColor = '#fef2f2';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#94a3b8';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL - Clean & Friendly */}
      {selectedInquiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '2rem',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#2563eb',
                  }}
                >
                  Message #{selectedInquiry._id.slice(-6).toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '0.2rem 0 0 0' }}>
                  {selectedInquiry.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '0.35rem',
                  borderRadius: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Sender Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                padding: '1rem',
                marginBottom: '1.25rem',
                fontSize: '0.825rem',
              }}
            >
              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Email</div>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}
                >
                  <Mail size={13} />
                  <span>{selectedInquiry.email}</span>
                </a>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Phone</div>
                <div style={{ color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                  <Phone size={13} color="#64748b" />
                  <span>{selectedInquiry.mobile || 'Not provided'}</span>
                </div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Organisation</div>
                <div style={{ color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                  <Building2 size={13} color="#64748b" />
                  <span>{selectedInquiry.organisation || 'Not provided'}</span>
                </div>
              </div>

              <div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Source</div>
                <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.15rem' }}>
                  {selectedInquiry.source || 'Website'}
                </div>
              </div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Subject
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 650,
                  color: '#0f172a',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                {selectedInquiry.subject || 'General Inquiry'}
              </div>
            </div>

            {/* Message Body */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Message
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  color: '#334155',
                  padding: '0.85rem 1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedInquiry.message || 'No additional message text.'}
              </div>
            </div>

            {/* Status Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Status
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['New', 'Contacted', 'Scheduled', 'Completed', 'Closed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedInquiry._id, st)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '6px',
                      fontSize: '0.775rem',
                      fontWeight: 650,
                      cursor: 'pointer',
                      border: selectedInquiry.status === st ? '1px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: selectedInquiry.status === st ? '#eff6ff' : '#ffffff',
                      color: selectedInquiry.status === st ? '#2563eb' : '#475569',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Internal Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  Private Notes
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Visible to your team only</span>
              </div>
              <textarea
                rows={3}
                placeholder="Write private notes about this person or follow-up details..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.825rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                }}
              />
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.45rem 0.95rem',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Save size={13} />
                <span>{savingNotes ? 'Saving…' : 'Save Note'}</span>
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.65rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
              <a
                href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'Your Message to Legal AI')}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Mail size={14} />
                <span>Reply by Email</span>
              </a>

              <button
                onClick={() => setSelectedInquiry(null)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;
