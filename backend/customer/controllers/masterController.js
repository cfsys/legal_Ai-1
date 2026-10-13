const MasterData = require('../models/MasterData');
const { getIsMongooseConnected } = require('../config/db');
const { sendSuccess, sendError } = require('../middleware/responseHandler');
const { ROLES } = require('../constants/enums');
const logger = require('../utils/logger');

// System reference categories that cannot be modified by customer accounts
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

// Initial seed dataset for all standard legal categories
const DEFAULT_MASTER_DATA = [
  // Court
  { category: 'Court', name: 'Supreme Court of India', code: 'SC', subType: 'Apex Court', jurisdiction: 'Pan-India', description: 'Apex constitutional and appellate court of India' },
  { category: 'Court', name: 'Delhi High Court', code: 'DHC', subType: 'High Court', jurisdiction: 'NCT of Delhi', description: 'High Court for National Capital Territory' },
  { category: 'Court', name: 'Bombay High Court', code: 'BHC', subType: 'High Court', jurisdiction: 'Maharashtra & Goa', description: 'High Court of Judicature at Bombay' },
  { category: 'Court', name: 'Calcutta High Court', code: 'CHC', subType: 'High Court', jurisdiction: 'West Bengal & A&N Islands', description: 'Oldest High Court in India' },
  { category: 'Court', name: 'Madras High Court', code: 'MHC', subType: 'High Court', jurisdiction: 'Tamil Nadu & Puducherry', description: 'Charter High Court of Madras' },
  { category: 'Court', name: 'Karnataka High Court', code: 'KHC', subType: 'High Court', jurisdiction: 'Karnataka', description: 'Principal Bench at Bengaluru' },
  { category: 'Court', name: 'National Company Law Tribunal (NCLT)', code: 'NCLT', subType: 'Tribunal', jurisdiction: 'Corporate Benches', description: 'Principal Bench New Delhi' },
  { category: 'Court', name: 'NCLAT New Delhi', code: 'NCLAT', subType: 'Appellate Tribunal', jurisdiction: 'National Appellate', description: 'Appellate tribunal for insolvency & company matters' },
  { category: 'Court', name: 'Income Tax Appellate Tribunal (ITAT)', code: 'ITAT', subType: 'Tax Tribunal', jurisdiction: 'Pan-India Benches', description: 'ITAT Mumbai Bench' },
  { category: 'Court', name: 'Securities Appellate Tribunal (SAT)', code: 'SAT', subType: 'Securities Tribunal', jurisdiction: 'Pan-India', description: 'SAT Mumbai' },

  // Bench
  { category: 'Bench', name: 'Principal Bench - New Delhi', code: 'PB-ND', subType: 'Division Bench', jurisdiction: 'New Delhi', description: 'Main administrative seat' },
  { category: 'Bench', name: 'Court No. 1 (Chief Justice Court)', code: 'C-01', subType: 'Chief Justice Bench', jurisdiction: 'Supreme Court', description: 'Division Bench' },
  { category: 'Bench', name: 'Commercial Appellate Division', code: 'CAD', subType: 'Special Commercial', jurisdiction: 'High Court of Delhi', description: 'Commercial disputes bench' },
  { category: 'Bench', name: 'Circuit Bench - Port Blair', code: 'CB-PB', subType: 'Circuit Registry', jurisdiction: 'Andaman & Nicobar', description: 'High Court Circuit' },
  { category: 'Bench', name: 'Special RERA Appellate Bench', code: 'RERA-B', subType: 'Appellate Roster', jurisdiction: 'State Tribunal', description: 'Real estate appellate tribunal' },

  // Judge
  { category: 'Judge', name: 'Hon’ble Chief Justice of India', code: 'CJI', subType: 'Chief Justice', jurisdiction: 'Supreme Court of India', description: 'Head of Indian Judiciary' },
  { category: 'Judge', name: 'Hon’ble Justice D.Y. Chandrachud (Former)', code: 'DYC', subType: 'Former CJI', jurisdiction: 'Supreme Court of India', description: '50th Chief Justice of India' },
  { category: 'Judge', name: 'Hon’ble Justice Sanjiv Khanna', code: 'SK', subType: 'Judge', jurisdiction: 'Supreme Court of India', description: 'Supreme Court of India' },
  { category: 'Judge', name: 'Hon’ble Justice B.R. Gavai', code: 'BRG', subType: 'Judge', jurisdiction: 'Supreme Court of India', description: 'Supreme Court of India' },
  { category: 'Judge', name: 'Hon’ble Justice Surya Kant', code: 'SRK', subType: 'Judge', jurisdiction: 'Supreme Court of India', description: 'Supreme Court of India' },

  // Act
  { category: 'Act', name: 'Constitution of India', code: 'COI-1950', subType: 'Constitutional', jurisdiction: 'Republic of India', description: 'Supreme law of India' },
  { category: 'Act', name: 'Insolvency and Bankruptcy Code, 2016', code: 'IBC-2016', subType: 'Central Statute', jurisdiction: 'Commercial Law', description: 'Insolvency resolution statutory framework' },
  { category: 'Act', name: 'Arbitration and Conciliation Act, 1996', code: 'ACA-1996', subType: 'Dispute Resolution', jurisdiction: 'Arbitration Law', description: 'Domestic & international commercial arbitration' },
  { category: 'Act', name: 'Companies Act, 2013', code: 'CA-2013', subType: 'Corporate Statute', jurisdiction: 'Ministry of Corporate Affairs', description: 'Corporate governance and statutory compliance' },
  { category: 'Act', name: 'Code of Civil Procedure, 1908', code: 'CPC-1908', subType: 'Procedural Code', jurisdiction: 'Civil Courts', description: 'Civil litigation procedure' },
  { category: 'Act', name: 'Specific Relief Act, 1963', code: 'SRA-1963', subType: 'Equitable Relief', jurisdiction: 'Civil Jurisdiction', description: 'Equitable and specific contractual remedies' },
  { category: 'Act', name: 'Prevention of Money Laundering Act, 2002', code: 'PMLA-2002', subType: 'Criminal / Economic', jurisdiction: 'Enforcement Directorate', description: 'Statutory enforcement regime' },

  // Section
  { category: 'Section', name: 'Section 7, IBC 2016 (Financial Creditor Petition)', code: 'IBC-S7', subType: 'IBC Provision', jurisdiction: 'NCLT Filing', description: 'Initiation of CIRP by financial creditor' },
  { category: 'Section', name: 'Section 9, IBC 2016 (Operational Creditor Demand)', code: 'IBC-S9', subType: 'IBC Provision', jurisdiction: 'NCLT Filing', description: 'Initiation of CIRP by operational creditor' },
  { category: 'Section', name: 'Section 11, Arbitration Act (Appointment of Arbitrator)', code: 'ACA-S11', subType: 'Arbitral Provision', jurisdiction: 'High Court / SC', description: 'Judicial power to appoint sole/tribunal arbitrator' },
  { category: 'Section', name: 'Section 34, Arbitration Act (Setting Aside Award)', code: 'ACA-S34', subType: 'Arbitral Challenge', jurisdiction: 'Commercial Court / HC', description: 'Challenge to arbitral award on statutory grounds' },
  { category: 'Section', name: 'Article 226, Constitution of India (Writ Jurisdiction)', code: 'COI-A226', subType: 'Constitutional Remedy', jurisdiction: 'High Courts', description: 'High Court extraordinary writ remedies' },
  { category: 'Section', name: 'Article 136, Constitution of India (Special Leave Petition)', code: 'COI-A136', subType: 'Appellate Discretion', jurisdiction: 'Supreme Court', description: 'Supreme Court discretionary appeal jurisdiction' },

  // Practice Area
  { category: 'Practice Area', name: 'Commercial Litigation', code: 'PA-LIT', subType: 'Core Dispute', jurisdiction: 'Commercial Courts & HCs', description: 'Complex commercial disputes' },
  { category: 'Practice Area', name: 'Insolvency & Bankruptcy (IBC)', code: 'PA-IBC', subType: 'Restructuring', jurisdiction: 'NCLT / NCLAT', description: 'Corporate insolvency resolution & liquidation' },
  { category: 'Practice Area', name: 'Arbitration & Alternative Dispute Resolution', code: 'PA-ADR', subType: 'ADR', jurisdiction: 'Domestic & International', description: 'Domestic & international arbitration' },
  { category: 'Practice Area', name: 'Corporate & M&A Advisory', code: 'PA-CORP', subType: 'Transactional', jurisdiction: 'Advisory', description: 'Transactional documentation & due diligence' },
  { category: 'Practice Area', name: 'Direct & Indirect Taxation', code: 'PA-TAX', subType: 'Tax Practice', jurisdiction: 'ITAT / High Courts', description: 'GST, Customs, and Income Tax proceedings' },
  { category: 'Practice Area', name: 'Intellectual Property Rights', code: 'PA-IPR', subType: 'IP Law', jurisdiction: 'Commercial Division', description: 'Trademarks, patents, and copyright litigation' },
  { category: 'Practice Area', name: 'White Collar Crime & PMLA Defense', code: 'PA-WCC', subType: 'Regulatory Defense', jurisdiction: 'Special PMLA Courts', description: 'Economic offenses and enforcement directorate' },

  // Case Type
  { category: 'Case Type', name: 'Special Leave Petition (Civil)', code: 'SLP(C)', subType: 'Appellate Filing', jurisdiction: 'Supreme Court of India', description: 'Supreme Court discretionary appeal' },
  { category: 'Case Type', name: 'Writ Petition (Civil)', code: 'WP(C)', subType: 'Constitutional Writ', jurisdiction: 'High Courts', description: 'Article 226 / 32 petition' },
  { category: 'Case Type', name: 'Company Petition (IBC)', code: 'CP(IB)', subType: 'Insolvency Petition', jurisdiction: 'NCLT Benches', description: 'NCLT insolvency petition' },
  { category: 'Case Type', name: 'Arbitration Petition', code: 'Arb.P.', subType: 'Arbitral Filing', jurisdiction: 'High Courts', description: 'Section 11 / 9 / 34 petition' },
  { category: 'Case Type', name: 'Commercial Suit', code: 'CS(COMM)', subType: 'Original Suit', jurisdiction: 'Commercial Division', description: 'Original jurisdiction commercial suit' },

  // Document Type
  { category: 'Document Type', name: 'Special Leave Petition (SLP)', code: 'DT-SLP', subType: 'Appellate Pleading', jurisdiction: 'Supreme Court', description: 'Supreme Court appellate petition' },
  { category: 'Document Type', name: 'Counter-Affidavit / Reply', code: 'DT-CA', subType: 'Defense Statement', jurisdiction: 'All Courts', description: 'Formal defense statement on oath' },
  { category: 'Document Type', name: 'Rejoinder Affidavit', code: 'DT-RA', subType: 'Rebuttal Pleading', jurisdiction: 'All Courts', description: 'Petitioner reply to counter affidavit' },
  { category: 'Document Type', name: 'Interlocutory Application (IA)', code: 'DT-IA', subType: 'Interim Motion', jurisdiction: 'All Courts', description: 'Interim relief / stay application' },
  { category: 'Document Type', name: 'Statutory Legal Notice', code: 'DT-LN', subType: 'Pre-litigation', jurisdiction: 'Notice Stage', description: 'Pre-litigation demand notice' },

  // Legal Template
  { category: 'Legal Template', name: 'Standard Non-Disclosure Agreement (NDA)', code: 'TPL-NDA', subType: 'Bilateral Agreement', jurisdiction: 'Commercial Contract', description: 'Mutual bilateral NDA' },
  { category: 'Legal Template', name: 'Master Services Agreement (MSA)', code: 'TPL-MSA', subType: 'Service Agreement', jurisdiction: 'Enterprise Drafting', description: 'Enterprise consulting services template' },
  { category: 'Legal Template', name: 'Share Purchase Agreement (SPA)', code: 'TPL-SPA', subType: 'Corporate M&A', jurisdiction: 'Transaction Law', description: 'Investment & M&A standard draft' },
  { category: 'Legal Template', name: 'Employment & Non-Compete Agreement', code: 'TPL-EMP', subType: 'Labor & Employment', jurisdiction: 'HR Compliance', description: 'C-Suite executive agreement' },

  // Clause
  { category: 'Clause', name: 'Governing Law and Exclusive Jurisdiction', code: 'CLS-GOV', subType: 'Jurisdiction', jurisdiction: 'Commercial Boilerplate', description: 'Governing law & seat of courts' },
  { category: 'Clause', name: 'Indemnity and Hold Harmless', code: 'CLS-IND', subType: 'Risk & Liability', jurisdiction: 'Commercial Contract', description: 'Mutual third-party indemnification' },
  { category: 'Clause', name: 'Limitation of Liability (Aggregate Cap)', code: 'CLS-LOL', subType: 'Financial Cap', jurisdiction: 'Risk Mitigation', description: 'Financial liability ceiling' },
  { category: 'Clause', name: 'Confidentiality and Trade Secrets Protection', code: 'CLS-CONF', subType: 'Intellectual Asset', jurisdiction: 'Restrictive Covenant', description: 'Surviving obligations' },
  { category: 'Clause', name: 'Force Majeure & Frustration', code: 'CLS-FM', subType: 'Performance Relief', jurisdiction: 'Standard Boilerplate', description: 'Unforeseen statutory events' },

  // Client
  { category: 'Client', name: 'Acme Holdings Private Limited', code: 'CL-ACME', subType: 'Conglomerate', jurisdiction: 'Domestic & Global', description: 'Multinational conglomerate' },
  { category: 'Client', name: 'Zenith Telecom Corporation', code: 'CL-ZENITH', subType: 'Telecom Provider', jurisdiction: 'Pan-India Circle', description: 'Telecommunications provider' },
  { category: 'Client', name: 'Apex Infrastructure & Logistics Ltd', code: 'CL-APEX', subType: 'Infrastructure Developer', jurisdiction: 'National Highways', description: 'Real estate & highway developer' },
  { category: 'Client', name: 'Nova FinTech Innovations LLP', code: 'CL-NOVA', subType: 'FinTech Startup', jurisdiction: 'Digital Banking', description: 'Digital banking infrastructure' },

  // Opposing Party
  { category: 'Opposing Party', name: 'Directorate of Enforcement (ED)', code: 'OP-ED', subType: 'Investigative Agency', jurisdiction: 'Government of India', description: 'Govt. investigative authority' },
  { category: 'Opposing Party', name: 'Deputy Commissioner of Income Tax', code: 'OP-ITD', subType: 'Revenue Department', jurisdiction: 'Ministry of Finance', description: 'Revenue department' },
  { category: 'Opposing Party', name: 'State Bank of India (Consortium Lead)', code: 'OP-SBI', subType: 'Secured Creditor', jurisdiction: 'Banking Sector', description: 'Secured institutional lender' },

  // Advocate
  { category: 'Advocate', name: 'Harish Salve, Senior Advocate', code: 'ADV-HS', subType: 'Senior Counsel', jurisdiction: 'Supreme Court & English Bar', description: 'Senior Counsel' },
  { category: 'Advocate', name: 'Mukul Rohatgi, Senior Advocate', code: 'ADV-MR', subType: 'Senior Counsel', jurisdiction: 'Supreme Court of India', description: 'Former Attorney General for India' },
  { category: 'Advocate', name: 'Abhishek Manu Singhvi, Senior Advocate', code: 'ADV-AMS', subType: 'Senior Counsel', jurisdiction: 'Supreme Court of India', description: 'Senior Counsel' },
  { category: 'Advocate', name: 'Divya Shah, Advocate on Record', code: 'ADV-DS', subType: 'Advocate on Record', jurisdiction: 'Supreme Court of India', description: 'Advocate-on-Record' },

  // Language
  { category: 'Language', name: 'English', code: 'LANG-EN', subType: 'Primary Court Language', jurisdiction: 'Supreme Court & High Courts', description: 'Standard court language' },
  { category: 'Language', name: 'Hindi', code: 'LANG-HI', subType: 'Official Language', jurisdiction: 'Subordinate & Northern HCs', description: 'Official language' },
  { category: 'Language', name: 'Marathi', code: 'LANG-MR', subType: 'Regional Language', jurisdiction: 'Bombay High Court & Lower Courts', description: 'Bombay High Court regional' },
  { category: 'Language', name: 'Gujarati', code: 'LANG-GU', subType: 'Regional Language', jurisdiction: 'Gujarat High Court & Tribunals', description: 'Gujarat High Court regional' },

  // Tags
  { category: 'Tags', name: 'IBC Section 7', code: 'TAG-IBC7', subType: 'Statutory Citation', jurisdiction: 'Research Tag', description: 'Taxonomy tag' },
  { category: 'Tags', name: 'Supreme Court Precedent', code: 'TAG-SC', subType: 'Judicial Precedent', jurisdiction: 'Case Law Tag', description: 'Binding ratio decidendi' },
  { category: 'Tags', name: 'Interim Injunction', code: 'TAG-INJ', subType: 'Interim Relief', jurisdiction: 'Motion Tag', description: 'Urgent stay relief' },
  { category: 'Tags', name: 'Commercial Court Act', code: 'TAG-CCA', subType: 'Statutory Regime', jurisdiction: 'Procedure Tag', description: 'Specified value claims' },
];

