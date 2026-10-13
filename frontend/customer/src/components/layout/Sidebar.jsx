import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Scale,
  LayoutGrid,
  Layers,
  Users,
  Shield,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  LogOut,
  CheckSquare,
  FileText,
  Calendar,
  MessageSquare,
  Sparkles,
  Gavel,
  PenTool,
  Search,
  Database,
} from 'lucide-react';
import { ROLES } from '../../constants/enums';
import { useAuth } from '../../context/AuthContext';

// Clean, craft-polished Tree Sublink with precise architectural connector lines (|--)
// Incorporates the boutique dark charcoal & mint styling
const TreeSubLink = ({ to, label, badge }) => {
  const location = useLocation();
  const isMatch =
    location.pathname === to || (to !== '/app/dashboard' && location.pathname.startsWith(to));

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        margin: '1px 0',
      }}
    >
      {/* Architectural connector tick branching off vertical trunk */}
      <span
        style={{
          position: 'absolute',
          left: '1.25rem',
          top: '50%',
          width: '10px',
          height: '1px',
          backgroundColor: isMatch ? '#34d399' : '#222d42',
          zIndex: 1,
          transition: 'background-color 0.15s ease',
        }}
      />

      <NavLink
        to={to}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.42rem 0.75rem 0.42rem 2.15rem',
          textDecoration: 'none',
          fontSize: '0.835rem',
          fontWeight: isMatch ? 650 : 500,
          color: isMatch ? '#ffffff' : '#8e98a8',
          borderRadius: '8px',
          backgroundColor: isMatch ? 'rgba(52, 211, 153, 0.12)' : 'transparent',
          border: isMatch ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid transparent',
          boxShadow: isMatch ? '0 1px 3px rgba(52, 211, 153, 0.1)' : 'none',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!isMatch) {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#ffffff';
          }
        }}
        onMouseLeave={(e) => {
          if (!isMatch) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#8e98a8';
          }
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
        {badge && (
          <span
            style={{
              fontSize: '0.625rem',
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: '9999px',
              backgroundColor: isMatch ? 'rgba(52, 211, 153, 0.25)' : '#1e2638',
              color: isMatch ? '#34d399' : '#94a3b8',
            }}
          >
            {badge}
          </span>
        )}
      </NavLink>
    </div>
  );
};

// Collapsible Navigation Accordion Group Header (sleek slate typography & subtle chevron)
const NavGroupHeader = ({ icon: Icon, title, isOpen, onToggle, count }) => (
  <button
    type="button"
    onClick={onToggle}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.52rem 0.65rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#e2e8f0',
      transition: 'background-color 0.15s ease',
      marginTop: '0.2rem',
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
      <Icon size={18} color="#94a3b8" strokeWidth={2.1} style={{ flexShrink: 0 }} />
      <span
        style={{
          fontSize: '0.865rem',
          fontWeight: 700,
          color: '#e2e8f0',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
      {count !== undefined && (
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            color: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            padding: '1px 6px',
            borderRadius: '9999px',
          }}
        >
          {count}
        </span>
      )}
      <ChevronDown
        size={14}
        color="#8e98a8"
        style={{
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
        }}
      />
    </div>
  </button>
);

// Collapsed Icon-only Nav Link with tooltip and active state
const CollapsedNavItem = ({ to, icon: Icon, title }) => {
  const location = useLocation();
  const isMatch =
    location.pathname === to || (to !== '/app/dashboard' && location.pathname.startsWith(to));

  return (
    <NavLink
      to={to}
      title={title}
      aria-label={title}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '9px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        backgroundColor: isMatch ? 'rgba(52, 211, 153, 0.14)' : 'transparent',
        border: isMatch ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid transparent',
        color: isMatch ? '#34d399' : '#8e98a8',
        boxShadow: isMatch ? '0 1px 4px rgba(52, 211, 153, 0.15)' : 'none',
        transition: 'all 0.15s ease',
        margin: '0 auto',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!isMatch) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.color = '#ffffff';
          e.currentTarget.style.borderColor = '#1e2638';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMatch) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#8e98a8';
          e.currentTarget.style.borderColor = 'transparent';
        }
      }}
    >
      <Icon size={19} strokeWidth={isMatch ? 2.3 : 2} />
    </NavLink>
  );
};

