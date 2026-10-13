import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/api';
import {
  Scale,
  Gavel,
  Layers,
  BookOpen,
  Hash,
  Briefcase,
  FolderKanban,
  Files,
  FileCode2,
  Bookmark,
  Users,
  Building2,
  Shield,
  Key,
  Database,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Search,
  ExternalLink,
  Plus,
  Landmark,
  CalendarCheck,
  Mail,
} from 'lucide-react';

const overviewStyles = `
  .overview-page-wrap {
    display: flex;
    flex-direction: column;
    gap: 22px;
    width: 100%;
    color: #0f172a;
    font-family: inherit;
    box-sizing: border-box;
  }

  .overview-page-wrap * {
    box-sizing: border-box;
  }

  /* TOP HEADER - CFSYS Clean Style */
  .overview-page-wrap .ov-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    background: #ffffff;
    padding: 20px 24px;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  }

  .overview-page-wrap .ov-badge-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #4f46e5;
    background: #eef2ff;
    padding: 3px 9px;
    border-radius: 6px;
    margin-bottom: 6px;
  }

  .overview-page-wrap .ov-title {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .overview-page-wrap .ov-subtitle {
    margin: 4px 0 0;
    font-size: 13px;
    color: #64748b;
    font-weight: 450;
  }

  .overview-page-wrap .ov-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  /* METRICS STRIP - CFSYS Style Stat Cards */
  .overview-page-wrap .ov-metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
    width: 100%;
  }

  .overview-page-wrap .ov-metric-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
    position: relative;
    transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    cursor: pointer;
  }

  .overview-page-wrap .ov-metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.08);
    border-color: #cbd5e1;
  }

  .overview-page-wrap .ov-metric-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .overview-page-wrap .ov-metric-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .overview-page-wrap .ov-metric-pill {
    font-size: 11px;
    font-weight: 650;
    padding: 3px 8px;
    border-radius: 999px;
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
  }

  .overview-page-wrap .ov-metric-label {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 4px;
  }

  .overview-page-wrap .ov-metric-value {
    font-size: 32px;
    font-weight: 850;
    color: #0f172a;
    line-height: 1.1;
    letter-spacing: -0.025em;
    margin-bottom: 6px;
  }

  .overview-page-wrap .ov-metric-sub {
    font-size: 11.5px;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* QUICK ACTIONS BAR - CFSYS Business Style */
  .overview-page-wrap .ov-quick-bar {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
  }

  .overview-page-wrap .ov-quick-title {
    font-size: 13.5px;
    font-weight: 750;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .overview-page-wrap .ov-quick-btns {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .overview-page-wrap .ov-quick-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    color: #334155;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .overview-page-wrap .ov-quick-btn:hover {
    background: #ffffff;
    border-color: #cbd5e1;
    color: #0f172a;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  /* TAXONOMY SECTION */
  .overview-page-wrap .ov-tax-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .overview-page-wrap .ov-tax-title {
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .overview-page-wrap .ov-tax-search-wrap {
    position: relative;
    width: 260px;
  }

  .overview-page-wrap .ov-tax-search-input {
    width: 100%;
    height: 36px;
    padding: 0 12px 0 34px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #ffffff;
    font-size: 12px;
    color: #0f172a;
    outline: none;
    transition: border-color 0.15s ease;
  }

  .overview-page-wrap .ov-tax-search-input:focus {
    border-color: #4f46e5;
  }

  /* TAXONOMIES GRID */
  .overview-page-wrap .ov-tax-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
    gap: 16px;
    width: 100%;
  }

  .overview-page-wrap .ov-tax-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
    transition: all 0.15s ease;
    cursor: pointer;
  }

  .overview-page-wrap .ov-tax-card:hover {
    border-color: #4f46e5;
    background: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -4px rgba(79, 70, 229, 0.12);
  }

  .overview-page-wrap .ov-tax-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    color: #4f46e5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  .overview-page-wrap .ov-tax-card:hover .ov-tax-icon-wrap {
    background: #eef2ff;
    border-color: #c7d2fe;
    color: #4338ca;
  }

  .overview-page-wrap .ov-tax-info {
    flex: 1;
    min-width: 0;
  }

  .overview-page-wrap .ov-tax-name {
    font-size: 14px;
    font-weight: 750;
    color: #0f172a;
    margin-bottom: 3px;
  }

  .overview-page-wrap .ov-tax-desc {
    font-size: 11.5px;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .overview-page-wrap .ov-tax-count {
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 4px 12px;
    border-radius: 8px;
  }
`;