// In-memory fallback if MongoDB connection is pending
let memoryMasterData = [...DEFAULT_MASTER_DATA.map((item, idx) => ({ ...item, _id: `mem_master_${idx}` }))];

// Seed helper
const ensureSeeded = async () => {
  if (getIsMongooseConnected()) {
    const count = await MasterData.countDocuments();
    if (count === 0) {
      await MasterData.insertMany(DEFAULT_MASTER_DATA);
      logger.info('MasterData', `Seeded ${DEFAULT_MASTER_DATA.length} initial master records into MongoDB Atlas`);
    }
  }
};

// @desc    Get master data statistics / counts grouped by category
// @route   GET /api/masters/stats
// @access  Public / Protected
const getMasterStats = async (req, res) => {
  try {
    if (getIsMongooseConnected()) {
      await ensureSeeded();
      const stats = await MasterData.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);

      const countsMap = {};
      stats.forEach((item) => {
        countsMap[item._id] = item.count;
      });

      return sendSuccess(res, countsMap, 'Master statistics retrieved successfully');
    } else {
      const countsMap = {};
      memoryMasterData.forEach((item) => {
        countsMap[item.category] = (countsMap[item.category] || 0) + 1;
      });
      return sendSuccess(res, countsMap, 'Master statistics retrieved (memory mode)');
    }
  } catch (error) {
    logger.error('MasterData', 'Failed to retrieve master statistics', error);
    return sendError(res, 'Failed to retrieve master statistics', 500, error);
  }
};

