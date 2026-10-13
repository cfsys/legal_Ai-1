import React, { useState } from 'react';
import { PenTool, BarChart3, Database, Sparkles, Check } from 'lucide-react';
import CustomSelect from '../components/common/CustomSelect';
import { draftService } from '../services/api';
import { toast } from '../context/ToastContext';

export const DraftingPage = () => {
  const [draftType, setDraftType] = useState('Legal Notice');
  const [instructions, setInstructions] = useState('');
  const [draftOutput, setDraftOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const content = `LEGAL NOTICE UNDER SECTION 138 OF NEGOTIABLE INSTRUMENTS ACT\n\nTo,\n[Recipient / Drawer Details]\n\nUnder instructions from and on behalf of our client, we hereby serve upon you this Legal Notice:\n\n1. That our client is a recognized commercial vendor engaged in goods supply.\n2. That pursuant to invoices duly delivered, you issued Cheque No. [CHEQUE_NO] for an amount of ₹5,00,000.\n3. That upon presentation, the said cheque was dishonored with endorsement "Funds Insufficient".\n\nWe hereby call upon you to make the payment within 15 days of receipt of this notice, failing which our client shall initiate criminal prosecution.`;

    setTimeout(async () => {
      setDraftOutput(content);
      setLoading(false);
      try {
        await draftService.create({
          draftType,
          instructions: instructions || 'Standard 138 NI Act draft request',
          content,
          matter: 'Commercial Advisory & Dispute',
        });
        toast.success('Legal draft generated and stored in database!');
      } catch (err) {
        console.warn('Draft save error:', err.message);
      }
    }, 600);
  };

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingBottom: '2.5rem',
      }}
    >
      {/* Top Banner (Matching modern workspace aesthetic) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#fdf2f8',
              color: '#db2777',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PenTool size={19} strokeWidth={2.2} />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Legal Drafting Assistant
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Generate legal notices, petitions, affidavits, and commercial contract clauses grounded in Indian jurisprudence.
            </p>
          </div>
        </div>

        {draftOutput && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(draftOutput);
              toast.success('Draft copied to clipboard!');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <Check size={14} color="#16a34a" />
            <span>Copy Draft</span>
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Draft Type</label>
            <CustomSelect
              value={draftType}
              onChange={(e) => setDraftType(e.target.value)}
              options={[
                { value: 'Legal Notice', label: 'Legal Notice (Sec 138 NI Act)' },
                { value: 'Special Leave Petition', label: 'Special Leave Petition (SLP - Civil)' },
                { value: 'Writ Petition', label: 'Writ Petition (Article 226/32)' },
                { value: 'Commercial Agreement', label: 'Commercial Supply Contract' },
                { value: 'Affidavit', label: 'Evidence by Way of Affidavit' },
              ]}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Facts & Instructions</label>
            <textarea
              rows={6}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Demand notice for recovery of unpaid invoices totaling ₹5,00,000 from client Acme Tech..."
              className="form-textarea"
            />
          </div>

          <button onClick={handleGenerate} className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', gap: '0.5rem' }}>
            <Sparkles size={16} />
            <span>{loading ? 'Drafting...' : 'Generate Legal Draft'}</span>
          </button>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem', minHeight: '380px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Preview & Edit
          </div>
          {draftOutput ? (
            <textarea
              rows={14}
              value={draftOutput}
              onChange={(e) => setDraftOutput(e.target.value)}
              className="form-textarea"
              style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6 }}
            />
          ) : (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '4rem 1rem', fontSize: '0.9rem' }}>
              Your generated draft will appear here ready to copy or download.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export const CalendarPage = () => (
  <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
    <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Cause List & Calendar</h1>
    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>Court hearings, item listings and judge benches.</p>
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.5rem' }}>
      {[
        { date: '15 Oct 2026', time: '10:30 AM', item: 'Item 12 - Court 3', court: 'Supreme Court of India', matter: 'Acme Holdings vs ED' },
        { date: '22 Oct 2026', time: '02:00 PM', item: 'Item 04 - Bench 1', court: 'NCLAT New Delhi', matter: 'Zenith Telecom Resolution' },
      ].map((c, idx) => (
        <div key={idx} style={{ padding: '1.25rem', borderBottom: idx === 0 ? '1px solid #f1f5f9' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>{c.court} · {c.item}</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{c.matter}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{c.date}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ReportsPage = () => (
  <div
    style={{
      maxWidth: '1440px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      paddingBottom: '2.5rem',
    }}
  >
    {/* Top Banner (Matching modern workspace aesthetic) */}
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BarChart3 size={19} strokeWidth={2.2} />
        </div>
        <div>
          <h1
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Reports & Analytics
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
            Workspace utilization, research memoranda throughput, and AI credit consumption metrics.
          </p>
        </div>
      </div>
    </div>

    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#2563eb', marginBottom: '1rem' }}>
        <BarChart3 size={22} />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Monthly Usage Breakdown</h3>
      </div>
      <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.8 }}>
        Total AI Queries Processed: <strong>142</strong><br />
        Documents Analyzed: <strong>14</strong><br />
        Citations Verified: <strong>68</strong><br />
        Average Accuracy Rating: <strong>99.4%</strong>
      </p>
    </div>
  </div>
);

export const MastersPage = () => (
  <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
    <h1 className="font-serif" style={{ fontSize: '2.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Masters Configuration</h1>
    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '2rem' }}>Courts taxonomy, document tags, act indices and subscription tier limits.</p>
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <Database size={24} color="#0f172a" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Court & Tribunal Taxonomies</h3>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['Supreme Court of India', 'Delhi High Court', 'Bombay High Court', 'Calcutta High Court', 'Madras High Court', 'NCLT / NCLAT', 'ITAT', 'SAT'].map((c) => (
          <span key={c} style={{ padding: '0.35rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: 500 }}>
            {c}
          </span>
        ))}
      </div>
    </div>
  </div>
);
