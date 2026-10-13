import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/api';
import {
  LayoutDashboard,
  Users,
  Database,
  Shield,
  Scale,
  LogOut,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
} from 'lucide-react';

export default function Sidebar() {
  const { currentTab, setCurrentTab, requestLogout, user, isSuperAdmin, canAccessModule } = useAdmin();

  // Inquiries Badge Count
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    if (typeof adminApi?.getLeads === 'function') {
      adminApi.getLeads({ limit: 1 })
        .then((res) => {
          if (isMounted && res?.stats?.newRequests !== undefined) {
            setNewInquiriesCount(res.stats.newRequests);
          }
        })
        .catch(() => {});
    }
    return () => { isMounted = false; };
  }, [currentTab]);

  // Collapsed state - saved in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('legal_ai_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('legal_ai_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Accordion state
  const [openSections, setOpenSections] = useState({
    masters: true,
    personnel: true,
    security: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isModuleAllowed = (moduleId) => canAccessModule(moduleId);

  const userName = user?.name || user?.fullName || user?.username || 'Super Administrator';
  const userInitials = (userName || 'SA')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  const roleDisplay = isSuperAdmin ? 'Super Admin' : user?.role || user?.roleTitle || 'Sub-Admin';

  const activeMasterCategory = localStorage.getItem('legal_ai_master_cat') || 'Court';

  const handleSelectMaster = (category) => {
    try {
      localStorage.setItem('legal_ai_master_cat', category);
    } catch {}
    setCurrentTab('masters');
  };

  return (
    <aside
      className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}
      style={{
        width: isCollapsed ? '72px' : '260px',
        backgroundColor: '#f8fafc',
        borderRight: '1px solid #e9edf3',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        flexShrink: 0,
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Brand Header with toggle collapse button */}
      <div
        style={{
          height: '64px',
          padding: isCollapsed ? '0 0.85rem' : '0 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          borderBottom: '1px solid #eef2f6',
          backgroundColor: '#ffffff',
          flexShrink: 0,
          gap: isCollapsed ? '0.4rem' : '0.65rem',
          transition: 'padding 0.2s ease',
        }}
      >
        {!isCollapsed ? (
          <div
            onClick={() => setCurrentTab('overview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              userSelect: 'none',
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
                flexShrink: 0,
              }}
            >
              <Scale size={18} strokeWidth={2.4} />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              Legal AI
            </span>
          </div>
        ) : (
          <div
            onClick={() => setCurrentTab('overview')}
            title="Legal AI - Overview"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            <Scale size={18} strokeWidth={2.4} />
          </div>
        )}

        <button
          type="button"
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation Tree Area */}
      <div
        style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1rem 0.85rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {/* Item 1: Dashboard */}
        {isModuleAllowed('overview') && (
          <button
            onClick={() => setCurrentTab('overview')}
            title="Dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: isCollapsed ? 0 : '0.75rem',
              width: '100%',
              padding: isCollapsed ? '0.65rem 0' : '0.6rem 0.85rem',
              borderRadius: '8px',
              backgroundColor: currentTab === 'overview' ? '#ffffff' : 'transparent',
              border: currentTab === 'overview' ? '1px solid #e2e8f0' : '1px solid transparent',
              color: currentTab === 'overview' ? '#0f172a' : '#475569',
              boxShadow: currentTab === 'overview' ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
              cursor: 'pointer',
              fontSize: '0.86rem',
              fontWeight: currentTab === 'overview' ? 700 : 550,
              transition: 'all 0.15s ease',
            }}
          >
            <LayoutDashboard size={18} style={{ color: currentTab === 'overview' ? '#2563eb' : '#64748b', flexShrink: 0 }} />
            {!isCollapsed && <span>Dashboard</span>}
          </button>
        )}

        {/* Item 2: Master Data */}
        {isModuleAllowed('masters') && (
          <div>
            <button
              onClick={() => {
                if (isCollapsed) {
                  handleSelectMaster('Court');
                } else {
                  handleSelectMaster('Court');
                  if (!openSections.masters) {
                    toggleSection('masters');
                  }
                }
              }}
              title="Master Data"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                width: '100%',
                padding: isCollapsed ? '0.65rem 0' : '0.6rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: (isCollapsed && currentTab === 'masters') ? '#ffffff' : 'transparent',
                border: (isCollapsed && currentTab === 'masters') ? '1px solid #e2e8f0' : 'none',
                boxShadow: (isCollapsed && currentTab === 'masters') ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
                color: (currentTab === 'masters') ? '#0f172a' : '#334155',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: (currentTab === 'masters') ? 700 : 650,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: isCollapsed ? 0 : '0.75rem' }}>
                <Database size={17} style={{ color: currentTab === 'masters' ? '#2563eb' : '#64748b', flexShrink: 0 }} />
                {!isCollapsed && <span>Master Data</span>}
              </div>
              {!isCollapsed && (openSections.masters ? <ChevronUp size={15} color="#94a3b8" /> : <ChevronDown size={15} color="#94a3b8" />)}
            </button>

            {!isCollapsed && openSections.masters && (
              <div
                style={{
                  position: 'relative',
                  marginLeft: '1.25rem',
                  paddingLeft: '0.85rem',
                  borderLeft: '1.5px solid #cbd5e1',
                  marginTop: '0.2rem',
                  marginBottom: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                }}
              >
                {[
                  { key: 'Court', label: 'Courts & Tribunals' },
                ].map((m) => {
                  const isActive = currentTab === 'masters' && activeMasterCategory.toLowerCase() === m.key.toLowerCase();
                  return (
                    <button
                      key={m.key}
                      onClick={() => handleSelectMaster(m.key)}
                      style={{
                        position: 'relative',
                        display: 'block',
                        width: '100%',
                        padding: '0.42rem 0.75rem',
                        borderRadius: '6px',
                        backgroundColor: isActive ? '#ffffff' : 'transparent',
                        boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)' : 'none',
                        border: isActive ? '1px solid #e2e8f0' : '1px solid transparent',
                        color: isActive ? '#0f172a' : '#64748b',
                        fontSize: '0.82rem',
                        fontWeight: isActive ? 700 : 500,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#0f172a';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#64748b';
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '-0.85rem',
                          top: '50%',
                          width: '0.65rem',
                          height: '1.5px',
                          backgroundColor: '#cbd5e1',
                        }}
                      />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Item 3: Advocates */}
        {isModuleAllowed('users') && (
          <div>
            <button
              onClick={() => {
                if (isCollapsed) {
                  setCurrentTab('users');
                } else {
                  toggleSection('personnel');
                }
              }}
              title="Advocates"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                width: '100%',
                padding: isCollapsed ? '0.65rem 0' : '0.6rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: (isCollapsed && currentTab === 'users') ? '#ffffff' : 'transparent',
                border: (isCollapsed && currentTab === 'users') ? '1px solid #e2e8f0' : 'none',
                boxShadow: (isCollapsed && currentTab === 'users') ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
                color: (currentTab === 'users') ? '#0f172a' : '#334155',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: (currentTab === 'users') ? 700 : 650,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: isCollapsed ? 0 : '0.75rem' }}>
                <Users size={17} style={{ color: currentTab === 'users' ? '#2563eb' : '#64748b', flexShrink: 0 }} />
                {!isCollapsed && <span>Advocates</span>}
              </div>
              {!isCollapsed && (openSections.personnel ? <ChevronUp size={15} color="#94a3b8" /> : <ChevronDown size={15} color="#94a3b8" />)}
            </button>

            {!isCollapsed && openSections.personnel && (
              <div
                style={{
                  position: 'relative',
                  marginLeft: '1.25rem',
                  paddingLeft: '0.85rem',
                  borderLeft: '1.5px solid #cbd5e1',
                  marginTop: '0.2rem',
                  marginBottom: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                }}
              >
                <button
                  onClick={() => setCurrentTab('users')}
                  style={{
                    position: 'relative',
                    display: 'block',
                    width: '100%',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    backgroundColor: currentTab === 'users' ? '#ffffff' : 'transparent',
                    boxShadow: currentTab === 'users' ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)' : 'none',
                    border: currentTab === 'users' ? '1px solid #e2e8f0' : '1px solid transparent',
                    color: currentTab === 'users' ? '#0f172a' : '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: currentTab === 'users' ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!currentTab !== 'users') e.currentTarget.style.color = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    if (currentTab !== 'users') e.currentTarget.style.color = '#64748b';
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '-0.85rem',
                      top: '50%',
                      width: '0.65rem',
                      height: '1.5px',
                      backgroundColor: '#cbd5e1',
                    }}
                  />
                  Advocates Directory
                </button>
              </div>
            )}
          </div>
        )}

        {/* Item 4: Customer Inquiries (Demo & Contact Requests) */}
        {isModuleAllowed('inquiries') && (
          <button
            onClick={() => setCurrentTab('inquiries')}
            title="Customer Inquiries & Demos"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: isCollapsed ? 0 : '0.75rem',
              width: '100%',
              padding: isCollapsed ? '0.65rem 0' : '0.6rem 0.85rem',
              borderRadius: '8px',
              backgroundColor: currentTab === 'inquiries' ? '#ffffff' : 'transparent',
              border: currentTab === 'inquiries' ? '1px solid #e2e8f0' : '1px solid transparent',
              color: currentTab === 'inquiries' ? '#0f172a' : '#475569',
              boxShadow: currentTab === 'inquiries' ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
              cursor: 'pointer',
              fontSize: '0.86rem',
              fontWeight: currentTab === 'inquiries' ? 700 : 550,
              transition: 'all 0.15s ease',
              position: 'relative',
            }}
          >
            <CalendarCheck size={18} style={{ color: currentTab === 'inquiries' ? '#2563eb' : '#64748b', flexShrink: 0 }} />
            {!isCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span>Inquiries & Demos</span>
                {newInquiriesCount > 0 && (
                  <span
                    style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      border: '1px solid #fde68a',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {newInquiriesCount}
                  </span>
                )}
              </div>
            )}
            {isCollapsed && newInquiriesCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '12px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b',
                }}
              />
            )}
          </button>
        )}

        {/* Item 5: Access & Governance */}
        {(isModuleAllowed('subadmins') || isModuleAllowed('roles')) && (
          <div>
            <button
              onClick={() => {
                if (isCollapsed) {
                  setCurrentTab('sub-admins');
                } else {
                  toggleSection('security');
                }
              }}
              title="Governance & RBAC"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                width: '100%',
                padding: isCollapsed ? '0.65rem 0' : '0.6rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: (isCollapsed && (currentTab === 'sub-admins' || currentTab === 'admin-roles')) ? '#ffffff' : 'transparent',
                border: (isCollapsed && (currentTab === 'sub-admins' || currentTab === 'admin-roles')) ? '1px solid #e2e8f0' : 'none',
                boxShadow: (isCollapsed && (currentTab === 'sub-admins' || currentTab === 'admin-roles')) ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
                color: (currentTab === 'sub-admins' || currentTab === 'admin-roles') ? '#0f172a' : '#334155',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: (currentTab === 'sub-admins' || currentTab === 'admin-roles') ? 700 : 650,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: isCollapsed ? 0 : '0.75rem' }}>
                <Shield size={17} style={{ color: (currentTab === 'sub-admins' || currentTab === 'admin-roles') ? '#2563eb' : '#64748b', flexShrink: 0 }} />
                {!isCollapsed && <span>Governance & RBAC</span>}
              </div>
              {!isCollapsed && (openSections.security ? <ChevronUp size={15} color="#94a3b8" /> : <ChevronDown size={15} color="#94a3b8" />)}
            </button>

            {!isCollapsed && openSections.security && (
              <div
                style={{
                  position: 'relative',
                  marginLeft: '1.25rem',
                  paddingLeft: '0.85rem',
                  borderLeft: '1.5px solid #cbd5e1',
                  marginTop: '0.2rem',
                  marginBottom: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                }}
              >
                {isModuleAllowed('subadmins') && (
                  <button
                    onClick={() => setCurrentTab('sub-admins')}
                    style={{
                      position: 'relative',
                      display: 'block',
                      width: '100%',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '6px',
                      backgroundColor: currentTab === 'sub-admins' ? '#ffffff' : 'transparent',
                      boxShadow: currentTab === 'sub-admins' ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)' : 'none',
                      border: currentTab === 'sub-admins' ? '1px solid #e2e8f0' : '1px solid transparent',
                      color: currentTab === 'sub-admins' ? '#0f172a' : '#64748b',
                      fontSize: '0.82rem',
                      fontWeight: currentTab === 'sub-admins' ? 700 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (currentTab !== 'sub-admins') e.currentTarget.style.color = '#0f172a';
                    }}
                    onMouseLeave={(e) => {
                      if (currentTab !== 'sub-admins') e.currentTarget.style.color = '#64748b';
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: '-0.85rem',
                        top: '50%',
                        width: '0.65rem',
                        height: '1.5px',
                        backgroundColor: '#cbd5e1',
                      }}
                    />
                    Administrators
                  </button>
                )}

                {isModuleAllowed('roles') && (
                  <button
                    onClick={() => setCurrentTab('admin-roles')}
                    style={{
                      position: 'relative',
                      display: 'block',
                      width: '100%',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '6px',
                      backgroundColor: currentTab === 'admin-roles' ? '#ffffff' : 'transparent',
                      boxShadow: currentTab === 'admin-roles' ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)' : 'none',
                      border: currentTab === 'admin-roles' ? '1px solid #e2e8f0' : '1px solid transparent',
                      color: currentTab === 'admin-roles' ? '#0f172a' : '#64748b',
                      fontSize: '0.82rem',
                      fontWeight: currentTab === 'admin-roles' ? 700 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (currentTab !== 'admin-roles') e.currentTarget.style.color = '#0f172a';
                    }}
                    onMouseLeave={(e) => {
                      if (currentTab !== 'admin-roles') e.currentTarget.style.color = '#64748b';
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: '-0.85rem',
                        top: '50%',
                        width: '0.65rem',
                        height: '1.5px',
                        backgroundColor: '#cbd5e1',
                      }}
                    />
                    Roles & Permissions
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Profile & Logout Bottom Footer */}
      <div
        style={{
          padding: isCollapsed ? '0.75rem 0' : '0.85rem 1rem',
          borderTop: '1px solid #eef2f6',
          display: 'flex',
          flexDirection: isCollapsed ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: '0.65rem',
          backgroundColor: '#ffffff',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, justifyContent: 'center' }}>
          <div
            title={`${userName} (${roleDisplay})`}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#4338ca',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.78rem',
              fontWeight: 750,
              flexShrink: 0,
            }}
          >
            {userInitials}
          </div>
          {!isCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userName}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {roleDisplay}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={requestLogout}
          title="Sign Out"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fee2e2';
            e.currentTarget.style.color = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
