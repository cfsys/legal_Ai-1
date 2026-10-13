const User = require('../models/User');
const Judgment = require('../models/Judgment');
const Research = require('../models/Research');
const Document = require('../models/Document');
const Contract = require('../models/Contract');
const Matter = require('../models/Matter');
const Task = require('../models/Task');
const CalendarEvent = require('../models/CalendarEvent');
const Draft = require('../models/Draft');
const { getIsMongooseConnected } = require('../config/db');
const bcrypt = require('bcryptjs');

// In-Memory store as zero-config backup
const memoryStore = {
  users: [],
  judgments: [],
  researches: [],
  documents: [],
  contracts: [],
  matters: [],
  tasks: [],
  events: [],
  drafts: [],
};

// Initial Judgments Data
const defaultJudgments = [
  {
    _id: 'judg_001',
    title: 'Kesavananda Bharati v. State of Kerala',
    court: 'Supreme Court of India',
    decisionDate: '1973-04-24',
    citation: '(1973) 4 SCC 225',
    status: 'Good Law',
    bench: '13 Judges',
    judges: 'S.M. Sikri, CJI & others',
    headnote: 'Established the Basic Structure Doctrine limiting Parliament\'s power to amend the Constitution.',
    ratioDecidendi: 'The Court held that the interpretation must give effect to the object of the statute. The decision remains a leading authority on constitutional law in India.',
    aiSummary: 'The 13-judge Constitution Bench held by a 7:6 majority that while Parliament has wide powers to amend the Constitution under Article 368, it cannot alter its "basic structure". Features like supremacy of the Constitution, rule of law, separation of powers, and judicial review form the bedrock of the Constitution.',
    actsAndSections: [
      { act: 'Constitution of India', section: 'Article 368' },
      { act: 'Constitution of India', section: 'Article 13' },
      { act: 'Constitution of India', section: 'Article 19' },
    ],
    casesCited: [
      'Golak Nath v. State of Punjab (1967) 2 SCR 762',
      'Shankari Prasad v. Union of India (1951) AIR 1951 SC 458',
      'Sajjan Singh v. State of Rajasthan (1965) 1 SCR 933',
    ],
    citedBy: [
      'Minerva Mills v. Union of India (1980) 3 SCC 625',
      'Indira Nehru Gandhi v. Raj Narain (1975) Supp SCC 1',
      'S.R. Bommai v. Union of India (1994) 3 SCC 1',
    ],
    highlights: [
      'Basic Structure Doctrine established',
      'Judicial review declared an inviolable feature',
      'Parliamentary sovereignty balanced with constitutional supremacy',
    ],
    fullText: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
  },
  {
    _id: 'judg_002',
    title: 'Collector of Land Acquisition v. Mst. Katiji',
    court: 'Supreme Court of India',
    decisionDate: '1987-02-19',
    citation: '(1987) 2 SCC 107',
    status: 'Good Law',
    bench: '2 Judges',
    judges: 'M.P. Thakkar & B.C. Ray, JJ.',
    headnote: 'Liberal approach to condonation of delay; substantial justice must be preferred over technical considerations.',
    ratioDecidendi: 'Courts must adopt a liberal and justice-oriented approach while interpreting "sufficient cause" under Section 5 of the Limitation Act, 1963.',
    aiSummary: 'The Supreme Court laid down six foundational principles for condoning delay under Section 5 of the Limitation Act, emphasizing that justice should not be defeated on mere technical grounds where no gross negligence or lack of bona fides is demonstrated.',
    actsAndSections: [
      { act: 'Limitation Act 1963', section: 'Section 5' },
      { act: 'Land Acquisition Act 1894', section: 'Section 18' },
    ],
    casesCited: ['Ramlal v. Rewa Coalfields Ltd. AIR 1962 SC 361'],
    citedBy: ['Perumon Bhagvathy Devaswom v. Bhargavi Amma (2008) 8 SCC 321'],
    highlights: [
      'Every days delay need not be explained with pedantic accuracy',
      'Substantial justice overrides procedural technicalities',
      'State is treated on equal footing but with realistic appreciation of bureaucratic delays',
    ],
    fullText: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
  },
  {
    _id: 'judg_003',
    title: 'Swiss Ribbons Pvt. Ltd. v. Union of India',
    court: 'Supreme Court of India',
    decisionDate: '2019-01-25',
    citation: '(2019) 4 SCC 17',
    status: 'Good Law',
    bench: '2 Judges',
    judges: 'R.F. Nariman & Navin Sinha, JJ.',
    headnote: 'Upheld constitutional validity of the IBC 2016 and the classification of financial and operational creditors.',
    ratioDecidendi: 'The classification between financial and operational creditors is based on intelligible differentia and does not violate Article 14 of the Constitution.',
    aiSummary: 'The Court exhaustively examined the Insolvency and Bankruptcy Code, 2016, holding that IBC is primarily a legislation for reorganization and insolvency resolution of corporate persons rather than recovery mechanism.',
    actsAndSections: [
      { act: 'Insolvency and Bankruptcy Code 2016', section: 'Section 29A' },
      { act: 'Insolvency and Bankruptcy Code 2016', section: 'Section 53' },
      { act: 'Constitution of India', section: 'Article 14' },
    ],
    casesCited: ['Innoventive Industries Ltd. v. ICICI Bank (2018) 1 SCC 407'],
    citedBy: ['Committee of Creditors of Essar Steel v. Satish Kumar Gupta (2020) 8 SCC 531'],
    highlights: [
      'Section 29A upheld as constitutional and vital to bar errant promoters',
      'Differentiation between financial and operational creditors validated',
    ],
    fullText: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
  },
  {
    _id: 'judg_004',
    title: 'Esher Singh v. State of A.P.',
    court: 'Supreme Court of India',
    decisionDate: '2004-03-12',
    citation: '(2004) 11 SCC 585',
    status: 'Distinguished',
    bench: '2 Judges',
    judges: 'Doraiswamy Raju & Arijit Pasayat, JJ.',
    headnote: 'Application of Section 27 of Evidence Act; facts discovered pursuant to disclosure statements.',
    ratioDecidendi: 'The expression "fact discovered" embraces the place from each the object is produced and the knowledge of the accused as to this, and the information given must relate distinctly to this fact.',
    aiSummary: 'The Supreme Court delineated the contours of admissibility of confessional statements leading to discovery of physical evidence in criminal trials under Section 27 of the Indian Evidence Act.',
    actsAndSections: [
      { act: 'Indian Evidence Act 1872', section: 'Section 27' },
      { act: 'Code of Criminal Procedure 1973', section: 'Section 161' },
    ],
    casesCited: ['Pulukuri Kottaya v. King-Emperor AIR 1947 PC 67'],
    citedBy: ['State of Karnataka v. David Rozario (2002) 7 SCC 728'],
    highlights: ['Section 27 strictly construed as an exception to Sections 25 and 26'],
    fullText: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
  },
  {
    _id: 'judg_005',
    title: 'Cheran Properties Ltd. v. Kasturi & Sons Ltd.',
    court: 'Supreme Court of India',
    decisionDate: '2018-04-24',
    citation: '(2018) 16 SCC 413',
    status: 'Good Law',
    bench: '3 Judges',
    judges: 'Dr. D.Y. Chandrachud, A.M. Khanwilkar & Dipak Misra, CJI',
    headnote: 'Enforcement of arbitral awards against non-signatories under group of companies doctrine and Section 35 of the Arbitration Act.',
    ratioDecidendi: 'An arbitral award can bind non-signatory entities where the intention to bind corporate affiliates or alter egos is clearly manifested by conduct and composite transaction.',
    aiSummary: 'The 3-judge bench affirmed the applicability of the Group of Companies doctrine to enforce arbitral awards against non-signatories who derived benefits and participated in composite transaction performance.',
    actsAndSections: [
      { act: 'Arbitration and Conciliation Act 1996', section: 'Section 35' },
      { act: 'Arbitration and Conciliation Act 1996', section: 'Section 36' },
      { act: 'Companies Act 2013', section: 'Section 241' },
    ],
    casesCited: ['Chloro Controls India v. Severn Trent (2013) 1 SCC 641'],
    citedBy: ['Cox and Kings Ltd. v. SAP India Pvt. Ltd. (2024) 4 SCC 1'],
    highlights: ['Binding nature of arbitral awards on alter egos', 'Section 35 Arbitration Act interpretation'],
    fullText: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
  },
  {
    _id: 'judg_006',
    title: 'Amazon.com NV Investment Holdings LLC v. Future Retail Ltd.',
    court: 'Delhi High Court',
    decisionDate: '2021-08-06',
    citation: '2021 SCC OnLine Del 3977',
    status: 'Good Law',
    bench: 'Single Judge',
    judges: 'J.R. Midha, J.',
    headnote: 'Emergency Arbitrator awards under SIAC rules enforceable under Section 17(2) of the Arbitration & Conciliation Act 1996.',
    ratioDecidendi: 'An Emergency Arbitrator is an arbitrator within the scheme of the Arbitration and Conciliation Act, and interim orders rendered by an Emergency Arbitrator are enforceable in Indian Courts under Section 17(2).',
    aiSummary: 'The Delhi High Court upheld the validity and enforceability of Emergency Arbitral awards in India, rejecting attempts to circumvent SIAC emergency injunctions in high-stakes retail acquisition disputes.',
    actsAndSections: [
      { act: 'Arbitration and Conciliation Act 1996', section: 'Section 17' },
      { act: 'Arbitration and Conciliation Act 1996', section: 'Section 9' },
      { act: 'Code of Civil Procedure 1908', section: 'Order XXXIX' },
    ],
    casesCited: ['Ashwani Minda v. U-Shin Ltd. (2020) 271 DLT 122'],
    citedBy: ['Future Coupons Pvt Ltd v. Amazon (2022) 13 SCC 519'],
    highlights: ['Emergency Arbitrator orders enforceable under Section 17(2)', 'Delhi High Court jurisdiction over institutional arbitrations'],
    fullText: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
  },
  {
    _id: 'judg_007',
    title: 'Tata Consultancy Services Ltd. v. Cyrus Investments Pvt. Ltd.',
    court: 'Supreme Court of India',
    decisionDate: '2021-03-26',
    citation: '(2021) 9 SCC 449',
    status: 'Good Law',
    bench: '3 Judges',
    judges: 'S.A. Bobde, CJI, A.S. Bopanna & V. Ramasubramanian, JJ.',
    headnote: 'Oppression and mismanagement standards under Sections 241 and 242 of Companies Act 2013 and removal of Executive Chairman.',
    ratioDecidendi: 'The removal of a person from directorship cannot be characterized as an act of oppression or prejudice unless it demonstrates lack of probity and fair dealing leading to justifiable loss of confidence.',
    aiSummary: 'The Supreme Court set aside NCLAT orders reinstating Cyrus Mistry as Executive Chairman, laying down critical corporate governance precedents on minority shareholder rights in public charitable trusts controlling corporate holding structures.',
    actsAndSections: [
      { act: 'Companies Act 2013', section: 'Section 241' },
      { act: 'Companies Act 2013', section: 'Section 242' },
      { act: 'Companies Act 2013', section: 'Section 245' },
    ],
    casesCited: ['Needle Industries (India) Ltd. v. Needle Industries Newey (1981) 3 SCC 333'],
    citedBy: ['Aruna Oswal v. Pankaj Oswal (2020) 8 SCC 418'],
    highlights: ['Threshold for oppression under Section 241', 'Power of tribunal to order reinstatement'],
    fullText: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
  },
  {
    _id: 'judg_008',
    title: 'K.S. Puttaswamy v. Union of India (Privacy Judgment)',
    court: 'Supreme Court of India',
    decisionDate: '2017-08-24',
    citation: '(2017) 10 SCC 1',
    status: 'Good Law',
    bench: '9 Judges',
    judges: 'J.S. Khehar, CJI, J. Chelameswar, S.A. Bobde, R.F. Nariman, D.Y. Chandrachud & others',
    headnote: 'Right to Privacy declared a fundamental right guaranteed under Article 21 and Part III of the Constitution of India.',
    ratioDecidendi: 'Privacy is an intrinsic element of life and personal liberty under Article 21 and an aspect of freedoms guaranteed by Part III of the Constitution. Overruled MP Sharma and Kharak Singh.',
    aiSummary: 'The unanimous 9-judge Constitution Bench held that the right to privacy is constitutionally protected as an intrinsic part of the right to life and personal liberty, establishing proportionality tests for statutory state intrusions.',
    actsAndSections: [
      { act: 'Constitution of India', section: 'Article 21' },
      { act: 'Constitution of India', section: 'Article 14' },
      { act: 'Constitution of India', section: 'Article 19' },
    ],
    casesCited: ['M.P. Sharma v. Satish Chandra (1954) SCR 1077', 'Kharak Singh v. State of U.P. (1964) 1 SCR 332'],
    citedBy: ['Navtej Singh Johar v. Union of India (2018) 10 SCC 1', 'Joseph Shine v. Union of India (2019) 3 SCC 39'],
    highlights: ['Right to Privacy held fundamental under Article 21', 'Overruled M.P. Sharma (1954) and Kharak Singh (1962)'],
    fullText: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
  },
  {
    _id: 'judg_009',
    title: 'Board of Control for Cricket in India v. Cricket Association of Bihar',
    court: 'Calcutta High Court',
    decisionDate: '2015-01-22',
    citation: '(2015) 3 SCC 251',
    status: 'Overruled',
    bench: '2 Judges',
    judges: 'T.S. Thakur & F.M.I. Kalifulla, JJ.',
    headnote: 'Conflict of interest in sports governance; Rule 6.2.4 of BCCI Regulations declared invalid.',
    ratioDecidendi: 'Public functions carried out by private sporting bodies are subject to judicial scrutiny and standards of natural justice and fairness.',
    aiSummary: 'Dispute originating from Calcutta High Court and escalated to Supreme Court regarding spot fixing, judicial oversight of BCCI, and establishment of the Justice Lodha Committee.',
    actsAndSections: [
      { act: 'Constitution of India', section: 'Article 226' },
      { act: 'Societies Registration Act 1860', section: 'Section 6' },
    ],
    casesCited: ['Zee Telefilms Ltd. v. Union of India (2005) 4 SCC 649'],
    citedBy: ['BCCI v. Kochi Cricket Pvt Ltd (2018) 6 SCC 287'],
    highlights: ['Rule 6.2.4 struck down for conflict of interest', 'Public function test applied'],
    fullText: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
  },
  {
    _id: 'judg_010',
    title: 'State of Maharashtra v. Bharat Shanti Lal Shah',
    court: 'Bombay High Court',
    decisionDate: '2008-09-01',
    citation: '(2008) 13 SCC 5',
    status: 'Good Law',
    bench: '2 Judges',
    judges: 'K.G. Balakrishnan, CJI & P. Sathasivam, J.',
    headnote: 'Constitutional validity of Sections 13, 14, 15, and 16 of Maharashtra Control of Organised Crime Act (MCOCA) 1999.',
    ratioDecidendi: 'Interception of wire, electronic or oral communications under statutory authority must satisfy strict procedural safeguards under Telegraph Act and MCOCA.',
    aiSummary: 'The bench examined police powers of telephonic interception and admissibility of intercepted recordings in organized crime investigations originating from Mumbai Special MCOCA Court and Bombay High Court.',
    actsAndSections: [
      { act: 'Code of Criminal Procedure 1973', section: 'Section 173' },
      { act: 'Indian Evidence Act 1872', section: 'Section 65B' },
      { act: 'Indian Telegraph Act 1885', section: 'Section 5' },
    ],
    casesCited: ['People\'s Union for Civil Liberties v. Union of India (1997) 1 SCC 301'],
    citedBy: ['State of Gujarat v. Sandip Omprakash Gupta (2022) 14 SCC 560'],
    highlights: ['Interception of communications subject to judicial and administrative safeguards'],
    fullText: 'Full judgment text is available in the Legal AI National Legal Repository archive.',
  },
];

