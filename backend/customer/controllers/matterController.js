const Matter = require('../models/Matter');
const { getIsMongooseConnected } = require('../config/db');
const { memoryStore } = require('../services/storage');
const APP_STRINGS = require('../constants/appStrings');
const { sendSuccess, sendError } = require('../middleware/responseHandler');
const logger = require('../utils/logger');
const { escapeRegex } = require('../utils/sanitize');

// @desc    Get all matters
// @route   GET /api/matters
// @access  Private
// @desc    Get all matters with backend search and pagination
// @route   GET /api/matters
// @access  Private
const getMatters = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { search, q, page, limit } = req.query;
    const searchQuery = (search || q || '').trim();
    const hasPagination = page !== undefined || limit !== undefined;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    if (getIsMongooseConnected()) {
      const filter = { user: userId };
      if (searchQuery) {
        const regex = new RegExp(escapeRegex(searchQuery), 'i');
        filter.$or = [
          { title: regex },
          { clientName: regex },
          { court: regex },
          { matterNumber: regex },
          { stage: regex },
          { status: regex },
        ];
      }

      const total = await Matter.countDocuments(filter);
      const query = Matter.find(filter).sort({ createdAt: -1 });
      if (hasPagination) {
        query.skip(skip).limit(limitNum);
      }
      const matters = await query;
      logger.info('Matters', `Retrieved ${matters.length} matters for user: ${req.user.email} (search: "${searchQuery}", page: ${pageNum})`);

      if (hasPagination) {
        return sendSuccess(res, {
          data: matters,
          pagination: {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1,
            limit: limitNum,
          },
        }, 'Matters retrieved successfully');
      }

      return sendSuccess(res, matters, 'Matters retrieved successfully');
    } else {
      let matters = memoryStore.matters.filter((m) => m.userId === userId.toString());
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        matters = matters.filter((m) =>
          (m.title || '').toLowerCase().includes(lowerQ) ||
          (m.clientName || '').toLowerCase().includes(lowerQ) ||
          (m.court || '').toLowerCase().includes(lowerQ) ||
          (m.matterNumber || '').toLowerCase().includes(lowerQ) ||
          (m.stage || '').toLowerCase().includes(lowerQ)
        );
      }
      const total = matters.length;
      if (hasPagination) {
        const paginated = matters.slice(skip, skip + limitNum);
        return sendSuccess(res, {
          data: paginated,
          pagination: {
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum) || 1,
            limit: limitNum,
          },
        }, 'Matters retrieved successfully');
      }
      return sendSuccess(res, matters, 'Matters retrieved successfully');
    }
  } catch (error) {
    logger.error('Matters', 'Failed to retrieve matters', error);
    return sendError(res, error.message || APP_STRINGS.MATTER.FETCH_FAILED, 500, error);
  }
};


// @desc    Create a new matter
// @route   POST /api/matters
// @access  Private
const createMatter = async (req, res) => {
  try {
    const { title, court, stage, nextHearingDate } = req.body;
    const clientName = req.body.clientName || req.body.client;
    const userId = req.user._id || req.user.id;

    if (!title || !clientName) {
      return sendError(res, APP_STRINGS.MATTER.FIELDS_REQUIRED, 400);
    }

    const matterNumber = `MAT-${Date.now().toString().slice(-6)}`;

    if (getIsMongooseConnected()) {
      const matter = await Matter.create({
        user: userId,
        title,
        matterNumber,
        clientName,
        court: court || 'Supreme Court of India',
        stage: stage || 'Pre-litigation / Research',
        nextHearingDate: nextHearingDate || '',
      });
      logger.info('Matters', `Created new matter in MongoDB: "${title}" (${matterNumber}) for client: ${clientName}`);
      return sendSuccess(res, matter, APP_STRINGS.MATTER.CREATE_SUCCESS, 201);
    } else {
      const newMatter = {
        _id: `mat_${Date.now()}`,
        userId: userId.toString(),
        title,
        matterNumber,
        clientName,
        court: court || 'Supreme Court of India',
        stage: stage || 'Pre-litigation / Research',
        status: 'Active',
        nextHearingDate: nextHearingDate || '',
        createdAt: new Date().toISOString(),
      };
      memoryStore.matters.unshift(newMatter);
      logger.info('Matters', `Created new matter in memory-store: "${title}" (${matterNumber}) for client: ${clientName}`);
      return sendSuccess(res, newMatter, APP_STRINGS.MATTER.CREATE_SUCCESS, 201);
    }
  } catch (error) {
    logger.error('Matters', 'Failed to create matter', error);
    return sendError(res, error.message || APP_STRINGS.MATTER.CREATE_FAILED, 500, error);
  }
};


