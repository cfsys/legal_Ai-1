import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import CustomDropdown from '../components/CustomDropdown';
import {
  Sliders,
  ShieldCheck,
  Cpu,
  Database,
  Lock,
  Save,
  CheckCircle2,
  HardDrive,
  RefreshCw,
} from 'lucide-react';

export default function SettingsView() {
  const { addToast } = useAdmin();
  const [settings, setSettings] = useState({
    defaultCredits: 500,
    deepResearchMultiplier: 2.5,
    enforce2FA: true,
    maintenanceMode: false,
    autoIndexJudgments: true,
    dataRetentionDays: 365,
    primaryModel: 'GPT-4o Legal Fine-tuned',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('Platform administrative settings saved successfully!');
    }, 400);
  };

  const modelOptions = [
    { value: 'GPT-4o Legal Fine-tuned', label: 'GPT-4o Legal Fine-tuned', subtext: 'Azure Gov / OpenAI' },
    { value: 'Claude 3.5 Sonnet', label: 'Claude 3.5 Sonnet', subtext: 'Anthropic Bedrock' },
    { value: 'DeepSeek-R1-Law', label: 'DeepSeek-R1-Law', subtext: 'Chain-of-Thought' },
    { value: 'LegalBERT-India', label: 'LegalBERT-India v4.2', subtext: 'Private GPU' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '850px' }}>
      {/* Header matching Client App */}
      <div>
        <h1 className="page-title">
          Platform & System Configurations
        </h1>
        <p className="page-subtitle">
          Global parameters for credit distribution, AI reasoning models, and multi-tenant security policies.
        </p>
      </div>

      {/* Credit & AI Quota Settings */}
      <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <Cpu size={18} style={{ color: '#2563eb' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
            AI Inference & Credit Rules
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Default Credits per New Advocate
            </label>
            <input
              type="number"
              className="form-input"
              style={{ height: '40px', borderRadius: '10px' }}
              value={settings.defaultCredits}
              onChange={(e) => setSettings({ ...settings, defaultCredits: Number(e.target.value) })}
            />
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Given upon onboarding before firm pool deduction
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
              Deep Research Multiplier
            </label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              style={{ height: '40px', borderRadius: '10px' }}
              value={settings.deepResearchMultiplier}
              onChange={(e) => setSettings({ ...settings, deepResearchMultiplier: Number(e.target.value) })}
            />
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Cost multiplier for multi-hop precedent cross-referencing
            </span>
          </div>
        </div>

        <div>
          <CustomDropdown
            label="Primary Default Reasoning Engine"
            options={modelOptions}
            value={settings.primaryModel}
            onChange={(val) => setSettings({ ...settings, primaryModel: val })}
          />
        </div>
      </div>

      {/* Security & Multi-Tenant Isolation */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
          <ShieldCheck size={18} style={{ color: 'var(--accent-blue)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Security & Tenant Isolation
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Enforce 2-Factor Authentication for Firm Admins
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Requires hardware security keys or authenticator apps for managing partners
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.enforce2FA}
              onChange={(e) => setSettings({ ...settings, enforce2FA: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Automated Judgment & Precedent Indexing
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Continuous nightly sync with Supreme Court of India & High Court cause lists
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.autoIndexJudgments}
              onChange={(e) => setSettings({ ...settings, autoIndexJudgments: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Platform Maintenance Mode
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Temporarily lock legal drafting and document scanning for database upgrades
            </div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-blue" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save System Settings'}</span>
        </button>
      </div>
    </div>
  );
}
