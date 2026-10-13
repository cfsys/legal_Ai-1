import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { adminApi } from '../services/api';
import {
  Database,
  Search,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  BookOpen,
  Scale,
  Gavel,
  Shield,
  FileText,
  Files,
  FileCode2,
  Bookmark,
  UserX,
  Globe,
  Hash,
  Briefcase,
  Layers,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  X,
} from 'lucide-react';
import ConfirmModal from '../components/modals/ConfirmModal';

// 15 Master Taxonomies with dynamic field mapping
const TAXONOMY_SCHEMAS = {
  Court: {
    name: 'Court',
    plural: 'Court Records',
    scopeDesc: 'Supreme Court, High Courts, Tribunals (NCLT, ITAT, SAT)',
    itemLabel: 'Court',
    icon: Scale,
    fields: {
      name: { label: 'Court Name *', placeholder: 'e.g. High Court of Gujarat' },
      code: { label: 'Court Code', placeholder: 'e.g. GHC' },
      tier: { label: 'Tier / Type', placeholder: 'e.g. High Court, Tribunal' },
      jurisdiction: { label: 'Jurisdiction / Seat', placeholder: 'e.g. State of Gujarat (Ahmedabad)' },
      description: { label: 'Scope / Description', placeholder: 'e.g. Constitutional and appellate seat' },
    },
    col1: 'COURT NAME',
    col2: 'CODE',
    col3: 'TIER / TYPE',
    col4: 'JURISDICTION',
    col5: 'DESCRIPTION',
  },
  Bench: {
    name: 'Bench',
    plural: 'Bench Records',
    scopeDesc: 'Principal Benches, Circuit Benches & Regional registries',
    itemLabel: 'Bench',
    icon: Layers,
    fields: {
      name: { label: 'Bench Name *', placeholder: 'e.g. Principal Bench New Delhi' },
      code: { label: 'Bench Code', placeholder: 'e.g. PB-ND' },
      tier: { label: 'Bench Type', placeholder: 'e.g. Principal, Circuit, Division' },
      jurisdiction: { label: 'State / Territorial Jurisdiction', placeholder: 'e.g. National Capital Region' },
      description: { label: 'Bench Particulars', placeholder: 'e.g. Roster and administrative registry' },
    },
    col1: 'BENCH NAME',
    col2: 'CODE',
    col3: 'BENCH TYPE',
    col4: 'TERRITORIAL JURISDICTION',
    col5: 'PARTICULARS',
  },
  Judge: {
    name: 'Judge',
    plural: 'Judge Records',
    scopeDesc: "Hon'ble Justices, Chief Justices & Presiding Officers",
    itemLabel: 'Judge',
    icon: Gavel,
    fields: {
      name: { label: "Hon'ble Judge Full Name *", placeholder: 'e.g. Honble Justice Sanjiv Khanna' },
      code: { label: 'Designation Code', placeholder: 'e.g. CJI / PUISNE' },
      tier: { label: 'Court Assigned', placeholder: 'e.g. Supreme Court of India' },
      jurisdiction: { label: 'Current Roster / Chamber', placeholder: 'e.g. Courtroom No. 1' },
      description: { label: 'Jurisprudence & Notes', placeholder: 'e.g. Specializes in commercial arbitration' },
    },
    col1: 'JUDGE NAME',
    col2: 'DESIGNATION',
    col3: 'COURT ASSIGNED',
    col4: 'ROSTER / CHAMBER',
    col5: 'NOTES',
  },
  Act: {
    name: 'Act',
    plural: 'Act Records',
    scopeDesc: 'Central Acts, State Legislation, Penal Codes & Statutory Rules',
    itemLabel: 'Act',
    icon: BookOpen,
    fields: {
      name: { label: 'Act Title *', placeholder: 'e.g. Arbitration and Conciliation Act, 1996' },
      code: { label: 'Short Citation / Code', placeholder: 'e.g. ACA-1996' },
      tier: { label: 'Enactment Authority', placeholder: 'e.g. Central Statute, State Act' },
      jurisdiction: { label: 'Enforcing Ministry / Scope', placeholder: 'e.g. Ministry of Law & Justice' },
      description: { label: 'Statutory Summary', placeholder: 'e.g. Primary legislation governing domestic & intl arbitration' },
    },
    col1: 'ACT TITLE',
    col2: 'CODE',
    col3: 'AUTHORITY',
    col4: 'MINISTRY / SCOPE',
    col5: 'SUMMARY',
  },
  Section: {
    name: 'Section',
    plural: 'Section Records',
    scopeDesc: 'Statutory Sections, Articles, Sub-clauses & Rules',
    itemLabel: 'Section',
    icon: Hash,
    fields: {
      name: { label: 'Section / Article Reference *', placeholder: 'e.g. Section 9 - Interim Measures' },
      code: { label: 'Parent Act Code', placeholder: 'e.g. ACA-1996' },
      tier: { label: 'Provision Category', placeholder: 'e.g. Substantive / Procedural' },
      jurisdiction: { label: 'Applicability', placeholder: 'e.g. Commercial Courts / Arbitral Tribunals' },
      description: { label: 'Statutory Context', placeholder: 'e.g. Powers of court to grant urgent interim protection' },
    },
    col1: 'SECTION REF',
    col2: 'PARENT ACT',
    col3: 'CATEGORY',
    col4: 'APPLICABILITY',
    col5: 'CONTEXT',
  },
  'Practice Area': {
    name: 'Practice Area',
    plural: 'Practice Area Records',
    scopeDesc: 'Litigation, Corporate, Intellectual Property & Advisory',
    itemLabel: 'Practice Area',
    icon: Briefcase,
    fields: {
      name: { label: 'Practice Area Name *', placeholder: 'e.g. Commercial Litigation' },
      code: { label: 'Area Code', placeholder: 'e.g. PA-CLDR' },
      tier: { label: 'Sector / Domain', placeholder: 'e.g. Dispute Resolution' },
      jurisdiction: { label: 'Target Jurisdiction', placeholder: 'e.g. Domestic / International' },
      description: { label: 'Scope of Practice', placeholder: 'e.g. Complex contractual disputes and shareholder battles' },
    },
    col1: 'PRACTICE AREA',
    col2: 'CODE',
    col3: 'SECTOR',
    col4: 'JURISDICTION',
    col5: 'SCOPE',
  },
  'Case Type': {
    name: 'Case Type',
    plural: 'Case Type Records',
    scopeDesc: 'Writ Petitions, SLPs, Commercial Suits, Company Petitions',
    itemLabel: 'Case Type',
    icon: Files,
    fields: {
      name: { label: 'Case Type Nomenclature *', placeholder: 'e.g. Special Leave Petition (Civil)' },
      code: { label: 'Filing Abbreviation', placeholder: 'e.g. SLP(C)' },
      tier: { label: 'Forum Level', placeholder: 'e.g. Supreme Court / High Court' },
      jurisdiction: { label: 'Jurisdiction Category', placeholder: 'e.g. Appellate / Original' },
      description: { label: 'Procedural Notes', placeholder: 'e.g. Discretionary appellate recourse under Article 136' },
    },
    col1: 'CASE TYPE',
    col2: 'ABBREVIATION',
    col3: 'FORUM LEVEL',
    col4: 'CATEGORY',
    col5: 'PROCEDURAL NOTES',
  },
  'Document Type': {
    name: 'Document Type',
    plural: 'Document Type Records',
    scopeDesc: 'Pleadings, Affidavits, Petitions, Applications & Notices',
    itemLabel: 'Document Type',
    icon: FileText,
    fields: {
      name: { label: 'Document Name *', placeholder: 'e.g. Vakalatnama & Memo of Appearance' },
      code: { label: 'Document Code', placeholder: 'e.g. DOC-VAK' },
      tier: { label: 'Document Class', placeholder: 'e.g. Authorization / Pleading' },
      jurisdiction: { label: 'Mandatory Court Stamp', placeholder: 'e.g. High Court / Supreme Court Stamp' },
      description: { label: 'Filing Guidelines', placeholder: 'e.g. Mandatory advocate authorization document' },
    },
    col1: 'DOCUMENT TYPE',
    col2: 'CODE',
    col3: 'CLASS',
    col4: 'STAMP SPECIFICATION',
    col5: 'FILING GUIDELINES',
  },
  'Legal Template': {
    name: 'Legal Template',
    plural: 'Legal Template Records',
    scopeDesc: 'Automated Drafting Precedents & Contractual Master Formats',
    itemLabel: 'Template',
    icon: FileCode2,
    fields: {
      name: { label: 'Template Title *', placeholder: 'e.g. Master Services Agreement (MSA)' },
      code: { label: 'Template ID / Code', placeholder: 'e.g. TPL-MSA' },
      tier: { label: 'Commercial Classification', placeholder: 'e.g. Corporate / IT Contracts' },
      jurisdiction: { label: 'Governing Law', placeholder: 'e.g. Indian Contract Act, 1872' },
      description: { label: 'Template Scope & Purpose', placeholder: 'e.g. Enterprise service contract with SLA terms' },
    },
    col1: 'TEMPLATE TITLE',
    col2: 'CODE',
    col3: 'CLASSIFICATION',
    col4: 'GOVERNING LAW',
    col5: 'PURPOSE',
  },
  Clause: {
    name: 'Clause',
    plural: 'Clause Records',
    scopeDesc: 'Pre-Approved Contractual & Indemnity Clauses',
    itemLabel: 'Clause',
    icon: Bookmark,
    fields: {
      name: { label: 'Clause Name *', placeholder: 'e.g. Governing Law & Dispute Resolution' },
      code: { label: 'Clause Reference Code', placeholder: 'e.g. CLS-DR' },
      tier: { label: 'Risk Rating / Type', placeholder: 'e.g. Standard Neutral / Multi-Tier' },
      jurisdiction: { label: 'Clause Family', placeholder: 'e.g. Dispute Resolution & Jurisdiction' },
      description: { label: 'Clause Draft Text / Scope', placeholder: 'e.g. Three-tier clause specifying arbitration seat' },
    },
    col1: 'CLAUSE TITLE',
    col2: 'CODE',
    col3: 'RISK TYPE',
    col4: 'FAMILY',
    col5: 'SCOPE',
  },
  'Opposing Party': {
    name: 'Opposing Party',
    plural: 'Opposing Party Records',
    scopeDesc: 'Counterparties, Respondents & Appellants',
    itemLabel: 'Opposing Party',
    icon: UserX,
    fields: {
      name: { label: 'Opposing Party Name *', placeholder: 'e.g. Union of India (Ministry of Finance)' },
      code: { label: 'Party Code', placeholder: 'e.g. OP-UOI-FIN' },
      tier: { label: 'Entity Classification', placeholder: 'e.g. Central Government Body' },
      jurisdiction: { label: 'Standing Counsel / State', placeholder: 'e.g. Attorney General / ASG' },
      description: { label: 'Adversary Profile Notes', placeholder: 'e.g. Department of Revenue, Ministry of Finance' },
    },
    col1: 'OPPOSING PARTY',
    col2: 'CODE',
    col3: 'CLASSIFICATION',
    col4: 'COUNSEL',
    col5: 'PROFILE',
  },
};

