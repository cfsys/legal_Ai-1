import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { adminApi } from '../../services/api';
import { X, ShieldAlert, Check, RefreshCcw } from 'lucide-react';

const MODULES = [
  { id: 'canResearch', bit: 1, label: 'Legal Research & AI Memos', desc: 'Ask Themes AI, generate structured citation memorandums', category: 'Core AI' },
  { id: 'canJudgments', bit: 2, label: 'Indian Case Law Precedents', desc: 'Search Supreme Court & High Court judgments, headnotes & ratio', category: 'Research' },
  { id: 'canDocuments', bit: 4, label: 'Document Clause Analyzer', desc: 'AI breakdown, clause risks, dates, and chronology generation', category: 'Analysis' },
  { id: 'canContracts', bit: 8, label: 'Contract Risk & Redlines', desc: 'Automated contract risk scoring and redline clause rewrites', category: 'Analysis' },
  { id: 'canDrafting', bit: 16, label: 'Legal Notice & Petition Drafter', desc: 'Generate customized legal notices, plaints, and affidavits', category: 'Drafting' },
  { id: 'canMatters', bit: 32, label: 'Litigation Case Files', desc: 'Manage hearing calendars, active dockets, and case stages', category: 'Management' },
  { id: 'canAdmin', bit: 64, label: 'Platform Administration', desc: 'User provisioning, permissions management, and role assignments', category: 'Administration' },
  { id: 'canBilling', bit: 128, label: 'Credit & Subscription Control', desc: 'Top up firm tokens, view credit logs and subscription status', category: 'Administration' },
  { id: 'canAudit', bit: 256, label: 'Security & Audit Logs', desc: 'Inspect audit trail of AI generations, logins, and permission changes', category: 'Security' },
  { id: 'canExport', bit: 512, label: 'Data Export & Reports', desc: 'Export matter dossiers, research PDFs, and compliance reports', category: 'Compliance' },
];

export default function EditPermissionsModal() {
  const { closeModal, modalTargetUser: user, addToast } = useAdmin();
  const [mask, setMask] = useState(user?.permissions || 63);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const toggleBit = (bit) => {
    const isGranted = (mask & bit) === bit;
    setMask(isGranted ? mask - bit : mask + bit);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await adminApi.updateUserPermissions(user.id, { numericMask: mask });
      if (res.success) {
        addToast(`Updated permissions for ${user.fullName} (Mask: ${mask})`);
        closeModal();
      }
    } catch (err) {
      addToast('Failed to save permissions: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
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
                background: '#f1f5f9',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldAlert size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Granular Permissions Matrix
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Configuring access for <strong style={{ color: '#0f172a' }}>{user.fullName}</strong> ({user.roleLabel})
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

        {/* Quick Presets Bar */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            background: '#f8fafc',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Quick Presets:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
              onClick={() => setMask(63)}
            >
              Standard Customer (63)
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', borderColor: '#e2e8f0', color: '#0f172a', fontWeight: 600 }}
              onClick={() => setMask(1023)}
            >
              Super Admin (1023)
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
              onClick={() => setMask(0)}
            >
              Revoke All (0)
            </button>
          </div>
        </div>

        {/* Module Items List */}
        <div style={{ padding: '1.25rem 1.5rem', maxHeight: '52vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#ffffff' }}>
          {MODULES.map((mod) => {
            const isGranted = (mask & mod.bit) === mod.bit;
            return (
              <div
                key={mod.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: isGranted ? '#eff6ff' : '#f8fafc',
                  border: '1px solid',
                  borderColor: isGranted ? '#bfdbfe' : 'var(--border-subtle)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ paddingRight: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isGranted ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>
                      {mod.label}
                    </span>
                    <span className="badge badge-blue font-mono" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      2^{Math.log2(mod.bit)} ({mod.bit})
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      [{mod.category}]
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {mod.desc}
                  </div>
                </div>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isGranted}
                    onChange={() => toggleBit(mod.bit)}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            );
          })}
        </div>

        {/* Bitmask Summary Footer */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Computed Bitmask Integer:
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
              {mask} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>(0x{mask.toString(16).toUpperCase()})</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button className="btn btn-blue" onClick={handleSave} disabled={saving}>
              <Check size={16} />
              <span>{saving ? 'Saving...' : 'Apply Permissions'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