// Initial Documents Data
const defaultDocuments = [
  {
    _id: 'doc_001',
    title: 'Share Purchase Agreement - Acme.pdf',
    pages: 42,
    status: 'Ready',
    isConfidential: true,
    uploadDate: '12 Jun 2026',
    sections: [
      {
        pageNumber: 1,
        heading: 'SHARE PURCHASE AGREEMENT',
        content: 'This Share Purchase Agreement ("Agreement") is entered into on [DATE] between [SELLER] and [BUYER].\n\n1. Definitions\nIn this Agreement, unless the context otherwise requires, capitalised terms shall have the meanings ascribed to them...\n\n2. Sale and Purchase\nSubject to the terms of this Agreement, the Seller shall sell and the Buyer shall purchase the Sale Shares free from all Encumbrances...',
      },
      {
        pageNumber: 2,
        heading: 'Consideration & Indemnity',
        content: '3. Consideration\nThe total consideration payable shall be INR [AMOUNT], payable in accordance with Schedule 2.\n\n4. Indemnity\nThe Seller shall indemnify the Buyer against all losses arising from any breach of the warranties set out in Schedule 3...',
      },
    ],
    aiAnalysis: {
      summary: 'Comprehensive 42-page Share Purchase Agreement covering sale of 100% equity stake in Acme Enterprises. Includes closing conditions, representations, warranties, tax indemnities capped at 25% of purchase price, and a 2-year non-compete covenant.',
      dates: ['Closing Date: 30 days from signing', 'Long Stop Date: 90 days from execution', 'Warranty Survival: 18 months from completion'],
      parties: ['Seller: Acme Holdings Private Limited', 'Buyer: Apex Strategic Capital Ltd'],
      obligations: ['Buyer to deposit escrow within 5 business days', 'Seller to obtain RoC and regulatory clearances', 'Transition services for 6 months post-closing'],
      clauses: ['Clause 7: Non-Compete & Non-Solicit', 'Clause 12: Governing Law & Arbitration (SIAC, Singapore)', 'Clause 14: Material Adverse Change (MAC)'],
      risks: ['Broad indemnity carve-out for environmental liabilities', 'Lack of explicit cap on fundamental warranty claims'],
      chronology: ['Execution -> Conditions Precedent Fulfillment -> Escrow Funding -> Closing & Share Transfer'],
    },
  },
  {
    _id: 'doc_002',
    title: 'Vendor Services Agreement.pdf',
    pages: 18,
    status: 'Ready',
    isConfidential: false,
    uploadDate: '10 Jun 2026',
    sections: [
      {
        pageNumber: 1,
        heading: 'MASTER SERVICES AGREEMENT',
        content: 'This Master Services Agreement is made between CloudTech Services and Themes Enterprise Solutions regarding cloud infrastructure management.',
      },
    ],
    aiAnalysis: {
      summary: 'Master vendor contract for cloud infrastructure management with 99.9% SLA guarantees, monthly invoicing, and mutual confidentiality.',
      dates: ['Effective Date: 01 Jul 2026', 'Term: 36 Months'],
      parties: ['Vendor: CloudTech Services Inc', 'Client: Themes Enterprise Solutions'],
      obligations: ['Provide 24/7 level-3 support', 'Monthly audit reports'],
      clauses: ['Clause 8: Limitation of Liability', 'Clause 11: Data Privacy & GDPR/DPDP compliance'],
      risks: ['Unilateral price escalation after 12 months with 30-day notice'],
      chronology: ['Drafted: 05 Jun 2026 -> Finalized: 10 Jun 2026'],
    },
  },
  {
    _id: 'doc_003',
    title: 'Order Copy - NCLT.pdf',
    pages: 9,
    status: 'Processing',
    isConfidential: false,
    uploadDate: '09 Jun 2026',
    sections: [
      {
        pageNumber: 1,
        heading: 'BEFORE THE NATIONAL COMPANY LAW TRIBUNAL, MUMBAI BENCH',
        content: 'In the matter of Corporate Insolvency Resolution Process under Section 7 of IBC, 2016.',
      },
    ],
    aiAnalysis: {
      summary: 'Interim order of NCLT Mumbai bench admitting Section 7 application and declaring moratorium under Section 14.',
      dates: ['Order Date: 08 Jun 2026'],
      parties: ['Financial Creditor: HDFC Bank', 'Corporate Debtor: Infra Buildcon Ltd'],
      obligations: ['IRP appointed to take custody of assets'],
      clauses: ['Moratorium declared under Sec 14'],
      risks: ['Pending appeals before NCLAT'],
      chronology: ['Filing -> Notice -> Admission Order'],
    },
  },
  {
    _id: 'doc_004',
    title: 'Employment Agreement - Draft.docx',
    pages: 6,
    status: 'Failed',
    isConfidential: false,
    uploadDate: '07 Jun 2026',
    sections: [],
    aiAnalysis: {
      summary: 'File processing encountered formatting errors. Please re-upload in standard PDF format.',
      dates: [],
      parties: [],
      obligations: [],
      clauses: [],
      risks: [],
      chronology: [],
    },
  },
];

