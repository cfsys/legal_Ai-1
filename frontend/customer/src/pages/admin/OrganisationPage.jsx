import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
  ExternalLink,
  Upload,
} from 'lucide-react';
import { toast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import CustomSelect from '../../components/common/CustomSelect';

const OrganisationPage = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.organisationName || 'Legal AI Legal Advocates & Solicitors',
    legalEntity: 'Limited Liability Partnership (LLP)',
    domain: 'legalai.in',
    country: 'India',
    billingEmail: user?.email || 'billing@legalai.in',
    supportEmail: 'contact@legalai.in',
    phone: '+91 22 6940 8800',
    timezone: 'Asia/Kolkata (IST · UTC+05:30)',
    gstin: '27AABCT2390M1Z8',
    address: 'Level 14, Express Towers, Nariman Point, Mumbai 400021',
    website: 'https://legalai.in',
    plan: user?.plan || 'Law Firm Enterprise',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Organisation settings updated successfully');
    }, 600);
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
            <Building2 size={19} strokeWidth={2.2} />
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
              Firm Entity & Organisation Settings
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Manage your legal entity, primary domain, billing contacts, and practice workspace profile.
            </p>
          </div>
        </div>
      </div>

      {/* Top Banner Card: Verified Domain */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '1.2rem',
            }}
          >
            T
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{formData.name}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.725rem',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={12} />
                Verified Legal Domain
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
              Primary Domain: <code style={{ backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>@{formData.domain}</code> · SSL / TLS Secured · Single-Tenant Pod
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.825rem', padding: '0.5rem 0.9rem', gap: '0.4rem' }}
            onClick={() => toast.info('Firm logo upload dialog opened')}
          >
            <Upload size={14} />
            Update Logo
          </button>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave}>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.85rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            Firm & Entity Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Organisation / Law Firm Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Legal Entity Type</label>
              <CustomSelect
                name="legalEntity"
                value={formData.legalEntity}
                onChange={handleChange}
                icon={Building2}
                options={[
                  { value: 'Limited Liability Partnership (LLP)', label: 'Limited Liability Partnership (LLP)' },
                  { value: 'Sole Proprietorship', label: 'Sole Proprietorship / Senior Advocate Chamber' },
                  { value: 'Partnership Firm', label: 'Partnership Firm' },
                  { value: 'Private Limited Company', label: 'Private Limited Company' },
                  { value: 'Corporate Legal Department', label: 'In-House Corporate Legal Department' },
                ]}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Corporate Domain</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
                <Globe size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country / Jurisdiction</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Billing Notification Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="billingEmail"
                  value={formData.billingEmail}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Official Phone</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                />
                <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tax ID / GSTIN (India)</label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Timezone</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                />
                <Clock size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Registered Office Address</label>
            <div style={{ position: 'relative' }}>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="form-textarea"
                style={{ paddingLeft: '2.4rem' }}
              />
              <MapPin size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '1rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ gap: '0.5rem', minWidth: '130px' }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving Changes...' : 'Save Organisation'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrganisationPage;
