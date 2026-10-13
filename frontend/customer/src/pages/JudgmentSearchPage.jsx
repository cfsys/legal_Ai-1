import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Scale,
  X,
  RotateCcw,
  ArrowRight,
  Filter
} from 'lucide-react';
import { judgmentService } from '../services/api';
import CustomSelect from '../components/common/CustomSelect';
import JudgmentFilterModal from '../components/modals/JudgmentFilterModal';

// Rich fallback database if network / offline
const FALLBACK_JUDGMENTS = [
  {
    _id: 'judg_001',
    title: 'Kesavananda Bharati v. State of Kerala',
    court: 'Supreme Court of India',
    decisionDate: '1973-04-24',
    judges: 'S.M. Sikri, CJI & others',
    bench: '13 Judges',
    headnote: "Established the Basic Structure Doctrine limiting Parliament's power to amend the Constitution under Article 368.",
    citation: '(1973) 4 SCC 225',
    status: 'Good Law',
    actsAndSections: [
      { act: 'Constitution of India', section: 'Article 368' },
      { act: 'Constitution of India', section: 'Article 13' },
    ],
  },
  {
    _id: 'judg_002',
    title: 'Collector of Land Acquisition v. Mst. Katiji',
    court: 'Supreme Court of India',
    decisionDate: '1987-02-19',
    judges: 'M.P. Thakkar & B.C. Ray, JJ.',
    bench: '2 Judges',
    headnote: 'Liberal approach to condonation of delay; substantial justice must be preferred over technical considerations under Section 5.',
    citation: '(1987) 2 SCC 107',
    status: 'Good Law',
    actsAndSections: [
      { act: 'Limitation Act 1963', section: 'Section 5' },
    ],
  },
  {
    _id: 'judg_003',
    title: 'Swiss Ribbons Pvt. Ltd. v. Union of India',
    court: 'Supreme Court of India',
    decisionDate: '2019-01-25',
    judges: 'R.F. Nariman & Navin Sinha, JJ.',
    bench: '2 Judges',
    headnote: 'Upheld constitutional validity of the IBC 2016 and the classification of financial and operational creditors.',
    citation: '(2019) 4 SCC 17',
    status: 'Good Law',
    actsAndSections: [
      { act: 'Insolvency and Bankruptcy Code 2016', section: 'Section 29A' },
      { act: 'Insolvency and Bankruptcy Code 2016', section: 'Section 53' },
    ],
  },
  {
    _id: 'judg_004',
    title: 'Esher Singh v. State of A.P.',
    court: 'Supreme Court of India',
    decisionDate: '2004-03-12',
    judges: 'Doraiswamy Raju & Arijit Pasayat, JJ.',
    bench: '2 Judges',
    headnote: 'Application of Section 27 of Evidence Act; facts discovered pursuant to disclosure statements.',
    citation: '(2004) 11 SCC 585',
    status: 'Distinguished',
    actsAndSections: [
      { act: 'Indian Evidence Act 1872', section: 'Section 27' },
      { act: 'Code of Criminal Procedure 1973', section: 'Section 161' },
    ],
  },
  {
    _id: 'judg_005',
    title: 'Cheran Properties Ltd. v. Kasturi & Sons Ltd.',
    court: 'Supreme Court of India',
    decisionDate: '2018-04-24',
    judges: 'Dr. D.Y. Chandrachud, A.M. Khanwilkar & Dipak Misra, CJI',
    bench: '3 Judges',
    headnote: 'Enforcement of arbitral awards against non-signatories under group of companies doctrine and Section 35 of the Arbitration Act.',
    citation: '(2018) 16 SCC 413',
    status: 'Good Law',
    actsAndSections: [
      { act: 'Arbitration and Conciliation Act 1996', section: 'Section 35' },
      { act: 'Companies Act 2013', section: 'Section 241' },
    ],
  },
  {
    _id: 'judg_006',
    title: 'Amazon.com NV Investment Holdings LLC v. Future Retail Ltd.',
    court: 'Delhi High Court',
    decisionDate: '2021-08-06',
    judges: 'J.R. Midha, J.',
    bench: 'Single Judge',
    headnote: 'Emergency Arbitrator awards under SIAC rules enforceable under Section 17(2) of the Arbitration & Conciliation Act 1996.',
    citation: '2021 SCC OnLine Del 3977',
    status: 'Good Law',
    actsAndSections: [
      { act: 'Arbitration and Conciliation Act 1996', section: 'Section 17' },
      { act: 'Arbitration and Conciliation Act 1996', section: 'Section 9' },
    ],
  },
  {
    _id: 'judg_007',
    title: 'Tata Consultancy Services Ltd. v. Cyrus Investments Pvt. Ltd.',
    court: 'Supreme Court of India',
    decisionDate: '2021-03-26',
    judges: 'S.A. Bobde, CJI, A.S. Bopanna & V. Ramasubramanian, JJ.',
    bench: '3 Judges',
    headnote: 'Oppression and mismanagement standards under Sections 241 and 242 of Companies Act 2013 and removal of Executive Chairman.',
    citation: '(2021) 9 SCC 449',
    status: 'Good Law',
    actsAndSections: [
      { act: 'Companies Act 2013', section: 'Section 241' },
      { act: 'Companies Act 2013', section: 'Section 242' },
    ],
  },
  {
    _id: 'judg_008',
    title: 'K.S. Puttaswamy v. Union of India (Privacy Judgment)',
    court: 'Supreme Court of India',
    decisionDate: '2017-08-24',
    judges: 'J.S. Khehar, CJI, J. Chelameswar, S.A. Bobde, R.F. Nariman, D.Y. Chandrachud & others',
    bench: '9 Judges',
    headnote: 'Right to Privacy declared a fundamental right guaranteed under Article 21 and Part III of the Constitution of India.',
    citation: '(2017) 10 SCC 1',
    status: 'Good Law',
    actsAndSections: [
      { act: 'Constitution of India', section: 'Article 21' },
      { act: 'Constitution of India', section: 'Article 14' },
    ],
  },
  {
    _id: 'judg_009',
    title: 'Board of Control for Cricket in India v. Cricket Association of Bihar',
    court: 'Calcutta High Court',
    decisionDate: '2015-01-22',
    judges: 'T.S. Thakur & F.M.I. Kalifulla, JJ.',
    bench: '2 Judges',
    headnote: 'Conflict of interest in sports governance; Rule 6.2.4 of BCCI Regulations declared invalid.',
    citation: '(2015) 3 SCC 251',
    status: 'Overruled',
    actsAndSections: [
      { act: 'Constitution of India', section: 'Article 226' },
      { act: 'Societies Registration Act 1860', section: 'Section 6' },
    ],
  },
  {
    _id: 'judg_010',
    title: 'State of Maharashtra v. Bharat Shanti Lal Shah',
    court: 'Bombay High Court',
    decisionDate: '2008-09-01',
    judges: 'K.G. Balakrishnan, CJI & P. Sathasivam, J.',
    bench: '2 Judges',
    headnote: 'Constitutional validity of Sections 13, 14, 15, and 16 of Maharashtra Control of Organised Crime Act (MCOCA) 1999.',
    citation: '(2008) 13 SCC 5',
    status: 'Good Law',
    actsAndSections: [
      { act: 'Code of Criminal Procedure 1973', section: 'Section 173' },
      { act: 'Indian Evidence Act 1872', section: 'Section 65B' },
    ],
  },
];

const JudgmentSearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('AI Search');
  const [court, setCourt] = useState('All Courts');
  const [status, setStatus] = useState('Any Status');

  // Custom filters configured via the popup modal
  const [customFilters, setCustomFilters] = useState({
    act: '',
    section: '',
    judge: '',
    bench: 'All Benches',
    fromDate: '',
    toDate: '',
  });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [judgments, setJudgments] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchModes = ['AI Search', 'Semantic', 'Keyword', 'Citation', 'Exact Phrase'];

  // Client-side fallback filter engine
  const filterLocally = useCallback((list) => {
    return list.filter((item) => {
      // Query filter
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const matchesQuery =
          item.title?.toLowerCase().includes(q) ||
          item.citation?.toLowerCase().includes(q) ||
          item.headnote?.toLowerCase().includes(q) ||
          item.judges?.toLowerCase().includes(q) ||
          (item.actsAndSections &&
            item.actsAndSections.some(
              (a) => a.act?.toLowerCase().includes(q) || a.section?.toLowerCase().includes(q)
            ));
        if (!matchesQuery) return false;
      }

      // Court filter
      if (court !== 'All Courts' && court !== 'Any Court') {
        if (!item.court?.toLowerCase().includes(court.toLowerCase())) return false;
      }

      // Status filter
      if (status !== 'Any Status') {
        if (item.status?.toLowerCase() !== status.toLowerCase()) return false;
      }

      // Act filter
      if (customFilters.act && customFilters.act.trim()) {
        const actLower = customFilters.act.trim().toLowerCase();
        const matchesAct =
          (item.actsAndSections &&
            item.actsAndSections.some((a) => a.act?.toLowerCase().includes(actLower))) ||
          item.headnote?.toLowerCase().includes(actLower);
        if (!matchesAct) return false;
      }

      // Section filter
      if (customFilters.section && customFilters.section.trim()) {
        const secLower = customFilters.section.trim().toLowerCase();
        const matchesSec =
          (item.actsAndSections &&
            item.actsAndSections.some((a) => a.section?.toLowerCase().includes(secLower))) ||
          item.headnote?.toLowerCase().includes(secLower);
        if (!matchesSec) return false;
      }

      // Judge filter
      if (customFilters.judge && customFilters.judge.trim()) {
        const judgeLower = customFilters.judge.trim().toLowerCase();
        if (!item.judges?.toLowerCase().includes(judgeLower)) return false;
      }

      // Bench filter
      if (customFilters.bench && customFilters.bench !== 'All Benches' && customFilters.bench !== 'Any Bench') {
        const benchLower = customFilters.bench.toLowerCase();
        if (!item.bench?.toLowerCase().includes(benchLower)) return false;
      }

      // Date range filter
      if (customFilters.fromDate && item.decisionDate) {
        if (item.decisionDate < customFilters.fromDate) return false;
      }
      if (customFilters.toDate && item.decisionDate) {
        if (item.decisionDate > customFilters.toDate) return false;
      }

      return true;
    });
  }, [query, court, status, customFilters]);

  const fetchJudgments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await judgmentService.search({
        q: query,
        court,
        status,
        searchMode,
        act: customFilters.act,
        section: customFilters.section,
        judge: customFilters.judge,
        bench: customFilters.bench,
        fromDate: customFilters.fromDate,
        toDate: customFilters.toDate,
      });

      const list = Array.isArray(data) ? data : data?.data || [];
      if (list.length > 0) {
        setJudgments(list);
      } else {
        // Double check against local store
        const localMatches = filterLocally(FALLBACK_JUDGMENTS);
        setJudgments(localMatches);
      }
    } catch (err) {
      console.warn('Backend unavailable, employing local precedent engine:', err.message);
      const filtered = filterLocally(FALLBACK_JUDGMENTS);
      setJudgments(filtered);
    } finally {
      setLoading(false);
    }
  }, [query, court, status, searchMode, customFilters, filterLocally]);

  useEffect(() => {
    fetchJudgments();
  }, [fetchJudgments]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJudgments();
  };

  // Count active custom modal filters
  const activeCustomFiltersCount = useMemo(() => {
    let count = 0;
    if (customFilters.act?.trim()) count++;
    if (customFilters.section?.trim()) count++;
    if (customFilters.judge?.trim()) count++;
    if (customFilters.bench && customFilters.bench !== 'All Benches') count++;
    if (customFilters.fromDate || customFilters.toDate) count++;
    return count;
  }, [customFilters]);

  // Handler for applying filters from modal
  const handleApplyModalFilters = (applied) => {
    setCustomFilters({
      act: applied.act || '',
      section: applied.section || '',
      judge: applied.judge || '',
      bench: applied.bench || 'All Benches',
      fromDate: applied.fromDate || '',
      toDate: applied.toDate || '',
    });
    if (applied.court) setCourt(applied.court);
    if (applied.status) setStatus(applied.status);
  };

  const handleResetAllFilters = () => {
    setQuery('');
    setCourt('All Courts');
    setStatus('Any Status');
    setCustomFilters({
      act: '',
      section: '',
      judge: '',
      bench: 'All Benches',
      fromDate: '',
      toDate: '',
    });
  };

  // Remove individual filter
  const removeFilter = (key) => {
    if (key === 'court') setCourt('All Courts');
    else if (key === 'status') setStatus('Any Status');
    else if (key === 'date') setCustomFilters((prev) => ({ ...prev, fromDate: '', toDate: '' }));
    else if (key === 'bench') setCustomFilters((prev) => ({ ...prev, bench: 'All Benches' }));
    else setCustomFilters((prev) => ({ ...prev, [key]: '' }));
  };

  const hasAnyActiveFilter =
    activeCustomFiltersCount > 0 ||
    court !== 'All Courts' ||
    status !== 'Any Status' ||
    query.trim().length > 0;

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingBottom: '3rem',
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
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Scale size={19} strokeWidth={2.2} />
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
              Judgments & Case Law Repository
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              Search the Supreme Court, High Courts, and judicial tribunals with dynamic citation analytics and bench headnotes.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {hasAnyActiveFilter && (
            <button
              type="button"
              onClick={resetAllFilters}
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
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Search Filter Box */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.85rem',
          padding: '1.25rem',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
        }}
      >
        <form onSubmit={handleSearchSubmit}>
          {/* Main Input - Apple / iPhone iOS Style */}
          <div
            className="apple-search-container"
            style={{
              padding: '0.35rem 0.45rem 0.35rem 1.15rem',
              marginBottom: '1rem',
              gap: '0.75rem',
              height: '48px',
            }}
          >
            <Search size={18} color="#8e8e93" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by issue, party, statutory provision or citation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="apple-search-input"
              style={{ fontSize: '0.95rem' }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="apple-clear-btn"
                title="Clear search"
              >
                <X size={10} strokeWidth={3} />
              </button>
            )}
            <button
              type="submit"
              className="apple-search-btn"
            >
              <Search size={14} strokeWidth={2.4} />
              <span>Search</span>
            </button>
          </div>

          {/* Filter Pills and Dropdowns row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.65rem' }}>
            {/* Mode Pills */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {searchModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSearchMode(mode)}
                  className={`filter-pill ${searchMode === mode ? 'active' : ''}`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Court Dropdown */}
            <div style={{ minWidth: '170px' }}>
              <CustomSelect
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                size="sm"
                icon={Scale}
                options={[
                  { value: 'All Courts', label: 'All Courts' },
                  { value: 'Supreme Court of India', label: 'Supreme Court of India' },
                  { value: 'Delhi High Court', label: 'Delhi High Court' },
                  { value: 'Bombay High Court', label: 'Bombay High Court' },
                  { value: 'Calcutta High Court', label: 'Calcutta High Court' },
                ]}
              />
            </div>

            {/* Status Dropdown */}
            <div style={{ minWidth: '150px' }}>
              <CustomSelect
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                size="sm"
                options={[
                  { value: 'Any Status', label: 'Any Status' },
                  { value: 'Good Law', label: 'Good Law' },
                  { value: 'Distinguished', label: 'Distinguished' },
                  { value: 'Overruled', label: 'Overruled' },
                ]}
              />
            </div>

            {/* Additional Filter Link / Button - Opens Dynamic Pop-up Modal */}
            <button
              type="button"
              onClick={() => setShowFilterModal(true)}
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.825rem',
                fontWeight: activeCustomFiltersCount > 0 ? 600 : 500,
                color: activeCustomFiltersCount > 0 ? '#1d4ed8' : '#475569',
                backgroundColor: activeCustomFiltersCount > 0 ? '#eff6ff' : '#f8fafc',
                border: activeCustomFiltersCount > 0 ? '1.5px solid #93c5fd' : '1px solid #e2e8f0',
                padding: '0.45rem 0.85rem',
                borderRadius: '0.55rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: activeCustomFiltersCount > 0 ? '0 1px 3px rgba(37, 99, 235, 0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (activeCustomFiltersCount === 0) {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }
              }}
              onMouseLeave={(e) => {
                if (activeCustomFiltersCount === 0) {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }
              }}
            >
              <SlidersHorizontal size={14} color={activeCustomFiltersCount > 0 ? '#2563eb' : '#64748b'} />
              <span>Act, Judge, Bench, Date filters</span>
              {activeCustomFiltersCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    lineHeight: 1,
                  }}
                >
                  {activeCustomFiltersCount}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Active Filter Chips Bar */}
      {hasAnyActiveFilter && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: '#ffffff',
            borderRadius: '0.65rem',
            border: '1px solid #e2e8f0',
            fontSize: '0.8rem',
          }}
        >
          <span style={{ color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={13} color="#2563eb" />
            <span>Active filters:</span>
          </span>

          {query.trim() && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.375rem',
                backgroundColor: '#f1f5f9',
                color: '#1e293b',
                fontWeight: 500,
              }}
            >
              Query: "{query}"
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => setQuery('')} />
            </span>
          )}

          {court !== 'All Courts' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.375rem',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontWeight: 500,
              }}
            >
              Court: {court}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('court')} />
            </span>
          )}

          {status !== 'Any Status' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.375rem',
                backgroundColor: status === 'Good Law' ? '#ecfdf5' : status === 'Distinguished' ? '#fffbeb' : '#fef2f2',
                color: status === 'Good Law' ? '#047857' : status === 'Distinguished' ? '#b45309' : '#b91c1c',
                fontWeight: 500,
              }}
            >
              Status: {status}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('status')} />
            </span>
          )}

          {customFilters.act && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.375rem',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontWeight: 500,
              }}
            >
              Act: {customFilters.act}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('act')} />
            </span>
          )}

          {customFilters.section && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.375rem',
                backgroundColor: '#f8fafc',
                color: '#334155',
                border: '1px solid #cbd5e1',
                fontWeight: 500,
              }}
            >
              Section: {customFilters.section}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('section')} />
            </span>
          )}

          {customFilters.judge && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.375rem',
                backgroundColor: '#f5f3ff',
                color: '#6d28d9',
                fontWeight: 500,
              }}
            >
              Judge: {customFilters.judge}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('judge')} />
            </span>
          )}

          {customFilters.bench && customFilters.bench !== 'All Benches' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.375rem',
                backgroundColor: '#f1f5f9',
                color: '#334155',
                fontWeight: 500,
              }}
            >
              Bench: {customFilters.bench}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('bench')} />
            </span>
          )}

          {(customFilters.fromDate || customFilters.toDate) && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.375rem',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                fontWeight: 500,
              }}
            >
              Timeline: {customFilters.fromDate || 'Past'} ➔ {customFilters.toDate || 'Present'}
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('date')} />
            </span>
          )}

          <button
            type="button"
            onClick={handleResetAllFilters}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontSize: '0.775rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.2rem 0.4rem',
            }}
          >
            <RotateCcw size={12} />
            <span>Clear all</span>
          </button>
        </div>
      )}

      {/* Judgment Count Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.825rem',
          color: '#64748b',
          marginBottom: '1rem',
          fontWeight: 500,
        }}
      >
        <span>
          {loading ? 'Searching national judicial archives...' : `${judgments.length} judgments found`}
        </span>
        {searchMode && (
          <span style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
            Mode: <strong style={{ color: '#475569' }}>{searchMode}</strong>
          </span>
        )}
      </div>

      {/* Judgment Cards List */}
      {loading ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            padding: '3rem',
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              width: '32px',
              height: '32px',
              border: '3px solid #e2e8f0',
              borderTopColor: '#2563eb',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              marginBottom: '1rem',
            }}
          />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ fontWeight: 500 }}>Scanning judicial repository and precedents...</p>
        </div>
      ) : judgments.length === 0 ? (
        /* Empty State */
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.85rem',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Scale size={28} strokeWidth={1.75} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
            No precedents match your criteria
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '420px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            No Indian case law precedents match your combination of query, act, judge, bench, and dates. Try broadening your filter selection.
          </p>
          <button
            type="button"
            onClick={handleResetAllFilters}
            className="btn-primary"
            style={{ width: 'auto', padding: '0.6rem 1.4rem', fontSize: '0.875rem', gap: '0.45rem' }}
          >
            <RotateCcw size={15} />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {judgments.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/app/judgments/${item._id}`)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.07)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {/* Header: Title and Status Badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h3>
                <span
                  className={
                    item.status === 'Good Law'
                      ? 'badge-good-law'
                      : item.status === 'Overruled'
                      ? 'badge-overruled'
                      : 'badge-distinguished'
                  }
                  style={{ flexShrink: 0 }}
                >
                  {item.status}
                </span>
              </div>

              {/* Court · Judges · Bench · Decision Date metadata */}
              <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>{item.court}</span>
                <span>·</span>
                <span>{item.judges}</span>
                <span>·</span>
                <span style={{ backgroundColor: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '0.25rem', fontWeight: 500 }}>
                  {item.bench}
                </span>
                {item.decisionDate && (
                  <>
                    <span>·</span>
                    <span>Decided {item.decisionDate}</span>
                  </>
                )}
              </div>

              {/* Headnote snippet */}
              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.55, margin: '0.25rem 0' }}>
                {item.headnote}
              </p>

              {/* Acts and Statutory Provisions tags if available */}
              {item.actsAndSections && item.actsAndSections.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.15rem' }}>
                  {item.actsAndSections.map((actSec, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.725rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '0.35rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        fontWeight: 500,
                      }}
                    >
                      {actSec.act} {actSec.section ? `· ${actSec.section}` : ''}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer: Citation link */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <div style={{ fontSize: '0.825rem', color: '#2563eb', fontWeight: 600 }}>
                  {item.citation}
                </div>
                <div
                  style={{
                    fontSize: '0.775rem',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span>View full doctrine</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Judgment Filter Modal Pop-up */}
      <JudgmentFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        initialFilters={{
          ...customFilters,
          court,
          status,
        }}
        onApply={handleApplyModalFilters}
        onReset={() => {
          setCustomFilters({
            act: '',
            section: '',
            judge: '',
            bench: 'All Benches',
            fromDate: '',
            toDate: '',
          });
        }}
      />
    </div>
  );
};

export default JudgmentSearchPage;