const MASTER_TAXONOMIES_CONFIG = [
  { key: 'Court', name: 'Courts & Tribunals', icon: Scale, desc: 'Supreme Court, High Courts, Tribunals' },
  { key: 'Judge', name: 'Judges & Justices', icon: Gavel, desc: "Hon'ble Justices & Presiding Officers" },
  { key: 'Bench', name: 'Court Benches', icon: Layers, desc: 'Principal, Circuit & Regional Benches' },
  { key: 'Act', name: 'Acts & Statutes', icon: BookOpen, desc: 'Central & State Statutes, Codes' },
  { key: 'Section', name: 'Statutory Sections', icon: Hash, desc: 'Articles, statutory rules & provisions' },
  { key: 'Practice Area', name: 'Practice Areas', icon: Briefcase, desc: 'Litigation, Corporate, IP, Arbitration' },
  { key: 'Case Type', name: 'Case Types', icon: FolderKanban, desc: 'Writ Petitions, SLPs, Suits, Appeals' },
  { key: 'Document Type', name: 'Document Types', icon: Files, desc: 'Affidavits, Vakalatnamas, Pleadings' },
  { key: 'Legal Template', name: 'Legal Templates', icon: FileCode2, desc: 'Pre-vetted legal pleading drafts' },
  { key: 'Clause', name: 'Clauses Library', icon: Bookmark, desc: 'Standard contract & dispute clauses' },
  { key: 'Opposing Party', name: 'Opposing Parties', icon: Users, desc: 'Respondents, Defendants, Opponents' },
];