// Initial Contracts Data
const defaultContracts = [
  {
    _id: 'cr_001',
    title: 'Vendor Services Agreement',
    type: 'Service Agreement',
    date: '12 Jun 2026',
    riskScore: 72,
    riskLevel: 'High',
    analysis: {
      criticalIssues: [
        'Unlimited liability clause on indemnification with no reciprocal cap',
        'Termination for convenience only available to vendor, not client',
        'Vague intellectual property assignment wording regarding pre-existing IP',
      ],
      recommendedAmendments: [
        'Insert cap on total liability equal to 12 months fees paid',
        'Add mutual 30-day termination for convenience clause',
        'Explicitly ring-fence customer background IP and data ownership',
      ],
      clausesReviewed: 34,
    },
  },
  {
    _id: 'cr_002',
    title: 'Mutual NDA – Zenith',
    type: 'NDA',
    date: '08 Jun 2026',
    riskScore: 34,
    riskLevel: 'Low',
    analysis: {
      criticalIssues: [
        'Standard 3-year survival term',
        'Standard carve-outs for publicly known information and compelled disclosure',
      ],
      recommendedAmendments: [
        'Add standard clause for immediate destruction of confidential records upon request',
      ],
      clausesReviewed: 14,
    },
  },
  {
    _id: 'cr_003',
    title: 'Employment Agreement',
    type: 'Employment',
    date: '03 Jun 2026',
    riskScore: 55,
    riskLevel: 'Medium',
    analysis: {
      criticalIssues: [
        'Non-compete clause duration of 18 months may be void under Section 27 of Indian Contract Act',
        'Non-solicitation clause lacks clear geographical limitation',
      ],
      recommendedAmendments: [
        'Limit post-employment covenants to non-solicitation of clients and staff for 12 months',
        'Clarify invention assignment procedure and dispute resolution via Indian arbitration',
      ],
      clausesReviewed: 22,
    },
  },
];

