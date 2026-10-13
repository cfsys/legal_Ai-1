const Judgment = require('../models/Judgment');
const { getIsMongooseConnected } = require('../config/db');
const { memoryStore } = require('../services/storage');
const APP_STRINGS = require('../constants/appStrings');
const { sendSuccess, sendError } = require('../middleware/responseHandler');

// Helper to normalize status for client display
const normalizeJudgment = (j) => {
  if (!j) return j;
  const plain = typeof j.toObject === 'function' ? j.toObject() : { ...j };
  if (plain.status === 1 || plain.status === '1') plain.status = 'Good Law';
  else if (plain.status === 2 || plain.status === '2') plain.status = 'Distinguished';
  else if (plain.status === 3 || plain.status === '3') plain.status = 'Overruled';
  return plain;
};

// @desc    Search and filter judgments
// @route   GET /api/judgments
// @access  Private
// @desc    Search and filter judgments dynamically
// @route   GET /api/judgments
// @access  Private
const getJudgments = async (req, res) => {
  try {
    const {
      q,
      court,
      status,
      act,
      section,
      judge,
      bench,
      fromDate,
      toDate,
      year,
      searchMode,
    } = req.query;

    const STATUS_MAP = {
      'Good Law': [1, '1', 'Good Law', 'good law'],
      'Distinguished': [2, '2', 'Distinguished', 'distinguished'],
      'Overruled': [3, '3', 'Overruled', 'overruled'],
    };

    if (getIsMongooseConnected()) {
      let query = {};
      const andConditions = [];

      // Keyword / Text Query
      if (q && q.trim()) {
        const trimmed = q.trim();
        if (searchMode === 'Citation') {
          andConditions.push({ citation: { $regex: trimmed, $options: 'i' } });
        } else if (searchMode === 'Exact Phrase') {
          andConditions.push({
            $or: [
              { title: { $regex: trimmed, $options: 'i' } },
              { headnote: { $regex: trimmed, $options: 'i' } },
              { ratioDecidendi: { $regex: trimmed, $options: 'i' } },
              { fullText: { $regex: trimmed, $options: 'i' } },
            ],
          });
        } else {
          // AI Search, Semantic, Keyword
          andConditions.push({
            $or: [
              { title: { $regex: trimmed, $options: 'i' } },
              { citation: { $regex: trimmed, $options: 'i' } },
              { headnote: { $regex: trimmed, $options: 'i' } },
              { judges: { $regex: trimmed, $options: 'i' } },
              { ratioDecidendi: { $regex: trimmed, $options: 'i' } },
              { aiSummary: { $regex: trimmed, $options: 'i' } },
              { 'actsAndSections.act': { $regex: trimmed, $options: 'i' } },
              { 'actsAndSections.section': { $regex: trimmed, $options: 'i' } },
              { highlights: { $regex: trimmed, $options: 'i' } },
            ],
          });
        }
      }

      // Court Filter
      if (court && court !== 'All Courts' && court !== 'Any Court') {
        andConditions.push({ court: { $regex: court, $options: 'i' } });
      }

      // Status Filter
      if (status && status !== 'Any Status') {
        const allowed = STATUS_MAP[status] || [status];
        andConditions.push({ status: { $in: allowed } });
      }

      // Act Filter
      if (act && act.trim() && act !== 'All Acts' && act !== 'Any Act') {
        andConditions.push({
          $or: [
            { 'actsAndSections.act': { $regex: act.trim(), $options: 'i' } },
            { headnote: { $regex: act.trim(), $options: 'i' } },
            { ratioDecidendi: { $regex: act.trim(), $options: 'i' } },
          ],
        });
      }

      // Section Filter
      if (section && section.trim()) {
        andConditions.push({
          $or: [
            { 'actsAndSections.section': { $regex: section.trim(), $options: 'i' } },
            { headnote: { $regex: section.trim(), $options: 'i' } },
          ],
        });
      }

      // Judge Filter
      if (judge && judge.trim() && judge !== 'All Judges') {
        andConditions.push({ judges: { $regex: judge.trim(), $options: 'i' } });
      }

      // Bench Filter
      if (bench && bench.trim() && bench !== 'All Benches' && bench !== 'Any Bench') {
        andConditions.push({ bench: { $regex: bench.trim(), $options: 'i' } });
      }

      // Year Filter
      if (year && year.trim() && year !== 'All Years') {
        andConditions.push({ decisionDate: { $regex: `^${year.trim()}` } });
      }

      // Date Range Filters
      if (fromDate && fromDate.trim()) {
        andConditions.push({ decisionDate: { $gte: fromDate.trim() } });
      }
      if (toDate && toDate.trim()) {
        andConditions.push({ decisionDate: { $lte: toDate.trim() } });
      }

      if (andConditions.length > 0) {
        query.$and = andConditions;
      }

      const judgments = await Judgment.find(query).sort({ decisionDate: -1 });
      const formatted = judgments.map(normalizeJudgment);
      return sendSuccess(res, formatted, 'Judgments retrieved successfully');
    } else {
      let results = [...memoryStore.judgments];

      if (q && q.trim()) {
        const qLower = q.trim().toLowerCase();
        if (searchMode === 'Citation') {
          results = results.filter((j) => j.citation?.toLowerCase().includes(qLower));
        } else {
          results = results.filter((j) => {
            const matchesText =
              j.title?.toLowerCase().includes(qLower) ||
              j.citation?.toLowerCase().includes(qLower) ||
              j.headnote?.toLowerCase().includes(qLower) ||
              j.judges?.toLowerCase().includes(qLower) ||
              j.ratioDecidendi?.toLowerCase().includes(qLower) ||
              j.aiSummary?.toLowerCase().includes(qLower) ||
              (j.highlights && j.highlights.some((h) => h.toLowerCase().includes(qLower))) ||
              (j.actsAndSections &&
                j.actsAndSections.some(
                  (a) =>
                    a.act?.toLowerCase().includes(qLower) ||
                    a.section?.toLowerCase().includes(qLower)
                ));
            return matchesText;
          });
        }
      }

      if (court && court !== 'All Courts' && court !== 'Any Court') {
        results = results.filter((j) =>
          j.court?.toLowerCase().includes(court.toLowerCase())
        );
      }

      if (status && status !== 'Any Status') {
        const allowed = STATUS_MAP[status] || [status];
        results = results.filter((j) => allowed.includes(j.status));
      }

      if (act && act.trim() && act !== 'All Acts' && act !== 'Any Act') {
        const actLower = act.trim().toLowerCase();
        results = results.filter(
          (j) =>
            (j.actsAndSections &&
              j.actsAndSections.some((a) => a.act?.toLowerCase().includes(actLower))) ||
            j.headnote?.toLowerCase().includes(actLower)
        );
      }

      if (section && section.trim()) {
        const secLower = section.trim().toLowerCase();
        results = results.filter(
          (j) =>
            (j.actsAndSections &&
              j.actsAndSections.some((a) => a.section?.toLowerCase().includes(secLower))) ||
            j.headnote?.toLowerCase().includes(secLower)
        );
      }

      if (judge && judge.trim() && judge !== 'All Judges') {
        const judgeLower = judge.trim().toLowerCase();
        results = results.filter((j) => j.judges?.toLowerCase().includes(judgeLower));
      }

      if (bench && bench.trim() && bench !== 'All Benches' && bench !== 'Any Bench') {
        const benchLower = bench.trim().toLowerCase();
        results = results.filter((j) => j.bench?.toLowerCase().includes(benchLower));
      }

      if (year && year.trim() && year !== 'All Years') {
        results = results.filter((j) => j.decisionDate?.startsWith(year.trim()));
      }

      if (fromDate && fromDate.trim()) {
        results = results.filter((j) => j.decisionDate >= fromDate.trim());
      }
      if (toDate && toDate.trim()) {
        results = results.filter((j) => j.decisionDate <= toDate.trim());
      }

      const formatted = results.map(normalizeJudgment);
      return sendSuccess(res, formatted, 'Judgments retrieved successfully');
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.JUDGMENT.SEARCH_FAILED, 500, error);
  }
};

// @desc    Get single judgment by ID
// @route   GET /api/judgments/:id
// @access  Private
const getJudgmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMongooseConnected()) {
      const judgment = await Judgment.findById(id);
      if (!judgment) return sendError(res, APP_STRINGS.JUDGMENT.NOT_FOUND, 404);
      return sendSuccess(res, normalizeJudgment(judgment), 'Judgment retrieved successfully');
    } else {
      const judgment = memoryStore.judgments.find((j) => j._id === id || j._id.toString() === id.toString());
      if (!judgment) return sendError(res, APP_STRINGS.JUDGMENT.NOT_FOUND, 404);
      return sendSuccess(res, normalizeJudgment(judgment), 'Judgment retrieved successfully');
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.JUDGMENT.RETRIEVE_FAILED, 500, error);
  }
};

module.exports = {
  getJudgments,
  getJudgmentById,
};
