const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { ROLES, USER_STATUS, DEFAULT_ADMIN_PERMISSIONS, DEFAULT_CUSTOMER_PERMISSIONS, PERMISSIONS } = require('../constants/enums');

// Hash helper
const hashPass = (pw) => bcrypt.hashSync(pw, 10);
const password123Hash = hashPass('password123');
const admin123Hash = hashPass('admin123');
const pass123456Hash = hashPass('123456');

// 1. LAW FIRMS
const cleanFirms = [
  {
    name: 'Shardul Amarchand Mangaldas & Co',
    domain: 'samlaw.in',
    tier: 'Enterprise',
    seatsLimit: 60,
    creditsTotal: 120000,
    creditsUsed: 34500,
    status: 'Active',
    contactEmail: 'contact@samlaw.in',
    billingCycle: 'Annual',
    city: 'New Delhi',
    state: 'Delhi',
    aiModelAllowed: ['GPT-4o Legal Fine-tuned', 'Claude 3.5 Sonnet (Legal Specialist)', 'LegalBERT-India v4.2', 'DeepSeek-R1-Law (Chain-of-Thought)'],
  },
  {
    name: 'Cyril Amarchand Mangaldas',
    domain: 'cyrilshroff.com',
    tier: 'Enterprise',
    seatsLimit: 50,
    creditsTotal: 100000,
    creditsUsed: 28400,
    status: 'Active',
    contactEmail: 'contact@cyrilshroff.com',
    billingCycle: 'Annual',
    city: 'Mumbai',
    state: 'Maharashtra',
    aiModelAllowed: ['GPT-4o Legal Fine-tuned', 'Claude 3.5 Sonnet (Legal Specialist)', 'LegalBERT-India v4.2', 'DeepSeek-R1-Law (Chain-of-Thought)'],
  },
  {
    name: 'Khaitan & Co',
    domain: 'khaitanco.com',
    tier: 'Enterprise',
    seatsLimit: 45,
    creditsTotal: 85000,
    creditsUsed: 21900,
    status: 'Active',
    contactEmail: 'mumbai@khaitanco.com',
    billingCycle: 'Annual',
    city: 'Mumbai',
    state: 'Maharashtra',
    aiModelAllowed: ['GPT-4o Legal Fine-tuned', 'LegalBERT-India v4.2'],
  },
  {
    name: 'Trilegal Partners',
    domain: 'trilegal.com',
    tier: 'Law Firm Pro',
    seatsLimit: 30,
    creditsTotal: 50000,
    creditsUsed: 16800,
    status: 'Active',
    contactEmail: 'info@trilegal.com',
    billingCycle: 'Monthly',
    city: 'Bengaluru',
    state: 'Karnataka',
    aiModelAllowed: ['GPT-4o Legal Fine-tuned', 'LegalBERT-India v4.2'],
  },
  {
    name: 'AZB & Partners',
    domain: 'azbpartners.com',
    tier: 'Enterprise',
    seatsLimit: 40,
    creditsTotal: 75000,
    creditsUsed: 22100,
    status: 'Active',
    contactEmail: 'delhi@azbpartners.com',
    billingCycle: 'Annual',
    city: 'New Delhi',
    state: 'Delhi',
    aiModelAllowed: ['GPT-4o Legal Fine-tuned', 'Claude 3.5 Sonnet (Legal Specialist)', 'LegalBERT-India v4.2'],
  },
  {
    name: 'Singh & Singh IP Chambers',
    domain: 'singhlegal.in',
    tier: 'Boutique',
    seatsLimit: 12,
    creditsTotal: 20000,
    creditsUsed: 4300,
    status: 'Active',
    contactEmail: 'office@singhlegal.in',
    billingCycle: 'Monthly',
    city: 'New Delhi',
    state: 'Delhi',
    aiModelAllowed: ['GPT-4o Legal Fine-tuned'],
  },
];

// Panel-Wise Module list
const ALL_MODULE_IDS = ['overview', 'users', 'masters', 'subadmins', 'roles'];

const fullModulePermissions = {};
ALL_MODULE_IDS.forEach(m => {
  fullModulePermissions[m] = { read: true, create: true, edit: true, delete: true, access: 'full' };
});

const complianceModulePermissions = {};
ALL_MODULE_IDS.forEach(m => {
  if (['overview', 'masters'].includes(m)) {
    complianceModulePermissions[m] = { read: true, create: true, edit: true, delete: false, access: 'full' };
  } else {
    complianceModulePermissions[m] = { read: true, create: false, edit: false, delete: false, access: 'view' };
  }
});

const operationsModulePermissions = {};
ALL_MODULE_IDS.forEach(m => {
  if (['overview', 'users', 'masters'].includes(m)) {
    operationsModulePermissions[m] = { read: true, create: true, edit: true, delete: true, access: 'full' };
  } else {
    operationsModulePermissions[m] = { read: false, create: false, edit: false, delete: false, access: 'none' };
  }
});

