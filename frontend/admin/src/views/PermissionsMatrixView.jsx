import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/api';
import CustomDropdown from '../components/CustomDropdown';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Save,
  RotateCcw,
  Layers,
  HelpCircle,
  Sliders,
  Filter,
  Building2,
} from 'lucide-react';

const PERMISSION_COLUMNS = [
  { key: 'canResearch', bit: 1, label: 'AI Research', short: 'Research', desc: 'Ask Themes AI & Legal Research Memorandums' },
  { key: 'canJudgments', bit: 2, label: 'Judgments', short: 'Precedents', desc: 'Indian Case Law Precedents Search & Headnotes' },
  { key: 'canDocuments', bit: 4, label: 'Doc Scanner', short: 'Docs', desc: 'Document Scanning & AI Clause Breakdown' },
  { key: 'canContracts', bit: 8, label: 'Contract Risk', short: 'Contracts', desc: 'Contract Risk Scoring & Redline Review' },
  { key: 'canDrafting', bit: 16, label: 'Drafter', short: 'Drafting', desc: 'Legal Notice & Petition Drafter' },
  { key: 'canMatters', bit: 32, label: 'Case Matters', short: 'Matters', desc: 'Litigation Matters & Hearing Calendars' },
  { key: 'canAdmin', bit: 64, label: 'Admin Access', short: 'Admin', desc: 'Admin Console & User Permissions' },
  { key: 'canBilling', bit: 128, label: 'Billing/Credits', short: 'Billing', desc: 'Credit Allocations & Invoice Management' },
  { key: 'canAudit', bit: 256, label: 'Audit Logs', short: 'Audit', desc: 'View Security Audit Trails' },
  { key: 'canExport', bit: 512, label: 'Bulk Export', short: 'Export', desc: 'Export Dossiers, Citations & Reports' },
];

