import React from 'react';
import {
  ShieldAlert,
  Building2,
  Users,
  Cpu,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
} from 'lucide-react';
import { toast } from '../../context/ToastContext';

const SuperAdminPage = () => {
  const orgs = [
    { name: 'Legal AI Legal LLP', domain: 'legalai.in', plan: 'Enterprise', users: 10, credits: '6,240 / 10,000', status: 'Active' },
    { name: 'Shardul & Co. Advocates', domain: 'shardul.law', plan: 'Enterprise', users: 35, credits: '28,400 / 50,000', status: 'Active' },
    { name: 'Trilegal Partners', domain: 'trilegal.in', plan: 'Law Firm', users: 20, credits: '14,800 / 25,000', status: 'Active' },
    { name: 'Khaitan Chamber', domain: 'khaitanlaw.com', plan: 'Law Firm', users: 15, credits: '9,200 / 15,000', status: 'Active' },
    { name: 'AZB Legal Associates', domain: 'azbpartners.com', plan: 'Enterprise', users: 45, credits: '42,100 / 60,000', status: 'Active' },
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={22} />
          </div>
          <h1 className="font-serif" style={{ fontSize: '2.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Super Admin Platform Console
          </h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Multi-tenant firm management, global AI token usage, and infrastructure health monitoring.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Firms</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>48</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.2rem' }}>+6 new firms this month</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Practitioners</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>384</div>
          <div style={{ fontSize: '0.75rem', color: '#2563eb', marginTop: '0.2rem' }}>Across Supreme Court & High Courts</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Monthly Platform Queries</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>184,200</div>
          <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.2rem' }}>99.98% Latency SLA met</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.85rem', padding: '1.25rem 1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>AI Pipeline Status</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '0.4rem' }}>All Systems Healthy</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Inference: 142ms avg response</div>
        </div>
      </div>

      {/* Multi-Tenant Firms Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>Tenant Organisations</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Firms provisioned on Legal AI infrastructure</p>
          </div>
          <button
            onClick={() => toast.info('Tenant provisioning wizard opened')}
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            + Provision New Firm
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Organisation Name</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Domain</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Tier</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Seats</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Monthly Credits</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569' }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((o, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#0f172a' }}>{o.name}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#64748b' }}>{o.domain}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#2563eb', fontWeight: 600 }}>{o.plan}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#334155' }}>{o.users} seats</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#334155' }}>{o.credits}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '9999px' }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      onClick={() => toast.info(`Viewing tenant metrics for ${o.name}`)}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPage;