const ORDERED_TAXONOMY_KEYS = [
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
  'Opposing Party',
];

const styles = `
  .masters-workbench-page {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    height: 100%;
    flex: 1;
    min-height: 0;
    color: #172033;
    font-family: inherit;
    position: relative;
    overflow: hidden;
  }

  .masters-workbench-page *,
  .masters-workbench-page *::before,
  .masters-workbench-page *::after {
    box-sizing: border-box;
  }

  /* Header */
  .masters-workbench-page .mw-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .masters-workbench-page .mw-header-title h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 750;
    color: #172033;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .masters-workbench-page .mw-header-title p {
    margin: 3px 0 0;
    font-size: 12px;
    color: #64748b;
  }

  .masters-workbench-page .mw-header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Executive Stats Strip */
  .masters-workbench-page .mw-stats-strip {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .masters-workbench-page .mw-stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    font-size: 12px;
    color: #475569;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  }

  .masters-workbench-page .mw-stat-pill strong {
    color: #0f172a;
    font-weight: 700;
  }

  .masters-workbench-page .mw-pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #059669;
    display: inline-block;
  }

  /* Split Workbench Layout (Non-scrollable container, internal viewport scrolling only) */
  .masters-workbench-page .mw-workbench-body {
    display: flex;
    gap: 14px;
    flex: 1;
    min-height: 0;
    width: 100%;
    overflow: hidden;
  }

  /* Left Rail: Taxonomy Category Selector */
  .masters-workbench-page .mw-left-rail {
    width: 260px;
    flex-shrink: 0;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .masters-workbench-page .mw-rail-header {
    padding: 12px 14px;
    border-bottom: 1px solid #eef2f6;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
  }

  .masters-workbench-page .mw-rail-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .masters-workbench-page .mw-rail-title-row span {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
  }

  .masters-workbench-page .mw-rail-badge {
    font-size: 11px;
    font-weight: 700;
    background: #f1f5f9;
    color: #334155;
    padding: 2px 7px;
    border-radius: 999px;
    border: 1px solid #e2e8f0;
  }

  .masters-workbench-page .mw-rail-search {
    position: relative;
    width: 100%;
  }

  .masters-workbench-page .mw-rail-search input {
    width: 100%;
    height: 32px;
    padding-left: 28px;
    padding-right: 8px;
    font-size: 11.5px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    outline: none;
    background: #f8fafc;
    color: #0f172a;
    transition: all 0.15s ease;
  }

  .masters-workbench-page .mw-rail-search input:focus {
    border-color: #0f172a;
    background: #ffffff;
  }

  .masters-workbench-page .mw-rail-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .masters-workbench-page .mw-rail-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: transparent;
    color: #334155;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
  }

  .masters-workbench-page .mw-rail-item:hover {
    background: #f8fafc;
    color: #0f172a;
    border-color: #e2e8f0;
  }

  .masters-workbench-page .mw-rail-item.active {
    background: #f1f5f9;
    color: #0f172a;
    border-color: #cbd5e1;
    font-weight: 700;
  }

  .masters-workbench-page .mw-rail-item-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .masters-workbench-page .mw-rail-item-icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: #f1f5f9;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .masters-workbench-page .mw-rail-item.active .mw-rail-item-icon {
    background: #0f172a;
    color: #ffffff;
  }

  .masters-workbench-page .mw-rail-item-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .masters-workbench-page .mw-rail-item-count {
    font-size: 11px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 999px;
    background: #f1f5f9;
    color: #64748b;
  }

  .masters-workbench-page .mw-rail-item.active .mw-rail-item-count {
    background: #ffffff;
    color: #0f172a;
    border: 1px solid #cbd5e1;
  }

  /* Right Panel: Data Table View */
  .masters-workbench-page .mw-main-panel {
    flex: 1;
    min-width: 0;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .masters-workbench-page .mw-table-header {
    padding: 12px 18px;
    border-bottom: 1px solid #eef2f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    flex-wrap: wrap;
    background: #ffffff;
  }

  .masters-workbench-page .mw-table-title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .masters-workbench-page .mw-table-title-avatar {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .masters-workbench-page .mw-table-title-text h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 750;
    color: #0f172a;
    letter-spacing: -0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .masters-workbench-page .mw-table-title-text p {
    margin: 2px 0 0;
    font-size: 11.5px;
    color: #64748b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .masters-workbench-page .mw-table-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .masters-workbench-page .mw-table-search {
    position: relative;
    width: 250px;
  }

  .masters-workbench-page .mw-table-search input {
    width: 100%;
    height: 34px;
    padding-left: 32px;
    padding-right: 10px;
    font-size: 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    outline: none;
    background: #f8fafc;
    color: #0f172a;
    transition: all 0.15s ease;
  }

  .masters-workbench-page .mw-table-search input:focus {
    border-color: #4f46e5;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
  }

  .masters-workbench-page .mw-table-viewport {
    flex: 1;
    min-height: 0;
    overflow-x: auto;
    overflow-y: auto;
    background: #ffffff;
  }

  .masters-workbench-page .mw-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 12.5px;
  }

  .masters-workbench-page .mw-table thead {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #f8fafc;
  }

  .masters-workbench-page .mw-table th {
    padding: 9px 16px;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }

  .masters-workbench-page .mw-table td {
    padding: 10px 16px;
    border-bottom: 1px solid #f1f5f9;
    color: #1e293b;
    vertical-align: middle;
  }

  .masters-workbench-page .mw-table tbody tr:hover {
    background-color: #f8fafc;
  }

  .masters-workbench-page .mw-table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-top: 1px solid #eef2f6;
    background: #ffffff;
    font-size: 12px;
    color: #64748b;
    flex-wrap: wrap;
    gap: 8px;
    flex-shrink: 0;
  }

  /* Form Modal */
  .mw-modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(4px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: mwFadeIn 0.15s ease-out;
  }

  @keyframes mwFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .mw-modal-box {
    background: #ffffff;
    border-radius: 12px;
    width: 100%;
    max-width: 520px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid #e2e8f0;
    overflow: visible;
  }

  .mw-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 18px;
    border-bottom: 1px solid #eef2f6;
    background: #ffffff;
    border-radius: 12px 12px 0 0;
  }

  .mw-modal-body {
    padding: 14px 18px;
    overflow: visible;
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .mw-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 10px 18px;
    border-top: 1px solid #eef2f6;
    background: #f8fafc;
    border-radius: 0 0 12px 12px;
  }

  .mw-form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mw-form-label {
    font-size: 11.5px;
    font-weight: 650;
    color: #334155;
  }

  .mw-form-input {
    width: 100%;
    height: 34px;
    padding: 0 10px;
    border: 1px solid #dce2ed;
    border-radius: 6px;
    font-size: 12px;
    color: #0f172a;
    outline: none;
    transition: all 0.15s ease;
    box-sizing: border-box;
  }

  .mw-form-input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
  }

  .mw-form-textarea {
    width: 100%;
    height: 50px;
    min-height: 50px;
    padding: 6px 10px;
    border: 1px solid #dce2ed;
    border-radius: 6px;
    font-size: 12px;
    color: #0f172a;
    outline: none;
    resize: none;
    box-sizing: border-box;
  }
    min-height: 60px;
  }

  .mw-form-textarea:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
  }
`;

