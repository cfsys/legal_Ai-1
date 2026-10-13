import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import { X, Coins, Plus, Minus, Check } from 'lucide-react';

export default function CreditTopupModal() {
  const { closeModal, modalTargetUser: user, addToast, refreshOverview } = useAdmin();
  const [amount, setAmount] = useState(1000);
  const [reason, setReason] = useState('Monthly chamber credit allowance');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    if (!amount || amount === 0) {
      addToast('Please enter a valid credit amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.allocateCredits(user.id, amount, reason);
      if (res.success) {
        addToast(`Successfully allocated ${amount >= 0 ? '+' : ''}${amount} credits to ${user.fullName}`);
        refreshOverview();
        closeModal();
      }
    } catch (err) {
      addToast('Credit allocation failed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#eff6ff',
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Coins size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Allocate Legal AI Credits
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Target: <strong style={{ color: 'var(--accent-blue)' }}>{user.fullName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Balance */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#f8fafc',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current Balance:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
            {user.credits?.toLocaleString()} Credits
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleApply} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#ffffff' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Quick Selection:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[250, 500, 1000, 2500, 10000].map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`btn btn-sm ${amount === val ? 'btn-blue' : 'btn-secondary'}`}
                  onClick={() => setAmount(val)}
                >
                  +{val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Credit Amount (Positive to add, negative to deduct)
            </label>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Audit Justification / Note *
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Approved by Managing Partner"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {/* New Balance Preview */}
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              fontSize: '0.8rem',
              color: '#047857',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>Projected New Balance:</span>
            <span style={{ fontWeight: 700 }}>
              {(Math.max(0, user.credits + amount)).toLocaleString()} Credits
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-blue" disabled={loading}>
              <Check size={16} />
              <span>{loading ? 'Processing...' : 'Apply Credits'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
