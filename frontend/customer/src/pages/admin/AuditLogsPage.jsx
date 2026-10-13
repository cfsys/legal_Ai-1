import React, { useState } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Shield,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
} from 'lucide-react';
import { toast } from '../../context/ToastContext';
import CustomSelect from '../../components/common/CustomSelect';

const AuditLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const rawLogs = [
    { id: 1, user: 'manthan@legalai.in', name: 'Manthan Joshi', role: 'Partner', action: 'User authentication (MFA Success)', target: 'Console / Web', ip: '192.168.1.4', location: 'Mumbai, IN', time: 'Just now', type: 'Auth', status: 'Success' },
    { id: 2, user: 'cfsys.xyz@gmail.com', name: 'Chirag Poshiya', role: 'Counsel', action: 'Created litigation matter', target: 'Matter TAI-2026-0012', ip: '10.0.0.2', location: 'New Delhi, IN', time: '42 mins ago', type: 'Matters', status: 'Success' },
    { id: 3, user: 'priya@legalai.in', name: 'Priya Sharma', role: 'Senior Associate', action: 'Exported research memorandum', target: 'Promissory Estoppel Memo', ip: '10.0.0.2', location: 'New Delhi, IN', time: '1 hour ago', type: 'Research', status: 'Success' },
    { id: 4, user: 'rohan@legalai.in', name: 'Rohan Mehta', role: 'Associate', action: 'Ran contract risk analysis', target: 'Master Services Agreement v2.pdf', ip: '10.0.0.9', location: 'Bengaluru, IN', time: '3 hours ago', type: 'Contracts', status: 'Success' },
    { id: 5, user: 'admin@legalai.in', name: 'System Admin', role: 'Super Admin', action: 'Updated user role permissions', target: 'User: priya@legalai.in (+canContracts)', ip: '192.168.1.1', location: 'Mumbai, IN', time: '5 hours ago', type: 'Admin', status: 'Success' },
    { id: 6, user: 'ananya@legalai.in', name: 'Ananya Verma', role: 'Paralegal', action: 'Failed login attempt (Invalid password)', target: 'Web Login', ip: '182.72.102.14', location: 'Pune, IN', time: '8 hours ago', type: 'Auth', status: 'Flagged' },
    { id: 7, user: 'cfsys.xyz@gmail.com', name: 'Chirag Poshiya', role: 'Counsel', action: 'Generated legal notice draft', target: 'Sec 138 NI Act Notice', ip: '10.0.0.2', location: 'New Delhi, IN', time: 'Yesterday', type: 'Drafting', status: 'Success' },
    { id: 8, user: 'admin@legalai.in', name: 'System Admin', role: 'Super Admin', action: 'Allocated credit top-up', target: '+250 AI Credits to cfsys.xyz@gmail.com', ip: '192.168.1.1', location: 'Mumbai, IN', time: '2 days ago', type: 'Admin', status: 'Success' },
  ];

  const filteredLogs = rawLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery);

    const matchesFilter = filterType === 'All' || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    toast.success('Audit log export initiated. CSV generated with 8 items.');
  };

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
            <ScrollText size={19} strokeWidth={2.2} />
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
              Enterprise Audit Logs & Activity Trail
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Immutable, chronological record of workspace activities, logins, data exports, and administrative actions.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
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
          <Download size={14} color="#64748b" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Action Toolbar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
          <div
            className="apple-search-container"
            style={{ width: '100%', maxWidth: '360px', height: '38px', gap: '0.65rem' }}
          >
            <Search size={15} color="#8e8e93" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search user, action, IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="apple-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="apple-clear-btn"
                title="Clear search"
              >
                <X size={10} strokeWidth={3} />
              </button>
            )}
          </div>

          <div style={{ minWidth: '150px' }}>
            <CustomSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              size="sm"
              icon={Filter}
              options={[
                { value: 'All', label: 'All Events' },
                { value: 'Auth', label: 'Auth & Sign-in' },
                { value: 'Admin', label: 'Admin Actions' },
                { value: 'Research', label: 'Research' },
                { value: 'Contracts', label: 'Contracts' },
                { value: 'Matters', label: 'Matters' },
              ]}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => toast.info('Refreshed audit logs')}
            className="btn-secondary"
            style={{ height: '38px', padding: '0 0.75rem', gap: '0.35rem', fontSize: '0.8rem' }}
            title="Refresh logs"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={handleExportCSV}
            className="btn-primary"
            style={{ height: '38px', padding: '0 1rem', gap: '0.4rem', fontSize: '0.825rem' }}
          >
            <Download size={15} />
            Export Audit CSV
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>User</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Action Performed</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Target / Scope</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>IP Address</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Timestamp</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{log.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.user}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#0f172a', fontWeight: 500 }}>
                    {log.action}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#475569', fontSize: '0.825rem' }}>
                    <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                      {log.target}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#64748b', fontSize: '0.8rem' }}>
                    <div>{log.ip}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{log.location}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {log.time}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                    {log.status === 'Success' ? (
                      <span
                        style={{
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          backgroundColor: '#ecfdf5',
                          color: '#059669',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        Success
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.725rem',
                          fontWeight: 600,
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        Flagged
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    No audit records matched your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b' }}>
          <span>Showing {filteredLogs.length} of {rawLogs.length} audit trail records</span>
          <span>Retention: 365 Days</span>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsPage;
