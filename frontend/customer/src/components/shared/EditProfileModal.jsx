import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Award,
  CheckCircle2,
  Save,
  Sparkles,
  Scale
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CustomSelect from '../common/CustomSelect';

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    organisationName: '',
    professionalType: 'Advocate',
    barCouncilNumber: '',
    bio: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        organisationName: user.organisationName || '',
        professionalType: user.professionalType || 'Advocate',
        barCouncilNumber: user.barCouncilNumber || '',
        bio: user.bio || '',
      });
    }
  }, [user, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && (e.key === 'Escape' || e.key === 'Esc')) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initials = `${formData.firstName?.[0] || 'A'}${formData.lastName?.[0] || 'D'}`.toUpperCase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        organisationName: formData.organisationName,
        professionalType: formData.professionalType,
        barCouncilNumber: formData.barCouncilNumber,
        bio: formData.bio,
      });
      if (res.success) {
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
          animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #dbeafe',
              }}
            >
              <User size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Edit Profile
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Update your advocate profile docket and chamber details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Avatar Identity Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.15rem',
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {formData.firstName || 'Advocate'} {formData.lastName || 'Counsel'}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.675rem',
                    fontWeight: 600,
                    color: '#059669',
                    backgroundColor: '#ecfdf5',
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  <CheckCircle2 size={11} /> Verified
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                {formData.email}
              </div>

              <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '4px' }}>
                Role: <strong>{user?.role === 1 || user?.role === 'admin' ? 'System Administrator' : 'Advocate / Customer'}</strong> · Plan: <strong>{user?.plan || 'Enterprise'}</strong>
              </div>
            </div>
          </div>

          {/* Name Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
            </div>
          </div>

          {/* Contact Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem 0.6rem 2.2rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.85rem',
                    color: '#64748b',
                    backgroundColor: '#f8fafc',
                    cursor: 'not-allowed',
                  }}
                />
                <Mail
                  size={15}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                Mobile Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem 0.6rem 2.2rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
                <Phone
                  size={15}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>
          </div>

          {/* Professional Credentials Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                Designation / Role
              </label>
              <CustomSelect
                value={formData.professionalType}
                onChange={(e) => setFormData({ ...formData, professionalType: e.target.value })}
                options={[
                  { value: 'Advocate', label: 'Advocate' },
                  { value: 'Senior Counsel', label: 'Senior Counsel' },
                  { value: 'Managing Partner', label: 'Managing Partner' },
                  { value: 'Legal Associate', label: 'Legal Associate' },
                  { value: 'In-House Counsel', label: 'In-House Counsel' },
                  { value: 'Chartered Accountant', label: 'Chartered Accountant' },
                  { value: 'Company Secretary', label: 'Company Secretary' },
                ]}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
                Bar Council Enrolment No.
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. D/1482/2018"
                  value={formData.barCouncilNumber}
                  onChange={(e) => setFormData({ ...formData, barCouncilNumber: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem 0.6rem 2.2rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
                <Scale
                  size={15}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>
          </div>

          {/* Law Firm / Chamber */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
              Law Firm / Chamber / Organisation
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. Sharma & Associates Chamber of Law"
                value={formData.organisationName}
                onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem 0.6rem 2.2rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
              <Building2
                size={15}
                color="#94a3b8"
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Bio / Practice Focus */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 650, color: '#334155', marginBottom: '0.35rem' }}>
              Practice Specialization & Bio
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Practicing before Supreme Court of India & Delhi High Court in commercial arbitration and corporate insolvency."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                color: '#0f172a',
                outline: 'none',
                resize: 'vertical',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />
          </div>

          {/* Modal Actions Footer */}
          <div
            style={{
              paddingTop: '0.75rem',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#475569',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.35rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: saving ? 'wait' : 'pointer',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!saving) e.currentTarget.style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                if (!saving) e.currentTarget.style.backgroundColor = '#2563eb';
              }}
            >
              <Save size={15} />
              <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
