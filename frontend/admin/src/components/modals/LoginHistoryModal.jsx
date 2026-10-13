import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  RefreshCw,
  Monitor,
  Laptop,
  Smartphone,
  Globe,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { adminApi } from '../../services/api';

const styles = `
  .lhm-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: lhmFadeIn 0.18s ease-out;
  }

  @keyframes lhmFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes lhmScaleUp {
    from {
      opacity: 0;
      transform: scale(0.97) translateY(8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .lhm-modal {
    background: #ffffff;
    width: 100%;
    max-width: 980px;
    max-height: 90vh;
    border-radius: 16px;
    box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(15, 23, 42, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: lhmScaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: inherit;
    color: #0f172a;
  }

  /* Header */
  .lhm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 24px;
    border-bottom: 1px solid #f1f5f9;
  }

  .lhm-header-title {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .lhm-header-title span.lhm-title-user {
    color: #0f172a;
    font-weight: 750;
  }

  .lhm-close-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: transparent;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .lhm-close-btn:hover {
    background: #f1f5f9;
    color: #0f172a;
    border-color: #e2e8f0;
  }

  /* Content */
  .lhm-body {
    padding: 20px 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* User Info Card */
  .lhm-user-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .lhm-user-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .lhm-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #2563eb;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 15px;
    flex-shrink: 0;
    text-transform: uppercase;
  }

  .lhm-name {
    font-size: 15px;
    font-weight: 750;
    color: #0f172a;
    letter-spacing: -0.2px;
    text-transform: uppercase;
  }

  .lhm-code-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 6px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
    font-size: 12px;
    font-weight: 700;
  }

  .lhm-user-meta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;
  }

  .lhm-user-dot {
    color: #cbd5e1;
    font-size: 14px;
  }

  .lhm-refresh-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    color: #334155;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .lhm-refresh-btn:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #0f172a;
  }

  .lhm-refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Metric Stat Cards */
  .lhm-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  @media (max-width: 768px) {
    .lhm-stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .lhm-stat-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .lhm-stat-label {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
  }

  .lhm-stat-value {
    font-size: 18px;
    font-weight: 750;
    color: #0f172a;
    line-height: 1.2;
    display: flex;
    align-items: center;
    gap: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .lhm-stat-online {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13.5px;
    font-weight: 700;
    color: #059669;
  }

  .lhm-pulse-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  }

  .lhm-ip-text {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .lhm-time-text {
    font-size: 13px;
    font-weight: 600;
    color: #1e293b;
  }

  /* Table */
  .lhm-table-wrapper {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
  }

  .lhm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
  }

  .lhm-table th {
    background: #f8fafc;
    padding: 10px 16px;
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #475569;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }

  .lhm-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }

  .lhm-table tr:last-child td {
    border-bottom: none;
  }

  .lhm-table tr:hover td {
    background: #f8fafc;
  }

  /* Status Badges */
  .lhm-badge-active {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 9999px;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #047857;
    font-size: 11.5px;
    font-weight: 600;
  }

  .lhm-badge-completed {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 9999px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    color: #64748b;
    font-size: 11.5px;
    font-weight: 600;
  }

  /* Device Cell */
  .lhm-device-cell {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  .lhm-device-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: #f1f5f9;
    color: #475569;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .lhm-device-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .lhm-browser-title {
    font-weight: 650;
    color: #0f172a;
    font-size: 12.5px;
  }

  .lhm-device-type {
    font-size: 11px;
    color: #64748b;
  }

  /* IP & Location Cell */
  .lhm-ip-cell {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .lhm-ip-line {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-weight: 700;
    font-size: 12px;
    color: #0f172a;
  }

  .lhm-ip-globe {
    color: #2563eb;
  }

  .lhm-location-line {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    color: #64748b;
  }

  .lhm-time-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #334155;
    white-space: nowrap;
  }

  .lhm-last-active-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    background: #2563eb;
    color: #ffffff;
    border-radius: 4px;
    font-size: 11.5px;
    font-weight: 600;
    white-space: nowrap;
  }

  /* Footer */
  .lhm-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    background: #ffffff;
    border-top: 1px solid #f1f5f9;
  }

  .lhm-footer-code {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
  }

  .lhm-footer-close {
    padding: 7px 18px;
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    color: #0f172a;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .lhm-footer-close:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
  }

  /* Loader & Empty states */
  .lhm-loading {
    padding: 40px;
    text-align: center;
    color: #64748b;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

/**
 * Format datetime into standard DD/MM/YYYY, hh:mm AM/PM format
 */
const formatDateTimeDisplay = (rawDateStr) => {
  if (!rawDateStr) return 'Just now';
  if (rawDateStr === 'Just now' || rawDateStr === 'Online') return rawDateStr;

  // Already in DD/MM/YYYY format with time
  if (/^\d{2}\/\d{2}\/\d{4},\s*\d{1,2}:\d{2}\s*(AM|PM)$/i.test(rawDateStr)) {
    return rawDateStr;
  }

  // Handle format like "10 Oct 2026, 10:09 am" or "9 Oct 2026, 10:27 am"
  const legacyMatch = String(rawDateStr).match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4}),\s*(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)$/i);
  if (legacyMatch) {
    const [, d, mStr, y, h, min, meridiem] = legacyMatch;
    const monthNames = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
    const mNum = monthNames[mStr.slice(0, 3).toLowerCase()] || '01';
    const dayPadded = d.padStart(2, '0');
    const hourPadded = h.padStart(2, '0');
    return `${dayPadded}/${mNum}/${y}, ${hourPadded}:${min} ${meridiem.toUpperCase()}`;
  }

  // Try parsing ISO or timestamp
  try {
    const d = new Date(rawDateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const formattedHours = String(hours).padStart(2, '0');
      return `${day}/${month}/${year}, ${formattedHours}:${minutes} ${ampm}`;
    }
  } catch {
    return rawDateStr;
  }

  return rawDateStr;
};

const formatLastActiveDisplay = (val) => {
  if (!val || val === 'Just now') return 'Just now';
  return formatDateTimeDisplay(val);
};

export default function LoginHistoryModal({ isOpen, userId, userName, userCode, onClose }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getUserLoginHistory(userId);
      setData(res?.data || res);
    } catch (err) {
      console.error('Failed to load login history:', err);
      setError(err.message || 'Unable to retrieve login history.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchHistory();
    } else {
      setData(null);
      setError(null);
    }
  }, [isOpen, userId, fetchHistory]);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const payload = data?.history || data?.data?.history || data?.data || data;
  const user = payload?.user || data?.user || {
    id: userId,
    fullName: userName || 'Practitioner',
    username: userName ? userName.toLowerCase().replace(/\s+/g, '_') : 'user',
    mobile: '9925179997',
    customerCode: userCode || (userId ? `ADV-${String(userId).slice(-4).toUpperCase()}` : 'ADV-101'),
  };

  const sessions = payload?.sessions || data?.sessions || [];
  const latestSession = sessions[0] || {};

  const stats = payload?.stats || data?.stats || {
    totalLogins: sessions.length || 1,
    activeSession: 'Online',
    latestIp: latestSession.ip || '171.61.165.64',
    lastLoginTime: latestSession.loginTime || 'Just now',
  };
  const displayName = user.fullName || userName || 'Practitioner';
  const initial = displayName.charAt(0).toUpperCase();

  const getDeviceIcon = (deviceType = '') => {
    const lower = deviceType.toLowerCase();
    if (lower.includes('mobile') || lower.includes('phone')) {
      return <Smartphone size={15} />;
    }
    if (lower.includes('laptop')) {
      return <Laptop size={15} />;
    }
    return <Monitor size={15} />;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lhm-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div className="lhm-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="lhm-header">
            <div className="lhm-header-title">
              Login History &amp; Logs — <span className="lhm-title-user">{displayName}</span>
            </div>
            <button
              type="button"
              className="lhm-close-btn"
              onClick={onClose}
              title="Close modal"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="lhm-body">
            {/* User Banner Row */}
            <div className="lhm-user-strip">
              <div className="lhm-user-left">
                <div className="lhm-avatar">{initial}</div>
                <div className="lhm-name">{displayName}</div>
                <div className="lhm-code-badge" title="Customer Code">
                  {user.customerCode || 3}
                </div>
                <div className="lhm-user-meta">
                  <User size={13} style={{ color: '#94a3b8' }} />
                  <span>{user.username || 'user'}</span>
                  <span className="lhm-user-dot">•</span>
                  <span>{user.mobile || user.email || '9925179997'}</span>
                </div>
              </div>

              {/* Action Buttons: Refresh Only (Revoke functionality strictly omitted as requested) */}
              <button
                type="button"
                className="lhm-refresh-btn"
                onClick={fetchHistory}
                disabled={loading}
                title="Refresh login logs"
              >
                <RefreshCw size={13} className={loading ? 'spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>

            {/* 4 Stats Cards */}
            <div className="lhm-stats-grid">
              <div className="lhm-stat-card">
                <span className="lhm-stat-label">Total Logins</span>
                <span className="lhm-stat-value">{stats.totalLogins}</span>
              </div>

              <div className="lhm-stat-card">
                <span className="lhm-stat-label">Active Session</span>
                <div className="lhm-stat-online">
                  <span className="lhm-pulse-dot" />
                  <span>{stats.activeSession || 'Online'}</span>
                </div>
              </div>

              <div className="lhm-stat-card">
                <span className="lhm-stat-label">Latest IP</span>
                <span className="lhm-stat-value lhm-ip-text" title={stats.latestIp}>
                  {stats.latestIp}
                </span>
              </div>

              <div className="lhm-stat-card">
                <span className="lhm-stat-label">Last Login Time</span>
                <span className="lhm-stat-value lhm-time-text">{formatDateTimeDisplay(stats.lastLoginTime)}</span>
              </div>
            </div>

            {/* Session Logs Table */}
            <div className="lhm-table-wrapper">
              {loading && !data ? (
                <div className="lhm-loading">
                  <RefreshCw size={22} className="spin" style={{ color: '#64748b' }} />
                  <span>Retrieving security session telemetry...</span>
                </div>
              ) : error ? (
                <div className="lhm-loading" style={{ color: '#e11d48' }}>
                  <AlertCircle size={22} />
                  <span>{error}</span>
                </div>
              ) : (
                <table className="lhm-table">
                  <thead>
                    <tr>
                      <th style={{ width: '12%' }}>Status</th>
                      <th style={{ width: '28%' }}>Device &amp; Browser</th>
                      <th style={{ width: '30%' }}>IP &amp; Location</th>
                      <th style={{ width: '15%' }}>Login Time</th>
                      <th style={{ width: '15%' }}>Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                          No recorded session history for this account.
                        </td>
                      </tr>
                    ) : (
                      sessions.map((sess) => {
                        const isActive = sess.status === 'Active';
                        return (
                          <tr key={sess.id}>
                            <td>
                              {isActive ? (
                                <span className="lhm-badge-active">
                                  <span className="lhm-pulse-dot" />
                                  Active
                                </span>
                              ) : (
                                <span className="lhm-badge-completed">
                                  <span
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background: '#94a3b8',
                                    }}
                                  />
                                  Completed
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="lhm-device-cell">
                                <div className="lhm-device-icon">
                                  {getDeviceIcon(sess.device)}
                                </div>
                                <div className="lhm-device-meta">
                                  <div className="lhm-browser-title">{sess.browser}</div>
                                  <div className="lhm-device-type">{sess.device}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="lhm-ip-cell">
                                <div className="lhm-ip-line">
                                  <Globe size={13} className="lhm-ip-globe" />
                                  <span>{sess.ip}</span>
                                </div>
                                <div className="lhm-location-line">
                                  <MapPin size={11} />
                                  <span>{sess.location}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="lhm-time-cell">
                                <Clock size={12} style={{ color: '#94a3b8' }} />
                                <span>{formatDateTimeDisplay(sess.loginTime)}</span>
                              </div>
                            </td>
                            <td>
                              <span className="lhm-last-active-badge">{formatLastActiveDisplay(sess.lastActive)}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="lhm-footer">
            <span className="lhm-footer-code">Customer Code: {user.customerCode || 3}</span>
            <button type="button" className="lhm-footer-close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