const mastersManagerPermissions = {};
ALL_MODULE_IDS.forEach(m => {
  if (['overview', 'masters'].includes(m)) {
    mastersManagerPermissions[m] = { read: true, create: true, edit: true, delete: true, access: 'full' };
  } else {
    mastersManagerPermissions[m] = { read: false, create: false, edit: false, delete: false, access: 'none' };
  }
});

// 2. ROLES
const cleanRoles = [
  {
    name: 'Super Admin',
    code: 'SUP_ADM',
    description: 'Unrestricted master access with full CRUD privileges across all panel modules.',
    permissions: {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      modules: fullModulePermissions,
    },
    isSystem: true,
    status: 'Active',
  },
  {
    name: 'Compliance Officer',
    code: 'COMPL_OFF',
    description: 'Governance authority responsible for audit oversight and master legal data taxonomy validation.',
    permissions: {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      modules: complianceModulePermissions,
    },
    isSystem: false,
    status: 'Active',
  },
  {
    name: 'Operations Manager',
    code: 'OPS_MGR',
    description: 'Oversees advocate directory management, verification status, and day-to-day operations.',
    permissions: {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      modules: operationsModulePermissions,
    },
    isSystem: false,
    status: 'Active',
  },
  {
    name: 'Master Data Lead',
    code: 'MASTER_LEAD',
    description: 'Specialist managing Indian court hierarchy, benches, judge profiles, and legal practice taxonomies.',
    permissions: {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      modules: mastersManagerPermissions,
    },
    isSystem: false,
    status: 'Active',
  },
];

// 3. AI MODELS
const cleanAiModels = [
  {
    name: 'GPT-4o Legal Fine-tuned',
    provider: 'OpenAI / Azure Gov',
    costPer1kTokens: '0.04 Credits',
    latency: '1.1s',
    contextWindow: '128k',
    status: 'Operational',
    primaryUse: 'Complex cross-examination, petition drafting, and appellate arguments',
  },
  {
    name: 'Claude 3.5 Sonnet (Legal Specialist)',
    provider: 'Anthropic Bedrock',
    costPer1kTokens: '0.03 Credits',
    latency: '0.9s',
    contextWindow: '200k',
    status: 'Operational',
    primaryUse: 'Comprehensive contract redlining, risk discovery, and multi-party M&A review',
  },
  {
    name: 'LegalBERT-India v4.2',
    provider: 'In-House Private GPU Cluster',
    costPer1kTokens: '0.01 Credits',
    latency: '0.3s',
    contextWindow: '32k',
    status: 'Operational',
    primaryUse: 'Indian Supreme Court & High Court citation extraction and statute matching',
  },
  {
    name: 'DeepSeek-R1-Law (Chain-of-Thought)',
    provider: 'Self-Hosted Legal Inference',
    costPer1kTokens: '0.02 Credits',
    latency: '1.6s',
    contextWindow: '64k',
    status: 'Operational',
    primaryUse: 'Ratio Decidendi synthesis and conflicting precedent reconciliation',
  },
];