// @desc    Get master data items by category
// @route   GET /api/masters
// @access  Public / Protected
const getMasterItems = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (getIsMongooseConnected()) {
      await ensureSeeded();
      const filter = { isActive: true };
      if (category) filter.category = category;
      if (search && search.trim()) {
        const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [
          { name: { $regex: escaped, $options: 'i' } },
          { code: { $regex: escaped, $options: 'i' } },
        ];
      }

      const items = await MasterData.find(filter).sort({ name: 1 });
      logger.info('MasterData', `Retrieved ${items.length} master items for category "${category || 'All'}" from MongoDB Atlas`);
      return sendSuccess(res, items, 'Master data items retrieved');
    } else {
      let filtered = memoryMasterData.filter((i) => i.isActive !== false);
      if (category) filtered = filtered.filter((i) => i.category.toLowerCase() === category.toLowerCase());
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (i) => i.name.toLowerCase().includes(q) || (i.code && i.code.toLowerCase().includes(q))
        );
      }
      return sendSuccess(res, filtered, 'Master data items retrieved (memory mode)');
    }
  } catch (error) {
    logger.error('MasterData', 'Failed to get master items', error);
    return sendError(res, 'Failed to get master items', 500, error);
  }
};

// @desc    Create a new master data record in MongoDB Atlas
// @route   POST /api/masters
// @access  Public / Protected
const createMasterItem = async (req, res) => {
  try {
    const { category, name, code, description, subType, jurisdiction, metadata } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const isAdmin = req.user && (req.user.role === ROLES.ADMIN || req.user.role === 1 || req.user.role === 'admin');

    if (!category || !category.trim()) {
      return sendError(res, 'Category is required', 400);
    }
    if (!name || !name.trim()) {
      return sendError(res, 'Item name is required', 400);
    }

    const trimmedCat = category.trim();

    // Customers cannot add system reference data (Court, Bench, Judge, Act, Section, etc.)
    if (SYSTEM_MASTER_CATEGORIES.includes(trimmedCat) && !isAdmin) {
      return sendError(
        res,
        `Customer accounts cannot create system reference records in "${trimmedCat}". Standard registries are maintained centrally by Legal AI platform administrators.`,
        403
      );
    }

    if (getIsMongooseConnected()) {
      const created = await MasterData.create({
        category: trimmedCat,
        name: name.trim(),
        code: code ? code.trim() : '',
        description: description ? description.trim() : '',
        subType: subType ? subType.trim() : '',
        jurisdiction: jurisdiction ? jurisdiction.trim() : '',
        metadata: metadata || {},
        user: userId,
      });

      logger.info('MasterData', `Created new master item "${created.name}" in category "${created.category}" in MongoDB Atlas`);
      return sendSuccess(res, created, `"${created.name}" saved to ${created.category} in database`, 201);
    } else {
      const newItem = {
        _id: `mem_master_${Date.now()}`,
        category: trimmedCat,
        name: name.trim(),
        code: code ? code.trim() : '',
        description: description ? description.trim() : '',
        subType: subType ? subType.trim() : '',
        jurisdiction: jurisdiction ? jurisdiction.trim() : '',
        metadata: metadata || {},
        isActive: true,
      };
      memoryMasterData.push(newItem);
      return sendSuccess(res, newItem, `"${newItem.name}" saved to ${newItem.category} (memory mode)`, 201);
    }
  } catch (error) {
    logger.error('MasterData', 'Failed to create master item', error);
    return sendError(res, 'Failed to create master item', 500, error);
  }
};

