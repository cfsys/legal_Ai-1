import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EditProfileModal } from '../shared/EditProfileModal';

const Header = () => {
  const { user, promptLogout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Divya Shah' : 'Divya Shah';
  const initials = user
    ? `${user.firstName?.[0] || 'D'}${user.lastName?.[0] || 'S'}`.toUpperCase()
    : 'DS';

  return (
    <>
      <header
        className="app-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left spacer / branding context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Search bar removed as requested */}
        </div>

        {/* Right User Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* User Profile Pill */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                padding: '0.3rem 0.6rem',
                borderRadius: '0.6rem',
                border: dropdownOpen ? '1px solid #cbd5e1' : '1px solid transparent',
                backgroundColor: dropdownOpen ? '#f8fafc' : 'transparent',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!dropdownOpen) e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                if (!dropdownOpen) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Initials Avatar with Luxury Noir & Mint Dot */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#0c1017',
                  border: '1px solid #1e2638',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                }}
              >
                {initials}
              </div>

              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.825rem', fontWeight: 650, color: '#0f172a' }}>
                  {fullName}
                </div>
                <div style={{ fontSize: '0.675rem', color: '#64748b' }}>
                  {user?.role === 'admin' ? 'System Admin' : 'Advocate'}
                </div>
              </div>

              <ChevronDown size={14} color="#94a3b8" />
            </div>

            {/* User Menu Dropdown */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  width: '240px',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  boxShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.14), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
                  border: '1px solid #e2e8f0',
                  padding: '0.75rem',
                  zIndex: 50,
                  animation: 'fadeInSlide 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    {fullName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {user?.email || 'cfsys.xyz@gmail.com'}
                  </div>
                </div>

                {/* Navigation links in popup */}
                <div style={{ padding: '0.4rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div
                    onClick={() => {
                      setDropdownOpen(false);
                      setIsEditProfileOpen(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.825rem',
                      color: '#1e293b',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      fontWeight: 550,
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <User size={15} color="#475569" />
                    <span>Edit Profile</span>
                  </div>

                  <div
                    onClick={() => {
                      setDropdownOpen(false);
                      promptLogout('/');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.55rem 0.75rem',
                      fontSize: '0.825rem',
                      color: '#dc2626',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      fontWeight: 500,
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={15} />
                    <span>Sign out</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </>
  );
};

export default Header;
