import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, ChevronRight, Bookmark } from 'lucide-react';
import { researchService } from '../services/api';

const LegalResearchPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const data = await researchService.getAll();
        setSessions(data);
      } catch (err) {
        console.warn('Using local fallback for research history:', err.message);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResearch();
  }, []);

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
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Search size={19} strokeWidth={2.2} />
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
              Legal Research Memorandums
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Citation-backed legal research dossiers, statutory analysis, and Supreme Court precedent tracking.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/app/research/new')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.5rem 1.15rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#ffffff',
            backgroundColor: '#4338ca',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(67, 56, 202, 0.25)',
            transition: 'background 0.18s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#3730a3')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4338ca')}
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>New Research</span>
        </button>
      </div>

      {/* Main Content Area */}
      {sessions.length === 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.85rem',
            padding: '5rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '0.75rem',
              backgroundColor: '#f1f5f9',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              marginBottom: '1.25rem',
            }}
          >
            <Search size={26} />
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.4rem' }}>
            No research sessions yet
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto 1.75rem' }}>
            Ask a legal question and Legal AI will build a citation-backed memorandum.
          </p>

          <button
            onClick={() => navigate('/app/research/new')}
            className="btn-primary"
            style={{ width: 'auto', padding: '0.65rem 1.5rem', fontSize: '0.875rem' }}
          >
            Start Research
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: selectedSession ? '1fr 1.2fr' : '1fr', gap: '1.5rem' }}>
          {/* List of Sessions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {sessions.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedSession(item)}
                style={{
                  backgroundColor: '#ffffff',
                  border: selectedSession?._id === item._id ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {item.depth || 'Standard'} Research
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {item.jurisdiction || 'Supreme Court of India'}
                  </span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {item.question}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={14} />
                  <span>{item.authorities?.length || 2} citation authorities</span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Session Full Detail */}
          {selectedSession && (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                padding: '2rem',
                position: 'sticky',
                top: '5rem',
                maxHeight: 'calc(100vh - 140px)',
                overflowY: 'auto',
              }}
            >
              <h2 className="font-serif" style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {selectedSession.question}
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                Jurisdiction: {selectedSession.jurisdiction} · Mode: {selectedSession.depth}
              </div>

              <div style={{ fontSize: '0.925rem', lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap' }}>
                {selectedSession.memorandum}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LegalResearchPage;
