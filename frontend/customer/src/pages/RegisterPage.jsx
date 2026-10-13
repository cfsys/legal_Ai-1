import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import LeftAuthPanel from '../components/common/LeftAuthPanel';
import CustomSelect from '../components/common/CustomSelect';
import OtpVerificationView from '../components/common/OtpVerificationView';
import { useAuth } from '../context/AuthContext';
import { APP_STRINGS } from '../constants/appStrings';
import { triggerGoogleSignIn } from '../utils/googleAuth';

const ROLE_OPTIONS = [
  { value: 'Advocate', label: 'Advocate / Litigator' },
  { value: 'Senior Counsel', label: 'Senior Counsel' },
  { value: 'Law Firm Partner', label: 'Law Firm Partner' },
  { value: 'In-House Counsel', label: 'In-House Legal' },
  { value: 'Law Scholar', label: 'Judicial Scholar' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { user, register, verifyOtp, resendOtp, googleLogin } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    professionalType: 'Advocate',
    organisationName: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // OTP Verification state
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Compute password strength (0-4)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(formData.password);
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError(APP_STRINGS.AUTH.FIELDS_REQUIRED);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(APP_STRINGS.AUTH.PASSWORDS_MISMATCH);
      return;
    }

    if (!formData.agreeTerms) {
      setError(APP_STRINGS.AUTH.TERMS_REQUIRED);
      return;
    }

    setLoading(true);
    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
      professionalType: formData.professionalType || 'Advocate',
      organisationName: formData.organisationName,
      password: formData.password,
    });
    setLoading(false);

    if (result.requiresOtp) {
      setOtpEmail(result.email || formData.email);
      setRequiresOtp(true);
    } else if (result.success) {
      navigate('/app/dashboard');
    } else {
      setError(result.message || APP_STRINGS.AUTH.REGISTRATION_FAILED);
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
        setError('Google popup was closed or blocked. Please allow popups for localhost to register.');
      } else {
        setError(err.message || 'Google registration could not be completed.');
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
        <div className="form-wrapper" style={{ maxWidth: '560px', width: '100%' }}>
          {requiresOtp ? (
            <OtpVerificationView
              email={otpEmail}
              purpose="register"
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
              <div style={{ marginBottom: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.725rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', border: '1px solid #bfdbfe' }}>
                    <Sparkles size={12} />
                    <span>30-DAY FREE ADVOCATE TRIAL · 500 AI CREDITS</span>
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
                fontSize: '1.9rem',
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.025em',
                marginBottom: '0.2rem',
                lineHeight: 1.15,
              }}
            >
              Create account
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Start your intelligent Legal AI Indian law research workspace.
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 0.85rem',
                backgroundColor: '#fef2f2',
                border: '1.5px solid #fecaca',
                color: '#b91c1c',
                borderRadius: '0.6rem',
                fontSize: '0.8rem',
                marginBottom: '0.7rem',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First Name & Last Name */}
            <div className="form-row" style={{ marginBottom: '0.65rem', gap: '1.15rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  First Name *
                </label>
                <div className="input-wrapper" style={{ height: '42px', borderRadius: '0.65rem' }}>
                  <span className="input-icon-prefix" style={{ left: '0.95rem' }}>
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field"
                    style={{ padding: '0 0.95rem 0 2.65rem', fontSize: '0.85rem', height: '100%' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Last Name *
                </label>
                <div className="input-wrapper" style={{ height: '42px', borderRadius: '0.65rem' }}>
                  <span className="input-icon-prefix" style={{ left: '0.95rem' }}>
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-field"
                    style={{ padding: '0 0.95rem 0 2.65rem', fontSize: '0.85rem', height: '100%' }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="form-row" style={{ marginBottom: '0.65rem', gap: '1.15rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Email Address *
                </label>
                <div className="input-wrapper" style={{ height: '42px', borderRadius: '0.65rem' }}>
                  <span className="input-icon-prefix" style={{ left: '0.95rem' }}>
                    <Mail size={15} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="advocate@lawfirm.in"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    style={{ padding: '0 0.95rem 0 2.65rem', fontSize: '0.85rem', height: '100%' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Mobile Number
                </label>
                <div className="input-wrapper" style={{ height: '42px', borderRadius: '0.65rem' }}>
                  <span className="input-icon-prefix" style={{ left: '0.95rem' }}>
                    <Phone size={15} />
                  </span>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="input-field"
                    style={{ padding: '0 0.95rem 0 2.65rem', fontSize: '0.85rem', height: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Professional Role & Organisation */}
            <div className="form-row" style={{ marginBottom: '0.65rem', gap: '1.15rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Professional Role
                </label>
                <CustomSelect
                  name="professionalType"
                  value={formData.professionalType}
                  onChange={handleChange}
                  options={ROLE_OPTIONS}
                  icon={Briefcase}
                  placeholder="Select professional role"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Organisation / Chamber
                </label>
                <div className="input-wrapper" style={{ height: '42px', borderRadius: '0.65rem' }}>
                  <span className="input-icon-prefix" style={{ left: '0.95rem' }}>
                    <Building2 size={15} />
                  </span>
                  <input
                    type="text"
                    name="organisationName"
                    placeholder="e.g. Supreme Court Bar Chambers"
                    value={formData.organisationName}
                    onChange={handleChange}
                    className="input-field"
                    style={{ padding: '0 0.95rem 0 2.65rem', fontSize: '0.85rem', height: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="form-row" style={{ marginBottom: '0.55rem', gap: '1.15rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Password *
                </label>
                <div className="input-wrapper" style={{ height: '42px', borderRadius: '0.65rem' }}>
                  <span className="input-icon-prefix" style={{ left: '0.95rem' }}>
                    <Lock size={15} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    style={{ padding: '0 2.65rem 0 2.65rem', fontSize: '0.85rem', height: '100%' }}
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

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                  Confirm Password *
                </label>
                <div className="input-wrapper" style={{ height: '42px', borderRadius: '0.65rem' }}>
                  <span className="input-icon-prefix" style={{ left: '0.95rem' }}>
                    <Lock size={15} />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    style={{ padding: '0 2.65rem 0 2.65rem', fontSize: '0.85rem', height: '100%' }}
                    required
                  />
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '0.25rem', height: '100%', width: '36px' }}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Password Strength Bar */}
            {formData.password && (
              <div style={{ marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#64748b', marginBottom: '3px' }}>
                  <span>Password strength</span>
                  <span style={{ fontWeight: 600, color: strength >= 3 ? '#10b981' : strength === 2 ? '#3b82f6' : '#f59e0b' }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
                <div className="password-strength-bar" style={{ marginTop: '2px', display: 'flex', gap: '4px' }}>
                  <div className={`strength-segment ${strength >= 1 ? (strength === 1 ? 'strength-weak' : strength === 2 ? 'strength-fair' : strength === 3 ? 'strength-good' : 'strength-strong') : ''}`} style={{ height: '3px', flex: 1, borderRadius: '2px' }} />
                  <div className={`strength-segment ${strength >= 2 ? (strength === 2 ? 'strength-fair' : strength === 3 ? 'strength-good' : 'strength-strong') : ''}`} style={{ height: '3px', flex: 1, borderRadius: '2px' }} />
                  <div className={`strength-segment ${strength >= 3 ? (strength === 3 ? 'strength-good' : 'strength-strong') : ''}`} style={{ height: '3px', flex: 1, borderRadius: '2px' }} />
                  <div className={`strength-segment ${strength >= 4 ? 'strength-strong' : ''}`} style={{ height: '3px', flex: 1, borderRadius: '2px' }} />
                </div>
              </div>
            )}

            {/* Terms and Conditions Checkbox */}
            <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                style={{ width: '15px', height: '15px', marginTop: '2px', accentColor: '#1d4ed8', cursor: 'pointer' }}
                required
              />
              <label htmlFor="agreeTerms" style={{ fontSize: '0.785rem', color: '#64748b', lineHeight: 1.4, cursor: 'pointer' }}>
                I agree to the <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: Authorized for legal research in Indian jurisdiction.'); }} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Terms of Use</a> and <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: All client documents and research notes are strictly encrypted.'); }} style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>.
              </label>
            </div>

            {/* Register CTA Button */}
            <button type="submit" className="btn-primary" disabled={loading} style={{ height: '44px', fontSize: '0.9rem', width: '100%', borderRadius: '0.65rem' }}>
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
                  <span>Creating workspace...</span>
                </>
              ) : (
                <>
                  <span>Create Free Workspace</span>
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
              margin: '0.75rem 0',
              color: '#94a3b8',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ padding: '0 0.85rem' }}>OR REGISTER WITH</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          {/* Google Only Social Auth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="btn-social"
            style={{ width: '100%', height: '42px', fontSize: '0.85rem', gap: '0.65rem', borderRadius: '0.65rem' }}
          >
            {googleLoading ? (
              <>
                <span
                  style={{
                    width: '15px',
                    height: '15px',
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
                <span>Register with Google</span>
              </>
            )}
          </button>

              {/* Switch to Login */}
              <div style={{ textAlign: 'center', marginTop: '0.85rem', fontSize: '0.835rem', color: '#64748b' }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#1d4ed8',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <span>Sign in here</span>
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

export default RegisterPage;