export default function MastersView() {
  const { addToast, user } = useAdmin();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const saved = localStorage.getItem('legal_ai_master_cat');
    return (saved && saved !== 'Language' && ORDERED_TAXONOMY_KEYS.includes(saved)) ? saved : 'Court';
  });

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'Language') {
      localStorage.setItem('legal_ai_master_cat', selectedCategory);
    }
  }, [selectedCategory]);
  const [railSearch, setRailSearch] = useState('');
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);

  // Close add/edit modal on Escape
  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [showModal]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input to query backend directly
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 280);
    return () => clearTimeout(timer);
  }, [search]);

  // Super Admin & permission calculation
  const isSuperAdmin =
    !user ||
    user.role === 1 ||
    user.role === 'Super Admin' ||
    user.roleName === 'Super Admin' ||
    user.code === 'SUPER_ADM';

  const masterPerm = user?.permissions?.modules?.masters;
  const catPerm = (() => {
    if (isSuperAdmin) return null;
    const categoriesMap = masterPerm?.categories || {};
    if (categoriesMap[selectedCategory]) return categoriesMap[selectedCategory];
    return user?.permissions?.modules?.['masters_' + selectedCategory] || null;
  })();

  const canCreate = isSuperAdmin || (
    catPerm
      ? Boolean(catPerm.create ?? catPerm.canCreate ?? false)
      : (masterPerm
          ? (masterPerm.access === 'full' || masterPerm.canCreate === true || masterPerm.create === true)
          : (user?.permissions?.canCreate ?? false))
  );

  const canEdit = isSuperAdmin || (
    catPerm
      ? Boolean(catPerm.edit ?? catPerm.canEdit ?? false)
      : (masterPerm
          ? (masterPerm.access === 'full' || masterPerm.canEdit === true || masterPerm.edit === true)
          : (user?.permissions?.canEdit ?? false))
  );

  const canDelete = isSuperAdmin || (
    catPerm
      ? Boolean(catPerm.delete ?? catPerm.canDelete ?? false)
      : (masterPerm
          ? (masterPerm.access === 'full' || masterPerm.canDelete === true || masterPerm.delete === true)
          : (user?.permissions?.canDelete ?? false))
  );

  const [formData, setFormData] = useState({
    category: 'Court',
    name: '',
    code: '',
    tier: '',
    jurisdiction: '',
    description: '',
    isActive: true,
  });

  // Load Categories & Counts
  const loadCategories = useCallback(async () => {
    try {
      const res = await adminApi.getMasterCategories();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      console.warn('Failed to load categories:', err.message);
    }
  }, []);

  // Load Master Data Items from Backend with Pagination
  const loadItems = useCallback(async () => {
    if (!selectedCategory) return;
    setLoading(true);
    try {
      const res = await adminApi.getMasterData({
        category: selectedCategory,
        search: debouncedSearch,
        page: currentPage,
        limit: pageSize,
      });
      if (res.success) {
        const list = Array.isArray(res.items)
          ? res.items
          : (Array.isArray(res.items?.items) ? res.items.items : (Array.isArray(res.data) ? res.data : []));
        setItems(list);
        const total = res.total ?? list.length;
        setTotalCount(total);
        setTotalPages(res.totalPages ?? Math.max(1, Math.ceil(total / pageSize)));
      }
    } catch (err) {
      addToast('Failed to load master records: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearch, currentPage, pageSize, addToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleRefresh = async () => {
    setIsRefreshed(false);
    await loadCategories();
    await loadItems();
    setIsRefreshed(true);
    setTimeout(() => setIsRefreshed(false), 2000);
  };

  const handleOpenCreate = () => {
    if (!canCreate) {
      addToast(`Access Restricted: Your assigned role does not have permission to add ${selectedCategory} records.`, 'error');
      return;
    }
    setEditingItem(null);
    setFormData({
      category: selectedCategory,
      name: '',
      code: '',
      tier: '',
      jurisdiction: '',
      description: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    if (!canEdit) {
      addToast(`Access Restricted: Your assigned role does not have permission to edit records.`, 'error');
      return;
    }
    setEditingItem(item);
    setFormData({
      category: item.category || selectedCategory,
      name: item.name || '',
      code: item.code || '',
      tier: item.tier || '',
      jurisdiction: item.jurisdiction || '',
      description: item.description || '',
      isActive: item.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Name is required', 'error');
      return;
    }

    try {
      if (editingItem) {
        const res = await adminApi.updateMasterData(editingItem._id, formData);
        if (res.success) {
          addToast(`Updated record '${formData.name}'`);
        }
      } else {
        const res = await adminApi.createMasterData(formData);
        if (res.success) {
          addToast(`Created record '${formData.name}' in ${formData.category}`);
        }
      }
      setShowModal(false);
      loadCategories();
      loadItems();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = (item) => {
    if (!canDelete) {
      addToast(`Access Restricted: Cannot delete ${selectedCategory} records.`, 'error');
      return;
    }
    setConfirmDeleteItem(item);
  };

  const executeDeleteRecord = async () => {
    if (!confirmDeleteItem) return;
    const item = confirmDeleteItem;
    setConfirmDeleteItem(null);
    try {
      const res = await adminApi.deleteMasterData(item._id);
      if (res.success) {
        addToast(`Deleted record '${item.name}'`);
        loadCategories();
        loadItems();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Map category counts
  const categoryCountMap = useMemo(() => {
    const map = {};
    (Array.isArray(categories) ? categories : []).forEach((c) => {
      if (c && c.category) {
        map[c.category] = Number(c.count) || 0;
        map[c.category.toLowerCase()] = Number(c.count) || 0;
      }
    });
    // Ensure the currently selected category reflects active loaded items
    if (selectedCategory && Array.isArray(items) && items.length > 0) {
      if (!map[selectedCategory] || map[selectedCategory] < items.length) {
        map[selectedCategory] = items.length;
      }
    }
    return map;
  }, [categories, selectedCategory, items]);

  const currentSchema = TAXONOMY_SCHEMAS[selectedCategory] || TAXONOMY_SCHEMAS['Court'];
  const CurrentIcon = currentSchema.icon || Database;

  // Filter categories in rail
  const railCategories = useMemo(() => {
    const q = railSearch.toLowerCase().trim();
    return ORDERED_TAXONOMY_KEYS.filter((key) => {
      if (!q) return true;
      return key.toLowerCase().includes(q);
    });
  }, [railSearch]);

  // Table items from backend
  const safeItems = Array.isArray(items) ? items : (Array.isArray(items?.items) ? items.items : []);
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = totalCount === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + safeItems.length, totalCount);
  const paginatedItems = safeItems;

  const totalRecordsAll = useMemo(() => {
    const sum = (Array.isArray(categories) ? categories : []).reduce((acc, c) => acc + (Number(c?.count) || 0), 0);
    return sum > 0 ? sum : (Array.isArray(items) ? items.length : 0);
  }, [categories, items]);

  return (
    <div className="masters-workbench-page">
      <style>{styles}</style>

      {/* Header */}
      <div className="mw-header" style={{ marginBottom: '16px' }}>
        <div className="mw-header-title">
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', margin: 0 }}>
            Master Data & Legal Taxonomies
          </h1>
        </div>
      </div>

      {/* Master-Detail Split Workbench */}
      <div className="mw-workbench-body">
        {/* Left Category Selector Rail */}
        <div className="mw-left-rail">
          <div className="mw-rail-header">
            <div className="mw-rail-title-row">
              <span>Categories</span>
              <span className="mw-rail-badge">{ORDERED_TAXONOMY_KEYS.length} Master Types</span>
            </div>

            <div className="mw-rail-search">
              <Search
                size={12}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                placeholder="Filter categories..."
                value={railSearch}
                onChange={(e) => setRailSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mw-rail-list">
            {railCategories.map((key) => {
              const conf = TAXONOMY_SCHEMAS[key];
              const IconComp = conf.icon || Database;
              const isActive = selectedCategory === key;
              const count = categoryCountMap[key] || 0;

              return (
                <button
                  key={key}
                  type="button"
                  className={`mw-rail-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(key);
                    setSearch('');
                    setCurrentPage(1);
                  }}
                >
                  <div className="mw-rail-item-left">
                    <div className="mw-rail-item-icon">
                      <IconComp size={13} />
                    </div>
                    <span className="mw-rail-item-text">{conf.name}</span>
                  </div>
                  <span className="mw-rail-item-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Table Panel */}
        <div className="mw-main-panel">
          {/* Table Header */}
          <div className="mw-table-header">
            <div className="mw-table-title-wrap">
              <div className="mw-table-title-avatar">
                <CurrentIcon size={18} />
              </div>
              <div className="mw-table-title-text">
                <h3>
                  <span>{currentSchema.plural}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {totalCount} Records
                  </span>
                </h3>
                <p>{currentSchema.scopeDesc}</p>
              </div>
            </div>

            <div className="mw-table-controls">
              <div className="mw-table-search">
                <Search
                  size={13}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="text"
                  placeholder={`Search ${currentSchema.name.toLowerCase()} records...`}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {canCreate && (
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  style={{
                    height: '38px',
                    padding: '0 16px',
                    fontSize: '13px',
                    fontWeight: 650,
                    gap: '6px',
                    borderRadius: '8px',
                    backgroundColor: '#4338ca',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    boxShadow: '0 1px 2px rgba(67, 56, 202, 0.2)',
                  }}
                >
                  <Plus size={16} />
                  <span>Add {currentSchema.itemLabel}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRefresh}
                title="Refresh master data"
                disabled={loading}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Table Viewport */}
          <div className={`mw-table-viewport ${isRefreshed ? 'data-refreshed-pulse' : ''}`}>
            <table className="mw-table">
              <thead>
                <tr>
                  <th style={{ width: '280px' }}>{currentSchema.col1 || 'NAME / TITLE'}</th>
                  <th style={{ width: '130px' }}>{currentSchema.col2 || 'CODE'}</th>
                  <th style={{ width: '170px' }}>{currentSchema.col3 || 'TIER / TYPE'}</th>
                  <th style={{ width: '170px' }}>{currentSchema.col4 || 'JURISDICTION'}</th>
                  <th>{currentSchema.col5 || 'DESCRIPTION'}</th>
                  <th style={{ width: '90px' }}>STATUS</th>
                  <th style={{ width: '80px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading && items.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Loading {currentSchema.plural}...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      No {currentSchema.name.toLowerCase()} records found matching your query.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => (
                    <tr key={item._id || item.id}>
                      {/* Name */}
                      <td>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>
                          {item.name}
                        </span>
                      </td>

                      {/* Code */}
                      <td>
                        {item.code ? (
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '11px',
                              fontWeight: 650,
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            {item.code}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>

                      {/* Tier / Type */}
                      <td>
                        {item.tier ? (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#f8fafc',
                              color: '#334155',
                              border: '1px solid #e2e8f0',
                              display: 'inline-block',
                            }}
                          >
                            {item.tier}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>

                      {/* Jurisdiction */}
                      <td>
                        <span style={{ fontSize: '12px', color: '#475569' }}>
                          {item.jurisdiction || '-'}
                        </span>
                      </td>

                      {/* Description */}
                      <td>
                        <span
                          style={{
                            fontSize: '11.5px',
                            color: '#64748b',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                          title={item.description}
                        >
                          {item.description || '-'}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: item.isActive !== false ? '#059669' : '#94a3b8',
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 500,
                              color: item.isActive !== false ? '#0f172a' : '#64748b',
                            }}
                          >
                            {item.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              title="Edit record"
                              style={{
                                width: '28px',
                                height: '28px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                background: '#ffffff',
                                color: '#475569',
                                cursor: 'pointer',
                              }}
                            >
                              <Edit2 size={12} />
                            </button>
                          )}

                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              title="Delete record"
                              style={{
                                width: '28px',
                                height: '28px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '6px',
                                border: '1px solid #fecdd3',
                                background: '#ffffff',
                                color: '#e11d48',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CFSYS Table Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderTop: '1px solid #f1f5f9',
            background: '#ffffff',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Showing <span style={{ fontWeight: 700, color: '#1e293b' }}>{totalCount === 0 ? '0' : `${startIndex + 1}-${endIndex}`}</span> of {totalCount}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    height: '32px',
                    padding: '0 8px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    background: '#ffffff',
                    fontWeight: 600,
                    color: '#1e293b',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
                    color: safePage <= 1 ? '#cbd5e1' : '#64748b',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                  Page {safePage} / {Math.max(1, totalPages)}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
                    color: safePage >= totalPages ? '#cbd5e1' : '#64748b',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="mw-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="mw-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="mw-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: '#f8fafc',
                    color: '#0f172a',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CurrentIcon size={16} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    {editingItem ? `Edit ${currentSchema.itemLabel}` : `Add New ${currentSchema.itemLabel}`}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="mw-modal-body">
                {/* Name */}
                <div className="mw-form-group">
                  <label className="mw-form-label">{currentSchema.fields.name.label}</label>
                  <input
                    type="text"
                    className="mw-form-input"
                    required
                    placeholder={currentSchema.fields.name.placeholder}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Code & Tier in two columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="mw-form-group">
                    <label className="mw-form-label">{currentSchema.fields.code.label}</label>
                    <input
                      type="text"
                      className="mw-form-input"
                      placeholder={currentSchema.fields.code.placeholder}
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                  </div>

                  <div className="mw-form-group">
                    <label className="mw-form-label">{currentSchema.fields.tier.label}</label>
                    <input
                      type="text"
                      className="mw-form-input"
                      placeholder={currentSchema.fields.tier.placeholder}
                      value={formData.tier}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    />
                  </div>
                </div>

                {/* Jurisdiction */}
                <div className="mw-form-group">
                  <label className="mw-form-label">{currentSchema.fields.jurisdiction.label}</label>
                  <input
                    type="text"
                    className="mw-form-input"
                    placeholder={currentSchema.fields.jurisdiction.placeholder}
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="mw-form-group">
                  <label className="mw-form-label">{currentSchema.fields.description.label}</label>
                  <textarea
                    className="mw-form-textarea"
                    placeholder={currentSchema.fields.description.placeholder}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Active Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="isActiveCheckbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ accentColor: '#4f46e5' }}
                  />
                  <label htmlFor="isActiveCheckbox" style={{ fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    Active Record
                  </label>
                </div>
              </div>

              <div className="mw-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  style={{ height: '34px', padding: '0 12px', fontSize: '11.5px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ height: '34px', padding: '0 16px', fontSize: '11.5px' }}
                >
                  {editingItem ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteItem && (
        <ConfirmModal
          isOpen={Boolean(confirmDeleteItem)}
          onClose={() => setConfirmDeleteItem(null)}
          onConfirm={executeDeleteRecord}
          title={`Delete ${selectedCategory} Record`}
          message={`Are you sure you want to permanently remove '${confirmDeleteItem.name}'? This action cannot be undone.`}
          confirmLabel="Delete Record"
          isDanger={true}
        />
      )}
    </div>
  );
}
