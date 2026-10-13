import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  FileText,
  Sparkles,
  ArrowRight,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  X,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { matterService, researchService, documentService } from '../services/api';
import { toast } from '../context/ToastContext';

export const ReportsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    matters: 24,
    researchSessions: 128,
    documents: 86,
    creditsUsed: '1,240',
  });

  // Selected bar for hover tooltip
  const [hoveredBar, setHoveredBar] = useState(null);
  // Selected donut slice for hover tooltip
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Export Modal state
  const [exportModal, setExportModal] = useState({
    isOpen: false,
    reportTitle: '',
    reportType: '',
    format: 'pdf',
    timeRange: 'Last 6 Months',
    isGenerating: false,
  });

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        const [mattersRes, researchRes, docsRes] = await Promise.allSettled([
          matterService.getAll(),
          researchService.getAll(),
          documentService.getAll(),
        ]);

        const mattersCount = mattersRes.status === 'fulfilled' && Array.isArray(mattersRes.value) && mattersRes.value.length > 0
          ? mattersRes.value.length
          : 24;

        const researchCount = researchRes.status === 'fulfilled' && Array.isArray(researchRes.value) && researchRes.value.length > 0
          ? researchRes.value.length
          : 128;

        const docsCount = docsRes.status === 'fulfilled' && Array.isArray(docsRes.value) && docsRes.value.length > 0
          ? docsRes.value.length
          : 86;

        setMetrics({
          matters: mattersCount,
          researchSessions: researchCount,
          documents: docsCount,
          creditsUsed: '1,240',
        });
      } catch (err) {
        console.warn('Reports page fallback data active:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  // Research over time data (matching screenshot bar proportions)
  const monthlyResearchData = [
    { month: 'Jan', count: 18, height: '36%' },
    { month: 'Feb', count: 32, height: '58%' },
    { month: 'Mar', count: 24, height: '46%' },
    { month: 'Apr', count: 52, height: '82%' },
    { month: 'May', count: 68, height: '96%' },
    { month: 'Jun', count: 48, height: '76%' },
  ];

  // AI usage by module data (matching screenshot donut proportions)
  const moduleUsageData = [
    { id: 'research', name: 'Ask Legal AI & Research', percentage: 45, color: '#0f172a', queries: 558 },
    { id: 'drafting', name: 'AI Drafting Studio', percentage: 25, color: '#2563eb', queries: 310 },
    { id: 'contracts', name: 'Contract Review', percentage: 20, color: '#059669', queries: 248 },
    { id: 'documents', name: 'Document Analysis', percentage: 10, color: '#d97706', queries: 124 },
  ];

  // 6 Report types from screenshot
  const reportTypes = [
    { id: 'matters', title: 'Matter Reports', desc: 'Case milestones, court listings, and client matter progress.' },
    { id: 'research', title: 'Research Reports', desc: 'Precedent citations, legal memoranda, and statutory cross-references.' },
    { id: 'documents', title: 'Document Reports', desc: 'Vault indexing, OCR status, and document extraction summaries.' },
    { id: 'ai', title: 'AI Reports', desc: 'Reasoning model accuracy, citation validation, and query breakdowns.' },
    { id: 'usage', title: 'Usage Reports', desc: 'Practitioner activity logs, team collaboration, and session durations.' },
    { id: 'financial', title: 'Financial Reports', desc: 'Billing hours, matter costs, and credit allocation statement.' },
  ];

  const handleOpenExport = (report) => {
    setExportModal({
      isOpen: true,
      reportTitle: report.title,
      reportType: report.id,
      format: 'pdf',
      timeRange: 'Last 6 Months',
      isGenerating: false,
    });
  };

  const handleTriggerExport = () => {
    setExportModal((prev) => ({ ...prev, isGenerating: true }));

    setTimeout(() => {
      // Simulate file download
      const filename = `${exportModal.reportTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.${exportModal.format}`;
      const dummyContent = `Legal AI - ${exportModal.reportTitle}\nGenerated: ${new Date().toLocaleString()}\nTime Range: ${exportModal.timeRange}\nFormat: ${exportModal.format.toUpperCase()}\nUser: ${user?.firstName || 'Advocate'} (${user?.organisationName || 'Legal AI Chambers'})\n\nSUMMARY METRICS:\n- Total Matters: ${metrics.matters}\n- Research Sessions: ${metrics.researchSessions}\n- Documents Analyzed: ${metrics.documents}\n- AI Credits Consumed: ${metrics.creditsUsed}\n`;

      const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportModal((prev) => ({ ...prev, isGenerating: false, isOpen: false }));
      toast.success(`${exportModal.reportTitle} generated & downloaded successfully!`, 'Report Exported');
    }, 900);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2rem',
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 0.35rem 0',
            letterSpacing: '-0.01em',
          }}
        >
          Reports
        </h1>
        <p
          style={{
            fontSize: '0.925rem',
            color: '#64748b',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Insights across research, matters and usage.
        </p>
      </div>

      {/* Top 4 Metric KPI Cards (Matching Screenshot) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* TOTAL MATTERS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 650,
                color: '#64748b',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              TOTAL MATTERS
            </span>
            <Layers size={17} color="#cbd5e1" strokeWidth={1.75} />
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1,
            }}
          >
            {metrics.matters}
          </div>
        </div>

        {/* RESEARCH SESSIONS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 650,
                color: '#64748b',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              RESEARCH SESSIONS
            </span>
            <Search size={17} color="#cbd5e1" strokeWidth={1.75} />
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1,
            }}
          >
            {metrics.researchSessions}
          </div>
        </div>

        {/* DOCUMENTS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 650,
                color: '#64748b',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              DOCUMENTS
            </span>
            <FileText size={17} color="#cbd5e1" strokeWidth={1.75} />
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1,
            }}
          >
            {metrics.documents}
          </div>
        </div>

        {/* AI CREDITS USED */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.725rem',
                fontWeight: 650,
                color: '#64748b',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              AI CREDITS USED
            </span>
            <Sparkles size={17} color="#cbd5e1" strokeWidth={1.75} />
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.25rem',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1,
            }}
          >
            {metrics.creditsUsed}
          </div>
        </div>
      </div>

      {/* Middle Row: Two Large Visualization Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Research over time (Bar Chart) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 650, color: '#0f172a', margin: 0 }}>
              Research over time
            </h3>
            {hoveredBar && (
              <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                {hoveredBar.month}: {hoveredBar.count} sessions
              </span>
            )}
          </div>

          {/* Bar Chart Canvas Container */}
          <div
            style={{
              height: '220px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '0 1rem 0.5rem 1rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            {monthlyResearchData.map((bar) => {
              const isHovered = hoveredBar?.month === bar.month;
              return (
                <div
                  key={bar.month}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    flex: 1,
                    maxWidth: '65px',
                  }}
                  onMouseEnter={() => setHoveredBar(bar)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div
                    style={{
                      width: '46px',
                      height: bar.height,
                      backgroundColor: isHovered ? '#1e293b' : '#0f172a',
                      borderTopLeftRadius: '4px',
                      borderTopRightRadius: '4px',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isHovered ? 'scaleY(1.03)' : 'none',
                      transformOrigin: 'bottom',
                      cursor: 'pointer',
                      boxShadow: isHovered ? '0 4px 12px rgba(15, 23, 42, 0.2)' : 'none',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.775rem',
                      fontWeight: isHovered ? 700 : 500,
                      color: isHovered ? '#0f172a' : '#64748b',
                      marginTop: '0.65rem',
                      transition: 'color 0.15s',
                    }}
                  >
                    {bar.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI usage by module (Donut Chart) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 650, color: '#0f172a', margin: 0 }}>
              AI usage by module
            </h3>
            {hoveredSlice && (
              <span style={{ fontSize: '0.75rem', color: hoveredSlice.color, fontWeight: 700, backgroundColor: '#f8fafc', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${hoveredSlice.color}30` }}>
                {hoveredSlice.name}: {hoveredSlice.percentage}%
              </span>
            )}
          </div>

          <div
            style={{
              height: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2.5rem',
            }}
          >
            {/* SVG Donut Chart */}
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                {/* 
                  Circumference = 2 * PI * 58 = 364.42
                  Navy 45% -> dash: 164, offset: 0
                  Blue 25% -> dash: 91, offset: -164
                  Green 20% -> dash: 73, offset: -255
                  Orange 10% -> dash: 36.4, offset: -328
                */}
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#0f172a"
                  strokeWidth="24"
                  strokeDasharray="164 365"
                  strokeDashoffset="0"
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
                  onMouseEnter={() => setHoveredSlice(moduleUsageData[0])}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="24"
                  strokeDasharray="91 365"
                  strokeDashoffset="-164"
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
                  onMouseEnter={() => setHoveredSlice(moduleUsageData[1])}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#059669"
                  strokeWidth="24"
                  strokeDasharray="73 365"
                  strokeDashoffset="-255"
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
                  onMouseEnter={() => setHoveredSlice(moduleUsageData[2])}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                <circle
                  cx="80"
                  cy="80"
                  r="58"
                  fill="transparent"
                  stroke="#d97706"
                  strokeWidth="24"
                  strokeDasharray="37 365"
                  strokeDashoffset="-328"
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.2s' }}
                  onMouseEnter={() => setHoveredSlice(moduleUsageData[3])}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              </svg>

              {/* Center hole content */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                  QUERIES
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                  1,240
                </span>
              </div>
            </div>

            {/* Clean Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {moduleUsageData.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    opacity: hoveredSlice && hoveredSlice.id !== item.id ? 0.45 : 1,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={() => setHoveredSlice(item)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '0.785rem', color: '#334155', fontWeight: 500, minWidth: '150px' }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: '0.785rem', color: '#64748b', fontWeight: 650, marginLeft: 'auto' }}>
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: 6 Report Cards (3 columns x 2 rows matching screenshot) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {reportTypes.map((report) => (
          <div
            key={report.id}
            onClick={() => handleOpenExport(report)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.4rem 1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
              cursor: 'pointer',
              transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#94a3b8';
              e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(15, 23, 42, 0.06)';
              const cta = e.currentTarget.querySelector('.report-cta');
              if (cta) cta.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.02)';
              const cta = e.currentTarget.querySelector('.report-cta');
              if (cta) cta.style.color = '#64748b';
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 650,
                  color: '#0f172a',
                  margin: '0 0 0.35rem 0',
                }}
              >
                {report.title}
              </h4>
              <p
                style={{
                  fontSize: '0.785rem',
                  color: '#64748b',
                  margin: '0 0 1rem 0',
                  lineHeight: 1.45,
                }}
              >
                {report.desc}
              </p>
            </div>

            <div
              className="report-cta"
              style={{
                fontSize: '0.825rem',
                color: '#64748b',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'color 0.15s',
              }}
            >
              <span>Generate & export</span>
              <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* Export & Generation Modal */}
      {exportModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Generate {exportModal.reportTitle}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>
                  Export verified analytics and audit records
                </p>
              </div>
              <button
                onClick={() => setExportModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.25rem 1.5rem' }}>
              {/* Date Range Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.45rem' }}>
                  Time Range
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {['Last 30 Days', 'Last 6 Months', 'Year to Date'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setExportModal((prev) => ({ ...prev, timeRange: range }))}
                      style={{
                        padding: '0.5rem',
                        fontSize: '0.775rem',
                        borderRadius: '0.375rem',
                        border: exportModal.timeRange === range ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                        backgroundColor: exportModal.timeRange === range ? '#f1f5f9' : '#ffffff',
                        color: exportModal.timeRange === range ? '#0f172a' : '#475569',
                        fontWeight: exportModal.timeRange === range ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.45rem' }}>
                  Export Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'pdf', label: 'PDF Document', icon: FileText },
                    { id: 'xlsx', label: 'Excel Sheet', icon: FileSpreadsheet },
                    { id: 'csv', label: 'CSV Data', icon: FileCode },
                  ].map((fmt) => {
                    const Icon = fmt.icon;
                    const isSelected = exportModal.format === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportModal((prev) => ({ ...prev, format: fmt.id }))}
                        style={{
                          padding: '0.65rem 0.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.35rem',
                          borderRadius: '0.5rem',
                          border: isSelected ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                          backgroundColor: isSelected ? '#f8fafc' : '#ffffff',
                          color: isSelected ? '#0f172a' : '#64748b',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        <Icon size={18} color={isSelected ? '#0f172a' : '#94a3b8'} />
                        <span>{fmt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setExportModal((prev) => ({ ...prev, isOpen: false }))}
                  style={{
                    flex: 1,
                    padding: '0.65rem 1rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTriggerExport}
                  disabled={exportModal.isGenerating}
                  className="btn-primary"
                  style={{
                    flex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.825rem',
                    fontWeight: 650,
                  }}
                >
                  {exportModal.isGenerating ? (
                    <span>Compiling Report...</span>
                  ) : (
                    <>
                      <Download size={15} />
                      <span>Download Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
