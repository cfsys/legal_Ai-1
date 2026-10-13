import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import CustomDropdown from '../CustomDropdown';
import { X, UserCog, Save, Building2, Shield, Briefcase, Mail, Phone, Coins, Lock } from 'lucide-react';

export default function EditUserModal({ user, onUpdated }) {
  const { closeModal, firms, refreshOverview, addToast } = useAdmin();

  // Split name if firstName/lastName not directly set
  const initialFirstName = user?.firstName || (user?.fullName ? user.fullName.split(' ')[0] : '');
  const initialLastName = user?.lastName || (user?.fullName ? user.fullName.split(' ').slice(1).join(' ') : '');

  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: user?.email || '',
    mobile: user?.mobile || '',
    firmId: user?.firmId || (firms && firms[0]?.id) || 'firm-1',
    role: String(user?.role !== undefined ? user.role : '4'),
    professionalType: user?.professionalType || 'Advocate',
    credits: user?.credits !== undefined ? user.credits : 1000,
    status: String(user?.status !== undefined ? user.status : '1'),
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      addToast('Please fill in required fields (First Name, Last Name, and Email)', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        firmId: formData.firmId,
        role: Number(formData.role),
        professionalType: formData.professionalType.trim() || 'Advocate',
        credits: Number(formData.credits) || 0,
        status: Number(formData.status),
      };

      if (formData.password && formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const res = await adminApi.updateUser(user.id, payload);

      if (res?.success) {
        addToast(`Advocate ${payload.fullName} updated successfully!`);
        if (onUpdated) onUpdated();
        refreshOverview();
        closeModal();
      } else {
        throw new Error(res?.message || 'Failed to update advocate');
      }
    } catch (err) {
      addToast('Error updating advocate: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: '4', label: 'Advocate' },
    { value: '3', label: 'Senior Partner' },
    { value: '2', label: 'Firm Admin' },
    { value: '5', label: 'Legal Researcher' },
    { value: '6', label: 'Paralegal' },
    { value: '7', label: 'Compliance Officer' },
    { value: '1', label: 'Super Admin' },
  ];

  const statusOptions = [
    { value: '1', label: 'Active (Operational)', subtext: 'Full access permitted' },
    { value: '2', label: 'Pending Approval', subtext: 'Awaiting onboarding' },
    { value: '3', label: 'Suspended (Revoked)', subtext: 'Access temporarily barred' },
  ];

  const firmOptions = (firms || []).map((f) => ({
    value: f.id,
    label: f.name,
    subtext: f.tier || 'Chamber',
  }));

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '580px',
          width: '100%',
          overflow: 'visible',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: '12px 12px 0 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
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
              <UserCog size={17} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Edit Advocate Record
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={closeModal}
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
          style={{
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '11px',
            background: '#ffffff',
            borderRadius: '0 0 12px 12px',
            overflow: 'visible',
          }}
        >
          {/* Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                First Name *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ramesh"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                Last Name *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Nariman"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Contact Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                Email Address *
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="ramesh@shardul.law"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                Mobile Number
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 98200 12345"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Firm & Role Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <CustomDropdown
                label="Law Firm Chamber *"
                options={firmOptions}
                value={formData.firmId}
                onChange={(val) => setFormData({ ...formData, firmId: val })}
                placeholder="Select law firm..."
                searchPlaceholder="Search chamber from backend..."
                icon={Building2}
                onSearch={async (query) => {
                  const res = await adminApi.getFirms({ search: query });
                  if (res.success && res.firms) {
                    return res.firms.map((f) => ({ value: f.id, label: f.name, subtext: f.tier || 'Chamber' }));
                  }
                }}
              />
            </div>

            <div>
              <CustomDropdown
                label="System Role *"
                options={roleOptions}
                value={formData.role}
                onChange={(val) => setFormData({ ...formData, role: val })}
                placeholder="Select system role..."
                searchPlaceholder="Search role..."
                icon={Shield}
              />
            </div>
          </div>

          {/* Designation & Credits Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                Professional Designation
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Senior Associate"
                value={formData.professionalType}
                onChange={(e) => setFormData({ ...formData, professionalType: e.target.value })}
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                Legal AI Credits
              </label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Status & Password Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <CustomDropdown
                label="Account Status *"
                options={statusOptions}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
                placeholder="Select status..."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                New Password (Optional)
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Leave blank to keep unchanged"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="new-password"
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
              disabled={loading}
              style={{ height: '35px', padding: '0 14px', fontSize: '0.82rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-blue"
              disabled={loading}
              style={{ height: '35px', padding: '0 16px', fontSize: '0.82rem', gap: '6px' }}
            >
              <Save size={15} />
              <span>{loading ? 'Saving...' : 'Update Advocate'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