// @desc    Update a matter
// @route   PUT /api/matters/:id
// @access  Private
const updateMatter = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, clientName, court, stage, status, nextHearingDate } = req.body;
    const userId = req.user._id || req.user.id;

    if (getIsMongooseConnected()) {
      const matter = await Matter.findOne({ _id: id, user: userId });
      if (!matter) {
        return sendError(res, 'Matter not found or unauthorized', 404);
      }
      if (title !== undefined) matter.title = title;
      if (clientName !== undefined) matter.clientName = clientName;
      if (court !== undefined) matter.court = court;
      if (stage !== undefined) matter.stage = stage;
      if (status !== undefined) matter.status = status;
      if (nextHearingDate !== undefined) matter.nextHearingDate = nextHearingDate;
      await matter.save();
      logger.info('Matters', `Updated matter: ${matter.matterNumber} (${matter.title})`);
      return sendSuccess(res, matter, 'Matter updated successfully');
    } else {
      const index = memoryStore.matters.findIndex((m) => m._id === id && m.userId === userId.toString());
      if (index === -1) {
        return sendError(res, 'Matter not found or unauthorized', 404);
      }
      const existing = memoryStore.matters[index];
      const updated = {
        ...existing,
        title: title !== undefined ? title : existing.title,
        clientName: clientName !== undefined ? clientName : existing.clientName,
        court: court !== undefined ? court : existing.court,
        stage: stage !== undefined ? stage : existing.stage,
        status: status !== undefined ? status : existing.status,
        nextHearingDate: nextHearingDate !== undefined ? nextHearingDate : existing.nextHearingDate,
        updatedAt: new Date().toISOString(),
      };
      memoryStore.matters[index] = updated;
      logger.info('Matters', `Updated memory-store matter: ${updated.matterNumber}`);
      return sendSuccess(res, updated, 'Matter updated successfully');
    }
  } catch (error) {
    logger.error('Matters', 'Failed to update matter', error);
    return sendError(res, error.message || 'Failed to update matter', 500, error);
  }
};

// @desc    Delete a matter
// @route   DELETE /api/matters/:id
// @access  Private
const deleteMatter = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (getIsMongooseConnected()) {
      const matter = await Matter.findOneAndDelete({ _id: id, user: userId });
      if (!matter) {
        return sendError(res, 'Matter not found or unauthorized', 404);
      }
      logger.info('Matters', `Deleted matter: ${matter.matterNumber}`);
      return sendSuccess(res, { id }, 'Matter deleted successfully');
    } else {
      const index = memoryStore.matters.findIndex((m) => m._id === id && m.userId === userId.toString());
      if (index === -1) {
        return sendError(res, 'Matter not found or unauthorized', 404);
      }
      memoryStore.matters.splice(index, 1);
      return sendSuccess(res, { id }, 'Matter deleted successfully');
    }
  } catch (error) {
    logger.error('Matters', 'Failed to delete matter', error);
    return sendError(res, error.message || 'Failed to delete matter', 500, error);
  }
};

module.exports = {
  getMatters,
  createMatter,
  updateMatter,
  deleteMatter,
};