// @desc    Delete a master data item from MongoDB Atlas
// @route   DELETE /api/masters/:id
// @access  Public / Protected
const deleteMasterItem = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user && (req.user.role === ROLES.ADMIN || req.user.role === 1 || req.user.role === 'admin');

    if (getIsMongooseConnected()) {
      const existing = await MasterData.findById(id);
      if (!existing) {
        return sendError(res, 'Master data record not found', 404);
      }

      // Check if trying to delete system reference data as customer
      if (SYSTEM_MASTER_CATEGORIES.includes(existing.category) && !isAdmin) {
        return sendError(
          res,
          `Customer accounts cannot delete system reference records from "${existing.category}". Only platform administrators can modify standard registries.`,
          403
        );
      }

      const deleted = await MasterData.findByIdAndDelete(id);
      logger.info('MasterData', `Deleted master item "${deleted.name}" (${id}) from MongoDB Atlas`);
      return sendSuccess(res, { id }, `Deleted record from database`);
    } else {
      const existing = memoryMasterData.find((i) => i._id === id || i.id === id);
      if (existing && SYSTEM_MASTER_CATEGORIES.includes(existing.category) && !isAdmin) {
        return sendError(
          res,
          `Customer accounts cannot delete system reference records from "${existing.category}". Only platform administrators can modify standard registries.`,
          403
        );
      }

      memoryMasterData = memoryMasterData.filter((i) => i._id !== id && i.id !== id);
      return sendSuccess(res, { id }, 'Record deleted (memory mode)');
    }
  } catch (error) {
    logger.error('MasterData', 'Failed to delete master item', error);
    return sendError(res, 'Failed to delete master item', 500, error);
  }
};

module.exports = {
  getMasterStats,
  getMasterItems,
  createMasterItem,
  deleteMasterItem,
};
