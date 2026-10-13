import React, { useState, useEffect } from 'react';
import {
  X,
  SlidersHorizontal,
  Scale,
  Calendar,
  UserCheck,
  BookOpen,
  Layers,
  RotateCcw,
  Check,
  Search
} from 'lucide-react';
import CustomSelect from '../common/CustomSelect';

const POPULAR_ACTS = [
  'Constitution of India',
  'Insolvency and Bankruptcy Code 2016',
  'Arbitration and Conciliation Act 1996',
  'Indian Evidence Act 1872',
  'Limitation Act 1963',
  'Companies Act 2013',
  'Code of Criminal Procedure 1973',
  'Code of Civil Procedure 1908',
];

const POPULAR_JUDGES = [
  'R.F. Nariman',
  'Dr. D.Y. Chandrachud',
  'S.M. Sikri, CJI',
  'S.A. Bobde, CJI',
  'M.P. Thakkar',
  'Doraiswamy Raju',
  'J.S. Khehar, CJI',
];

const BENCH_OPTIONS = [
  { value: 'All Benches', label: 'All Benches' },
  { value: 'Single Judge', label: 'Single Judge' },
  { value: '2 Judges', label: 'Division Bench (2 Judges)' },
  { value: '3 Judges', label: 'Full Bench (3 Judges)' },
  { value: 'Judges', label: 'Constitution Bench (5+ Judges)' },
];

const TIMELINE_PRESETS = [
  { label: 'All Time', fromDate: '', toDate: '' },
  { label: '2021 – 2026', fromDate: '2021-01-01', toDate: '2026-12-31' },
  { label: '2010 – 2020', fromDate: '2010-01-01', toDate: '2020-12-31' },
  { label: '2000 – 2009', fromDate: '2000-01-01', toDate: '2009-12-31' },
  { label: 'Pre-2000 Landmark', fromDate: '1950-01-01', toDate: '1999-12-31' },
];

