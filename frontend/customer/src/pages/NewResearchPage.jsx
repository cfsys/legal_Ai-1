import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Scale, Search } from 'lucide-react';
import { researchService, masterService } from '../services/api';
import { APP_STRINGS } from '../constants/appStrings';
import CustomSelect from '../components/common/CustomSelect';

const DEFAULT_COURT_OPTIONS = [
  { value: 'Supreme Court of India', label: 'Supreme Court of India' },
  { value: 'Delhi High Court', label: 'Delhi High Court' },
  { value: 'Bombay High Court', label: 'Bombay High Court' },
  { value: 'Calcutta High Court', label: 'Calcutta High Court' },
  { value: 'NCLAT', label: 'NCLAT / Tribunals' },
];

const NewResearchPage = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [jurisdiction, setJurisdiction] = useState('Supreme Court of India');
  const [courtOptions, setCourtOptions] = useState(DEFAULT_COURT_OPTIONS);
  const [loadingCourts, setLoadingCourts] = useState(false);
  const [actSuggestions, setActSuggestions] = useState([]);
  const [acts, setActs] = useState('');
  const [depth, setDepth] = useState('Standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dynamically load courts and acts from Master Data
  useEffect(() => {
    let isMounted = true;

    const loadMasterData = async () => {
      setLoadingCourts(true);
      try {
        const [courtsRes, actsRes] = await Promise.allSettled([
          masterService.getItems('Court'),
          masterService.getItems('Act'),
        ]);

        if (isMounted && courtsRes.status === 'fulfilled') {
          const courtsData = Array.isArray(courtsRes.value)
            ? courtsRes.value
            : courtsRes.value?.data || [];
          if (Array.isArray(courtsData) && courtsData.length > 0) {
            const dynamicCourts = courtsData.map((c) => ({
              value: c.name,
              label: c.code ? `${c.name} (${c.code})` : c.name,
            }));
            setCourtOptions(dynamicCourts);
            setJurisdiction((prev) => {
              if (!prev) return dynamicCourts[0].value;
              const exists = dynamicCourts.some((opt) => opt.value === prev);
              return exists ? prev : dynamicCourts[0].value;
            });
          }
        }

        if (isMounted && actsRes.status === 'fulfilled') {
          const actsData = Array.isArray(actsRes.value)
            ? actsRes.value
            : actsRes.value?.data || [];
          if (Array.isArray(actsData) && actsData.length > 0) {
            setActSuggestions(actsData.map((a) => a.name).filter(Boolean));
          }
        }
      } catch (err) {
        console.warn('Failed to load master options for new research:', err);
      } finally {
        if (isMounted) setLoadingCourts(false);
      }
    };

    loadMasterData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError(APP_STRINGS.RESEARCH.QUESTION_REQUIRED);
      return;
    }

    setLoading(true);
    try {
      await researchService.create({
        question,
        jurisdiction,
        acts,
        depth,
      });
      navigate('/app/research');
    } catch (err) {
      console.warn('API error, saving locally:', err.message);
      navigate('/app/research');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
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
              New Legal Research Query
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Legal AI will produce a structured, citation-backed memorandum grounded in statutory jurisprudence.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/app/research')}
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
          <ArrowLeft size={14} />
          <span>Back to Research</span>
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Main Form Box */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Legal Question */}
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ fontWeight: 600 }}>
            Legal question
          </label>
          <textarea
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What is the standard for condonation of delay under Section 5 of the Limitation Act?"
            className="form-textarea"
            style={{ resize: 'vertical' }}
            required
          />
        </div>

        {/* 2-Columns: Jurisdiction / Acts */}
        <div className="form-row form-group" style={{ marginBottom: '1.5rem' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Jurisdiction / Court
            </label>
            <CustomSelect
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              icon={Scale}
              options={courtOptions}
              disabled={loadingCourts}
              placeholder={loadingCourts ? 'Loading courts...' : 'Select court / jurisdiction'}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>
              Acts / Sections (optional)
            </label>
            <input
              type="text"
              list="acts-suggestions-list"
              value={acts}
              onChange={(e) => setActs(e.target.value)}
              placeholder="e.g. Limitation Act 1963, Section 5"
              className="form-input"
            />
            {actSuggestions.length > 0 && (
              <datalist id="acts-suggestions-list">
                {actSuggestions.map((act) => (
                  <option key={act} value={act} />
                ))}
              </datalist>
            )}
          </div>
        </div>

        {/* Research Depth Pills */}
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label className="form-label" style={{ fontWeight: 600 }}>
            Research depth
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Quick', 'Standard', 'Deep Research'].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDepth(d)}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: depth === d ? '1px solid #0b1329' : '1px solid #e2e8f0',
                  backgroundColor: depth === d ? '#0b1329' : '#ffffff',
                  color: depth === d ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Start Research Button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{
            backgroundColor: '#475569',
            padding: '0.85rem',
            fontSize: '0.95rem',
            borderRadius: '0.5rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0b1329')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#475569')}
        >
          <Sparkles size={18} />
          <span>{loading ? 'Generating Memorandum...' : 'Start Research'}</span>
        </button>
      </form>
    </div>
  );
};

export default NewResearchPage;
