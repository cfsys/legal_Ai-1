const Judgment = require('../models/Judgment');
const Matter = require('../models/Matter');
const Document = require('../models/Document');
const Research = require('../models/Research');
const Contract = require('../models/Contract');
const Task = require('../models/Task');
const { getIsMongooseConnected } = require('../config/db');
const { memoryStore, defaultJudgments } = require('../services/storage');
const { sendSuccess } = require('../middleware/responseHandler');
const logger = require('../utils/logger');
const { escapeRegex } = require('../utils/sanitize');

// Essential workspace quick actions
const WORKSPACE_QUICK_ACTIONS = [
  {
    id: 'action-ai',
    category: 'Actions',
    title: 'Ask Legal AI',
    subtitle: 'Ask legal questions grounded in Indian Supreme Court & High Court law',
    path: '/app/ai',
    iconType: 'Sparkles',
    badge: 'AI Assistant',
    badgeColor: '#2563eb',
    badgeBg: '#eff6ff',
    keywords: ['ask', 'ai', 'question', 'research', 'reasoning', 'assistant'],
  },
  {
    id: 'action-judgments',
    category: 'Actions',
    title: 'Judgment Precedent Search',
    subtitle: 'Search 75+ years of Indian case law, headnotes, ratio and citations',
    path: '/app/judgments',
    iconType: 'Scale',
    badge: 'Case Law',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
    keywords: ['judgment', 'judgments', 'precedent', 'case law', 'citation', 'sc', 'supreme court'],
  },
  {
    id: 'action-research-new',
    category: 'Actions',
    title: 'New Legal Research Memorandum',
    subtitle: 'Generate citation-backed structured legal memorandum',
    path: '/app/research/new',
    iconType: 'FileText',
    badge: 'New Memo',
    badgeColor: '#7c3aed',
    badgeBg: '#f5f3ff',
    keywords: ['research', 'memo', 'memorandum', 'draft memo', 'citation research'],
  },
  {
    id: 'action-documents',
    category: 'Actions',
    title: 'Document Analysis & Clause Review',
    subtitle: 'Upload agreements and run 8 AI Assistant analysis actions',
    path: '/app/documents',
    iconType: 'FileText',
    badge: 'Analysis',
    badgeColor: '#0284c7',
    badgeBg: '#f0f9ff',
    keywords: ['document', 'documents', 'upload', 'clauses', 'pdf', 'contract'],
  },
  {
    id: 'action-matters',
    category: 'Actions',
    title: 'Litigation Matters & Case Files',
    subtitle: 'Manage client case briefs, hearing calendars and cause lists',
    path: '/app/matters',
    iconType: 'Layers',
    badge: 'Litigation',
    badgeColor: '#d97706',
    badgeBg: '#fffbeb',
    keywords: ['matter', 'matters', 'case', 'litigation', 'hearing', 'client'],
  },
];

// Helper to normalize judgment status
const getStatusLabel = (st) => {
  if (st === 1 || st === '1' || st === 'Good Law') return 'Good Law';
  if (st === 2 || st === '2' || st === 'Distinguished') return 'Distinguished';
  if (st === 3 || st === '3' || st === 'Overruled') return 'Overruled';
  return 'Precedent';
};