export default function OverviewView() {
  const {
    overview,
    refreshOverview,
    setCurrentTab,
    refreshDbStatus,
    refreshFirms,
    addToast,
  } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [taxSearch, setTaxSearch] = useState('');
  const [inquiryStats, setInquiryStats] = useState({ total: 0, newRequests: 0, demo: 0, contact: 0 });

  const loadCategories = useCallback(async () => {
    try {
      const [catRes, leadRes] = await Promise.allSettled([
        typeof adminApi?.getMasterCategories === 'function' ? adminApi.getMasterCategories() : Promise.resolve({ success: false }),
        typeof adminApi?.getLeads === 'function' ? adminApi.getLeads({ limit: 1 }) : Promise.resolve({ success: false }),
      ]);
      if (catRes.status === 'fulfilled' && catRes.value?.success) {
        setCategoryData(catRes.value.categories || []);
      }
      if (leadRes.status === 'fulfilled' && leadRes.value?.success && leadRes.value.stats) {
        setInquiryStats(leadRes.value.stats);
      }
    } catch (err) {
      console.warn('Dashboard categories load error:', err);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleRefresh = async () => {
    setLoading(true);
    setIsRefreshed(false);
    try {
      await Promise.all([
        typeof refreshOverview === 'function' ? refreshOverview() : Promise.resolve(),
        typeof refreshDbStatus === 'function' ? refreshDbStatus() : Promise.resolve(),
        typeof refreshFirms === 'function' ? refreshFirms() : Promise.resolve(),
        loadCategories(),
      ]);
      setIsRefreshed(true);
      if (typeof addToast === 'function') {
        addToast('Dashboard data refreshed successfully', 'success');
      }
      setTimeout(() => setIsRefreshed(false), 1200);
    } catch (err) {
      console.warn('Refresh error:', err);
      if (typeof addToast === 'function') {
        addToast('Failed to refresh some dashboard data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Combine category counts from API
  const categoryCountsMap = useMemo(() => {
    const map = {};
    (categoryData || []).forEach((c) => {
      if (c && c.category) {
        map[c.category.toLowerCase()] = Number(c.count) || 0;
      }
    });
    const ovCategories = overview?.masterCategories || [];
    ovCategories.forEach((c) => {
      if (c && c.category) {
        map[c.category.toLowerCase()] = Number(c.count) || map[c.category.toLowerCase()] || 0;
      }
    });
    return map;
  }, [categoryData, overview]);

  const stats = overview?.stats || {};
  const courtsCount = stats.courtsCount ?? categoryCountsMap['court'] ?? 0;
  const judgesCount = stats.judgesCount ?? categoryCountsMap['judge'] ?? 0;
  const benchesCount = stats.benchesCount ?? categoryCountsMap['bench'] ?? 0;
  const actsCount = stats.actsCount ?? categoryCountsMap['act'] ?? 0;
  const totalMasterRecords = stats.totalMasterRecords ?? Object.values(categoryCountsMap).reduce((a, b) => a + b, 0);

  const handleOpenMasterCategory = (catKey) => {
    try {
      localStorage.setItem('legal_ai_master_cat', catKey);
    } catch {}
    setCurrentTab('masters');
  };

  const filteredTaxonomies = useMemo(() => {
    const q = taxSearch.toLowerCase().trim();
    if (!q) return MASTER_TAXONOMIES_CONFIG;
    return MASTER_TAXONOMIES_CONFIG.filter(
      (t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)
    );
  }, [taxSearch]);
  return (
    <div
      className={`overview-page-wrap ${isRefreshed ? 'data-refreshed-pulse' : ''}`}
      style={{
        opacity: loading ? 0.72 : 1,
        transition: 'opacity 0.25s ease',
      }}
    >
      <style>{overviewStyles}</style>

      {/* Header - CFSYS Clean Style */}
      <div className="ov-header">
        <div>
          <h1 className="ov-title">
            <Scale size={24} style={{ color: '#4f46e5' }} />
            <span>Master Data & Taxonomies Overview</span>
          </h1>
        </div>

        <div className="ov-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            title="Refresh"
            disabled={loading}
            style={{
              width: '38px',
              height: '38px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setCurrentTab('masters')}
            style={{ height: '38px', padding: '0 16px', fontSize: '12px', gap: '6px' }}
          >
            <span>Manage All Masters</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Customer Inquiries Banner */}
      {inquiryStats.total > 0 && (
        <div
          onClick={() => setCurrentTab('inquiries')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            backgroundColor: inquiryStats.newRequests > 0 ? '#fffbeb' : '#ffffff',
            borderRadius: '12px',
            border: inquiryStats.newRequests > 0 ? '1px solid #fde68a' : '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = inquiryStats.newRequests > 0 ? '#fde68a' : '#e2e8f0';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: inquiryStats.newRequests > 0 ? '#fef3c7' : '#eff6ff',
                color: inquiryStats.newRequests > 0 ? '#d97706' : '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CalendarCheck size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 750, color: '#0f172a' }}>
                  Homepage Customer Inquiries & Demo Requests
                </span>
                {inquiryStats.newRequests > 0 && (
                  <span
                    style={{
                      padding: '2px 7px',
                      borderRadius: '10px',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      border: '1px solid #fde68a',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {inquiryStats.newRequests} New
                  </span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {inquiryStats.total} total submissions received ({inquiryStats.demo} Book a Demo, {inquiryStats.contact} Contact Us inquiries)
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 650,
              color: '#2563eb',
            }}
          >
            <span>Review Inquiries</span>
            <ArrowRight size={14} />
          </div>
        </div>
      )}

      {/* Top Metric Cards - CFSYS Style Stats Grid */}
      <div className="ov-metrics-grid">
        {/* Total Master Records */}
        <div
          className="ov-metric-card"
          onClick={() => setCurrentTab('masters')}
        >
          <div className="ov-metric-top">
            <div className="ov-metric-icon-wrap" style={{ backgroundColor: '#eef2ff', color: '#4f46e5' }}>
              <Database size={22} />
            </div>
            <span className="ov-metric-pill">12 Taxonomies</span>
          </div>
          <div>
            <div className="ov-metric-label">Total Master Records</div>
            <div className="ov-metric-value">{totalMasterRecords}</div>
            <div className="ov-metric-sub">
              <CheckCircle2 size={13} style={{ color: '#10b981' }} />
              <span>Active & indexed in MongoDB</span>
            </div>
          </div>
        </div>

        {/* Courts & Tribunals */}
        <div
          className="ov-metric-card"
          onClick={() => handleOpenMasterCategory('Court')}
        >
          <div className="ov-metric-top">
            <div className="ov-metric-icon-wrap" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <Landmark size={22} />
            </div>
            <span className="ov-metric-pill">Court Tiers</span>
          </div>
          <div>
            <div className="ov-metric-label">Courts & Tribunals</div>
            <div className="ov-metric-value">{courtsCount}</div>
            <div className="ov-metric-sub">
              <span>Apex, High Courts & Tribunals</span>
            </div>
          </div>
        </div>

        {/* Hon'ble Judges */}
        <div
          className="ov-metric-card"
          onClick={() => handleOpenMasterCategory('Judge')}
        >
          <div className="ov-metric-top">
            <div className="ov-metric-icon-wrap" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
              <Gavel size={22} />
            </div>
            <span className="ov-metric-pill">Bench Rosters</span>
          </div>
          <div>
            <div className="ov-metric-label">Hon'ble Judges & Justices</div>
            <div className="ov-metric-value">{judgesCount}</div>
            <div className="ov-metric-sub">
              <span>Mapped across active jurisdictions</span>
            </div>
          </div>
        </div>

        {/* Court Benches */}
        <div
          className="ov-metric-card"
          onClick={() => handleOpenMasterCategory('Bench')}
        >
          <div className="ov-metric-top">
            <div className="ov-metric-icon-wrap" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <Layers size={22} />
            </div>
            <span className="ov-metric-pill">Jurisdictions</span>
          </div>
          <div>
            <div className="ov-metric-label">Court Benches</div>
            <div className="ov-metric-value">{benchesCount}</div>
            <div className="ov-metric-sub">
              <span>Principal & Circuit divisions</span>
            </div>
          </div>
        </div>

        {/* Acts & Statutes */}
        <div
          className="ov-metric-card"
          onClick={() => handleOpenMasterCategory('Act')}
        >
          <div className="ov-metric-top">
            <div className="ov-metric-icon-wrap" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
              <BookOpen size={22} />
            </div>
            <span className="ov-metric-pill">Statutory</span>
          </div>
          <div>
            <div className="ov-metric-label">Statutory Acts & Codes</div>
            <div className="ov-metric-value">{actsCount}</div>
            <div className="ov-metric-sub">
              <span>Central & State legislations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Taxonomies Section */}
      <div className="ov-tax-section-head" style={{ justifyContent: 'flex-start', gap: '18px' }}>
        <div className="ov-tax-search-wrap">
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '11px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
          <input
            type="text"
            className="ov-tax-search-input"
            placeholder="Search taxonomies..."
            value={taxSearch}
            onChange={(e) => setTaxSearch(e.target.value)}
          />
        </div>

        <div className="ov-tax-title">
          <Database size={18} style={{ color: '#4f46e5' }} />
          <span>Taxonomies & Legal Repositories</span>
          <span style={{ fontSize: '12px', fontWeight: 650, color: '#64748b' }}>
            ({filteredTaxonomies.length} categories)
          </span>
        </div>
      </div>

      {/* Taxonomies Grid - CFSYS Style */}
      <div className="ov-tax-grid">
        {filteredTaxonomies.map((item) => {
          const Icon = item.icon || Database;
          const count = categoryCountsMap[item.key.toLowerCase()] ?? 0;

          return (
            <div
              key={item.key}
              className="ov-tax-card"
              onClick={() => handleOpenMasterCategory(item.key)}
              title={`Open ${item.name} master editor`}
            >
              <div className="ov-tax-icon-wrap">
                <Icon size={20} />
              </div>

              <div className="ov-tax-info">
                <div className="ov-tax-name">{item.name}</div>
                <div className="ov-tax-desc">{item.desc}</div>
              </div>

              <div className="ov-tax-count">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
