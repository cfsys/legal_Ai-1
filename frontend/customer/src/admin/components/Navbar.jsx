import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const {
    user,
    requestLogout,
    setCurrentTab,
  } = useAdmin();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // User display info
  const displayName = user?.fullName || user?.name || user?.username || user?.email?.split('@')[0] || 'Super Admin';
  const displayRole = user?.roleTitle || (typeof user?.role === 'string' ? user?.role : (user?.role === 1 ? 'Super Administrator' : 'Administrator'));
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header
      className="top-navbar"
      style={{
        height: '64px',
        padding: '0 1.5rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eef2f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      {/* Left Spacer */}
      <div />

      {/* Right Controls: User Profile Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* User Profile Avatar Circle - matching 'SA' in screenshot */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#4338ca',
              color: '#ffffff',
              border: '2px solid #e0e7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 750,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.15s ease',
            }}
            title={displayName}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {initials || 'SA'}
          </button>

          {/* Profile Popover Menu */}
          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                padding: '0.65rem',
                zIndex: 1000,
                animation: 'scaleUp 0.15s ease-out',
              }}
            >
              {/* User Identity Info */}
              <div
                style={{
                  padding: '0.6rem 0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  marginBottom: '0.45rem',
                }}
              >
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                  {displayName}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>
                  {user?.email || 'admin@themes.ai'}
                </div>
                <div style={{ marginTop: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 650, color: '#4338ca', backgroundColor: '#eef2ff', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  <ShieldCheck size={11} />
                  <span>{displayRole}</span>
                </div>
              </div>

              {/* Sign Out Action */}
              <button
                onClick={() => {
                  setProfileOpen(false);
                  requestLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={14} />
                <span>Sign Out / Lock Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
