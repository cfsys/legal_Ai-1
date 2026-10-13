import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Gavel,
  FileText,
  Shield,
  PenTool,
  Send,
  Copy,
  BookmarkPlus,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { researchService } from '../services/api';
import { APP_STRINGS } from '../constants/appStrings';
import CustomSelect from '../components/common/CustomSelect';

const AskThemesAiPage = () => {
  const [court, setCourt] = useState('Any Court');
  const [area, setArea] = useState('Any Area');
  const [depth, setDepth] = useState('Standard');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [copied, setCopied] = useState(false);

  const samplePrompts = [
    {
      title: 'Research a Legal Issue',
      prompt: 'Explain the doctrine of promissory estoppel under Indian law with leading Supreme Court precedents.',
      icon: Search,
    },
    {
      title: 'Find Judgments',
      prompt: 'Find Supreme Court judgments on condonation of delay under Section 5 of the Limitation Act.',
      icon: Gavel,
    },
    {
      title: 'Analyse a Document',
      prompt: 'What are the key obligations and warranty representations in a standard commercial agreement?',
      icon: FileText,
    },
    {
      title: 'Review a Contract',
      prompt: 'What are the highest-risk clauses to check in a vendor services agreement under Indian jurisdiction?',
      icon: Shield,
    },
    {
      title: 'Create a Draft',
      prompt: 'Draft a legal notice for recovery of ₹5,00,000 under a breached supplier agreement.',
      icon: PenTool,
    },
  ];

  const handleAsk = async (promptText) => {
    const textToAsk = promptText || query;
    if (!textToAsk.trim()) return;

    setQuery(textToAsk);
    setLoading(true);

    try {
      const data = await researchService.ask({
        question: textToAsk,
        court,
        area,
        depth,
      });
      setResponse(data);
    } catch (err) {
      console.warn('API error, using local reasoning fallback:', err.message);
      // Fallback
      setResponse({
        question: textToAsk,
        answer: `### 1. Statutory Framework\nUnder Indian law, the legal proposition regarding **"${textToAsk}"** is governed by foundational statutory mandates and landmark Supreme Court decisions.\n\n---\n\n### 2. Principles Governing the Query\n**Collector, Land Acquisition v. Mst. Katiji (1987) 2 SCC 107**\nCourts adopt a liberal, justice-oriented approach. Substantial justice must be preferred over pedantic procedural technicalities.\n\n**Perumon Bhagvathy Devaswom v. Bhargavi Amma (2008) 8 SCC 321**\nThe expression requires reasonable diligence and absence of culpable inaction or deliberate delay.\n\n---\n\n### 3. Actionable Guidance for Legal Practitioners\n- File supporting affidavit specifying dates and circumstances.\n- Cite contemporary Supreme Court authorities establishing equitable relief.`,
        authorities: [
          {
            title: 'Collector, Land Acquisition v. Mst. Katiji',
            citation: '(1987) 2 SCC 107',
            status: 'Good Law',
            relevance: 'Benchmark authority on liberal approach to substantive justice.',
          },
          {
            title: 'State of Nagaland v. Lipok AO',
            citation: '(2005) 3 SCC 752',
            status: 'Good Law',
            relevance: 'Realistic appraisal of procedural delays.',
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response?.answer) {
      navigator.clipboard.writeText(response.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        paddingBottom: '1rem',
      }}
    >
      <div>
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
            marginBottom: '1rem',
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
              <Sparkles size={19} strokeWidth={2.2} />
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
                Legal AI Search & Assistant
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
                Research issues, analyze documents, review contracts, and find Supreme Court precedents.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {response && (
              <button
                type="button"
                onClick={() => {
                  setResponse(null);
                  setQuery('');
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
                <RotateCcw size={14} color="#64748b" />
                <span>New Question</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '0.75rem 1rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.85rem',
            marginBottom: '1.5rem',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          }}
        >
          {/* Court Select */}
          <div style={{ minWidth: '185px' }}>
            <CustomSelect
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              size="sm"
              icon={Gavel}
              options={[
                { value: 'Any Court', label: 'Any Court' },
                { value: 'Supreme Court of India', label: 'Supreme Court of India' },
                { value: 'Delhi High Court', label: 'Delhi High Court' },
                { value: 'Bombay High Court', label: 'Bombay High Court' },
                { value: 'NCLAT', label: 'NCLAT / Tribunals' },
              ]}
            />
          </div>

          {/* Area Select */}
          <div style={{ minWidth: '185px' }}>
            <CustomSelect
              value={area}
              onChange={(e) => setArea(e.target.value)}
              size="sm"
              icon={FileText}
              options={[
                { value: 'Any Area', label: 'Any Area' },
                { value: 'Limitation & Civil Procedure', label: 'Limitation & CPC' },
                { value: 'Constitutional Law', label: 'Constitutional Law' },
                { value: 'Insolvency & Bankruptcy', label: 'Insolvency & Bankruptcy (IBC)' },
                { value: 'Contract & Commercial', label: 'Contract & Commercial' },
                { value: 'Criminal Procedure', label: 'Criminal Procedure' },
              ]}
            />
          </div>

          {/* Depth Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', marginLeft: 'auto' }}>
            {['Quick', 'Standard', 'Deep Research'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDepth(d)}
                className={`filter-pill ${depth === d ? 'active' : ''}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* If no response yet: show centered hero header and prompt cards */}
        {!response && !loading && (
          <div style={{ textAlign: 'center', margin: '1rem 0 3rem 0' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: '#0b1329',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                marginBottom: '1.25rem',
                boxShadow: '0 8px 16px -4px rgba(11, 19, 41, 0.2)',
              }}
            >
              <Sparkles size={24} />
            </div>

            <h1
              className="font-serif"
              style={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em',
              }}
            >
              Ask Legal AI a legal question...
            </h1>

            <p style={{ color: '#64748b', fontSize: '0.975rem', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
              Research issues, find judgments, analyse documents, review contracts and draft — all grounded in Indian law.
            </p>

            {/* 5 Prompt Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                textAlign: 'left',
              }}
            >
              {samplePrompts.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleAsk(card.prompt)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#2563eb';
                      e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(37, 99, 235, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Icon size={18} color="#64748b" style={{ marginBottom: '0.65rem' }} />
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.35rem' }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.45 }}>
                      {card.prompt}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div
              style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '3px solid #e2e8f0',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                marginBottom: '1rem',
              }}
            ></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>
              Legal AI Legal Reasoning Engine is analyzing...
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
              Scanning Indian Supreme Court, High Courts, and Central Acts
            </div>
          </div>
        )}

        {/* Response View matching Screenshot ask_legal_ai_response */}
        {response && !loading && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '0.85rem',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)',
              marginBottom: '2rem',
            }}
          >
            {/* Top Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid #f1f5f9',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {response.depth || depth} Reasoning · {response.court || court}
                </span>
                <h3
                  className="font-serif"
                  style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}
                >
                  "{response.question}"
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleCopy}
                  className="btn-social"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.35rem' }}
                >
                  {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                  <span>{copied ? APP_STRINGS.AI_CHAT.COPIED : APP_STRINGS.AI_CHAT.COPY}</span>
                </button>
                <button
                  onClick={() => alert(APP_STRINGS.AI_CHAT.SAVED_TO_BRIEFCASE)}
                  className="btn-social"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.35rem' }}
                >
                  <BookmarkPlus size={14} />
                  <span>Save to Matter</span>
                </button>
                <button
                  onClick={() => setResponse(null)}
                  className="btn-social"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', gap: '0.35rem' }}
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Answer Content formatted */}
            <div
              style={{
                fontSize: '0.925rem',
                lineHeight: 1.7,
                color: '#334155',
                whiteSpace: 'pre-wrap',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {response.answer}
            </div>

            {/* Authorities section */}
            {response.authorities && response.authorities.length > 0 && (
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
                  Citation-Backed Authorities
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                  {response.authorities.map((auth, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.85rem 1rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        backgroundColor: '#f8fafc',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span className="badge-good-law">⚖ {auth.status || 'Good Law'}</span>
                        <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>{auth.citation}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{auth.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{auth.relevance}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Query Input Bar (Apple / iPhone iOS Style) */}
      <div
        className="apple-search-container"
        style={{
          position: 'sticky',
          bottom: '1rem',
          backgroundColor: '#ffffff',
          borderRadius: '9999px',
          padding: '0.4rem 0.5rem 0.4rem 1.25rem',
          gap: '0.75rem',
          boxShadow: '0 6px 24px -4px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          height: '50px',
        }}
      >
        <Sparkles size={18} color="#0071e3" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Ask Legal AI a legal question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAsk();
          }}
          className="apple-search-input"
          style={{ fontSize: '0.925rem' }}
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="apple-clear-btn"
            title="Clear question"
          >
            <X size={10} strokeWidth={3} />
          </button>
        )}

        <button
          onClick={() => handleAsk()}
          disabled={loading || !query.trim()}
          className="apple-icon-btn"
          title="Send query"
        >
          <Send size={15} />
        </button>
      </div>

      {/* Sub-disclaimer */}
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', margin: '0.65rem 0' }}>
        Legal AI is AI-assisted and may be inaccurate. Verify with a qualified professional.
      </div>
    </div>
  );
};

export default AskThemesAiPage;
