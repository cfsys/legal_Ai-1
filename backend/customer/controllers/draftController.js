const Draft = require('../models/Draft');
const { getIsMongooseConnected } = require('../config/db');
const { memoryStore } = require('../services/storage');
const APP_STRINGS = require('../constants/appStrings');
const { sendSuccess, sendError } = require('../middleware/responseHandler');
const logger = require('../utils/logger');

// @desc    Get all drafts for current user
// @route   GET /api/drafts
// @access  Private
const getDrafts = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getIsMongooseConnected()) {
      const drafts = await Draft.find({ user: userId }).sort({ createdAt: -1 });
      logger.info('Drafts', `Retrieved ${drafts.length} drafts for user: ${req.user.email}`);
      return sendSuccess(res, drafts, 'Drafts retrieved successfully');
    } else {
      const userDrafts = memoryStore.drafts.filter(
        (d) => (d.user?.toString() || d.userId?.toString()) === userId.toString()
      );
      logger.info('Drafts', `Retrieved ${userDrafts.length} memory-store drafts for user: ${req.user.email}`);
      return sendSuccess(res, userDrafts, 'Drafts retrieved successfully');
    }
  } catch (error) {
    logger.error('Drafts', 'Failed to retrieve drafts', error);
    return sendError(res, error.message || APP_STRINGS.DRAFT.FETCH_FAILED, 500, error);
  }
};


// @desc    Save a generated draft
// @route   POST /api/drafts
// @access  Private
const createDraft = async (req, res) => {
  try {
    const { instructions, content, matter } = req.body;
    const draftType = req.body.draftType || req.body.category || req.body.title || 'Legal Document';
    const userId = req.user._id || req.user.id;

    if (!content) {
      return sendError(res, APP_STRINGS.DRAFT.TYPE_CONTENT_REQUIRED, 400);
    }

    if (getIsMongooseConnected()) {
      const newDraft = await Draft.create({
        user: userId,
        draftType,
        instructions: instructions || '',
        content,
        matter: matter || 'General Legal Practice',
        status: 'Saved',
      });
      logger.info('Drafts', `Created draft in MongoDB: "${draftType}" (${content.length} chars) for user: ${req.user.email}`);
      return sendSuccess(res, newDraft, APP_STRINGS.DRAFT.CREATE_SUCCESS, 201);
    } else {
      const newDraft = {
        _id: `draft_${Date.now()}`,
        userId: userId.toString(),
        draftType,
        instructions: instructions || '',
        content,
        matter: matter || 'General Legal Practice',
        status: 'Saved',
        createdAt: new Date().toISOString(),
      };
      memoryStore.drafts.unshift(newDraft);
      logger.info('Drafts', `Created draft in memory-store: "${draftType}" (${content.length} chars) for user: ${req.user.email}`);
      return sendSuccess(res, newDraft, APP_STRINGS.DRAFT.CREATE_SUCCESS, 201);
    }
  } catch (error) {
    logger.error('Drafts', 'Failed to create draft', error);
    return sendError(res, error.message || APP_STRINGS.DRAFT.CREATE_FAILED, 500, error);
  }
};

// @desc    Delete a draft
// @route   DELETE /api/drafts/:id
// @access  Private
const deleteDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (getIsMongooseConnected()) {
      const deleted = await Draft.findOneAndDelete({ _id: id, user: userId });
      if (!deleted) {
        logger.warn('Drafts', `Draft ${id} not found for deletion`);
        return sendError(res, APP_STRINGS.DRAFT.NOT_FOUND, 404);
      }
      logger.info('Drafts', `Deleted draft ${id} from MongoDB for user: ${req.user.email}`);
      return sendSuccess(res, { id }, APP_STRINGS.DRAFT.DELETE_SUCCESS);
    } else {
      const draftIndex = memoryStore.drafts.findIndex((d) => d._id.toString() === id.toString());
      if (draftIndex === -1) {
        logger.warn('Drafts', `Memory-store draft ${id} not found for deletion`);
        return sendError(res, APP_STRINGS.DRAFT.NOT_FOUND, 404);
      }
      memoryStore.drafts.splice(draftIndex, 1);
      logger.info('Drafts', `Deleted memory-store draft ${id} for user: ${req.user.email}`);
      return sendSuccess(res, { id }, APP_STRINGS.DRAFT.DELETE_SUCCESS);
    }
  } catch (error) {
    logger.error('Drafts', `Failed to delete draft ${req.params.id}`, error);
    return sendError(res, error.message || APP_STRINGS.DRAFT.DELETE_FAILED, 500, error);
  }
};


module.exports = {
  getDrafts,
  createDraft,
  deleteDraft,
};
