import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Globe,
  Clock,
  Laptop,
  Smartphone,
  LogOut,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { toast } from '../../context/ToastContext';
import CustomSelect from '../../components/common/CustomSelect';

const SecurityPage = () => {
  const [settings, setSettings] = useState({
    mfa: true,
    sso: true,
    ipAllowlist: false,
    sessionTimeout: '30',
    dataRetention: '365',
    exportWatermark: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => {
      const updated = !prev[key];
      toast.success(`${key.toUpperCase()} setting updated`);
      return { ...prev, [key]: updated };
    });
  };

  const handleTimeoutChange = (e) => {
    setSettings((prev) => ({ ...prev, sessionTimeout: e.target.value }));
    toast.success(`Session timeout set to ${e.target.value} minutes`);
  };

  const sessions = [
    { device: 'Chrome on Windows 11', ip: '192.168.1.4', location: 'Mumbai, India', current: true, time: 'Active now', icon: Laptop },
    { device: 'Safari on macOS Sonoma', ip: '10.0.0.2', location: 'New Delhi, India', current: false, time: '2 hours ago', icon: Laptop },
    { device: 'Legal AI iOS App', ip: '122.161.44.8', location: 'Bengaluru, India', current: false, time: 'Yesterday', icon: Smartphone },
  ];

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
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={19} strokeWidth={2.2} />
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
              Enterprise Security & Access Governance
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Organisation security controls, authentication rules, active device sessions, and compliance policies.
            </p>
          </div>
        </div>
      </div>

      {/* Security Health Score Banner */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '0.85rem',
          padding: '1.5rem 1.75rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#1e293b',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}
          >
            98%
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Enterprise Security Posture: Optimal</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              MFA enforced · AES-256 encrypted storage · Strict role-based isolation active
            </div>
          </div>
        </div>

        <button
          onClick={() => toast.success('Security audit report generated')}
          className="btn-primary"
          style={{ backgroundColor: '#2563eb', fontSize: '0.825rem', padding: '0.5rem 1rem' }}
        >
          Download Compliance Report
        </button>
      </div>

      {/* Security Toggles Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
          Authentication & Access Safeguards
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Enforce MFA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Enforce Multi-Factor Authentication (MFA)</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Require all members to authenticate via TOTP or authenticator app.</div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('mfa')}
              style={{
                width: '46px',
                height: '26px',
                borderRadius: '9999px',
                backgroundColor: settings.mfa ? '#0f172a' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: settings.mfa ? '23px' : '3px',
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>

          {/* Single Sign-On (SSO) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Single Sign-On (SSO)</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Authenticate via SAML 2.0 or OIDC with Okta, Azure AD, or Google Workspace.</div>
            </div>
            <button
              onClick={() => toast.info('SSO Configuration Dialog opened')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              Configure SSO
            </button>
          </div>

          {/* IP Allowlist */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>IP Allowlist</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Restrict access exclusively to office IP CIDR blocks.</div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('ipAllowlist')}
              style={{
                width: '46px',
                height: '26px',
                borderRadius: '9999px',
                backgroundColor: settings.ipAllowlist ? '#0f172a' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: settings.ipAllowlist ? '23px' : '3px',
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>

          {/* Session timeout */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Session Inactivity Timeout</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Automatically log out dormant browser sessions for security.</div>
            </div>
            <div style={{ width: '170px' }}>
              <CustomSelect
                value={settings.sessionTimeout}
                onChange={handleTimeoutChange}
                size="sm"
                icon={Clock}
                options={[
                  { value: '15', label: '15 Minutes' },
                  { value: '30', label: '30 Minutes' },
                  { value: '60', label: '1 Hour' },
                  { value: '480', label: '8 Hours' },
                ]}
              />
            </div>
          </div>

          {/* Export Watermark */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Document & Research Watermarking</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Embed forensic confidentiality watermarks with user timestamp on all exports.</div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('exportWatermark')}
              style={{
                width: '46px',
                height: '26px',
                borderRadius: '9999px',
                backgroundColor: settings.exportWatermark ? '#0f172a' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: settings.exportWatermark ? '23px' : '3px',
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Active Devices & Logins</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Manage concurrent sign-ins associated with your account</p>
          </div>
          <button
            onClick={() => toast.success('All other sessions revoked')}
            className="btn-secondary"
            style={{ color: '#dc2626', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            Revoke Other Sessions
          </button>
        </div>

        <div style={{ padding: '1rem 1.5rem' }}>
          {sessions.map((sess, idx) => {
            const Icon = sess.icon;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 0',
                  borderBottom: idx !== sessions.length - 1 ? '1px solid #f8fafc' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{sess.device}</span>
                      {sess.current && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#059669', padding: '1px 6px', borderRadius: '4px' }}>
                          Current Session
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.15rem' }}>
                      IP: {sess.ip} · {sess.location} · {sess.time}
                    </div>
                  </div>
                </div>

                {!sess.current && (
                  <button
                    onClick={() => toast.info('Session revoked')}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Revoke
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