export default function PermissionsMatrixView() {
  const { selectedFirmId, setSelectedFirmId, firms, addToast } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ firmId: selectedFirmId });
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      addToast('Failed to load permission records: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedFirmId, addToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle individual toggle on the grid
  const handleTogglePermission = async (user, col) => {
    const currentMask = user.permissions;
    const isGranted = (currentMask & col.bit) === col.bit;
    const newMask = isGranted ? currentMask - col.bit : currentMask + col.bit;

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === user.id) {
          const newMap = { ...u.permissionsMap, [col.key]: !isGranted };
          return { ...u, permissions: newMask, permissionsMap: newMap };
        }
        return u;
      })
    );

    setSavingId(user.id);
    try {
      const res = await adminApi.updateUserPermissions(user.id, { numericMask: newMask });
      if (res.success) {
        addToast(`Updated ${col.label} for ${user.fullName} (Mask: ${newMask})`);
      }
    } catch (err) {
      addToast('Failed to persist permission change: ' + err.message, 'error');
      loadUsers(); // rollback on error
    } finally {
      setSavingId(null);
    }
  };

  // Preset Applicator
  const applyPreset = async (user, presetType) => {
    let newMask = 63;
    if (presetType === 'all') newMask = 1023; // Super admin
    if (presetType === 'customer') newMask = 63; // Default Customer (1+2+4+8+16+32)
    if (presetType === 'researcher') newMask = 1 | 2 | 4 | 512; // 519
    if (presetType === 'compliance') newMask = 4 | 8 | 256 | 512; // 780
    if (presetType === 'read-only') newMask = 1 | 2; // 3

    setSavingId(user.id);
    try {
      const res = await adminApi.updateUserPermissions(user.id, { numericMask: newMask });
      if (res.success) {
        addToast(`Applied ${presetType.toUpperCase()} preset to ${user.fullName} (Mask: ${newMask})`);
        loadUsers();
      }
    } catch (err) {
      addToast('Failed to apply preset: ' + err.message, 'error');
    } finally {
      setSavingId(null);
    }
  };

  const firmOptions = [
    { value: '', label: 'All Law Firms (Multi-Tenant)' },
    ...firms.map((f) => ({ value: f.id, label: f.name, subtext: f.tier })),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header matching Client App */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">
            Granular Permissions & Feature Matrix
          </h1>
          <p className="page-subtitle">
            Direct bit-level authorization matrix. Grant or revoke specific Themes AI legal modules with real-time numeric bitmask sync.
          </p>
        </div>

        {/* Firm Filter CustomDropdown */}
        <div style={{ width: '260px' }}>
          <CustomDropdown
            options={firmOptions}
            value={selectedFirmId}
            onChange={(val) => setSelectedFirmId(val)}
            placeholder="All Law Firms"
            icon={Building2}
          />
        </div>
      </div>

      {/* Bitmask Legend Card */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: '#ffffff',
          borderLeft: '4px solid #0f172a',
          borderColor: '#e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <ShieldAlert size={18} style={{ color: '#0f172a' }} />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
            Architecture Overview: Integer Bitmask Authorization
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
          Permissions in Legal AI are encoded into a single 32-bit integer field. For example, 
          <code style={{ color: '#0f172a', margin: '0 0.35rem', padding: '0.15rem 0.4rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontWeight: 600 }}>
            Mask 63 = 1 (Research) + 2 (Judgments) + 4 (Documents) + 8 (Contracts) + 16 (Drafting) + 32 (Matters)
          </code>.
          Toggling any module flips the corresponding bit and persists immediately to the database.
        </p>
      </div>

      {/* Matrix Table - Scrollable Box */}
      <div className="table-card-box">
        <div className="table-scroll-viewport" style={{ maxHeight: '480px' }}>
          <table className="custom-table" style={{ minWidth: '1080px' }}>
            <thead>
              <tr>
                <th style={{ width: '220px' }}>Advocate / User</th>
                <th style={{ width: '130px' }}>Firm</th>
                <th style={{ width: '110px' }}>Bitmask</th>
                {PERMISSION_COLUMNS.map((col) => (
                  <th key={col.key} style={{ textAlign: 'center', padding: '0.75rem 0.5rem' }} title={col.desc}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {col.short}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#2563eb', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      2^{Math.log2(col.bit)} ({col.bit})
                    </div>
                  </th>
                ))}
                <th style={{ textAlign: 'right', width: '160px' }}>Presets</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const mask = user.permissions;
                return (
                  <tr key={user.id}>
                    {/* User info */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=0f172a&color=ffffff`;
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                            {user.fullName}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {user.roleLabel}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Firm */}
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {user.firmName}
                    </td>

                    {/* Bitmask Value */}
                    <td>
                      <span
                        className="badge badge-primary font-mono"
                        style={{ fontSize: '0.74rem', letterSpacing: '0.02em', fontWeight: 700 }}
                      >
                        {mask} (0x{mask.toString(16).toUpperCase()})
                      </span>
                    </td>

                    {/* 10 Bit Checkboxes */}
                    {PERMISSION_COLUMNS.map((col) => {
                      const isGranted = (mask & col.bit) === col.bit;
                      return (
                        <td key={col.key} style={{ textAlign: 'center', padding: '0.6rem 0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleTogglePermission(user, col)}
                            disabled={savingId === user.id}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: isGranted ? '1px solid #10b981' : '1px solid #e2e8f0',
                              background: isGranted ? '#ecfdf5' : '#ffffff',
                              color: isGranted ? '#059669' : '#cbd5e1',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              boxShadow: 'var(--shadow-subtle)',
                            }}
                            title={`${isGranted ? 'Revoke' : 'Grant'} ${col.label} (${col.bit})`}
                          >
                            {isGranted ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                          </button>
                        </td>
                      );
                    })}

                    {/* Quick Presets */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem' }}
                          onClick={() => applyPreset(user, 'customer')}
                          title="Grant standard 63 customer modules"
                        >
                          Std (63)
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.68rem', borderColor: '#e2e8f0', color: '#0f172a', fontWeight: 600 }}
                          onClick={() => applyPreset(user, 'all')}
                          title="Grant all 1023 privileges"
                        >
                          All (1023)
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Box Footer */}
        <div className="table-box-footer">
          <span>Bitmask encoding: 10 legal module flags (0 to 1023)</span>
          <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Real-Time Bitmask Synchronized
          </span>
        </div>
      </div>
    </div>
  );
}
