import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { contractService } from '../services/api';

const ContractDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = await contractService.getById(id);
        setContract(data);
      } catch (err) {
        setContract({
          _id: id || 'cr_001',
          title: 'Vendor Services Agreement',
          type: 'Service Agreement',
          date: '12 Jun 2026',
          riskScore: 72,
          riskLevel: 'High',
          analysis: {
            criticalIssues: [
              'Unlimited liability clause on indemnification with no reciprocal cap',
              'Termination for convenience only available to vendor, not client',
              'Vague intellectual property assignment wording regarding pre-existing IP',
            ],
            recommendedAmendments: [
              'Insert cap on total liability equal to 12 months fees paid',
              'Add mutual 30-day termination for convenience clause',
              'Explicitly ring-fence customer background IP and data ownership',
            ],
            clausesReviewed: 34,
          },
        });
      }
    };
    fetchContract();
  }, [id]);

  if (!contract) return null;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/app/contracts')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'none',
          border: 'none',
          color: '#64748b',
          fontSize: '0.85rem',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Contract Review</span>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
            {contract.title}
          </h1>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {contract.type} · Reviewed {contract.date}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.9rem',
              backgroundColor: contract.riskLevel === 'High' ? '#fef2f2' : '#ecfdf5',
              color: contract.riskLevel === 'High' ? '#dc2626' : '#059669',
              border: `1px solid ${contract.riskLevel === 'High' ? '#fecaca' : '#a7f3d0'}`,
            }}
          >
            Risk Score: {contract.riskScore}/100 ({contract.riskLevel} Risk)
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Critical Issues */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', marginBottom: '1.25rem' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Critical Risk Findings</h3>
          </div>
          <ul style={{ paddingLeft: '1.25rem', color: '#334155', fontSize: '0.9rem', lineHeight: 1.8 }}>
            {(contract.analysis?.criticalIssues || []).map((issue, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{issue}</li>
            ))}
          </ul>
        </div>

        {/* Recommended Amendments */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #a7f3d0', borderRadius: '0.75rem', padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', marginBottom: '1.25rem' }}>
            <CheckCircle size={20} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Recommended Redline Amendments</h3>
          </div>
          <ul style={{ paddingLeft: '1.25rem', color: '#334155', fontSize: '0.9rem', lineHeight: 1.8 }}>
            {(contract.analysis?.recommendedAmendments || []).map((rec, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPage;
