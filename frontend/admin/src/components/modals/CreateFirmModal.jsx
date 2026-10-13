import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import CustomDropdown from '../CustomDropdown';
import { X, Building2, Plus, Sparkles } from 'lucide-react';

export default function CreateFirmModal() {
  const { closeModal, refreshFirms, refreshOverview, addToast } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    tier: 'Law Firm Pro',
    seatsLimit: 20,
    creditsTotal: 25000,
    city: 'New Delhi',
    state: 'Delhi',
    contactEmail: '',
    billingCycle: 'Annual',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      addToast('Firm name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.createFirm({
        ...formData,
        seatsLimit: Number(formData.seatsLimit),
        creditsTotal: Number(formData.creditsTotal),
      });

      if (res.success) {
        addToast(`Law firm ${res.firm.name} provisioned successfully!`);
        refreshFirms();
        refreshOverview();
        closeModal();
      }
    } catch (err) {
      addToast('Failed to create firm: ' + err.message, 'error');
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
        {/* Header */}
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
              <Building2 size={17} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Onboard Law Firm Chamber
              </h3>
            </div>
          </div>

          <button
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

        {/* Form */}
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
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
              Law Firm Name *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Amarchand Mangaldas & Suresh A. Shroff & Co."
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                const autoDomain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.law';
                setFormData({ ...formData, name, domain: formData.domain ? formData.domain : autoDomain });
              }}
              required
              style={{ height: '36px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                Primary Domain
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="firmdomain.law"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <CustomDropdown
                label="Subscription Tier *"
                searchPlaceholder="Search tier..."
                options={[
                  { value: 'Enterprise', label: 'Enterprise', subtext: '50+ Seats' },
                  { value: 'Law Firm Pro', label: 'Law Firm Pro', subtext: '20 Seats' },
                  { value: 'Boutique', label: 'Boutique Chambers', subtext: '8 Seats' },
                  { value: 'Trial', label: 'Trial Tenant', subtext: '5 Seats' },
                ]}
                value={formData.tier}
                onChange={(val) => {
                  let seats = 15;
                  let credits = 25000;
                  if (val === 'Enterprise') { seats = 50; credits = 80000; }
                  if (val === 'Boutique') { seats = 8; credits = 10000; }
                  setFormData({ ...formData, tier: val, seatsLimit: seats, creditsTotal: credits });
                }}
                placeholder="Select tier..."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                Licensed Seats Capacity
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.seatsLimit}
                onChange={(e) => setFormData({ ...formData, seatsLimit: e.target.value })}
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                Shared Credit Pool
              </label>
              <input
                type="number"
                className="form-input"
                value={formData.creditsTotal}
                onChange={(e) => setFormData({ ...formData, creditsTotal: e.target.value })}
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                City Jurisdiction
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                Admin Contact Email
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="managing.partner@firm.law"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                style={{ height: '36px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
              style={{ height: '35px', padding: '0 14px', fontSize: '0.82rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-blue"
              disabled={loading}
              style={{ height: '35px', padding: '0 16px', fontSize: '0.82rem' }}
            >
              <Plus size={15} />
              <span>{loading ? 'Provisioning...' : 'Onboard Firm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
