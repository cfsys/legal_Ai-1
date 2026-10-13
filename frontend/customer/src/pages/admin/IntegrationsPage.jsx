import React, { useState } from 'react';
import {
  Plug,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  FileCheck,
  Building,
  X,
  Settings,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { toast } from '../../context/ToastContext';

const IntegrationsPage = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'google',
      name: 'Google Workspace',
      desc: 'Sync legal research briefs to Google Docs and access case files from Google Drive.',
      category: 'Cloud Storage & Docs',
      status: 'Connected',
      badge: 'Active',
      color: '#ea4335',
      letter: 'G',
      lastSync: '10 minutes ago',
    },
    {
      id: 'ms365',
      name: 'Microsoft 365',
      desc: 'Legal AI Word Add-in for clause drafting and citation verification directly in MS Word.',
      category: 'Word & Outlook',
      status: 'Not connected',
      badge: 'Available',
      color: '#0078d4',
      letter: 'M',
      lastSync: 'Never',
    },
    {
      id: 'slack',
      name: 'Slack',
      desc: 'Receive automated cause list hearing notifications and daily AI case law digests in Slack channels.',
      category: 'Team Communication',
      status: 'Connected',
      badge: 'Active',
      color: '#4a154b',
      letter: 'S',
      lastSync: '1 hour ago',
    },
    {
      id: 'ecourts',
      name: 'e-Courts India',
      desc: 'Direct integration with Supreme Court & High Courts e-Courts portal for live cause lists.',
      category: 'Court Registries',
      status: 'Not connected',
      badge: 'Available',
      color: '#059669',
      letter: 'eC',
      lastSync: 'Never',
    },
    {
      id: 'clio',
      name: 'Clio Practice Management',
      desc: 'Synchronize active litigation matters, client rosters, and billable research hours.',
      category: 'Practice Management',
      status: 'Not connected',
      badge: 'Available',
      color: '#1e3a8a',
      letter: 'C',
      lastSync: 'Never',
    },
    {
      id: 'leegality',
      name: 'Leegality / DocuSign',
      desc: 'Seamless digital stamp paper execution, Aadhaar eSign, and document signing workflows.',
      category: 'Digital Signatures',
      status: 'Connected',
      badge: 'Active',
      color: '#d97706',
      letter: 'L',
      lastSync: 'Yesterday',
    },
  ]);

  const [activeModalInteg, setActiveModalInteg] = useState(null);
  const [syncingId, setSyncingId] = useState(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (activeModalInteg) setActiveModalInteg(null);
      }
    };
    if (activeModalInteg) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalInteg]);

  const handleConnect = (integ) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integ.id
          ? { ...i, status: 'Connected', badge: 'Active', lastSync: 'Just now' }
          : i
      )
    );
    toast.success(`${integ.name} connected successfully`, 'Integration Active');
  };

  const handleDisconnect = (integ) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === integ.id
          ? { ...i, status: 'Not connected', badge: 'Available' }
          : i
      )
    );
    if (activeModalInteg?.id === integ.id) {
      setActiveModalInteg(null);
    }
    toast.info(`${integ.name} disconnected`, 'Integration Removed');
  };

  const handleTriggerSync = (integ) => {
    setSyncingId(integ.id);
    setTimeout(() => {
      setSyncingId(null);
      setIntegrations((prev) =>
        prev.map((i) => (i.id === integ.id ? { ...i, lastSync: 'Just now' } : i))
      );
      toast.success(`${integ.name} synchronized successfully`, 'Data Synchronized');
    }, 700);
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
            <Plug size={19} strokeWidth={2.2} />
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
              Platform Ecosystem & Integrations
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Connect Legal AI with your firm's document repositories, court registries, and practice productivity suites.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Integrations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {integrations.map((integ) => {
          const isConnected = integ.status === 'Connected';
          return (
            <div
              key={integ.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.85rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: integ.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                      }}
                    >
                      {integ.letter}
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{integ.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{integ.category}</div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      backgroundColor: isConnected ? '#ecfdf5' : '#f1f5f9',
                      color: isConnected ? '#059669' : '#64748b',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {integ.badge}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {integ.desc}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: isConnected ? '#059669' : '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {isConnected && <CheckCircle2 size={13} />}
                  {integ.status}
                </span>

                {isConnected ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setActiveModalInteg(integ)}
                      className="btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.38rem 0.75rem' }}
                    >
                      Manage
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDisconnect(integ)}
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.38rem 0.65rem',
                        color: '#dc2626',
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleConnect(integ)}
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manage Integration Modal */}
      {activeModalInteg && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: activeModalInteg.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}
                >
                  {activeModalInteg.letter}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Manage {activeModalInteg.name}
                  </h3>
                  <p style={{ fontSize: '0.725rem', color: '#64748b', margin: 0 }}>
                    {activeModalInteg.category} · Status: Active
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveModalInteg(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#15803d',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} />
                  <span>Integration is healthy and connected.</span>
                </div>
                <span style={{ fontSize: '0.725rem', color: '#166534', fontWeight: 600 }}>
                  Synced {activeModalInteg.lastSync}
                </span>
              </div>

              {/* Sync settings */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.45rem' }}>
                  Synchronization Settings
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#334155', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Auto-sync generated legal drafts and briefs</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#334155', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Receive real-time hearing cause list alerts</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#334155', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Audit trail logging for compliance & data access</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleTriggerSync(activeModalInteg)}
                  disabled={syncingId === activeModalInteg.id}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    fontSize: '0.825rem',
                  }}
                >
                  <RefreshCw size={14} className={syncingId === activeModalInteg.id ? 'spin' : ''} />
                  <span>{syncingId === activeModalInteg.id ? 'Syncing...' : 'Sync Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDisconnect(activeModalInteg)}
                  style={{
                    padding: '0.55rem 0.85rem',
                    color: '#dc2626',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage;