// 4. MASTER DATA (15 Taxonomies with pristine realistic Indian Legal data)
const cleanMasterData = [
  // Court
  { category: 'Court', name: 'Supreme Court of India', code: 'SCI', tier: 'Apex', jurisdiction: 'India', description: 'Apex constitutional and appellate court of the Republic of India' },
  { category: 'Court', name: 'High Court of Judicature at Bombay', code: 'BOM-HC', tier: 'High Court', jurisdiction: 'Maharashtra & Goa', description: 'Principal seat in Mumbai with benches at Nagpur, Aurangabad, and Goa' },
  { category: 'Court', name: 'High Court of Delhi', code: 'DEL-HC', tier: 'High Court', jurisdiction: 'NCT of Delhi', description: 'Original and appellate jurisdiction with specialized Commercial Division' },
  { category: 'Court', name: 'High Court of Karnataka', code: 'KAR-HC', tier: 'High Court', jurisdiction: 'Karnataka', description: 'Principal seat at Bengaluru with circuit benches at Dharwad and Kalaburagi' },
  { category: 'Court', name: 'National Company Law Appellate Tribunal', code: 'NCLAT', tier: 'Appellate Tribunal', jurisdiction: 'India', description: 'Appellate body for company law, competition, and insolvency matters' },
  { category: 'Court', name: 'National Company Law Tribunal - Mumbai Bench', code: 'NCLT-MUM', tier: 'Tribunal', jurisdiction: 'Maharashtra', description: 'Principal adjudication authority for corporate insolvency (IBC) and mergers' },

  // Bench
  { category: 'Bench', name: 'Principal Bench - New Delhi', code: 'PB-DEL', jurisdiction: 'New Delhi', description: 'Chief Justice Bench handling constitutional and transfer matters' },
  { category: 'Bench', name: 'Commercial Appellate Division Bench', code: 'CAD-BOM', jurisdiction: 'Mumbai', description: 'Dedicated commercial division bench for high-value contractual disputes' },
  { category: 'Bench', name: 'Division Bench (Court 1)', code: 'DB-1', jurisdiction: 'Delhi', description: 'Appellate Division Bench hearing civil and commercial appeals' },
  { category: 'Bench', name: 'Constitution Bench (5-Judge)', code: 'CB-5', jurisdiction: 'New Delhi', description: 'Constitutional reference bench for substantial questions of constitutional interpretation' },

  // Judge
  { category: 'Judge', name: 'Hon’ble Chief Justice of India', code: 'CJI-OFFICE', jurisdiction: 'Supreme Court of India', description: 'Office of the Chief Justice of India' },
  { category: 'Judge', name: 'Hon’ble Justice D.Y. Chandrachud (Retd.)', code: 'J-DYC', jurisdiction: 'Supreme Court of India', description: 'Former CJI noted for landmark constitutional privacy and digital jurisprudence' },
  { category: 'Judge', name: 'Hon’ble Justice Sanjiv Khanna', code: 'J-SK', jurisdiction: 'Supreme Court of India', description: 'Supreme Court judge specializing in taxation, commercial, and arbitration laws' },
  { category: 'Judge', name: 'Hon’ble Justice B.R. Gavai', code: 'J-BRG', jurisdiction: 'Supreme Court of India', description: 'Supreme Court judge with focus on administrative, criminal, and constitutional law' },

  // Act
  { category: 'Act', name: 'Constitution of India, 1950', code: 'COI-1950', jurisdiction: 'Central', description: 'Supreme law of the Republic of India outlining fundamental rights and governance' },
  { category: 'Act', name: 'Arbitration and Conciliation Act, 1996', code: 'ACA-1996', jurisdiction: 'Central', description: 'Primary legislation governing domestic arbitration, international commercial arbitration, and enforcement of foreign awards' },
  { category: 'Act', name: 'Insolvency and Bankruptcy Code, 2016', code: 'IBC-2016', jurisdiction: 'Central', description: 'Unified legal framework for corporate insolvency resolution process (CIRP) and liquidation' },
  { category: 'Act', name: 'Companies Act, 2013', code: 'CA-2013', jurisdiction: 'Central', description: 'Primary statute governing company incorporation, board responsibilities, corporate mergers, and governance' },
  { category: 'Act', name: 'Code of Civil Procedure, 1908', code: 'CPC-1908', jurisdiction: 'Central', description: 'Procedural code for the administration of civil proceedings across Indian courts' },
  { category: 'Act', name: 'Bharatiya Nyaya Sanhita, 2023', code: 'BNS-2023', jurisdiction: 'Central', description: 'Substantive penal code of India replacing the Indian Penal Code 1860' },
  { category: 'Act', name: 'Commercial Courts Act, 2015', code: 'CCA-2015', jurisdiction: 'Central', description: 'Specialized adjudication mechanism for commercial disputes above designated pecuniary thresholds' },

  // Section
  { category: 'Section', name: 'Section 9 - Interim Measures by Court', code: 'ACA-S9', jurisdiction: 'Arbitration Act', description: 'Urgent interim protection by civil court prior to, during, or after arbitral proceedings' },
  { category: 'Section', name: 'Section 11 - Appointment of Arbitrators', code: 'ACA-S11', jurisdiction: 'Arbitration Act', description: 'Judicial appointment of sole arbitrator or presiding arbitrator upon failure of agreed procedure' },
  { category: 'Section', name: 'Section 34 - Application for Setting Aside Arbitral Award', code: 'ACA-S34', jurisdiction: 'Arbitration Act', description: 'Recourse against domestic arbitral award on grounds of patent illegality or public policy' },
  { category: 'Section', name: 'Section 7 - Initiation of CIRP by Financial Creditor', code: 'IBC-S7', jurisdiction: 'Insolvency Code', description: 'Insolvency petition triggered upon financial debt default exceeding threshold' },
  { category: 'Section', name: 'Section 9 - Initiation of CIRP by Operational Creditor', code: 'IBC-S9', jurisdiction: 'Insolvency Code', description: 'Operational creditor application following statutory demand notice under Section 8' },
  { category: 'Section', name: 'Section 138 - Dishonour of Cheque', code: 'NIA-S138', jurisdiction: 'Negotiable Instruments Act', description: 'Criminal liability for cheque bounced due to insufficiency of funds in drawer bank account' },
  { category: 'Section', name: 'Article 226 - Power of High Courts to Issue Certain Writs', code: 'COI-A226', jurisdiction: 'Constitution of India', description: 'Constitutional writ jurisdiction for enforcement of fundamental and statutory rights' },

  // Practice Area
  { category: 'Practice Area', name: 'Commercial Litigation & Dispute Resolution', code: 'PA-CLDR', description: 'Complex contractual disputes, shareholder battles, and statutory enforcement' },
  { category: 'Practice Area', name: 'International Commercial Arbitration', code: 'PA-ICA', description: 'Cross-border dispute resolution under SIAC, LCIA, ICC, and MCIA rules' },
  { category: 'Practice Area', name: 'Corporate Restructuring & Insolvency (IBC)', code: 'PA-IBC', description: 'Creditor representation, resolution plans, and liquidations before NCLT/NCLAT' },
  { category: 'Practice Area', name: 'White Collar Defense & Regulatory Investigations', code: 'PA-WCD', description: 'Representation in ED, CBI, SFIO, and SEBI regulatory enforcement proceedings' },
  { category: 'Practice Area', name: 'Intellectual Property, Patents & Trademarks', code: 'PA-IPR', description: 'Patent prosecution, trademark infringement injunctions, and copyright licensing' },
  { category: 'Practice Area', name: 'Mergers, Acquisitions & Private Equity', code: 'PA-MAPE', description: 'Share purchase agreements, due diligence audits, and regulatory antitrust clearances' },

  // Case Type
  { category: 'Case Type', name: 'Special Leave Petition (Civil)', code: 'SLP(C)', description: 'Discretionary appellate recourse under Article 136 of the Constitution of India' },
  { category: 'Case Type', name: 'Commercial Arbitration Petition', code: 'CARB-P', description: 'Petitions under Section 9, 14, 29A, or 34 of the Arbitration Act before High Court' },
  { category: 'Case Type', name: 'Writ Petition (Civil)', code: 'WP(C)', description: 'Constitutional writ petition under Article 226/32 challenging state executive action' },
  { category: 'Case Type', name: 'Company Appeal (AT) (Insolvency)', code: 'COMP-APP-IBC', description: 'Appeals before NCLAT against admission or rejection of Section 7/9/10 petitions' },
  { category: 'Case Type', name: 'Summary Commercial Suit', code: 'COMS-SUIT', description: 'Expedited recovery suits under Order XXXVII of the Code of Civil Procedure' },

  // Document Type
  { category: 'Document Type', name: 'Vakalatnama & Memo of Appearance', code: 'DOC-VAK', description: 'Formal authorization document vesting advocate power to represent litigant' },
  { category: 'Document Type', name: 'Statement of Claim (Arbitration)', code: 'DOC-SOC', description: 'Comprehensive plead specifying claimant factual narrative, breach events, and prayer' },
  { category: 'Document Type', name: 'Statement of Defense & Counterclaim', code: 'DOC-SOD', description: 'Respondent written answer traversing claim allegations and raising cross-demands' },
  { category: 'Document Type', name: 'Affidavit in Rejoinder', code: 'DOC-REJ', description: 'Sworn responsive affirmation addressing preliminary objections raised by respondents' },
  { category: 'Document Type', name: 'Urgent Application for Interim Injunction', code: 'DOC-INJ', description: 'Interlocutory prayer for ex-parte ad-interim restraining order' },

  // Legal Template
  { category: 'Legal Template', name: 'Master Services Agreement (MSA) - Enterprise', code: 'TPL-MSA', description: 'Comprehensive enterprise services agreement with SLA, indemnities, and data security warranties' },
  { category: 'Legal Template', name: 'Mutual Non-Disclosure Agreement (NDA)', code: 'TPL-NDA', description: 'Standard bilateral confidentiality agreement with 3-year term and IP protection' },
  { category: 'Legal Template', name: 'Share Purchase & Shareholders Agreement', code: 'TPL-SHA', description: 'Investor protective covenants, drag-along, tag-along, and liquidation preference terms' },
  { category: 'Legal Template', name: 'Statutory Demand Notice (Section 8 IBC)', code: 'TPL-IBC8', description: 'Mandatory form 3 notice to corporate debtor demanding payment of unpaid operational debt' },

  // Clause
  { category: 'Clause', name: 'Governing Law and Dispute Resolution (Arbitration)', code: 'CLS-DR', description: 'Three-tier clause specifying amicable discussions, mediation, and seat in New Delhi/Mumbai' },
  { category: 'Clause', name: 'Limitation of Liability & Consequential Damages Cap', code: 'CLS-LOL', description: 'Mutual cap equal to 12 months fees with carve-outs for confidentiality and gross negligence' },
  { category: 'Clause', name: 'Indemnification & Third-Party Claims Hold Harmless', code: 'CLS-INDEM', description: 'Comprehensive defense and indemnity against intellectual property infringement claims' },
  { category: 'Clause', name: 'Force Majeure & Business Interruption Relief', code: 'CLS-FM', description: 'Excuses performance upon epidemic, war, act of God, or governmental restraint' },

  // Client
  { category: 'Client', name: 'Reliance Industries Limited', code: 'CLI-RIL', jurisdiction: 'India', description: 'Diversified conglomerate spanning energy, retail, telecommunications, and digital services' },
  { category: 'Client', name: 'Tata Consultancy Services Ltd', code: 'CLI-TCS', jurisdiction: 'India', description: 'Global multinational information technology and enterprise consulting leader' },
  { category: 'Client', name: 'HDFC Bank Limited', code: 'CLI-HDFC', jurisdiction: 'India', description: 'Premier private sector banking institution handling commercial syndications and retail' },
  { category: 'Client', name: 'Larsen & Toubro Limited', code: 'CLI-LT', jurisdiction: 'India', description: 'Infrastructure, engineering, defense manufacturing, and EPC project development' },
  { category: 'Client', name: 'Infosys Limited', code: 'CLI-INFY', jurisdiction: 'India', description: 'Global software, cloud migration, and AI digital transformation services provider' },

  // Opposing Party
  { category: 'Opposing Party', name: 'Union of India (Ministry of Finance)', code: 'OP-UOI-FIN', jurisdiction: 'Central Government', description: 'Central executive body overseeing direct/indirect tax administration and financial policy' },
  { category: 'Opposing Party', name: 'Enforcement Directorate (Directorate of Revenue Intelligence)', code: 'OP-ED', jurisdiction: 'India', description: 'Specialized financial investigation agency enforcing PMLA and FEMA statutory provisions' },
  { category: 'Opposing Party', name: 'Competition Commission of India (CCI)', code: 'OP-CCI', jurisdiction: 'India', description: 'Statutory antitrust regulator monitoring market dominance and merger combinations' },
  { category: 'Opposing Party', name: 'State of Maharashtra (Department of Industries)', code: 'OP-MAH', jurisdiction: 'State Government', description: 'State government entity responsible for industrial licensing and land acquisition' },

  // Advocate
  { category: 'Advocate', name: 'Harish Salve, Senior Advocate', code: 'ADV-HS', jurisdiction: 'Supreme Court of India', description: 'Former Solicitor General of India; King\'s Counsel renowned for constitutional and international arbitration' },
  { category: 'Advocate', name: 'Mukul Rohatgi, Senior Advocate', code: 'ADV-MR', jurisdiction: 'Supreme Court of India', description: 'Former Attorney General of India; veteran commercial litigation and corporate defense counsel' },
  { category: 'Advocate', name: 'Dr. Abhishek Manu Singhvi, Senior Advocate', code: 'ADV-AMS', jurisdiction: 'Supreme Court of India', description: 'Eminent constitutional jurist and commercial appellate counsel' },
  { category: 'Advocate', name: 'Indira Jaising, Senior Advocate', code: 'ADV-IJ', jurisdiction: 'Supreme Court of India', description: 'Pioneering human rights advocate, public interest litigator, and former ASG' },

  // Tags
  { category: 'Tags', name: 'High Priority (Urgent Listing)', code: 'TAG-URGENT', description: 'Flagged for urgent mention before the Chief Justice Court or Vacation Bench' },
  { category: 'Tags', name: 'Interim Injunction Granted', code: 'TAG-INJ-GRT', description: 'Restraining or status-quo order currently operative in favor of client' },
  { category: 'Tags', name: 'Reserved for Judgment', code: 'TAG-RES-JUG', description: 'Final oral arguments concluded; formal judgment awaiting pronouncement' },
  { category: 'Tags', name: 'Cross-Border Arbitration', code: 'TAG-CROSS-ARB', description: 'Involves foreign seated tribunal or enforcement under New York Convention' },
  { category: 'Tags', name: 'Settlement Negotiations Active', code: 'TAG-SETTLE', description: 'Parties actively exploring mediation or section 89 CPC conciliation' },
];