const Sidebar = () => {
  const { user, promptLogout } = useAuth();
  const location = useLocation();

  // Collapse state (persisted or default false)
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = user?.role === ROLES.ADMIN || user?.role === 1 || user?.role === 'admin';

  // Group expansion state (default expanded for instant navigation)
  const [openGroups, setOpenGroups] = useState({
    intelligence: true,
    practice: true,
    masterData: true,
    advocates: true,
    governance: true,
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    promptLogout('/');
  };

  const isDashboardActive =
    location.pathname === '/app/dashboard' || location.pathname === '/app';

  const userDisplayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      user.name ||
      user.email?.split('@')[0] ||
      'Advocate'
    : 'Advocate';

  const initials = (
    ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase() ||
    (user?.email?.[0] || 'A').toUpperCase() ||
    'A'
  );

  return (
    <aside
      className="app-sidebar"
      style={{
        width: collapsed ? '68px' : '255px',
        transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: '#0c1017',
        borderRight: '1px solid #1a2233',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        boxShadow: '2px 0 12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* Header Brand */}
      {collapsed ? (
        <div
          style={{
            padding: '0.85rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem',
            borderBottom: '1px solid #1a2233',
            flexShrink: 0,
          }}
        >
          {/* Logo Icon (clickable to expand) */}
          <div
            onClick={() => setCollapsed(false)}
            title="Legal AI · Click to expand sidebar"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#121824',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Scale size={19} strokeWidth={2.4} />
          </div>

          {/* Expand Button (>) */}
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              border: '1px solid #1e2638',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#8e98a8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(52, 211, 153, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.4)';
              e.currentTarget.style.color = '#34d399';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = '#1e2638';
              e.currentTarget.style.color = '#8e98a8';
            }}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: '1rem 1rem 0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1a2233',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Boutique Dark Scale Icon */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#121824',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                flexShrink: 0,
              }}
            >
              <Scale size={19} strokeWidth={2.4} />
            </div>

            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              Legal<span style={{ color: '#34d399' }}>AI</span>
            </span>
          </div>

          {/* Collapse toggle button (<) */}
          <button
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              border: '1px solid #1e2638',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#8e98a8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#8e98a8';
            }}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* Nav List Area */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: collapsed ? '0.75rem 0.4rem' : '0.75rem 0.75rem 1rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: collapsed ? '0.5rem' : '0.45rem',
        }}
      >
        {collapsed ? (
          /* COLLAPSED ICON-ONLY NAVIGATION */
          <>
            <CollapsedNavItem to="/app/dashboard" icon={LayoutGrid} title="Dashboard" />
            <div
              style={{
                height: '1px',
                backgroundColor: '#1a2233',
                margin: '0.25rem 0.5rem',
              }}
            />
            <CollapsedNavItem to="/app/ai" icon={Sparkles} title="Legal AI Search" />
            <CollapsedNavItem to="/app/judgments" icon={Gavel} title="Judgment Search" />
            <CollapsedNavItem to="/app/drafting" icon={PenTool} title="Legal Drafting" />
            <CollapsedNavItem to="/app/research" icon={Search} title="Legal Research" />

            <div
              style={{
                height: '1px',
                backgroundColor: '#1a2233',
                margin: '0.25rem 0.5rem',
              }}
            />

            <CollapsedNavItem to="/app/matters" icon={Layers} title="Matters" />
            <CollapsedNavItem to="/app/tasks" icon={CheckSquare} title="Tasks" />
            <CollapsedNavItem to="/app/documents" icon={FileText} title="Documents" />
            <CollapsedNavItem to="/app/calendar" icon={Calendar} title="Calendar" />

            {isAdmin && (
              <>
                <div
                  style={{
                    height: '1px',
                    backgroundColor: '#1a2233',
                    margin: '0.25rem 0.5rem',
                  }}
                />
                <CollapsedNavItem to="/app/admin/masters" icon={Database} title="National Masters" />
                <CollapsedNavItem to="/app/admin/users" icon={Users} title="Practitioners" />
                <CollapsedNavItem
                  to="/app/admin/security"
                  icon={Shield}
                  title="Roles & Security"
                />
                <CollapsedNavItem
                  to="/app/admin/inquiries"
                  icon={MessageSquare}
                  title="Customer Inquiries"
                />
              </>
            )}
          </>
        ) : (
          /* EXPANDED PROFESSIONAL TREE NAVIGATION */
          <>
            {/* Elevated Dashboard Card Item */}
            <NavLink
              to="/app/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: isDashboardActive ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid #1e2638',
                backgroundColor: isDashboardActive ? 'rgba(52, 211, 153, 0.12)' : '#121824',
                boxShadow: isDashboardActive
                  ? '0 2px 8px rgba(52, 211, 153, 0.15)'
                  : '0 1px 2px rgba(0, 0, 0, 0.2)',
                textDecoration: 'none',
                color: isDashboardActive ? '#ffffff' : '#cbd5e1',
                transition: 'all 0.15s ease',
                marginBottom: '0.25rem',
              }}
              onMouseEnter={(e) => {
                if (!isDashboardActive) {
                  e.currentTarget.style.borderColor = '#2a364f';
                  e.currentTarget.style.backgroundColor = '#161f30';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDashboardActive) {
                  e.currentTarget.style.borderColor = '#1e2638';
                  e.currentTarget.style.backgroundColor = '#121824';
                  e.currentTarget.style.color = '#cbd5e1';
                }
              }}
            >
              <LayoutGrid size={18} color={isDashboardActive ? '#34d399' : '#8e98a8'} strokeWidth={2.4} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                Dashboard
              </span>
            </NavLink>

            {/* AI & Legal Intelligence Group */}
            <div>
              <NavGroupHeader
                icon={Sparkles}
                title="AI & Legal Intelligence"
                isOpen={openGroups.intelligence}
                onToggle={() => toggleGroup('intelligence')}
              />
              {openGroups.intelligence && (
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '2px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1.25rem',
                      top: 0,
                      bottom: '0.65rem',
                      width: '1px',
                      backgroundColor: '#1e2638',
                    }}
                  />
                  <TreeSubLink to="/app/ai" label="Legal AI Search" />
                  <TreeSubLink to="/app/judgments" label="Judgment Search" />
                  <TreeSubLink to="/app/drafting" label="Legal Drafting" />
                  <TreeSubLink to="/app/research" label="Legal Research" />
                </div>
              )}
            </div>

            {/* Practice & Operations Group */}
            <div>
              <NavGroupHeader
                icon={Layers}
                title="Practice & Operations"
                isOpen={openGroups.practice}
                onToggle={() => toggleGroup('practice')}
              />
              {openGroups.practice && (
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '2px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '1.25rem',
                      top: 0,
                      bottom: '0.65rem',
                      width: '1px',
                      backgroundColor: '#1e2638',
                    }}
                  />
                  <TreeSubLink to="/app/matters" label="Matters" />
                  <TreeSubLink to="/app/tasks" label="Tasks" />
                  <TreeSubLink to="/app/documents" label="Documents" />
                  <TreeSubLink to="/app/calendar" label="Calendar" />
                </div>
              )}
            </div>

            {/* Master Data (Admin Group matching 2nd image) */}
            {isAdmin && (
              <>
                <div>
                  <NavGroupHeader
                    icon={Database}
                    title="Master Data"
                    isOpen={openGroups.masterData}
                    onToggle={() => toggleGroup('masterData')}
                  />
                  {openGroups.masterData && (
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '2px',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '1.25rem',
                          top: 0,
                          bottom: '0.65rem',
                          width: '1px',
                          backgroundColor: '#1e2638',
                        }}
                      />
                      <TreeSubLink to="/app/admin/masters" label="Courts & Tribunals" />
                    </div>
                  )}
                </div>

                {/* Advocates (Admin Group matching 2nd image) */}
                <div>
                  <NavGroupHeader
                    icon={Users}
                    title="Advocates"
                    isOpen={openGroups.advocates}
                    onToggle={() => toggleGroup('advocates')}
                  />
                  {openGroups.advocates && (
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '2px',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '1.25rem',
                          top: 0,
                          bottom: '0.65rem',
                          width: '1px',
                          backgroundColor: '#1e2638',
                        }}
                      />
                      <TreeSubLink to="/app/admin/users" label="Advocates Directory" />
                    </div>
                  )}
                </div>

                {/* Governance & RBAC (Admin Group matching 2nd image) */}
                <div>
                  <NavGroupHeader
                    icon={Shield}
                    title="Governance & RBAC"
                    isOpen={openGroups.governance}
                    onToggle={() => toggleGroup('governance')}
                  />
                  {openGroups.governance && (
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: '2px',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '1.25rem',
                          top: 0,
                          bottom: '0.65rem',
                          width: '1px',
                          backgroundColor: '#1e2638',
                        }}
                      />
                      <TreeSubLink to="/app/admin/users" label="Administrators" />
                      <TreeSubLink to="/app/admin/security" label="Roles & Permissions" />
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </nav>

      {/* User Footer with Profile & Logout confirmation trigger */}
      <div
        style={{
          padding: collapsed ? '0.75rem 0.5rem' : '0.75rem 0.85rem',
          borderTop: '1px solid #1a2233',
          backgroundColor: '#090d14',
          flexShrink: 0,
          display: 'flex',
          flexDirection: collapsed ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: collapsed ? '0.65rem' : '0.65rem',
        }}
      >
        <div
          title={userDisplayName}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            minWidth: 0,
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: collapsed ? '100%' : 'auto',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#121824',
              border: '1px solid #1e2638',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          {!collapsed && (
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userDisplayName}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: '#8e98a8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block' }} />
                {isAdmin ? 'Super Administrator' : 'Practicing Advocate'}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          type="button"
          title="Sign out"
          aria-label="Sign out"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#8e98a8',
            cursor: 'pointer',
            padding: '0.45rem',
            borderRadius: '6px',
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.color = '#f87171';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#8e98a8';
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