export const JudgmentFilterModal = ({
  isOpen,
  onClose,
  initialFilters = {},
  onApply,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState({
    act: '',
    section: '',
    judge: '',
    bench: 'All Benches',
    fromDate: '',
    toDate: '',
    court: 'All Courts',
    status: 'Any Status',
  });

  const [activeTimelinePreset, setActiveTimelinePreset] = useState('All Time');

  useEffect(() => {
    if (isOpen) {
      const merged = {
        act: initialFilters.act || '',
        section: initialFilters.section || '',
        judge: initialFilters.judge || '',
        bench: initialFilters.bench || 'All Benches',
        fromDate: initialFilters.fromDate || '',
        toDate: initialFilters.toDate || '',
        court: initialFilters.court || 'All Courts',
        status: initialFilters.status || 'Any Status',
      };
      setLocalFilters(merged);

      // Detect timeline preset
      const matchedPreset = TIMELINE_PRESETS.find(
        (p) => p.fromDate === merged.fromDate && p.toDate === merged.toDate
      );
      setActiveTimelinePreset(matchedPreset ? matchedPreset.label : 'Custom');
    }
  }, [isOpen, initialFilters]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = (e) => {
    e?.preventDefault();
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetValues = {
      act: '',
      section: '',
      judge: '',
      bench: 'All Benches',
      fromDate: '',
      toDate: '',
      court: localFilters.court,
      status: localFilters.status,
    };
    setLocalFilters(resetValues);
    setActiveTimelinePreset('All Time');
    if (onReset) onReset(resetValues);
  };

  const handleTimelinePresetSelect = (preset) => {
    setActiveTimelinePreset(preset.label);
    setLocalFilters((prev) => ({
      ...prev,
      fromDate: preset.fromDate,
      toDate: preset.toDate,
    }));
  };

  // Calculate active filter count
  const activeCount = [
    localFilters.act,
    localFilters.section,
    localFilters.judge,
    localFilters.bench !== 'All Benches' ? localFilters.bench : null,
    localFilters.fromDate || localFilters.toDate ? 'date' : null,
  ].filter(Boolean).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.68)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1.25rem',
        animation: 'fadeInSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '0.65rem',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 2px rgba(37, 99, 235, 0.1)',
              }}
            >
              <SlidersHorizontal size={18} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2
                  className="font-serif"
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Precedent Filters
                </h2>
                {activeCount > 0 && (
                  <span
                    style={{
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {activeCount} active
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.15rem 0 0' }}>
                Filter Indian case laws by Act, Judge, Bench composition, and Timeline.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem',
          }}
        >
          {/* Act / Statute Filter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={14} color="#2563eb" />
                <span>Act & Statutory Legislation</span>
              </label>
              {localFilters.act && (
                <button
                  type="button"
                  onClick={() => setLocalFilters((prev) => ({ ...prev, act: '' }))}
                  style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear Act
                </button>
              )}
            </div>

            {/* Quick Act Selection Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
              {POPULAR_ACTS.map((actName) => {
                const isSelected = localFilters.act.toLowerCase() === actName.toLowerCase();
                return (
                  <button
                    key={actName}
                    type="button"
                    onClick={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        act: isSelected ? '' : actName,
                      }))
                    }
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.775rem',
                      fontWeight: isSelected ? 600 : 500,
                      border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                      color: isSelected ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {isSelected && <Check size={12} strokeWidth={2.8} />}
                    <span>{actName}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Act Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Or type custom act name (e.g. Insolvency, Limitation, Arbitration)..."
                value={localFilters.act}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, act: e.target.value }))}
                className="form-input"
                style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
              />
              <Search
                size={15}
                color="#94a3b8"
                style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Section & Specific Provision Filter */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
              <Layers size={14} color="#2563eb" />
              <span>Section / Article / Rule</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Section 27, Article 368, Section 29A, Section 17, Order XXXIX..."
              value={localFilters.section}
              onChange={(e) => setLocalFilters((prev) => ({ ...prev, section: e.target.value }))}
              className="form-input"
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {/* Judge / Coram Filter */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <UserCheck size={14} color="#2563eb" />
                <span>Judge / Presiding Coram</span>
              </label>
              {localFilters.judge && (
                <button
                  type="button"
                  onClick={() => setLocalFilters((prev) => ({ ...prev, judge: '' }))}
                  style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear Judge
                </button>
              )}
            </div>

            {/* Popular Judges quick buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
              {POPULAR_JUDGES.map((judgeName) => {
                const isSelected = localFilters.judge.toLowerCase().includes(judgeName.toLowerCase());
                return (
                  <button
                    key={judgeName}
                    type="button"
                    onClick={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        judge: isSelected ? '' : judgeName,
                      }))
                    }
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.775rem',
                      fontWeight: isSelected ? 600 : 500,
                      border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                      color: isSelected ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {isSelected && <Check size={12} strokeWidth={2.8} />}
                    <span>{judgeName}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search judge by name (e.g. Nariman, Chandrachud, Thakkar)..."
                value={localFilters.judge}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, judge: e.target.value }))}
                className="form-input"
                style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
              />
              <Search
                size={15}
                color="#94a3b8"
                style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Bench Strength & Court row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Bench Composition */}
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
                <Scale size={14} color="#2563eb" />
                <span>Bench Strength</span>
              </label>
              <CustomSelect
                value={localFilters.bench}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, bench: e.target.value }))}
                options={BENCH_OPTIONS}
                size="md"
              />
            </div>

            {/* Court Jurisdiction */}
            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
                <Scale size={14} color="#2563eb" />
                <span>Court / Forum</span>
              </label>
              <CustomSelect
                value={localFilters.court}
                onChange={(e) => setLocalFilters((prev) => ({ ...prev, court: e.target.value }))}
                options={[
                  { value: 'All Courts', label: 'All Courts' },
                  { value: 'Supreme Court of India', label: 'Supreme Court of India' },
                  { value: 'Delhi High Court', label: 'Delhi High Court' },
                  { value: 'Bombay High Court', label: 'Bombay High Court' },
                  { value: 'Calcutta High Court', label: 'Calcutta High Court' },
                ]}
                size="md"
              />
            </div>
          </div>

          {/* Decision Timeline / Date Range */}
          <div>
            <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
              <Calendar size={14} color="#2563eb" />
              <span>Decision Timeline & Year</span>
            </label>

            {/* Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
              {TIMELINE_PRESETS.map((preset) => {
                const isSelected = activeTimelinePreset === preset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleTimelinePresetSelect(preset)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.775rem',
                      fontWeight: isSelected ? 600 : 500,
                      border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                      color: isSelected ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Date Range Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                  Decided From (YYYY-MM-DD)
                </span>
                <input
                  type="date"
                  value={localFilters.fromDate}
                  onChange={(e) => {
                    setActiveTimelinePreset('Custom');
                    setLocalFilters((prev) => ({ ...prev, fromDate: e.target.value }));
                  }}
                  className="form-input"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                  Decided To (YYYY-MM-DD)
                </span>
                <input
                  type="date"
                  value={localFilters.toDate}
                  onChange={(e) => {
                    setActiveTimelinePreset('Custom');
                    setLocalFilters((prev) => ({ ...prev, toDate: e.target.value }));
                  }}
                  className="form-input"
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1.15rem 1.75rem',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.4rem 0.6rem',
              borderRadius: '0.5rem',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#0f172a';
              e.currentTarget.style.backgroundColor = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-social"
              style={{
                padding: '0.55rem 1.1rem',
                fontSize: '0.85rem',
                width: 'auto',
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="btn-primary"
              style={{
                padding: '0.55rem 1.4rem',
                fontSize: '0.85rem',
                width: 'auto',
                gap: '0.45rem',
              }}
            >
              <Check size={16} strokeWidth={2.4} />
              <span>Apply Filters</span>
              {activeCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.22)',
                    fontSize: '0.75rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '9999px',
                    marginLeft: '0.2rem',
                  }}
                >
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgmentFilterModal;
