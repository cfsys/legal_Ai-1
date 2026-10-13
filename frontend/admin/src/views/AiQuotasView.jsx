import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import CustomDropdown from '../components/CustomDropdown';
import {
  Cpu,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Wand2,
  Copy,
  Check,
  Download,
  FileText,
} from 'lucide-react';

export default function AiQuotasView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Drafting Simulator State matching client app screenshot
  const [draftType, setDraftType] = useState('legal-notice-138');
  const [jurisdiction, setJurisdiction] = useState('delhi');
  const [isDrafting, setIsDrafting] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchQuotas = async () => {
      try {
        const res = await adminApi.getAiQuotas();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load quotas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotas();
  }, []);

  const draftOptions = [
    { value: 'legal-notice-138', label: 'Legal Notice (Sec 138 NI Act)' },
    { value: 'slp-civil', label: 'Special Leave Petition (SLP - Civil)' },
    { value: 'writ-petition', label: 'Writ Petition (Article 226/32)' },
    { value: 'commercial-contract', label: 'Commercial Supply Contract' },
    { value: 'evidence-affidavit', label: 'Evidence by Way of Affidavit' },
  ];

  const handleGenerate = () => {
    setIsDrafting(true);
    setGeneratedDraft('');

    setTimeout(() => {
      let draftText = '';
      if (draftType === 'legal-notice-138') {
        draftText = `LEGAL DEMAND NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881

TO:
M/s Apex Enterprises Private Limited
Registered Office: Nariman Point, Mumbai - 400021

UNDER INSTRUCTIONS FROM AND ON BEHALF OF:
FinTech Capital Solutions LLP, Connaught Place, New Delhi

SUBJECT: NOTICE UNDER SECTION 138 READ WITH SECTION 141 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 REGARDING DISHONOR OF CHEQUE NO. 849201 DATED 12.08.2026 FOR AN AMOUNT OF RS. 25,00,000/- (RUPEES TWENTY FIVE LAKHS ONLY).

Sir/Madam,
Under instructions from our Client, we hereby serve upon you this Statutory Legal Notice:

1. That you, the Addressee, had issued Cheque bearing No. 849201 dated 12.08.2026 drawn on HDFC Bank Ltd. for a sum of Rs. 25,00,000/- towards discharge of legally enforceable commercial liabilities.
2. That upon presentation by our client through their banker, State Bank of India, the said cheque returned dishonored with the memo reason: "FUNDS INSUFFICIENT" dated 24.08.2026.
3. You are hereby called upon to pay the said sum of Rs. 25,00,000/- within 15 (fifteen) days from receipt hereof, failing which our Client shall initiate criminal proceedings under Section 138 of the NI Act against you and all directors in charge of conduct of business.`;
      } else {
        draftText = `IN THE SUPREME COURT OF INDIA\nCIVIL APPELLATE JURISDICTION\n\nSPECIAL LEAVE PETITION (CIVIL) NO. ______ OF 2026\n\nIN THE MATTER OF:\nPetitioner: M/s Global Infrastructure Consortium\nVERSUS\nRespondent: Union of India & Anr.\n\nSYNOPSIS AND LIST OF DATES\nThe present Special Leave Petition under Article 136 of the Constitution of India challenges the impugned Final Judgment and Order dated 14.07.2026 passed by the High Court of Delhi in Commercial Appeal No. 84/2026.\n\nGROUNDS:\nA. Because the High Court erred in holding that Section 34 of the Arbitration and Conciliation Act, 1996 permits re-appreciation of evidence contrary to the law laid down in Associate Builders v. DDA (2015) 3 SCC 49.\nB. Because the findings are patent errors on the face of the record causing manifest injustice.`;
      }
      setGeneratedDraft(draftText);
      setIsDrafting(false);
    }, 600);
  };

  const handleCopy = () => {
    if (!generatedDraft) return;
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const models = data?.models || [
    {
      id: 'gpt-4o-legal',
      name: 'GPT-4o Legal Fine-tuned',
      provider: 'OpenAI / Azure Gov',
      specialization: 'Complex cross-examination & Petition drafting',
      context: '128k',
      cost: '0.04 Credits',
      latency: '1.2s',
      status: 'Operational',
    },
    {
      id: 'claude-35-sonnet-law',
      name: 'Claude 3.5 Sonnet (Legal Specialist)',
      provider: 'Anthropic Bedrock',
      specialization: 'Contract 100-page redlining & Risk extraction',
      context: '200k',
      cost: '0.03 Credits',
      latency: '0.9s',
      status: 'Operational',
    },
    {
      id: 'legal-bert-india',
      name: 'LegalBERT-India v4.2',
      provider: 'In-House Private GPU Cluster',
      specialization: 'Indian Supreme Court citation matching & Headnotes',
      context: '32k',
      cost: '0.01 Credits',
      latency: '0.3s',
      status: 'Operational',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header matching client app design */}
      <div>
        <h1 className="page-title">
          AI Legal Drafting & Inference Quotas
        </h1>
        <p className="page-subtitle">
          Generate legal notices, petitions, affidavits, and commercial contract clauses grounded in Indian jurisprudence while monitoring tenant quota caps.
        </p>
      </div>

      {/* Interactive AI Drafting Panel matching the uploaded client app screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
        {/* Left Card: Draft Type & Controls */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div>
            <CustomDropdown
              label="Draft Type"
              options={draftOptions}
              value={draftType}
              onChange={(val) => setDraftType(val)}
              placeholder="Select draft type..."
            />

            <div style={{ marginTop: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '0.45rem',
                }}
              >
                Jurisdiction & Court Authority
              </label>
              <input
                type="text"
                defaultValue="Supreme Court of India / High Court of Delhi"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isDrafting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              width: '100%',
              padding: '0.75rem 1.25rem',
              backgroundColor: '#0f172a',
              border: '1px solid #0f172a',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: isDrafting ? 'wait' : 'pointer',
              boxShadow: '0 2px 4px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0f172a')}
          >
            <Zap size={16} color="#ffffff" />
            <span>{isDrafting ? 'Synthesizing Legal Notice...' : 'Generate Legal Draft'}</span>
          </button>
        </div>

        {/* Right Card: PREVIEW & EDIT matching uploaded screenshot */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '340px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              PREVIEW & EDIT
            </span>

            {generatedDraft && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleCopy}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.65rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {generatedDraft ? (
            <div
              style={{
                flex: 1,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1.25rem',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                color: '#1e293b',
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
                maxHeight: '320px',
              }}
            >
              {generatedDraft}
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#94a3b8',
                fontSize: '0.92rem',
                fontWeight: 400,
                padding: '2rem',
              }}
            >
              Your generated draft will appear here ready to copy or download.
            </div>
          )}
        </div>
      </div>

      {/* 3 Executive KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Token Quota */}
        <div className="card" style={{ padding: '1.4rem 1.6rem' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Daily Global Token Quota
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              4.8M
            </span>
            <span style={{ fontSize: '0.92rem', color: '#94a3b8', fontWeight: 500 }}>
              / 15M Tokens
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '999px', marginTop: '0.9rem', overflow: 'hidden' }}>
            <div style={{ width: '32%', height: '100%', backgroundColor: '#0f172a', borderRadius: '999px' }} />
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.5rem' }}>
            32% allocated across all tenant chambers
          </div>
        </div>

        {/* Deep Research */}
        <div className="card" style={{ padding: '1.4rem 1.6rem' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Deep Legal Research Quota
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              720
            </span>
            <span style={{ fontSize: '0.92rem', color: '#94a3b8', fontWeight: 500 }}>
              / 2,000 Queries
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '999px', marginTop: '0.9rem', overflow: 'hidden' }}>
            <div style={{ width: '36%', height: '100%', backgroundColor: '#2563eb', borderRadius: '999px' }} />
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.5rem' }}>
            Supreme Court multi-stage citation synthesis
          </div>
        </div>

        {/* Inference Latency */}
        <div className="card" style={{ padding: '1.4rem 1.6rem' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Average Inference Latency
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              0.84s
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#059669', backgroundColor: '#ecfdf5', padding: '0.15rem 0.45rem', borderRadius: '999px' }}>
              Optimal (99.8% SLA)
            </span>
          </div>
          <div style={{ width: '100%', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '999px', marginTop: '0.9rem', overflow: 'hidden' }}>
            <div style={{ width: '18%', height: '100%', backgroundColor: '#10b981', borderRadius: '999px' }} />
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.5rem' }}>
            Cluster nodes reporting 100% health
          </div>
        </div>
      </div>

      {/* Model Catalog Table */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Active Legal Intelligence AI Models
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, marginTop: '0.15rem' }}>
              Configured reasoning models available to tenant law firms
            </p>
          </div>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Provider & Hosting</th>
                <th>Specialization & Primary Use</th>
                <th>Context Window</th>
                <th>Token Cost</th>
                <th>Avg Latency</th>
                <th>Cluster Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Cpu size={14} />
                      </div>
                      <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }}>
                        {model.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: '#475569', fontSize: '0.82rem' }}>{model.provider}</td>
                  <td style={{ color: '#334155', fontSize: '0.82rem' }}>{model.specialization}</td>
                  <td>
                    <span
                      style={{
                        padding: '0.15rem 0.45rem',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontFamily: 'monospace',
                        color: '#2563eb',
                        fontWeight: 600,
                      }}
                    >
                      {model.context}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#2563eb', fontSize: '0.82rem' }}>{model.cost}</td>
                  <td style={{ color: '#059669', fontWeight: 600, fontSize: '0.82rem' }}>{model.latency}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.74rem',
                        color: '#059669',
                        fontWeight: 600,
                        backgroundColor: '#ecfdf5',
                        border: '1px solid #d1fae5',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                      }}
                    >
                      <CheckCircle2 size={12} color="#059669" />
                      {model.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
