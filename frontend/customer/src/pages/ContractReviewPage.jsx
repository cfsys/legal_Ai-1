import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, GitCompare, AlertCircle, CheckCircle2, AlertTriangle, X, ArrowUpRight } from 'lucide-react';
import { contractService } from '../services/api';
import { APP_STRINGS } from '../constants/appStrings';
import CustomSelect from '../components/common/CustomSelect';

const CircularMeter = ({ score, level }) => {
  const isHigh = level === 'High';
  const isLow = level === 'Low';
  const strokeColor = isHigh ? '#ef4444' : isLow ? '#10b981' : '#f59e0b';
  const trackColor = isHigh ? '#fee2e2' : isLow ? '#d1fae5' : '#fef3c7';

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth="4.5"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '0.925rem', fontWeight: 700, color: '#0f172a' }}>
        {score}
      </span>
    </div>
  );
};

const ContractReviewPage = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Service Agreement');
  const [loading, setLoading] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (showNewModal) setShowNewModal(false);
      }
    };
    if (showNewModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNewModal]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const data = await contractService.getAll();
      setContracts(data);
    } catch (err) {
      setContracts([
        {
          _id: 'cr_001',
          title: 'Vendor Services Agreement',
          type: 'Service Agreement',
          date: '12 Jun 2026',
          riskScore: 72,
          riskLevel: 'High',
        },
        {
          _id: 'cr_002',
          title: 'Mutual NDA – Zenith',
          type: 'NDA',
          date: '08 Jun 2026',
          riskScore: 34,
          riskLevel: 'Low',
        },
        {
          _id: 'cr_003',
          title: 'Employment Agreement',
          type: 'Employment',
          date: '03 Jun 2026',
          riskScore: 55,
          riskLevel: 'Medium',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await contractService.createReview({
        title: newTitle,
        type: newType,
      });
      setShowNewModal(false);
      setNewTitle('');
      fetchContracts();
    } catch (err) {
      setShowNewModal(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header bar matching Screenshot contract_review_page */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1
            className="font-serif"
            style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '0.25rem',
            }}
          >
            Contract Review
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            AI-powered risk analysis and redline recommendations for your agreements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn-social"
            onClick={() => alert(APP_STRINGS.CONTRACTS.COMPARE_ACTIVE)}
            style={{ padding: '0.65rem 1.15rem', fontSize: '0.85rem', gap: '0.45rem' }}
          >
            <GitCompare size={15} />
            <span>Compare</span>
          </button>
          <button
            onClick={() => setShowNewModal(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '0.65rem 1.35rem', fontSize: '0.85rem', gap: '0.45rem' }}
          >
            <Plus size={16} />
            <span>New Review</span>
          </button>
        </div>
      </div>

      {/* Contract Cards Grid matching Screenshot */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {contracts.map((item) => {
          const isHigh = item.riskLevel === 'High';
          const isLow = item.riskLevel === 'Low';
          const badgeBg = isHigh ? '#fef2f2' : isLow ? '#ecfdf5' : '#fffbeb';
          const badgeText = isHigh ? '#dc2626' : isLow ? '#059669' : '#d97706';
          const badgeBorder = isHigh ? '#fecaca' : isLow ? '#a7f3d0' : '#fde68a';

          return (
            <div
              key={item._id}
              onClick={() => navigate(`/app/contracts/${item._id}`)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.85rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(0, 0, 0, 0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.02)';
              }}
            >
              {/* Top Row: Shield Icon and Risk Pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <Shield size={20} color="#94a3b8" />
                <span
                  style={{
                    backgroundColor: badgeBg,
                    color: badgeText,
                    border: `1px solid ${badgeBorder}`,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  {item.riskLevel}
                </span>
              </div>

              {/* Title and Date */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                {item.title}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem' }}>
                {item.type} · {item.date}
              </div>

              {/* Circular Meter Graphic with SVG */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #f8fafc' }}>
                <CircularMeter score={item.riskScore} level={item.riskLevel} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Risk score</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    {item.riskLevel} risk
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', color: '#94a3b8' }}>
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Review Modal */}
      {showNewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '0.85rem',
              padding: '2rem',
              width: '100%',
              maxWidth: '480px',
              position: 'relative',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <button
              onClick={() => setShowNewModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} color="#64748b" />
            </button>

            <h3 className="font-serif" style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              New Contract Risk Review
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Select agreement type to compute risk scoring and clause redlines.
            </p>

            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Agreement Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Software License Agreement"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contract Type</label>
                <CustomSelect
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  options={[
                    { value: 'Service Agreement', label: 'Service Agreement' },
                    { value: 'NDA', label: 'Non-Disclosure Agreement (NDA)' },
                    { value: 'Employment', label: 'Employment Agreement' },
                    { value: 'Share Purchase', label: 'Share Purchase Agreement' },
                    { value: 'Commercial Lease', label: 'Commercial Lease Deed' },
                  ]}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                Run AI Risk Analysis
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractReviewPage;