// @desc    Dynamic global search querying MongoDB across Judgments, Matters, Docs, Research & Actions
// @route   GET /api/search
// @access  Private
const globalSearch = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const queryStr = (req.query.q || req.query.search || '').trim();
    const isMongoose = getIsMongooseConnected();

    let judgments = [];
    let matters = [];
    let documents = [];
    let researches = [];
    let contracts = [];
    let tasks = [];

    if (queryStr) {
      const regex = new RegExp(escapeRegex(queryStr), 'i');

      if (isMongoose) {
        // 1. Dynamic Search in Judgments
        try {
          judgments = await Judgment.find({
            $or: [
              { title: regex },
              { citation: regex },
              { headnote: regex },
              { judges: regex },
              { 'actsAndSections.act': regex },
              { 'actsAndSections.section': regex },
              { ratioDecidendi: regex },
            ],
          })
            .sort({ decisionDate: -1 })
            .limit(5);
        } catch (e) {
          logger.warn('Search', `Judgments query error: ${e.message}`);
        }

        // 2. Dynamic Search in Matters
        try {
          matters = await Matter.find({
            $or: [{ user: userId }, { isPublic: true }, {}],
            $and: [
              {
                $or: [
                  { title: regex },
                  { clientName: regex },
                  { court: regex },
                  { matterNumber: regex },
                  { stage: regex },
                  { status: regex },
                ],
              },
            ],
          })
            .sort({ updatedAt: -1 })
            .limit(4);
        } catch (e) {
          logger.warn('Search', `Matters query error: ${e.message}`);
        }

        // 3. Dynamic Search in Documents
        try {
          documents = await Document.find({
            $or: [{ user: userId }, { isPublic: true }, {}],
            $and: [
              {
                $or: [
                  { title: regex },
                  { description: regex },
                  { fileType: regex },
                  { tags: regex },
                ],
              },
            ],
          })
            .sort({ updatedAt: -1 })
            .limit(4);
        } catch (e) {
          logger.warn('Search', `Documents query error: ${e.message}`);
        }

        // 4. Dynamic Search in Research
        try {
          researches = await Research.find({
            $or: [
              { title: regex },
              { question: regex },
              { jurisdiction: regex },
            ],
          })
            .sort({ updatedAt: -1 })
            .limit(3);
        } catch (e) {
          logger.warn('Search', `Research query error: ${e.message}`);
        }

        // 5. Dynamic Search in Contracts
        try {
          contracts = await Contract.find({
            $or: [
              { title: regex },
              { agreementType: regex },
            ],
          })
            .sort({ updatedAt: -1 })
            .limit(3);
        } catch (e) {
          logger.warn('Search', `Contracts query error: ${e.message}`);
        }

        // 6. Dynamic Search in Tasks
        try {
          tasks = await Task.find({
            $or: [
              { title: regex },
              { assignedTo: regex },
            ],
          })
            .limit(2);
        } catch (e) {}
      } else {
        // Fallback in memoryStore
        const q = queryStr.toLowerCase();
        judgments = (memoryStore.judgments || defaultJudgments || [])
          .filter(
            (j) =>
              (j.title && j.title.toLowerCase().includes(q)) ||
              (j.citation && j.citation.toLowerCase().includes(q)) ||
              (j.headnote && j.headnote.toLowerCase().includes(q)) ||
              (j.judges && j.judges.toLowerCase().includes(q))
          )
          .slice(0, 5);

        matters = (memoryStore.matters || [])
          .filter(
            (m) =>
              (m.title && m.title.toLowerCase().includes(q)) ||
              (m.clientName && m.clientName.toLowerCase().includes(q)) ||
              (m.court && m.court.toLowerCase().includes(q))
          )
          .slice(0, 4);

        documents = (memoryStore.documents || [])
          .filter(
            (d) =>
              (d.title && d.title.toLowerCase().includes(q)) ||
              (d.description && d.description.toLowerCase().includes(q))
          )
          .slice(0, 4);
      }
    } else {
      // EMPTY QUERY: Focused search bar -> Display active, relevant legal items
      if (isMongoose) {
        try {
          judgments = await Judgment.find({})
            .sort({ decisionDate: -1 })
            .limit(4);
        } catch (e) {}

        try {
          matters = await Matter.find({ $or: [{ user: userId }, {}] })
            .sort({ updatedAt: -1 })
            .limit(3);
        } catch (e) {}

        try {
          documents = await Document.find({ $or: [{ user: userId }, {}] })
            .sort({ updatedAt: -1 })
            .limit(3);
        } catch (e) {}

        try {
          researches = await Research.find({ $or: [{ user: userId }, {}] })
            .sort({ updatedAt: -1 })
            .limit(2);
        } catch (e) {}
      } else {
        judgments = (memoryStore.judgments || defaultJudgments || []).slice(0, 4);
        matters = (memoryStore.matters || []).slice(0, 3);
        documents = (memoryStore.documents || []).slice(0, 3);
      }
    }

    // Format all results into clean, unified search objects
    const formattedResults = [];

    // 1. Format Judgments
    judgments.forEach((j) => {
      const statusLabel = getStatusLabel(j.status);
      formattedResults.push({
        id: `judgment-${j._id || j.id}`,
        category: 'Judgments',
        title: j.title || 'Untitled Judgment',
        subtitle: `${j.court || 'Supreme Court of India'} · ${j.citation || ''}${j.bench ? ` · ${j.bench}` : ''}`,
        path: `/app/judgments/${j._id || j.id}`,
        iconType: 'Scale',
        badge: statusLabel,
        badgeColor:
          statusLabel === 'Good Law'
            ? '#059669'
            : statusLabel === 'Distinguished'
            ? '#d97706'
            : '#dc2626',
        badgeBg:
          statusLabel === 'Good Law'
            ? '#ecfdf5'
            : statusLabel === 'Distinguished'
            ? '#fffbeb'
            : '#fef2f2',
      });
    });

    // 2. Format Matters
    matters.forEach((m) => {
      formattedResults.push({
        id: `matter-${m._id || m.id}`,
        category: 'Matters',
        title: m.title || 'Untitled Matter',
        subtitle: `${m.court || 'Supreme Court'} · Client: ${m.clientName || 'Confidential'}${m.matterNumber ? ` · ${m.matterNumber}` : ''}`,
        path: '/app/matters',
        iconType: 'Layers',
        badge: m.nextHearing
          ? `Hearing: ${new Date(m.nextHearing).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
          : m.stage || m.status || 'Active',
        badgeColor: '#0284c7',
        badgeBg: '#f0f9ff',
      });
    });

    // 3. Format Documents
    documents.forEach((d) => {
      formattedResults.push({
        id: `doc-${d._id || d.id}`,
        category: 'Documents',
        title: d.title || 'Untitled Document',
        subtitle: `${d.pages ? `${d.pages} pages` : 'Document'} · ${d.category || 'Uploaded Legal Brief'}`,
        path: `/app/documents/${d._id || d.id}`,
        iconType: 'FileText',
        badge: (d.fileType || 'PDF').toUpperCase(),
        badgeColor: '#059669',
        badgeBg: '#ecfdf5',
      });
    });

    // 4. Format Research Memorandums
    researches.forEach((r) => {
      formattedResults.push({
        id: `research-${r._id || r.id}`,
        category: 'Research',
        title: r.title || r.question || 'Legal Memorandum',
        subtitle: `${r.jurisdiction || 'Indian Law'} · ${r.depth || 'AI Research'}`,
        path: `/app/research/${r._id || r.id}`,
        iconType: 'Sparkles',
        badge: 'AI Memo',
        badgeColor: '#2563eb',
        badgeBg: '#eff6ff',
      });
    });

    // 5. Format Contracts
    contracts.forEach((c) => {
      formattedResults.push({
        id: `contract-${c._id || c.id}`,
        category: 'Contracts',
        title: c.title || 'Commercial Agreement',
        subtitle: `${c.agreementType || 'Agreement'} · Risk Score: ${c.riskScore ?? 45}/100`,
        path: '/app/documents',
        iconType: 'FileText',
        badge: c.riskLevel || 'Review',
        badgeColor: '#d97706',
        badgeBg: '#fffbeb',
      });
    });

    // 6. Format Tasks
    tasks.forEach((t) => {
      formattedResults.push({
        id: `task-${t._id || t.id}`,
        category: 'Tasks',
        title: t.title,
        subtitle: `Priority: ${t.priority || 'Normal'} · ${t.assignedTo || 'Assigned'}`,
        path: '/app/tasks',
        iconType: 'CheckSquare',
        badge: t.status || 'Pending',
        badgeColor: '#d97706',
        badgeBg: '#fffbeb',
      });
    });

    // 7. Matching Quick Workspace Actions
    const matchingActions = WORKSPACE_QUICK_ACTIONS.filter((item) => {
      if (!queryStr) return true; // Show actions when empty
      const q = queryStr.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
      );
    });

    // Include actions
    matchingActions.slice(0, queryStr ? 2 : 3).forEach((act) => {
      formattedResults.push(act);
    });

    return sendSuccess(res, formattedResults, 'Search results retrieved successfully');
  } catch (error) {
    logger.error('Search', `Global search failed: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to perform search',
      data: WORKSPACE_QUICK_ACTIONS,
    });
  }
};

module.exports = {
  globalSearch,
};
