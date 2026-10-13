import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Mail, ArrowRight, RefreshCw, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const OtpVerificationView = ({
  email,
  purpose = 'login',
  onVerify,
  onResend,
  onCancel,
  loading = false,
}) => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(30);
  const [expiresIn, setExpiresIn] = useState(600); // 10 minutes in seconds
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  // Auto-focus first input box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for 10-minute validity
  useEffect(() => {
    if (expiresIn <= 0) return;
    const timer = setInterval(() => {
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresIn]);

  // Cooldown timer for Resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const cdTimer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(cdTimer);
  }, [resendCooldown]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDigitChange = (index, value) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    // Single digit input
    const char = cleaned.slice(-1);
    const updated = [...otpDigits];
    updated[index] = char;
    setOtpDigits(updated);
    setError('');

    // Advance focus to next input box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const digits = pasted.split('');
    const updated = ['', '', '', '', '', ''];
    digits.forEach((d, i) => {
      if (i < 6) updated[i] = d;
    });
    setOtpDigits(updated);
    setError('');

    const focusIdx = Math.min(digits.length, 5);
    inputRefs.current[focusIdx]?.focus();

    if (digits.length === 6) {
      onVerify(email, pasted, purpose);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');
    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }
    if (expiresIn <= 0) {
      setError('This verification code has expired. Please click "Resend Code".');
      return;
    }
    onVerify(email, fullCode, purpose);
  };

  const handleResendClick = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setError('');
    const res = await onResend(email, purpose);
    setResending(false);
    if (res?.success) {
      setResendCooldown(30);
      setExpiresIn(600);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } else if (res?.message) {
      setError(res.message);
    }
  };

  return (
    <div style={{ width: '100%', animation: 'fadeInSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      {/* Header Badge */}
      <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            margin: '0 auto 14px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            border: '1px solid #bfdbfe',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.15)',
          }}
        >
          <ShieldCheck size={28} />
        </div>

        <h2 style={{ fontSize: '1.45rem', fontWeight: 750, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          {purpose === 'register' ? 'Verify Your Email' : 'Two-Step Verification'}
        </h2>
        <p style={{ fontSize: '0.865rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
          We have dispatched a 6-digit verification code to
        </p>

        {/* Highlighted email pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px',
            padding: '4px 12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '9999px',
            fontSize: '0.835rem',
            fontWeight: 650,
            color: '#1e293b',
          }}
        >
          <Mail size={13} color="#2563eb" />
          <span>{email}</span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.65rem 0.85rem',
            marginBottom: '1.25rem',
            borderRadius: '10px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#dc2626',
            fontSize: '0.825rem',
          }}
        >
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* 6 Segmented OTP Inputs */}
      <div
        onPaste={handlePaste}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          margin: '1.5rem 0 1rem',
        }}
      >
        {otpDigits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleDigitChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            disabled={loading}
            style={{
              width: '46px',
              height: '54px',
              textAlign: 'center',
              fontSize: '1.45rem',
              fontWeight: 750,
              fontFamily: 'monospace',
              color: '#0f172a',
              backgroundColor: digit ? '#eff6ff' : '#ffffff',
              border: digit ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
              borderRadius: '10px',
              outline: 'none',
              transition: 'all 0.15s ease',
              boxShadow: digit ? '0 0 0 3px rgba(37, 99, 235, 0.12)' : 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb';
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
            }}
            onBlur={(e) => {
              if (!digit) {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
        ))}
      </div>

      {/* Timer & Expiry Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.785rem',
          color: expiresIn <= 60 ? '#dc2626' : '#64748b',
          marginBottom: '1.5rem',
          fontWeight: 550,
        }}
      >
        <span>Code expires in:</span>
        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: expiresIn <= 60 ? '#dc2626' : '#0f172a' }}>
          {formatTimer(expiresIn)}
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || otpDigits.join('').length !== 6}
        className="btn-primary"
        style={{
          width: '100%',
          height: '46px',
          fontSize: '0.925rem',
          fontWeight: 650,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: otpDigits.join('').length === 6 ? 1 : 0.65,
          cursor: otpDigits.join('').length === 6 ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? (
          <>
            <div className="spinner-border" style={{ width: '16px', height: '16px' }} />
            <span>Verifying Code...</span>
          </>
        ) : (
          <>
            <span>{purpose === 'register' ? 'Verify & Create Account' : 'Verify & Sign In'}</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* Resend and Back Actions */}
      <div
        style={{
          marginTop: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <button
          type="button"
          onClick={handleResendClick}
          disabled={resendCooldown > 0 || resending}
          style={{
            background: 'none',
            border: 'none',
            color: resendCooldown > 0 ? '#94a3b8' : '#2563eb',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px',
          }}
        >
          <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
          <span>
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Verification Code'}
          </span>
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ArrowLeft size={12} />
            <span>{purpose === 'register' ? 'Back to Registration Form' : 'Back to Email Sign In'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpVerificationView;
