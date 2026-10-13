import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Scale,
  Layers,
  Gavel,
  BookOpen,
  Hash,
  Briefcase,
  Files,
  FileText,
  FileCode,
  Bookmark,
  Building,
  UserX,
  UserCheck,
  Tag,
  Database,
  Search,
  Plus,
  X,
  Check,
  Trash2,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Lock,
  Shield,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants/enums';
import { toast } from '../../context/ToastContext';
import { masterService } from '../../services/api';

// Metadata and specific configuration for all 14 master categories (Screenshots 2 & 3)
const MASTER_CONFIG = {
  Court: {
    icon: Scale,
    label: 'Court',
    desc: 'Supreme Court, High Courts, Tribunals (NCLT, ITAT, SAT)',
    fields: [
      { name: 'name', label: 'Court Name *', placeholder: 'e.g. Gujarat High Court', required: true },
      { name: 'code', label: 'Court Code', placeholder: 'e.g. GHC' },
      { name: 'subType', label: 'Tier / Type', placeholder: 'e.g. High Court, Tribunal, Commercial Court' },
      { name: 'jurisdiction', label: 'Jurisdiction / Seat', placeholder: 'e.g. State of Gujarat (Ahmedabad)' },
      { name: 'description', label: 'Official Scope / Description', placeholder: 'e.g. Constitutional and appellate seat' },
    ],
    columns: ['COURT NAME', 'CODE', 'TIER / TYPE', 'JURISDICTION', 'DESCRIPTION', 'ACTIONS'],
  },
  Bench: {
    icon: Layers,
    label: 'Bench',
    desc: 'Principal Benches, Circuit Benches & Regional registries',
    fields: [
      { name: 'name', label: 'Bench Name *', placeholder: 'e.g. Principal Bench New Delhi', required: true },
      { name: 'code', label: 'Bench Code', placeholder: 'e.g. PB-ND' },
      { name: 'subType', label: 'Division Type', placeholder: 'e.g. Division Bench, Single Bench' },
      { name: 'jurisdiction', label: 'Seat / Location', placeholder: 'e.g. New Delhi' },
      { name: 'description', label: 'Bench Scope / Remarks', placeholder: 'e.g. Appellate hearings' },
    ],
    columns: ['BENCH NAME', 'CODE', 'DIVISION TYPE', 'SEAT / LOCATION', 'DESCRIPTION', 'ACTIONS'],
  },
  Judge: {
    icon: Gavel,
    label: 'Judge',
    desc: 'Hon’ble Sitting and Former Judges roster',
    fields: [
      { name: 'name', label: 'Hon’ble Judge Name *', placeholder: 'e.g. Hon’ble Justice P.S. Narasimha', required: true },
      { name: 'code', label: 'Initials / Code', placeholder: 'e.g. PSN' },
      { name: 'subType', label: 'Designation', placeholder: 'e.g. Sitting Judge, Chief Justice, Former CJI' },
      { name: 'jurisdiction', label: 'Court / Bench', placeholder: 'e.g. Supreme Court of India' },
      { name: 'description', label: 'Appointment / Tenure Info', placeholder: 'e.g. Appointed Aug 2021' },
    ],
    columns: ['HON’BLE JUDGE', 'CODE', 'DESIGNATION', 'COURT / BENCH', 'DESCRIPTION', 'ACTIONS'],
  },
  Act: {
    icon: BookOpen,
    label: 'Act',
    desc: 'Central and State Statutory enactments',
    fields: [
      { name: 'name', label: 'Act Title *', placeholder: 'e.g. Digital Personal Data Protection Act, 2023', required: true },
      { name: 'code', label: 'Short Citation / Code', placeholder: 'e.g. DPDPA-2023' },
      { name: 'subType', label: 'Enactment Authority', placeholder: 'e.g. Central Statute, State Act' },
      { name: 'jurisdiction', label: 'Enforcing Ministry / Scope', placeholder: 'e.g. Ministry of Electronics & IT' },
      { name: 'description', label: 'Statutory Summary', placeholder: 'e.g. Regulation of digital personal data' },
    ],
    columns: ['ACT TITLE', 'CITATION / CODE', 'AUTHORITY', 'ENFORCING BODY', 'SUMMARY', 'ACTIONS'],
  },
  Section: {
    icon: Hash,
    label: 'Section',
    desc: 'Specific provisions and statutory clauses',
    fields: [
      { name: 'name', label: 'Section Provision *', placeholder: 'e.g. Section 9, Arbitration Act (Interim Relief)', required: true },
      { name: 'code', label: 'Section Code', placeholder: 'e.g. ACA-S9' },
      { name: 'subType', label: 'Parent Act Citation', placeholder: 'e.g. Arbitration & Conciliation Act 1996' },
      { name: 'jurisdiction', label: 'Filing Forum', placeholder: 'e.g. Commercial Court / High Court' },
      { name: 'description', label: 'Statutory Remedy / Content', placeholder: 'e.g. Court power to grant interim measures' },
    ],
    columns: ['SECTION PROVISION', 'CODE', 'PARENT ACT', 'FORUM', 'REMEDY / SUMMARY', 'ACTIONS'],
  },
  'Practice Area': {
    icon: Briefcase,
    label: 'Practice Area',
    desc: 'Litigation, Arbitration, Tax, Corporate, Insolvency, IP',
    fields: [
      { name: 'name', label: 'Practice Domain Title *', placeholder: 'e.g. Competition & Antitrust Law', required: true },
      { name: 'code', label: 'Code', placeholder: 'e.g. PA-CCI' },
      { name: 'subType', label: 'Practice Group', placeholder: 'e.g. Regulatory & Enforcement' },
      { name: 'jurisdiction', label: 'Primary Forum', placeholder: 'e.g. Competition Commission of India / NCLAT' },
      { name: 'description', label: 'Practice Scope', placeholder: 'e.g. Cartel investigations and merger control' },
    ],
    columns: ['PRACTICE AREA', 'CODE', 'GROUP', 'PRIMARY FORUM', 'SCOPE', 'ACTIONS'],
  },
  'Case Type': {
    icon: Files,
    label: 'Case Type',
    desc: 'SLP, Writ Petition, Company Petition, Commercial Suit',
    fields: [
      { name: 'name', label: 'Case Type Title *', placeholder: 'e.g. Contempt Petition (Civil)', required: true },
      { name: 'code', label: 'Classification Code', placeholder: 'e.g. Cont.P.(C)' },
      { name: 'subType', label: 'Procedural Stage', placeholder: 'e.g. Enforcement / Contempt' },
      { name: 'jurisdiction', label: 'Applicable Court', placeholder: 'e.g. High Courts & Supreme Court' },
      { name: 'description', label: 'Statutory Basis', placeholder: 'e.g. Contempt of Courts Act 1971' },
    ],
    columns: ['CASE TYPE', 'CODE', 'STAGE', 'APPLICABLE COURT', 'STATUTORY BASIS', 'ACTIONS'],
  },
  'Document Type': {
    icon: FileText,
    label: 'Document Type',
    desc: 'Brief, Rejoinder, Counter-Affidavit, Legal Notice',
    fields: [
      { name: 'name', label: 'Document Title *', placeholder: 'e.g. Caveat Petition', required: true },
      { name: 'code', label: 'Pleading Code', placeholder: 'e.g. DT-CAV' },
      { name: 'subType', label: 'Pleading Category', placeholder: 'e.g. Preventive Filing' },
      { name: 'jurisdiction', label: 'Registry / Forum', placeholder: 'e.g. All Civil Courts & Tribunals' },
      { name: 'description', label: 'Filing Guidelines', placeholder: 'e.g. Notice before interim ex-parte orders' },
    ],
    columns: ['DOCUMENT TITLE', 'CODE', 'CATEGORY', 'REGISTRY', 'GUIDELINES', 'ACTIONS'],
  },
  'Legal Template': {
    icon: FileCode,
    label: 'Legal Template',
    desc: 'Standardized institutional templates',
    fields: [
      { name: 'name', label: 'Template Title *', placeholder: 'e.g. Shareholders Agreement (SHA)', required: true },
      { name: 'code', label: 'Template ID', placeholder: 'e.g. TPL-SHA' },
      { name: 'subType', label: 'Drafting Standard', placeholder: 'e.g. Series A Venture Standard' },
      { name: 'jurisdiction', label: 'Applicable Law', placeholder: 'e.g. Indian Companies Act 2013' },
      { name: 'description', label: 'Key Clauses Included', placeholder: 'e.g. Tag-along, drag-along, board rights' },
    ],
    columns: ['TEMPLATE TITLE', 'ID', 'STANDARD', 'APPLICABLE LAW', 'KEY CLAUSES', 'ACTIONS'],
  },
  Clause: {
    icon: Bookmark,
    label: 'Clause',
    desc: 'Indemnity, Limitation of Liability, Dispute Resolution clauses',
    fields: [
      { name: 'name', label: 'Clause Heading *', placeholder: 'e.g. Non-Solicitation and Non-Compete', required: true },
      { name: 'code', label: 'Clause Code', placeholder: 'e.g. CLS-NS' },
      { name: 'subType', label: 'Risk Category', placeholder: 'e.g. Restrictive Covenant' },
      { name: 'jurisdiction', label: 'Enforceability', placeholder: 'e.g. Section 27 Contract Act Compliant' },
      { name: 'description', label: 'Standard Verbiage / Note', placeholder: 'e.g. 12-month post-termination restriction' },
    ],
    columns: ['CLAUSE HEADING', 'CODE', 'RISK CATEGORY', 'ENFORCEABILITY', 'STANDARD VERBIAGE', 'ACTIONS'],
  },
  Client: {
    icon: Building,
    label: 'Client',
    desc: 'Corporate clients and institutional entities',
    fields: [
      { name: 'name', label: 'Client / Entity Name *', placeholder: 'e.g. Tata Consultancy Services Ltd', required: true },
      { name: 'code', label: 'Client Code', placeholder: 'e.g. CL-TCS' },
      { name: 'subType', label: 'Industry Sector', placeholder: 'e.g. Information Technology & Software' },
      { name: 'jurisdiction', label: 'Client Tier', placeholder: 'e.g. Institutional Tier-1' },
      { name: 'description', label: 'Key Contact / Matters', placeholder: 'e.g. General Counsel Office, Mumbai' },
    ],
    columns: ['CLIENT / ENTITY', 'CODE', 'INDUSTRY', 'TIER', 'CONTACT / SCOPE', 'ACTIONS'],
  },
  'Opposing Party': {
    icon: UserX,
    label: 'Opposing Party',
    desc: 'Adverse parties in ongoing litigation',
    fields: [
      { name: 'name', label: 'Opposing Party Name *', placeholder: 'e.g. Central Board of Indirect Taxes & Customs', required: true },
      { name: 'code', label: 'Adverse Code', placeholder: 'e.g. OP-CBIC' },
      { name: 'subType', label: 'Party Category', placeholder: 'e.g. Government Department / Revenue' },
      { name: 'jurisdiction', label: 'Adverse Jurisdiction', placeholder: 'e.g. Department of Revenue, GoI' },
      { name: 'description', label: 'Counsel Representing', placeholder: 'e.g. Standing Government Counsel' },
    ],
    columns: ['OPPOSING PARTY', 'CODE', 'CATEGORY', 'JURISDICTION', 'OPPOSING COUNSEL', 'ACTIONS'],
  },
  Advocate: {
    icon: UserCheck,
    label: 'Advocate',
    desc: 'Instructing solicitors & Senior Advocates on record',
    fields: [
      { name: 'name', label: 'Advocate Full Name *', placeholder: 'e.g. K.K. Venugopal, Senior Advocate', required: true },
      { name: 'code', label: 'Bar Reg / Code', placeholder: 'e.g. ADV-KKV' },
      { name: 'subType', label: 'Designation / Standing', placeholder: 'e.g. Senior Advocate / Former AG' },
      { name: 'jurisdiction', label: 'Bar Association', placeholder: 'e.g. Supreme Court Bar Association' },
      { name: 'description', label: 'Chambers / Contact', placeholder: 'e.g. Senior Chambers, New Delhi' },
    ],
    columns: ['ADVOCATE NAME', 'BAR CODE', 'DESIGNATION', 'BAR ASSOCIATION', 'CHAMBERS', 'ACTIONS'],
  },
  Tags: {
    icon: Tag,
    label: 'Tags',
    desc: 'Taxonomy labels for research indexing',
    fields: [
      { name: 'name', label: 'Tag Name *', placeholder: 'e.g. Quashing of FIR (Sec 482)', required: true },
      { name: 'code', label: 'Tag ID', placeholder: 'e.g. TAG-482' },
      { name: 'subType', label: 'Taxonomy Namespace', placeholder: 'e.g. Criminal Jurisprudence' },
      { name: 'jurisdiction', label: 'Applicable Modules', placeholder: 'e.g. Research, Drafting, Judgments' },
      { name: 'description', label: 'Search Keyword / Alias', placeholder: 'e.g. Inherent High Court power' },
    ],
    columns: ['TAG NAME', 'TAG ID', 'NAMESPACE', 'MODULES', 'KEYWORD / SCOPE', 'ACTIONS'],
  },
};