// Initial Tasks Data
const defaultTasks = [
  {
    _id: 'task_1',
    task: 'File reply in Acme matter',
    due: '20 Jun 2026',
    priority: 'High',
    status: 'To Do',
    assignee: 'Chirag Poshiya',
    matter: 'Acme Holdings vs ED',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'task_2',
    task: 'Review NDA - Zenith',
    due: '18 Jun 2026',
    priority: 'Medium',
    status: 'In Progress',
    assignee: 'Chirag Poshiya',
    matter: 'Zenith Telecom CIRP',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'task_3',
    task: 'Prepare hearing notes for SLP',
    due: '15 Jun 2026',
    priority: 'High',
    status: 'To Do',
    assignee: 'Chirag Poshiya',
    matter: 'Supreme Court - Special Leave Petition',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'task_4',
    task: 'Draft rejoinder affidavit',
    due: '22 Jun 2026',
    priority: 'Low',
    status: 'Done',
    assignee: 'Chirag Poshiya',
    matter: 'Commercial Suit 402/2026',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'task_5',
    task: 'Client briefing for settlement',
    due: '25 Jun 2026',
    priority: 'Medium',
    status: 'To Do',
    assignee: 'Chirag Poshiya',
    matter: 'Acme Holdings vs ED',
    createdAt: new Date().toISOString(),
  },
];

