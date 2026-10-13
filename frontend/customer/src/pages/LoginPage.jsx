import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import LeftAuthPanel from '../components/common/LeftAuthPanel';
import OtpVerificationView from '../components/common/OtpVerificationView';
import { useAuth } from '../context/AuthContext';
import { APP_STRINGS } from '../constants/appStrings';
import { triggerGoogleSignIn } from '../utils/googleAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login, verifyOtp, resendOtp, googleLogin } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // OTP Verification state
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(APP_STRINGS.AUTH.EMAIL_PASSWORD_REQUIRED);
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.requiresOtp) {
      setOtpEmail(result.email || email);
      setRequiresOtp(true);
    } else if (result.success) {
      navigate('/app/dashboard');
    } else {
      setError(result.message || APP_STRINGS.AUTH.LOGIN_FAILED);
    }
  };

  const handleVerifyOtp = async (targetEmail, otpCode, purpose) => {
    setOtpLoading(true);
    setError('');
    const res = await verifyOtp(targetEmail, otpCode, purpose);
    setOtpLoading(false);
    if (res.success) {
      navigate('/app/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleResendOtp = async (targetEmail, purpose) => {
    return await resendOtp(targetEmail, purpose);
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const profile = await triggerGoogleSignIn();
      const result = await googleLogin(profile);
      if (result.success) {
        navigate('/app/dashboard');
      } else {
        setError(result.message || APP_STRINGS.AUTH.GOOGLE_AUTH_FAILED);
      }
    } catch (err) {
      if (err.message === 'POPUP_TIMEOUT_OR_BLOCKED') {
        setError('Google popup was closed or blocked. Please allow popups for localhost to sign in.');
      } else {
        setError(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Left Brand Showcase Section */}
      <LeftAuthPanel />

      {/* Right Form Section - Strict 100vh non-scrollable */}
      <div className="auth-right">
        <div className="form-wrapper-login" style={{ maxWidth: '480px', width: '100%' }}>
          {requiresOtp ? (
            <OtpVerificationView
              email={otpEmail}
              purpose="login"
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              onCancel={() => {
                setRequiresOtp(false);
                setError('');
              }}
              loading={otpLoading}
            />
          ) : (
            <>
              {/* Header Badge & Title */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.725rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
                    <ShieldCheck size={13} />
                    <span>SECURE PRACTITIONER ACCESS</span>
                  </div>

              <Link
                to="/"
                style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  textDecoration: 'none',
                  fontWeight: 550,
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                ← Back to Homepage
              </Link>
            </div>

            <h2
              className="font-serif"
              style={{
                fontSize: '2.1rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.025em',
                marginBottom: '0.25rem',
                lineHeight: 1.15,
              }}
            >
              Welcome back
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Sign in to access your Indian law research & precedent workspace.
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                backgroundColor: '#fef2f2',
                border: '1.5px solid #fecaca',
                color: '#b91c1c',
                borderRadius: '0.65rem',
                fontSize: '0.825rem',
                marginBottom: '0.85rem',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.08)',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field with Icon */}
            <div className="form-group" style={{ marginBottom: '0.95rem' }}>
              <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                <span>Email address</span>
              </label>
              <div className="input-wrapper" style={{ height: '44px', borderRadius: '0.65rem' }}>
                <span className="input-icon-prefix" style={{ left: '1rem' }}>
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  placeholder="name@lawfirm.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{ padding: '0 1rem 0 2.75rem', fontSize: '0.875rem', height: '100%' }}
                  required
                />
              </div>
            </div>

            {/* Password Field with Icon & Eye Toggle */}
            <div className="form-group" style={{ marginBottom: '0.95rem' }}>
              <label className="form-label" style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                <span>Password</span>
              </label>
              <div className="input-wrapper" style={{ height: '44px', borderRadius: '0.65rem' }}>
                <span className="input-icon-prefix" style={{ left: '1rem' }}>
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ padding: '0 2.75rem 0 2.75rem', fontSize: '0.875rem', height: '100%' }}
                  required
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.25rem', height: '100%', width: '36px' }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                fontSize: '0.825rem',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  color: '#475569',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: '#1d4ed8', cursor: 'pointer' }}
                />
                <span>Remember me</span>
              </label>

              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert(APP_STRINGS.AUTH.FORGOT_PASSWORD_SENT);
                }}
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Primary CTA Button */}
            <button type="submit" className="btn-primary" disabled={loading} style={{ height: '44px', fontSize: '0.925rem', width: '100%', borderRadius: '0.65rem' }}>
              {loading ? (
                <>
                  <span
                    style={{
                      width: '15px',
                      height: '15px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Legal AI</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* OR Divider with subtle line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0.85rem 0',
              color: '#94a3b8',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ padding: '0 0.85rem' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          {/* Google Only Social Auth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="btn-social"
            style={{ width: '100%', height: '44px', fontSize: '0.875rem', gap: '0.65rem', borderRadius: '0.65rem' }}
          >
            {googleLoading ? (
              <>
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #cbd5e1',
                    borderTopColor: '#2563eb',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                  }}
                />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

              {/* Switch to Register */}
              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#1d4ed8',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <span>Create workspace account</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