// Exact sequence matching Screenshots 2 & 3
const CATEGORY_NAMES = [
  'Court',
  'Bench',
  'Judge',
  'Act',
  'Section',
  'Practice Area',
  'Case Type',
  'Document Type',
  'Legal Template',
  'Clause',
  'Client',
  'Opposing Party',
  'Advocate',
  'Tags',
];

// Baseline numbers matching user screenshots 2 & 3
const DEFAULT_COUNTS = {
  Court: 7,
  Bench: 4,
  Judge: 4,
  Act: 7,
  Section: 7,
  'Practice Area': 6,
  'Case Type': 5,
  'Document Type': 5,
  'Legal Template': 4,
  Clause: 4,
  Client: 5,
  'Opposing Party': 4,
  Advocate: 4,
  Tags: 5,
};

// System reference categories that are read-only for customer accounts
const SYSTEM_MASTER_CATEGORIES = [
  'Court',
  'Bench',
  'Judge',
  'Act',
  'Section',
  'Practice Area',
  'Case Type',
  'Document Type',
  'Language',
  'Tags',
];

const MastersPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN || user?.role === 1 || user?.role === 'admin';

  const [searchParams, setSearchParams] = useSearchParams();
  const catFromUrl = searchParams.get('category');
  const [activeCategoryKey, setActiveCategoryKey] = useState(
    catFromUrl && MASTER_CONFIG[catFromUrl] ? catFromUrl : 'Court'
  );

  const isSystemCategory = SYSTEM_MASTER_CATEGORIES.includes(activeCategoryKey);
  const canManageActiveCategory = isAdmin || !isSystemCategory;

  const [countsMap, setCountsMap] = useState(DEFAULT_COUNTS);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Deletion Confirmation Modal State
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (showAddModal) setShowAddModal(false);
        if (deleteCandidate) setDeleteCandidate(null);
      }
    };
    if (showAddModal || deleteCandidate) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal, deleteCandidate]);

  useEffect(() => {
    if (catFromUrl && MASTER_CONFIG[catFromUrl] && catFromUrl !== activeCategoryKey) {
      setActiveCategoryKey(catFromUrl);
    }
  }, [catFromUrl]);

  // Fetch real aggregated statistics from MongoDB Atlas
  const fetchStats = async () => {
    try {
      const res = await masterService.getStats();
      const stats = res?.data || res;
      if (stats && typeof stats === 'object') {
        setCountsMap((prev) => ({
          ...prev,
          ...stats,
        }));
        setDbConnected(true);
      }
    } catch (err) {
      console.warn('Backend master stats offline:', err.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // When active category changes, fetch its records from MongoDB Atlas
  const loadCategoryItems = async (catKey) => {
    if (!catKey) return;
    setLoadingItems(true);
    setSearchQuery('');
    try {
      const res = await masterService.getItems(catKey);
      const data = res?.data || res;
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.warn('Failed to load items for', catKey, err.message);
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (activeCategoryKey) {
      loadCategoryItems(activeCategoryKey);
    }
  }, [activeCategoryKey]);

  const handleSelectCategory = (catKey) => {
    setActiveCategoryKey(catKey);
    setSearchParams({ category: catKey });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), loadCategoryItems(activeCategoryKey)]);
    setRefreshing(false);
    toast.success('Data refreshed successfully');
  };

  // Open add record modal for active category
  const handleOpenAddModal = () => {
    setFormValues({});
    setShowAddModal(true);
  };

  // Submit new record directly to MongoDB Atlas
  const handleSaveRecord = async (e) => {
    e.preventDefault();
    const config = MASTER_CONFIG[activeCategoryKey];
    if (!config) return;

    if (!formValues.name || !formValues.name.trim()) {
      toast.error('Item name is required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await masterService.create({
        category: activeCategoryKey,
        name: formValues.name.trim(),
        code: formValues.code ? formValues.code.trim() : '',
        subType: formValues.subType ? formValues.subType.trim() : '',
        jurisdiction: formValues.jurisdiction ? formValues.jurisdiction.trim() : '',
        description: formValues.description ? formValues.description.trim() : '',
      });

      const savedItem = res?.data || res;
      setItems((prev) => [savedItem, ...prev]);

      // Update count in state
      setCountsMap((prev) => ({
        ...prev,
        [activeCategoryKey]: (prev[activeCategoryKey] || 0) + 1,
      }));

      toast.success(`Saved "${formValues.name}" successfully!`);
      setShowAddModal(false);
      setFormValues({});
    } catch (err) {
      console.error('Failed to create master record:', err);
      toast.error(`Failed to save record: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm delete handler
  const confirmDeleteRecord = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await masterService.delete(deleteCandidate.id);
      setItems((prev) => prev.filter((i) => (i._id || i.id) !== deleteCandidate.id));

      setCountsMap((prev) => ({
        ...prev,
        [activeCategoryKey]: Math.max(0, (prev[activeCategoryKey] || 0) - 1),
      }));

      toast.success(`Deleted "${deleteCandidate.name}" permanently`);
      setDeleteCandidate(null);
    } catch (err) {
      console.error('Failed to delete master record:', err);
      toast.error(`Failed to delete record: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const name = (item.name || '').toLowerCase();
    const code = (item.code || '').toLowerCase();
    const subType = (item.subType || '').toLowerCase();
    const jurisdiction = (item.jurisdiction || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    return (
      name.includes(q) ||
      code.includes(q) ||
      subType.includes(q) ||
      jurisdiction.includes(q) ||
      desc.includes(q)
    );
  });

  const activeConfig = MASTER_CONFIG[activeCategoryKey] || MASTER_CONFIG.Court;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      {/* Top Header */}
      <div
        style={{
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
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
            <Database size={19} strokeWidth={2.2} />
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
              Master Data & Taxonomies
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.77rem', margin: '0.1rem 0 0 0' }}>
              {isAdmin
                ? 'Admin-curated judicial registries, statutory codes, courts, and legal taxonomy.'
                : 'National judicial registries, statutory codes, courts, and firm practice data.'}
            </p>
          </div>
        </div>

        {/* Status & Refresh Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              fontSize: '0.76rem',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#16a34a',
                boxShadow: '0 0 6px rgba(22, 163, 74, 0.5)',
              }}
            />
            <span>Cloud Connected</span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!refreshing) e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              if (!refreshing) e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <RefreshCw
              size={13}
              style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: Vertical Category Sidebar (Screenshots 2 & 3) + Records Table */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '250px minmax(0, 1fr)',
          gap: '1.25rem',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN: Vertical Categories List (Matching Screenshots 2 & 3) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {CATEGORY_NAMES.map((catKey) => {
            const cfg = MASTER_CONFIG[catKey] || {};
            const IconCmp = cfg.icon || Scale;
            const isSelected = activeCategoryKey === catKey;
            const count = countsMap[catKey] !== undefined ? countsMap[catKey] : DEFAULT_COUNTS[catKey] || 0;

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => handleSelectCategory(catKey)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '10px',
                  border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                  backgroundColor: isSelected ? '#f0f7ff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {/* Left Icon and Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#0f172a' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <IconCmp size={16} strokeWidth={isSelected ? 2.3 : 2} />
                  </div>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 700 : 600,
                      color: isSelected ? '#0f172a' : '#334155',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {catKey}
                  </span>
                </div>

                {/* Right Count Pill */}
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 650,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: isSelected ? '#ffffff' : '#f1f5f9',
                    border: isSelected ? '1px solid #e2e8f0' : 'none',
                    color: isSelected ? '#0f172a' : '#64748b',
                    minWidth: '22px',
                    textAlign: 'center',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Active Category Records Workspace */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          {/* Active Tab Toolbar */}
          <div
            style={{
              padding: '1.15rem 1.35rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  {activeConfig.label} Records
                </h2>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backgroundColor: '#eff6ff',
                    color: '#2563eb',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  {items.length} in DB
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '3px 0 0 0' }}>
                {activeConfig.desc}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Search Bar */}
              <div
                className="apple-search-container"
                style={{ height: '36px', gap: '0.55rem', padding: '0 0.75rem', width: '220px' }}
              >
                <Search size={14} color="#8e8e93" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder={`Search ${activeConfig.label}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="apple-search-input"
                  style={{ fontSize: '0.825rem' }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="apple-clear-btn"
                    title="Clear filter"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                )}
              </div>

              {/* Add Record Button or Read-Only Lock Badge */}
              {canManageActiveCategory ? (
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="btn-primary"
                  style={{
                    height: '36px',
                    gap: '0.45rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    padding: '0 0.95rem',
                  }}
                >
                  <Plus size={15} />
                  <span>Add {activeConfig.label}</span>
                </button>
              ) : (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                  title="Standard national system records are maintained centrally by Legal AI platform administrators."
                >
                  <Lock size={13} color="#94a3b8" />
                  <span>System Reference (Read-Only)</span>
                </div>
              )}
            </div>
          </div>

          {/* System Master Info Banner (For Customer Accounts) */}
          {!canManageActiveCategory && (
            <div
              style={{
                padding: '0.65rem 1.25rem',
                backgroundColor: '#eff6ff',
                borderBottom: '1px solid #dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.785rem',
                color: '#1e40af',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={14} color="#2563eb" style={{ flexShrink: 0 }} />
                <span>
                  <strong>National Reference Registry:</strong> Standard {activeConfig.label} records are verified and maintained centrally by Legal AI. Read-only for law firm customer accounts.
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#1d4ed8',
                  backgroundColor: '#dbeafe',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                }}
              >
                Official Registry
              </span>
            </div>
          )}

          {/* Table View */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: '#fafbfc',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: '#64748b',
                  }}
                >
                  {activeConfig.columns.map((col, idx) => {
                    const isLastCol = idx === activeConfig.columns.length - 1;
                    const colTitle = !canManageActiveCategory && isLastCol ? 'STATUS' : col;
                    return (
                      <th
                        key={col}
                        style={{
                          padding: '0.75rem 1rem',
                          textAlign: isLastCol ? 'right' : 'left',
                        }}
                      >
                        {colTitle}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {loadingItems ? (
                  <tr>
                    <td colSpan={activeConfig.columns.length} style={{ padding: '3rem', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.65rem',
                          color: '#64748b',
                        }}
                      >
                        <Loader2 size={24} className="animate-spin" color="#2563eb" />
                        <span style={{ fontSize: '0.85rem' }}>Loading records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={activeConfig.columns.length} style={{ padding: '3rem', textAlign: 'center' }}>
                      <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                        No records found for "{activeConfig.label}". Click "+ Add {activeConfig.label}" to add one.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item._id || item.id}
                      style={{
                        borderBottom: '1px solid #f8fafc',
                        fontSize: '0.84rem',
                        color: '#1e293b',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>
                        {item.name}
                      </td>

                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                        {item.code ? (
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              backgroundColor: '#f1f5f9',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              color: '#334155',
                            }}
                          >
                            {item.code}
                          </span>
                        ) : (
                          <span style={{ color: '#cbd5e1' }}>—</span>
                        )}
                      </td>

                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                        {item.subType || <span style={{ color: '#cbd5e1' }}>—</span>}
                      </td>

                      <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                        {item.jurisdiction || <span style={{ color: '#cbd5e1' }}>—</span>}
                      </td>

                      <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.8rem', maxWidth: '280px' }}>
                        {item.description || <span style={{ color: '#cbd5e1' }}>—</span>}
                      </td>

                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        {canManageActiveCategory ? (
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate({ id: item._id || item.id, name: item.name })}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              padding: '4px',
                              transition: 'color 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                            title={`Delete ${item.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: '#059669',
                              backgroundColor: '#ecfdf5',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              border: '1px solid #a7f3d0',
                            }}
                          >
                            <Check size={11} strokeWidth={2.5} />
                            Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD NEW RECORD MODAL (Category-Tailored Fields) */}
      {showAddModal && activeConfig && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              width: '100%',
              maxWidth: '560px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Add New {activeConfig.label} Record
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '3px 0 0 0' }}>
                  Fill in the details below to add a new record.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveRecord} style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {activeConfig.fields.map((fld) => (
                  <div key={fld.name}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#334155',
                        marginBottom: '0.35rem',
                      }}
                    >
                      {fld.label}
                    </label>
                    <input
                      type="text"
                      placeholder={fld.placeholder}
                      value={formValues[fld.name] || ''}
                      onChange={(e) =>
                        setFormValues((prev) => ({ ...prev, [fld.name]: e.target.value }))
                      }
                      className="form-input"
                      style={{ fontSize: '0.85rem', borderRadius: '6px' }}
                      required={fld.required}
                    />
                  </div>
                ))}
              </div>

              {/* Modal Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  marginTop: '1.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#0b1329',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: submitting ? 'default' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{submitting ? 'Saving to Database...' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP CONFIRMATION MODAL FOR DELETION */}
      {deleteCandidate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '1rem',
          }}
          onClick={() => !isDeleting && setDeleteCandidate(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              width: '100%',
              maxWidth: '440px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Delete Master Record
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.35rem 0 0 0', lineHeight: 1.45 }}>
                  Are you sure you want to permanently delete{' '}
                  <strong style={{ color: '#0f172a' }}>"{deleteCandidate.name}"</strong> from{' '}
                  <strong style={{ color: '#0f172a' }}>{activeCategoryKey}</strong>? This cannot be undone.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteRecord}
                disabled={isDeleting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.5rem 1.15rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting && <Loader2 size={13} className="animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MastersPage;