// 5. AUDIT LOGS
const cleanAuditLogs = [
  {
    action: 'PLATFORM_INITIALIZATION',
    category: 'Security',
    actorName: 'Super Admin',
    actorEmail: 'admin@themes.ai',
    targetUser: 'Themes AI Legal Infrastructure',
    details: 'Enterprise Legal AI orchestrator successfully initialized with TLS 1.3 encryption and audit tracing',
    severity: 'SUCCESS',
    ip: '103.21.244.18',
    timestamp: new Date(Date.now() - 3600000 * 24),
  },
  {
    action: 'FIRM_ONBOARDED',
    category: 'Multi-Tenant',
    actorName: 'Super Admin',
    actorEmail: 'admin@themes.ai',
    targetUser: 'Shardul Amarchand Mangaldas & Co',
    details: 'Onboarded Enterprise tier tenant with 60 seats and 120,000 initial reasoning credits',
    severity: 'SUCCESS',
    ip: '103.21.244.18',
    timestamp: new Date(Date.now() - 3600000 * 20),
  },
  {
    action: 'AI_MODEL_ROUTING_CONFIGURED',
    category: 'AI Ops',
    actorName: 'Super Admin',
    actorEmail: 'admin@themes.ai',
    targetUser: 'Global Platform',
    details: 'Configured DeepSeek-R1-Law reasoning engine for Indian Supreme Court precedents & ratio extraction',
    severity: 'INFO',
    ip: '103.21.244.18',
    timestamp: new Date(Date.now() - 3600000 * 16),
  },
  {
    action: 'CREDITS_TOPUP',
    category: 'Billing',
    actorName: 'Super Admin',
    actorEmail: 'admin@themes.ai',
    targetUser: 'Cyril Amarchand Mangaldas (Pool)',
    details: 'Allocated +50,000 reasoning credits via Annual Enterprise Subscription Tier addendum',
    severity: 'SUCCESS',
    ip: '103.21.244.18',
    timestamp: new Date(Date.now() - 3600000 * 12),
  },
  {
    action: 'ROLE_PROVISIONED',
    category: 'Security',
    actorName: 'Chirag Poshiya',
    actorEmail: 'cfsys.xyz@gmail.com',
    targetUser: 'Meera Sen (Compliance Officer)',
    details: 'Assigned Compliance Officer role with granular audit log and regulatory taxonomy review privileges',
    severity: 'INFO',
    ip: '115.96.128.5',
    timestamp: new Date(Date.now() - 3600000 * 8),
  },
  {
    action: 'USER_PROVISIONED',
    category: 'User Management',
    actorName: 'System Admin',
    actorEmail: 'admin@themes.ai',
    targetUser: 'Senior Adv. Aryaman Singhania (aryaman.singhania@samlaw.in)',
    details: 'Provisioned Senior Partner credentials affiliated with Shardul Amarchand Mangaldas & Co',
    severity: 'SUCCESS',
    ip: '103.21.244.18',
    timestamp: new Date(Date.now() - 3600000 * 5),
  },
  {
    action: 'ACCOUNT_SUSPENDED',
    category: 'Compliance',
    actorName: 'Super Admin',
    actorEmail: 'admin@themes.ai',
    targetUser: 'Rohan Varma (rohan.varma@legalai.in)',
    details: 'Account suspended following failed dual-factor compliance verification review',
    severity: 'WARN',
    ip: '103.21.244.18',
    timestamp: new Date(Date.now() - 3600000 * 2),
  },
];