// Initial Calendar Events Data
const defaultEvents = [
  {
    _id: 'evt_1',
    date: '2026-06-15',
    title: 'Hearing - Acme matter',
    type: 'Hearing',
    time: '10:30 AM',
    matter: 'Acme Holdings vs Directorate of Enforcement',
    location: 'Supreme Court of India · Courtroom 3',
    notes: 'Special Leave Petition (SLP) hearing. Senior Advocate appearing.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'evt_2',
    date: '2026-06-18',
    title: 'NDA review due',
    type: 'Deadline',
    time: '05:00 PM',
    matter: 'Zenith Telecom CIRP',
    location: 'Internal Office',
    notes: 'Complete bilateral NDA markup and compliance review.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'evt_3',
    date: '2026-06-20',
    title: 'File reply',
    type: 'Task',
    time: '02:00 PM',
    matter: 'Acme Holdings vs ED',
    location: 'Registry Counter 4',
    notes: 'File rejoinder affidavit with supporting evidence annexures.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'evt_4',
    date: '2026-06-25',
    title: 'Client meeting',
    type: 'Meeting',
    time: '04:00 PM',
    matter: 'General Corporate Advisory',
    location: 'Conference Room Alpha / Virtual Video',
    notes: 'Quarterly review of pending litigation and statutory filings.',
    createdAt: new Date().toISOString(),
  },
];

