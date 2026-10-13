import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/api';
import {
  Scale,
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  Cpu,
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
} from 'lucide-react';

export default function LoginPage() {
  const { loginUser, addToast } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.login(email, password);
      if (res.success) {
        loginUser(res.token, res.user);
        addToast(`Welcome back, ${res.user.fullName || 'Admin'}!`);
      }
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f8fafc',
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.04) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(15, 23, 42, 0.04) 0%, transparent 40%),
          linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)
        `,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          maxWidth: '1040px',
          width: '100%',
          minHeight: '620px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 0 0 1px #e2e8f0',
        }}
      >
        {/* Left Executive Showcase (Harvey AI / Stripe Aesthetic) */}
        <div
          className="bg-grid-pattern-executive"
          style={{
            flex: '1 1 52%',
            borderRight: '1px solid #e2e8f0',
            padding: '3.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Header Brand */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                boxShadow: 'var(--shadow-subtle)',
                marginBottom: '1.75rem',
              }}
            >
              <Zap size={13} style={{ color: '#2563eb' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '0.04em' }}>
                ENTERPRISE LEGAL SUITE · v2.4
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)',
                }}
              >
                <Scale size={22} style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
                  Legal <span style={{ color: '#2563eb' }}>AI</span> Admin
                </h1>
                <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Multi-Tenant Law Firm Orchestration
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, marginTop: '0.5rem', maxWidth: '420px' }}>
              Centralized administrative governance for law firm chamber management, role-based access control, and legal AI model orchestration.
            </p>
          </div>

          {/* Architecture Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.4rem',
              boxShadow: 'var(--shadow-card)',
              margin: '1.5rem 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                System Architecture
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                <span className="status-indicator-live" />
                <span>API :5001 Live</span>
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>
                <Building2 size={16} style={{ color: '#2563eb' }} />
                <span>Multi-Tenant Chambers</span>
              </div>
              <span className="badge badge-primary">6 Firm Instances</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>
                <ShieldCheck size={16} style={{ color: '#059669' }} />
                <span>Enterprise Role Access</span>
              </div>
              <span className="badge badge-emerald">RBAC Controls</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>
                <Cpu size={16} style={{ color: '#0f172a' }} />
                <span>AI Reasoning Engines</span>
              </div>
              <span className="badge badge-primary">GPT-4o · LegalBERT</span>
            </div>
          </div>

          {/* Footer Security Certs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <LockKeyhole size={14} style={{ color: '#2563eb' }} />
              <span>TLS 1.3 · 256-Bit Encrypted</span>
            </div>
            <span style={{ fontWeight: 600, color: '#94a3b8' }}>ISO 27001 Certified</span>
          </div>
        </div>

        {/* Right Authentication Panel */}
        <div
          style={{
            flex: '1 1 48%',
            backgroundColor: '#ffffff',
            padding: '3.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem' }}>
                <span className="badge badge-primary">Executive Console</span>
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Administrator Sign In
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.84rem', marginTop: '0.25rem' }}>
                Provide your authorized administrative credentials to manage tenant chambers.
              </p>
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 0.95rem',
                  borderRadius: '8px',
                  backgroundColor: '#fff1f2',
                  border: '1px solid #fecdd3',
                  color: '#be123c',
                  fontSize: '0.82rem',
                  marginBottom: '1.25rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Email or Username
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
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
                    style={{ paddingLeft: '2.4rem' }}
                    placeholder="Enter email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
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
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingLeft: '2.4rem', paddingRight: '2.4rem' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: '#0f172a' }}
                  />
                  <span>Keep session active</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.7rem', fontSize: '0.88rem' }}
                disabled={loading}
              >
                <span>{loading ? 'Verifying Credentials...' : 'Sign In '}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
