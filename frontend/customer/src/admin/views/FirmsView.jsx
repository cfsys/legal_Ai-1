import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  Building2,
  Plus,
  Users,
  Layers,
  Zap,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function FirmsView() {
  const { firms, refreshFirms, setSelectedFirmId, setCurrentTab, openModal, canPerform } = useAdmin();
  const [filterTier, setFilterTier] = useState('');

  useEffect(() => {
    if (refreshFirms) refreshFirms();
  }, [refreshFirms]);

  const filteredFirms = filterTier
    ? firms.filter((f) => f.tier.toLowerCase() === filterTier.toLowerCase())
    : firms;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header matching Client App */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">
            Multi-Tenant Law Firm Management
          </h1>
          <p className="page-subtitle">
            Provision isolated law firm environments, allocate seat licenses, and configure firm-wide credit pools.
          </p>
        </div>

        {canPerform('tenants', 'create') && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => openModal('createFirm')}>
              <Plus size={15} />
              <span>Onboard Law Firm</span>
            </button>
          </div>
        )}
      </div>

      {/* Tier Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          className={`btn btn-sm ${filterTier === '' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterTier('')}
        >
          All Tenants ({firms.length})
        </button>
        <button
          className={`btn btn-sm ${filterTier === 'enterprise' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterTier('enterprise')}
        >
          Enterprise Tier
        </button>
        <button
          className={`btn btn-sm ${filterTier === 'law firm pro' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterTier('law firm pro')}
        >
          Law Firm Pro
        </button>
        <button
          className={`btn btn-sm ${filterTier === 'boutique' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilterTier('boutique')}
        >
          Boutique
        </button>
      </div>

      {/* Firm Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredFirms.map((firm) => {
          const seatPercent = Math.min(100, Math.round(((firm.memberCount || 1) / (firm.seatsLimit || 1)) * 100));
          const creditsRemaining = (firm.creditsTotal || 0) - (firm.creditsUsed || 0);

          return (
            <div key={firm.id} className="card card-accent-line" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.25rem' }}>
              <div>
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {firm.name}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'var(--font-mono)', marginTop: '0.15rem', fontWeight: 600 }}>
                      {firm.domain}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 650,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: firm.tier === 'Enterprise' ? '#0f172a' : '#f8fafc',
                      color: firm.tier === 'Enterprise' ? '#ffffff' : '#334155',
                      border: firm.tier === 'Enterprise' ? '1px solid #0f172a' : '1px solid #e2e8f0',
                      display: 'inline-block',
                    }}
                  >
                    {firm.tier}
                  </span>
                </div>

                {/* Location & Contact */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={13} style={{ color: '#64748b' }} />
                    {firm.city}, {firm.state}
                  </span>
                  <span>•</span>
                  <span>{firm.billingCycle} Billing</span>
                </div>

                {/* Seats Utilization */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Licensed Seats</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {firm.memberCount || 1} / {firm.seatsLimit} seats ({seatPercent}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${seatPercent}%`,
                        height: '100%',
                        background: seatPercent > 80 ? 'var(--accent-amber)' : '#0f172a',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>

                {/* Credit Pool Balance */}
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shared Credit Pool</span>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      {creditsRemaining.toLocaleString()} Cr Remaining
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Total: {firm.creditsTotal?.toLocaleString()} • Used: {firm.creditsUsed?.toLocaleString()}
                  </div>
                </div>

                {/* AI Models Allowed */}
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    Authorized AI Reasoning Models
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {firm.aiModelAllowed?.map((model) => (
                      <span
                        key={model}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          backgroundColor: '#f8fafc',
                          color: '#334155',
                          border: '1px solid #e2e8f0',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        <Zap size={10} style={{ color: '#64748b' }} />
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  onClick={() => {
                    setSelectedFirmId(firm.id);
                    setCurrentTab('users');
                  }}
                >
                  <Users size={14} />
                  <span>View Advocates</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