// Seed storage initially
const initializeMemoryStore = async () => {
  if (memoryStore.judgments.length === 0) {
    memoryStore.judgments = [...defaultJudgments];
  }
  if (memoryStore.documents.length === 0) {
    memoryStore.documents = [...defaultDocuments];
  }
  if (memoryStore.contracts.length === 0) {
    memoryStore.contracts = [...defaultContracts];
  }
  if (memoryStore.tasks.length === 0) {
    memoryStore.tasks = defaultTasks.map((t) => ({ ...t, userId: 'user_cfsys' }));
  }
  if (memoryStore.events.length === 0) {
    memoryStore.events = defaultEvents.map((e) => ({ ...e, userId: 'user_cfsys' }));
  }

  // Pre-seed Admin and Demo User if empty
  if (memoryStore.users.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    const adminHashed = await bcrypt.hash('admin123', salt);

    // 1. Customer User requested by user: cfsys.xyz@gmail.com / 123456
    memoryStore.users.push({
      _id: 'user_cfsys',
      firstName: 'Chirag',
      lastName: 'Poshiya',
      email: 'cfsys.xyz@gmail.com',
      mobile: '+91 9876543210',
      professionalType: 'Advocate',
      organisationName: 'MYFINDI',
      password: hashedPassword,
      role: 'customer',
      plan: 'MYFINDI',
      credits: 500,
      permissions: {
        canResearch: true,
        canJudgments: true,
        canDocuments: true,
        canContracts: true,
        canDrafting: true,
        canMatters: true,
        canAdmin: false,
      },
      avatar: 'CP',
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    // 2. Admin User
    memoryStore.users.push({
      _id: 'user_admin',
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@legalai.in',
      mobile: '+91 9999999999',
      professionalType: 'Managing Partner',
      organisationName: 'Legal AI Legal Enterprise',
      password: adminHashed,
      role: 'admin',
      plan: 'Enterprise Admin',
      credits: 99999,
      permissions: {
        canResearch: true,
        canJudgments: true,
        canDocuments: true,
        canContracts: true,
        canDrafting: true,
        canMatters: true,
        canAdmin: true,
      },
      avatar: 'SA',
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    console.log('[Seeds] Pre-seeded users: admin@legalai.in (admin123) and cfsys.xyz@gmail.com (123456)');
  }
};

initializeMemoryStore();

module.exports = {
  memoryStore,
  defaultJudgments,
  defaultDocuments,
  defaultContracts,
  defaultTasks,
  defaultEvents,
};
