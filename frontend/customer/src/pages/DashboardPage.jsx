import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Calendar,
  FileText,
  ArrowRight,
  Scale,
  CheckSquare,
  RefreshCw,
  Check,
  ChevronRight,
  Gavel,
  Shield,
  Briefcase,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { matterService, documentService, taskService, eventService } from '../services/api';

/**
 * Format date into DD/MM/YYYY format (e.g. 18/06/2026)
 */
const formatDateDDMMYYYY = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string') {
    const cleanStr = dateVal.trim();
    const parts = cleanStr.split('T')[0].split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const [year, month, day] = parts;
      return day + '/' + month + '/' + year;
    }
    if (/^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(cleanStr)) {
      return cleanStr;
    }
    if (/^[0-9]{1,2}\s+[A-Za-z]{3,}\s+[0-9]{4}$/.test(cleanStr)) {
      return cleanStr;
    }
  }
  try {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return day + '/' + month + '/' + year;
    }
  } catch {
    return String(dateVal);
  }
  return String(dateVal);
};

/**
 * Checks dynamically if a hearing date is today or in the future.
 * Past dates will return false and be excluded from Upcoming Hearings.
 */
const isUpcomingDate = (dateVal) => {
  if (!dateVal) return false;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If dateVal is YYYY-MM-DD string, parse safely to avoid timezone discrepancies
    if (typeof dateVal === 'string') {
      const parts = dateVal.trim().split('T')[0].split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const targetDate = new Date(year, month, day, 23, 59, 59, 999);
        return targetDate.getTime() >= today.getTime();
      }
    }

    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      d.setHours(23, 59, 59, 999);
      return d.getTime() >= today.getTime();
    }
  } catch {
    return false;
  }
  return false;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Advocate';

  const [stats, setStats] = useState({
    matters: 0,
    documents: 0,
    tasks: 0,
    hearings: 0,
  });

  const [mattersList, setMattersList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [hearingsList, setHearingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  // In-flight guard to prevent duplicate API requests
  const isFetchingRef = useRef(false);

  const extractList = (res) => {
    if (!res || res.status !== 'fulfilled') return [];
    const val = res.value;
    if (Array.isArray(val)) return val;
    if (val && Array.isArray(val.data)) return val.data;
    return [];
  };

  const loadDashboardData = async (isManual = false) => {
    if (isFetchingRef.current && !isManual) return;
    isFetchingRef.current = true;

    if (isManual) setRefreshing(true);
    setLoading(true);

    try {
      const [mattersRes, docsRes, tasksRes, eventsRes] = await Promise.allSettled([
        matterService.getAll(),
        documentService.getAll(),
        taskService.getAll(),
        eventService.getAll(),
      ]);

      const mattersData = extractList(mattersRes);
      const docsData = extractList(docsRes);
      const tasksData = extractList(tasksRes);
      const eventsData = extractList(eventsRes);

      // Extract real hearings from Calendar Events (type: 'Hearing' or title mentioning Hearing) that have not passed
      const calendarHearings = eventsData
        .filter((ev) => {
          const isHearingType = ev.type === 'Hearing' || (ev.title && /hearing/i.test(ev.title));
          return isHearingType && isUpcomingDate(ev.date);
        })
        .map((ev) => ({
          _id: ev._id || ev.id,
          title: ev.title,
          date: ev.date,
          time: ev.time || '10:30 AM',
          court: ev.location || ev.matter || 'Supreme Court / High Court',
          matter: ev.matter || '',
          source: 'calendar',
          path: '/app/calendar',
        }));

      // Extract hearings from active Matters where nextHearingDate is set and has not passed
      const matterHearings = mattersData
        .filter((m) => m.nextHearingDate && String(m.nextHearingDate).trim() !== '' && isUpcomingDate(m.nextHearingDate))
        .map((m) => ({
          _id: m._id || m.id,
          title: `${m.title} · Hearing`,
          date: m.nextHearingDate,
          time: '10:30 AM',
          court: m.court || 'Jurisdictional Court',
          matter: m.title,
          source: 'matter',
          path: '/app/matters',
        }));

      // Combine real upcoming hearings
      let allUpcomingHearings = [...calendarHearings, ...matterHearings];

      // Fallback: If no event has type 'Hearing', show other upcoming calendar events that have not passed
      if (allUpcomingHearings.length === 0 && eventsData.length > 0) {
        allUpcomingHearings = eventsData
          .filter((ev) => isUpcomingDate(ev.date))
          .map((ev) => ({
            _id: ev._id || ev.id,
            title: ev.title,
            date: ev.date,
            time: ev.time || '10:00 AM',
            court: ev.location || ev.matter || (ev.type ? `${ev.type} Schedule` : 'Court Appearance'),
            matter: ev.matter || '',
            source: 'calendar',
            path: '/app/calendar',
          }));
      }

      // Sort dynamically: Upcoming hearings (closest upcoming dates first)
      allUpcomingHearings.sort((a, b) => {
        const timeA = a.date ? new Date(a.date).getTime() : 0;
        const timeB = b.date ? new Date(b.date).getTime() : 0;
        return timeA - timeB;
      });

      setStats({
        matters: mattersData.length,
        documents: docsData.length,
        tasks: tasksData.length,
        hearings: allUpcomingHearings.length,
      });

      setMattersList(mattersData);
      setTasksList(tasksData);
      setHearingsList(allUpcomingHearings);
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      if (isManual) {
        setRefreshing(false);
        setRefreshed(true);
        setTimeout(() => setRefreshed(false), 2200);
      }
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Executive KPI Cards (Boutique Luxury Theme with Mint & Charcoal Accents)
  const metrics = [
    {
      title: 'Active Litigation Matters',
      value: stats.matters,
      badge: 'Cases',
      icon: Layers,
      iconColor: '#059669',
      iconBg: 'rgba(52, 211, 153, 0.15)',
      badgeColor: '#047857',
      badgeBg: 'rgba(52, 211, 153, 0.15)',
      statusText: stats.matters === 1 ? '1 active case' : `${stats.matters} active cases`,
      path: '/app/matters',
    },
    {
      title: 'Upcoming Cause List Hearings',
      value: stats.hearings,
      badge: 'Hearings',
      icon: Calendar,
      iconColor: '#0c1017',
      iconBg: '#f1f0ea',
      badgeColor: '#0c1017',
      badgeBg: '#f1f0ea',
      statusText: stats.hearings > 0 ? `${stats.hearings} scheduled hearings` : 'No hearings scheduled',
      path: '/app/calendar',
    },
    {
      title: 'Procedural Tasks & Filings',
      value: stats.tasks,
      badge: 'Tasks',
      icon: CheckSquare,
      iconColor: '#d97706',
      iconBg: '#fef3c7',
      badgeColor: '#b45309',
      badgeBg: '#fef3c7',
      statusText: stats.tasks > 0 ? `${stats.tasks} pending tasks` : 'All tasks completed',
      path: '/app/tasks',
    },
    {
      title: 'Document Vault Repository',
      value: stats.documents,
      badge: 'Files',
      icon: FileText,
      iconColor: '#0c1017',
      iconBg: '#f1f0ea',
      badgeColor: '#0c1017',
      badgeBg: '#f1f0ea',
      statusText: stats.documents > 0 ? `${stats.documents} uploaded documents` : 'Case briefs & documents',
      path: '/app/documents',
    },
  ];

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        height: '100%',
        maxHeight: 'calc(100vh - 82px)',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner (Boutique Dark Charcoal & Mint Showcase) */}
      <div
        style={{
          backgroundColor: '#0c1017',
          borderRadius: '16px',
          border: '1px solid #1e2638',
          padding: '1rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#121824',
              border: '1px solid #1e2638',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Scale size={20} strokeWidth={2.3} />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.18rem',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Litigation Practice & Workspace Overview
            </h1>
            <p style={{ color: '#8e98a8', fontSize: '0.78rem', margin: '0.15rem 0 0 0' }}>
              Welcome back, {firstName} · Real-time case proceedings, filings tracking, and legal documents across client dockets.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              fontSize: '0.785rem',
              fontWeight: 600,
              color: '#cbd5e1',
              backgroundColor: '#121824',
              border: '1px solid #1e2638',
              borderRadius: '9999px',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              if (!refreshing) {
                e.currentTarget.style.backgroundColor = '#162032';
                e.currentTarget.style.color = '#ffffff';
              }
            }}
            onMouseLeave={(e) => {
              if (!refreshing) {
                e.currentTarget.style.backgroundColor = '#121824';
                e.currentTarget.style.color = '#cbd5e1';
              }
            }}
          >
            <RefreshCw
              size={13}
              color="#8e98a8"
              style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
            />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => navigate('/app/matters')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.52rem 1.25rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0c1017',
              backgroundColor: '#34d399',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(52, 211, 153, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#34d399';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>Manage All Matters</span>
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
        }}
      >
        {metrics.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.path)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1.5px)';
                e.currentTarget.style.boxShadow = '0 5px 12px rgba(15, 23, 42, 0.06)';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '7px',
                      backgroundColor: card.iconBg,
                      color: card.iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={17} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.675rem',
                      fontWeight: 650,
                      color: card.badgeColor,
                      backgroundColor: card.badgeBg,
                      padding: '1.5px 7px',
                      borderRadius: '9999px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {card.badge}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>
                  {card.title}
                </div>

                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0 0.25rem 0', lineHeight: 1.1 }}>
                  {card.value}
                </div>
              </div>

              <div
                style={{
                  fontSize: '0.725rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 500,
                  marginTop: '0.35rem',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '0.35rem',
                }}
              >
                <span>{card.statusText}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content: Active Matters Docket & Operational Schedule (No extra buttons) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
          gap: '1rem',
        }}
      >
        {/* Left Column: Active Case Dockets */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e6e4dc',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            padding: '1.1rem 1.35rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #f0eee6',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(52, 211, 153, 0.15)',
                  color: '#047857',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Layers size={17} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0c1017', margin: 0 }}>
                  Active Litigation Dockets
                </h3>
                <p style={{ fontSize: '0.72rem', color: '#5e6676', margin: '0.1rem 0 0 0' }}>
                  Live matter briefs & proceedings in judicial forums
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/app/matters')}
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                color: '#0c1017',
                backgroundColor: '#f6f5f1',
                border: '1px solid #e6e4dc',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eae8df';
                e.currentTarget.style.borderColor = '#d4d1c5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f6f5f1';
                e.currentTarget.style.borderColor = '#e6e4dc';
              }}
            >
              <span>View All Matters</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Dockets List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {mattersList.length === 0 ? (
              <div
                style={{
                  padding: '2.5rem 1rem',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px dashed #cbd5e1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Layers size={24} color="#94a3b8" />
                <div style={{ fontSize: '0.875rem', fontWeight: 650, color: '#334155' }}>
                  No Active Litigation Matters
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, maxWidth: '280px', lineHeight: 1.4 }}>
                  Add your first case matter to track forums, proceedings, and hearing dockets.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/app/matters')}
                  style={{
                    marginTop: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    backgroundColor: '#4338ca',
                    border: 'none',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>+ Create Matter</span>
                </button>
              </div>
            ) : (
              mattersList.slice(0, 3).map((matter, idx) => (
                <div
                  key={matter._id || matter.id || idx}
                  onClick={() => navigate('/app/matters')}
                  style={{
                    padding: '0.95rem 1.1rem',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#0284c7',
                          backgroundColor: '#e0f2fe',
                          padding: '1.5px 7px',
                          borderRadius: '4px',
                        }}
                      >
                        {matter.matterNumber}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#059669',
                          backgroundColor: '#ecfdf5',
                          padding: '1.5px 7px',
                          borderRadius: '4px',
                        }}
                      >
                        {matter.status || 'Active'}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {matter.title}
                    </div>

                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginTop: '0.2rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      Client: <strong>{matter.clientName}</strong> · {matter.court} · {matter.stage}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.15rem' }}>
                      Next Listing
                    </div>
                    <div
                      style={{
                        fontSize: '0.775rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Calendar size={13} color="#0284c7" />
                      <span>{matter.nextHearingDate ? formatDateDDMMYYYY(matter.nextHearingDate) : 'To be listed'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Hearings & Action Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Upcoming Judicial Hearings */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e6e4dc',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              padding: '1rem 1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
                paddingBottom: '0.65rem',
                borderBottom: '1px solid #f0eee6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#f1f0ea',
                    color: '#0c1017',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Calendar size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0c1017', margin: 0 }}>
                    Upcoming Hearings
                  </h3>
                  <p style={{ fontSize: '0.71rem', color: '#5e6676', margin: '0.08rem 0 0 0' }}>
                    Cause-list appearances & courtrooms
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/app/calendar')}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#0c1017',
                  backgroundColor: '#f6f5f1',
                  border: '1px solid #e6e4dc',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#eae8df';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f6f5f1';
                }}
              >
                <span>Calendar</span>
                <ChevronRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {hearingsList.length === 0 ? (
                <div
                  style={{
                    padding: '1.1rem 0.75rem',
                    textAlign: 'center',
                    backgroundColor: '#f6f5f1',
                    borderRadius: '8px',
                    border: '1px dashed #e6e4dc',
                    color: '#5e6676',
                    fontSize: '0.75rem',
                  }}
                >
                  No judicial hearings on schedule
                </div>
              ) : (
                hearingsList.slice(0, 2).map((hearing, idx) => (
                  <div
                    key={hearing._id || hearing.id || idx}
                    onClick={() => navigate(hearing.path || '/app/calendar')}
                    style={{
                      padding: '0.65rem 0.95rem',
                      borderRadius: '10px',
                      backgroundColor: '#fbfbfa',
                      border: '1px solid #e6e4dc',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#d4d1c5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fbfbfa';
                      e.currentTarget.style.borderColor = '#e6e4dc';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ fontSize: '0.785rem', fontWeight: 700, color: '#0c1017' }}>
                        {hearing.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#0c1017', backgroundColor: '#f1f0ea', padding: '1px 7px', borderRadius: '9999px', border: '1px solid #e6e4dc' }}>
                        {formatDateDDMMYYYY(hearing.date)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.71rem', color: '#5e6676' }}>
                      {hearing.court || hearing.location || hearing.matter || 'Jurisdiction Bench to be assigned'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Procedural Tasks */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e6e4dc',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
              padding: '1rem 1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
                paddingBottom: '0.65rem',
                borderBottom: '1px solid #f0eee6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#fef3c7',
                    color: '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckSquare size={16} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0c1017', margin: 0 }}>
                    Priority Tasks
                  </h3>
                  <p style={{ fontSize: '0.71rem', color: '#5e6676', margin: '0.08rem 0 0 0' }}>
                    Filing milestones & procedural deadlines
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/app/tasks')}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#b45309',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fde68a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                }}
              >
                <span>View Tasks</span>
                <ChevronRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tasksList.length === 0 ? (
                <div
                  style={{
                    padding: '1.1rem 0.75rem',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px dashed #cbd5e1',
                    color: '#64748b',
                    fontSize: '0.75rem',
                  }}
                >
                  No pending procedural tasks
                </div>
              ) : (
                tasksList.slice(0, 2).map((task, idx) => (
                  <div
                    key={task._id || task.id || idx}
                    onClick={() => navigate('/app/tasks')}
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1, paddingRight: '0.5rem' }}>
                      <div style={{ fontSize: '0.785rem', fontWeight: 650, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.task}
                      </div>
                      <div style={{ fontSize: '0.69rem', color: '#64748b', marginTop: '0.1rem' }}>
                        {task.matter ? `${task.matter} • ` : ''}Due: {formatDateDDMMYYYY(task.due)}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        color: task.priority === 'High' ? '#dc2626' : task.priority === 'Medium' ? '#d97706' : '#16a34a',
                        backgroundColor: task.priority === 'High' ? '#fef2f2' : task.priority === 'Medium' ? '#fffbeb' : '#f0fdf4',
                        border: `1px solid ${task.priority === 'High' ? '#fecaca' : task.priority === 'Medium' ? '#fde68a' : '#bbf7d0'}`,
                        padding: '1.5px 6px',
                        borderRadius: '4px',
                        flexShrink: 0,
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