async function runResetAndSeed() {
  console.log('--- STARTING ENTERPRISE DATABASE RESET & RE-SEED ---');
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected successfully to Atlas.');

  const db = mongoose.connection.db;

  // 1. Wipe collections
  console.log('Wiping old test data from Atlas...');
  await db.collection('firms').deleteMany({});
  await db.collection('users').deleteMany({});
  await db.collection('subadmins').deleteMany({});
  await db.collection('roles').deleteMany({});
  await db.collection('aimodels').deleteMany({});
  await db.collection('masterdatas').deleteMany({});
  await db.collection('auditlogs').deleteMany({});
  console.log('Collections cleared.');

  // 2. Seed Firms
  console.log(`Seeding ${cleanFirms.length} Law Firms...`);
  const insertedFirms = [];
  for (const f of cleanFirms) {
    const res = await db.collection('firms').insertOne({
      ...f,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    insertedFirms.push({ ...f, _id: res.insertedId });
  }
  console.log(`Inserted ${insertedFirms.length} firms.`);

  // 3. Seed Roles
  console.log(`Seeding ${cleanRoles.length} Roles...`);
  const insertedRoles = [];
  for (const r of cleanRoles) {
    const res = await db.collection('roles').insertOne({
      ...r,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    insertedRoles.push({ ...r, _id: res.insertedId });
  }
  console.log(`Inserted ${insertedRoles.length} roles.`);

  const superAdminRole = insertedRoles.find(r => r.name === 'Super Admin');
  const complianceRole = insertedRoles.find(r => r.name === 'Compliance Officer');
  const opsRole = insertedRoles.find(r => r.name === 'Operations Manager');

  // 4. Seed SubAdmins (Executive Admins)
  console.log('Seeding Administrators & Sub-Admins...');
  const cleanSubAdmins = [
    {
      username: 'superadmin',
      fullName: 'Super Administrator',
      email: 'admin@themes.ai',
      password: admin123Hash,
      role: 'Super Admin',
      roleTitle: 'Super Admin',
      roleId: superAdminRole._id,
      code: 'SUPER_ADM',
      deviceLimit: 'Unlimited',
      salesPerson: 'No',
      status: 1,
      department: 'Platform Administration',
      permissions: {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        modules: fullModulePermissions,
      },
      lastLogin: 'Just now',
      assignedBy: 'System',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'admin_legalai',
      fullName: 'Legal AI Administrator',
      email: 'admin@legalai.in',
      password: admin123Hash,
      role: 'Super Admin',
      roleTitle: 'Super Admin',
      roleId: superAdminRole._id,
      code: 'SUPER_ADM',
      deviceLimit: 'Unlimited',
      salesPerson: 'No',
      status: 1,
      department: 'Platform Administration',
      permissions: {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        modules: fullModulePermissions,
      },
      lastLogin: 'Just now',
      assignedBy: 'System',
      createdAt: new Date(),
      updatedAt: new Date(),
      password: admin123Hash,
      role: 'Super Admin',
      roleTitle: 'Super Admin',
      roleId: superAdminRole._id,
      code: 'SUPER_ADM',
      deviceLimit: 'Unlimited',
      salesPerson: 'No',
      status: 1,
      department: 'Platform Administration',
      permissions: {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        modules: fullModulePermissions,
      },
      lastLogin: 'Just now',
      assignedBy: 'System',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'chirag_poshiya',
      fullName: 'Chirag Poshiya',
      email: 'cfsys.xyz@gmail.com',
      password: pass123456Hash,
      role: 'Super Admin',
      roleTitle: 'Super Admin',
      roleId: superAdminRole._id,
      code: 'SUPER_ADM',
      deviceLimit: 'Unlimited',
      salesPerson: 'No',
      status: 1,
      department: 'Executive Board',
      permissions: {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        modules: fullModulePermissions,
      },
      lastLogin: '10 mins ago',
      assignedBy: 'System',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'meera_compliance',
      fullName: 'Adv. Meera Sen',
      email: 'meera.sen@legalai.in',
      password: admin123Hash,
      role: 'Compliance Officer',
      roleTitle: 'Compliance Officer',
      roleId: complianceRole._id,
      code: 'COMPL_OFF',
      deviceLimit: '5',
      salesPerson: 'No',
      status: 1,
      department: 'Regulatory Compliance',
      permissions: {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: false,
        modules: complianceModulePermissions,
      },
      lastLogin: '1 hour ago',
      assignedBy: 'Super Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      username: 'vikram_ops',
      fullName: 'Vikramaditya Roy',
      email: 'vikram.roy@legalai.in',
      password: admin123Hash,
      role: 'Operations Manager',
      roleTitle: 'Operations Manager',
      roleId: opsRole._id,
      code: 'OPS_MGR',
      deviceLimit: '5',
      salesPerson: 'No',
      status: 1,
      department: 'Chamber Operations',
      permissions: {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        modules: operationsModulePermissions,
      },
      lastLogin: '3 hours ago',
      assignedBy: 'Super Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const s of cleanSubAdmins) {
    await db.collection('subadmins').insertOne(s);
  }
  console.log(`Inserted ${cleanSubAdmins.length} subadmins.`);

  // 5. Seed Users (Advocates & Practitioners)
  console.log('Seeding Advocates & Practitioners...');
  const samFirm = insertedFirms[0];
  const camFirm = insertedFirms[1];
  const khaitanFirm = insertedFirms[2];
  const trilegalFirm = insertedFirms[3];
  const azbFirm = insertedFirms[4];
  const singhFirm = insertedFirms[5];

  const cleanUsers = [
    {
      firstName: 'Aryaman',
      lastName: 'Singhania',
      email: 'aryaman.singhania@samlaw.in',
      password: password123Hash,
      role: ROLES.SENIOR_PARTNER, // 3
      firmId: samFirm._id.toString(),
      organisationName: samFirm.name,
      professionalType: 'Senior Advocate (SC)',
      mobile: '+91 98200 44112',
      credits: 15000,
      plan: 'Enterprise',
      permissions: DEFAULT_ADMIN_PERMISSIONS,
      status: USER_STATUS.ACTIVE, // 1
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      lastActive: '5 mins ago',
      createdAt: new Date('2025-01-15T09:00:00Z'),
      updatedAt: new Date(),
    },
    {
      firstName: 'Radhika',
      lastName: 'Merchant',
      email: 'radhika.merchant@cyrilshroff.com',
      password: password123Hash,
      role: ROLES.FIRM_ADMIN, // 2
      firmId: camFirm._id.toString(),
      organisationName: camFirm.name,
      professionalType: 'Managing Partner - Disputes',
      mobile: '+91 98111 22334',
      credits: 12000,
      plan: 'Enterprise',
      permissions: DEFAULT_ADMIN_PERMISSIONS,
      status: USER_STATUS.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
      lastActive: '12 mins ago',
      createdAt: new Date('2025-01-20T10:30:00Z'),
      updatedAt: new Date(),
    },
    {
      firstName: 'Kabir',
      lastName: 'Deshmukh',
      email: 'kabir.deshmukh@khaitanco.com',
      password: password123Hash,
      role: ROLES.ADVOCATE, // 4
      firmId: khaitanFirm._id.toString(),
      organisationName: khaitanFirm.name,
      professionalType: 'Dispute Resolution Counsel',
      mobile: '+91 99201 55667',
      credits: 8500,
      plan: 'Enterprise',
      permissions: DEFAULT_CUSTOMER_PERMISSIONS,
      status: USER_STATUS.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      lastActive: '35 mins ago',
      createdAt: new Date('2025-02-01T11:00:00Z'),
      updatedAt: new Date(),
    },
    {
      firstName: 'Ananya',
      lastName: 'Iyer',
      email: 'ananya.iyer@trilegal.com',
      password: password123Hash,
      role: ROLES.LEGAL_RESEARCHER, // 5
      firmId: trilegalFirm._id.toString(),
      organisationName: trilegalFirm.name,
      professionalType: 'Senior Research Associate',
      mobile: '+91 98334 77889',
      credits: 6200,
      plan: 'Law Firm Pro',
      permissions: PERMISSIONS.CAN_RESEARCH | PERMISSIONS.CAN_JUDGMENTS | PERMISSIONS.CAN_DOCUMENTS | PERMISSIONS.CAN_EXPORT,
      status: USER_STATUS.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
      lastActive: '1 hour ago',
      createdAt: new Date('2025-02-10T14:15:00Z'),
      updatedAt: new Date(),
    },
    {
      firstName: 'Farhan',
      lastName: 'Qureshi',
      email: 'farhan.qureshi@azbpartners.com',
      password: password123Hash,
      role: ROLES.ADVOCATE, // 4
      firmId: azbFirm._id.toString(),
      organisationName: azbFirm.name,
      professionalType: 'Litigation Associate',
      mobile: '+91 97110 33445',
      credits: 4800,
      plan: 'Enterprise',
      permissions: DEFAULT_CUSTOMER_PERMISSIONS,
      status: USER_STATUS.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
      lastActive: '2 hours ago',
      createdAt: new Date('2025-02-25T16:00:00Z'),
      updatedAt: new Date(),
    },
    {
      firstName: 'Simranjit',
      lastName: 'Kaur',
      email: 'simranjit.kaur@singhlegal.in',
      password: password123Hash,
      role: ROLES.ADVOCATE, // 4
      firmId: singhFirm._id.toString(),
      organisationName: singhFirm.name,
      professionalType: 'Patent & IP Attorney',
      mobile: '+91 98102 99887',
      credits: 3500,
      plan: 'Boutique',
      permissions: DEFAULT_CUSTOMER_PERMISSIONS,
      status: USER_STATUS.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      lastActive: 'Yesterday',
      createdAt: new Date('2025-03-01T10:00:00Z'),
      updatedAt: new Date(),
    },
    {
      firstName: 'Devendra',
      lastName: 'Prasad',
      email: 'devendra.prasad@samlaw.in',
      password: password123Hash,
      role: ROLES.PARALEGAL, // 6
      firmId: samFirm._id.toString(),
      organisationName: samFirm.name,
      professionalType: 'Senior Paralegal Clerk',
      mobile: '+91 99100 66778',
      credits: 800,
      plan: 'Enterprise',
      permissions: PERMISSIONS.CAN_DOCUMENTS | PERMISSIONS.CAN_MATTERS,
      status: USER_STATUS.PENDING, // 2
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
      lastActive: 'Pending verification',
      createdAt: new Date('2025-03-15T11:30:00Z'),
      updatedAt: new Date(),
    },
    {
      firstName: 'Rohan',
      lastName: 'Varma',
      email: 'rohan.varma@legalai.in',
      password: password123Hash,
      role: ROLES.ADVOCATE, // 4
      firmId: trilegalFirm._id.toString(),
      organisationName: trilegalFirm.name,
      professionalType: 'Junior Associate',
      mobile: '+91 98711 44332',
      credits: 0,
      plan: 'Trial plan',
      permissions: 0,
      status: USER_STATUS.SUSPENDED, // 3
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=256',
      lastActive: 'Suspended by admin',
      createdAt: new Date('2025-01-10T12:00:00Z'),
      updatedAt: new Date(),
    },
    // Also include Super Admin in User collection for universal login compatibility
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@themes.ai',
      password: admin123Hash,
      role: ROLES.SUPER_ADMIN, // 1
      firmId: samFirm._id.toString(),
      organisationName: 'Themes AI Platform Org',
      professionalType: 'Chief Platform Administrator',
      mobile: '+91 98200 11001',
      credits: 999999,
      plan: 'Super Admin',
      permissions: 1023,
      status: USER_STATUS.ACTIVE,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      lastActive: 'Just now',
      createdAt: new Date('2025-01-01T00:00:00Z'),
      updatedAt: new Date(),
    },
  ];

  for (const u of cleanUsers) {
    await db.collection('users').insertOne(u);
  }
  console.log(`Inserted ${cleanUsers.length} users.`);

  // 6. Seed AI Models
  console.log(`Seeding ${cleanAiModels.length} AI Models...`);
  for (const m of cleanAiModels) {
    await db.collection('aimodels').insertOne({
      ...m,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  console.log(`Inserted ${cleanAiModels.length} AI models.`);

  // 7. Seed Master Data
  console.log(`Seeding ${cleanMasterData.length} Master Data items across all 15 categories...`);
  for (const m of cleanMasterData) {
    await db.collection('masterdatas').insertOne({
      ...m,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  console.log(`Inserted ${cleanMasterData.length} master data records.`);

  // 8. Seed Audit Logs
  console.log(`Seeding ${cleanAuditLogs.length} Audit Logs...`);
  for (const l of cleanAuditLogs) {
    await db.collection('auditlogs').insertOne(l);
  }
  console.log(`Inserted ${cleanAuditLogs.length} audit logs.`);

  // 9. Sync clean data to db.json local fallback
  const dbJsonData = {
    firms: insertedFirms.map(f => ({ ...f, id: f._id.toString() })),
    users: cleanUsers.map((u, i) => ({ ...u, id: `user-${i + 1}` })),
    roles: insertedRoles.map(r => ({ ...r, id: r._id.toString() })),
    subAdmins: cleanSubAdmins.map((s, i) => ({ ...s, id: `sub-${i + 1}` })),
    aiModels: cleanAiModels.map((m, i) => ({ ...m, id: `model-${i + 1}` })),
    auditLogs: cleanAuditLogs.map((l, i) => ({ ...l, id: `log-${i + 1}` })),
    lastUpdated: new Date().toISOString(),
  };

  const dbJsonPath = path.join(__dirname, '..', 'data', 'db.json');
  fs.writeFileSync(dbJsonPath, JSON.stringify(dbJsonData, null, 2), 'utf-8');
  console.log(`Synced clean data to local fallback file: ${dbJsonPath}`);

  await mongoose.disconnect();
  console.log('--- RE-SEED COMPLETE AND VERIFIED ---');
}

runResetAndSeed().catch(err => {
  console.error('Reset and seed failed:', err);
  process.exit(1);
});
