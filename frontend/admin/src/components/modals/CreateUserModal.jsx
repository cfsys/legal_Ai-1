import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import { X, UserPlus, AlertCircle } from 'lucide-react';

export default function CreateUserModal({ onCreated }) {
  const { closeModal, firms, refreshOverview, refreshUsers, addToast } = useAdmin();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '+91 ',
    firmId: firms[0]?.id || 'firm-1',
    role: '4', // Advocate default
    professionalType: 'Advocate',
    credits: 1000,
    permissions: 63, // Default customer mask
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [closeModal]);

  // Field validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName': {
        const val = (value || '').trim();
        if (!val) return 'First name is required';
        if (val.length < 2) return 'First name must be at least 2 characters';
        if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'First name can only contain letters';
        return '';
      }
      case 'lastName': {
        const val = (value || '').trim();
        if (!val) return 'Last name is required';
        if (!/^[a-zA-Z\s.'-]+$/.test(val)) return 'Last name can only contain letters';
        return '';
      }
      case 'email': {
        const val = (value || '').trim();
        if (!val) return 'Email address is required';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(val)) return 'Please enter a valid email address';
        return '';
      }
      case 'mobile': {
        const val = (value || '').trim();
        const digits = val.replace(/\D/g, '');
        if (!val || val === '+91' || val === '+91 ') {
          return 'Mobile phone number is required';
        }
        // Standard Indian mobile validation: starts with 6-9 and has 10 digits (with or without 91 prefix)
        const isIndian = /^(?:\+91[\s-]?)?[6789]\d{9}$/.test(val.replace(/\s+/g, ' '));
        const isValidDigits = digits.length >= 10 && digits.length <= 13;
        if (!isIndian && !isValidDigits) {
          return 'Enter a valid 10-digit mobile number (e.g., +91 98200 12345)';
        }
        return '';
      }
      case 'professionalType': {
        const val = (value || '').trim();
        if (val.length > 60) return 'Designation cannot exceed 60 characters';
        return '';
      }
      case 'password': {
        if (value && value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return '';
      }
      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {};
    const fields = ['firstName', 'lastName', 'email', 'mobile', 'professionalType', 'password'];
    fields.forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const getInputStyle = (fieldName) => {
    const hasError = touched[fieldName] && errors[fieldName];
    return {
      height: '36px',
      boxSizing: 'border-box',
      width: '100%',
      borderColor: hasError ? '#ef4444' : undefined,
      backgroundColor: hasError ? 'rgba(239, 68, 68, 0.04)' : undefined,
      transition: 'border-color 0.15s ease, background-color 0.15s ease',
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      professionalType: true,
      password: true,
    });

    const validationErrors = validateAll();
    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      addToast(validationErrors[errorKeys[0]], 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.createUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        firmId: formData.firmId,
        role: Number(formData.role),
        professionalType: formData.professionalType.trim() || 'Advocate',
        credits: Number(formData.credits || 1000),
        permissions: Number(formData.permissions || 63),
        password: formData.password || 'password123',
      });

      if (res.success) {
        const createdUser = res.user || {
          ...formData,
          fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        };

        addToast(`Advocate ${createdUser.fullName || formData.firstName} provisioned successfully!`);

        // 1. Notify parent caller
        if (typeof onCreated === 'function') {
          onCreated(createdUser);
        }

        // 2. Refresh admin context reactive counters
        if (typeof refreshUsers === 'function') {
          refreshUsers();
        }
        if (typeof refreshOverview === 'function') {
          refreshOverview();
        }

        // 3. Dispatch global custom event so views (UsersView) update real-time without browser refresh
        window.dispatchEvent(new CustomEvent('legal_ai_user_created', { detail: createdUser }));

        closeModal();
      } else {
        addToast(res.message || 'Failed to provision advocate', 'error');
      }
    } catch (err) {
      addToast('Failed to provision advocate: ' + (err.message || 'Server error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '100%',
          overflow: 'visible',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#eff6ff',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={17} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Provision New Legal Advocate
              </h3>
            </div>
          </div>

          <button
            onClick={closeModal}
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '13px',
            background: '#ffffff',
            borderRadius: '0 0 12px 12px',
            overflow: 'visible',
          }}
        >
          {/* Row 1: First Name & Last Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                First Name *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ramesh"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                style={getInputStyle('firstName')}
              />
              {touched.firstName && errors.firstName && (
                <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '3px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <AlertCircle size={12} />
                  <span>{errors.firstName}</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Last Name *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Nariman"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                style={getInputStyle('lastName')}
              />
              {touched.lastName && errors.lastName && (
                <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '3px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <AlertCircle size={12} />
                  <span>{errors.lastName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Email Address & Mobile Number */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Email Address *
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="ramesh@shardul.law"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                style={getInputStyle('email')}
              />
              {touched.email && errors.email && (
                <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '3px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <AlertCircle size={12} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Mobile Number *
              </label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98200 12345"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                onBlur={() => handleBlur('mobile')}
                style={getInputStyle('mobile')}
              />
              {touched.mobile && errors.mobile && (
                <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '3px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <AlertCircle size={12} />
                  <span>{errors.mobile}</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Professional Designation & Login Password */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Professional Designation
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Advocate / Senior Partner"
                value={formData.professionalType}
                onChange={(e) => handleChange('professionalType', e.target.value)}
                onBlur={() => handleBlur('professionalType')}
                style={getInputStyle('professionalType')}
              />
              {touched.professionalType && errors.professionalType && (
                <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '3px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <AlertCircle size={12} />
                  <span>{errors.professionalType}</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Login Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Default: password123"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                style={getInputStyle('password')}
              />
              {touched.password && errors.password && (
                <div style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '3px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <AlertCircle size={12} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
              style={{ height: '36px', padding: '0 16px', fontSize: '0.82rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-blue"
              disabled={loading}
              style={{ height: '36px', padding: '0 18px', fontSize: '0.82rem' }}
            >
              <UserPlus size={15} />
              <span>{loading ? 'Provisioning...' : 'Provision Advocate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
