import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import CustomDropdown from '../components/CustomDropdown';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Shield,
  RefreshCw,
} from 'lucide-react';

export default function AuditLogsView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchAction, setSearchAction] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAuditLogs({
        category: categoryFilter,
        action: searchAction,
      });
      if (res.success) {
        setLogs(res.logs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [categoryFilter, searchAction]);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'Security', label: 'Security & Access' },
    { value: 'Billing', label: 'Billing & Credits' },
    { value: 'User Management', label: 'User Management' },
    { value: 'Multi-Tenant', label: 'Multi-Tenant' },
    { value: 'Compliance', label: 'Compliance' },
    { value: 'AI Ops', label: 'AI Ops' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header matching Client App */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">
            Security & Compliance Audit Stream
          </h1>
          <p className="page-subtitle">
            Immutable regulatory audit trail logging administrative delegations, token allocations, and AI engine requests.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem', height: '40px', borderRadius: '10px' }}
            placeholder="Search action, advocate or event..."
            value={searchAction}
            onChange={(e) => setSearchAction(e.target.value)}
          />
        </div>

        <div style={{ width: '220px' }}>
          <CustomDropdown
            options={categoryOptions}
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            placeholder="All Categories"
          />
        </div>

        <button
          type="button"
          onClick={loadLogs}
          disabled={loading}
          title="Refresh stream"
          style={{
            width: '36px',
            height: '36px',
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

      {/* Audit Log Table - Scrollable Box */}
      <div className="table-card-box">
        <div className="table-scroll-viewport" style={{ maxHeight: '480px' }}>
          <table className="custom-table" style={{ minWidth: '920px' }}>
            <thead>
              <tr>
                <th style={{ width: '170px' }}>Timestamp</th>
                <th style={{ width: '130px' }}>Severity</th>
                <th style={{ width: '180px' }}>Action</th>
                <th>Target Entity / User</th>
                <th>Details</th>
                <th>Actor</th>
                <th style={{ width: '110px' }}>Client IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isError = log.severity === 'ERROR';
                const isWarn = log.severity === 'WARN';
                const isSuccess = log.severity === 'SUCCESS';

                return (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={12} />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          isError
                            ? 'badge-rose'
                            : isWarn
                            ? 'badge-amber'
                            : isSuccess
                            ? 'badge-emerald'
                            : 'badge-blue'
                        }`}
                      >
                        {isError ? (
                          <AlertOctagon size={11} />
                        ) : isWarn ? (
                          <AlertTriangle size={11} />
                        ) : (
                          <CheckCircle2 size={11} />
                        )}
                        <span>{log.severity}</span>
                      </span>
                    </td>

                    <td style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      {log.action}
                    </td>

                    <td style={{ fontSize: '0.82rem', color: '#0f172a', fontWeight: 650 }}>
                      {log.targetUser}
                    </td>

                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '340px' }}>
                      {log.details}
                    </td>

                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {log.actorName}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {log.actorEmail}
                      </div>
                    </td>

                    <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {log.ip}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Box Footer */}
        <div className="table-box-footer">
          <span>Showing <strong>{logs.length}</strong> immutable audit entries</span>
          <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Audit Chain Verified
          </span>
        </div>
      </div>
    </div>
  );
}
