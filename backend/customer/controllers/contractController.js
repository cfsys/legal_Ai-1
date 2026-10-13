const Contract = require('../models/Contract');
const { getIsMongooseConnected } = require('../config/db');
const { memoryStore } = require('../services/storage');
const APP_STRINGS = require('../constants/appStrings');
const { sendSuccess, sendError } = require('../middleware/responseHandler');

// Helper to normalize contract riskLevel for frontend display
const normalizeContract = (c) => {
  if (!c) return c;
  const plain = typeof c.toObject === 'function' ? c.toObject() : { ...c };
  if (plain.riskLevel === 1 || plain.riskLevel === '1') plain.riskLevel = 'Low';
  else if (plain.riskLevel === 2 || plain.riskLevel === '2') plain.riskLevel = 'Medium';
  else if (plain.riskLevel === 3 || plain.riskLevel === '3') plain.riskLevel = 'High';
  return plain;
};

// @desc    Get all contract reviews
// @route   GET /api/contracts
// @access  Private
const getContracts = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    if (getIsMongooseConnected()) {
      const contracts = await Contract.find({ user: userId }).sort({ createdAt: -1 });
      const formatted = contracts.map(normalizeContract);
      return sendSuccess(res, formatted, 'Contracts retrieved successfully');
    } else {
      const userContracts = memoryStore.contracts.filter(
        (c) => (c.user?.toString() || c.userId?.toString()) === userId.toString()
      );
      const formatted = userContracts.map(normalizeContract);
      return sendSuccess(res, formatted, 'Contracts retrieved successfully');
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.CONTRACT.FETCH_FAILED, 500, error);
  }
};

// @desc    Get contract review by ID
// @route   GET /api/contracts/:id
// @access  Private
const getContractById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMongooseConnected()) {
      const contract = await Contract.findById(id);
      if (!contract) return sendError(res, APP_STRINGS.CONTRACT.NOT_FOUND, 404);
      return sendSuccess(res, normalizeContract(contract), 'Contract retrieved successfully');
    } else {
      const contract = memoryStore.contracts.find((c) => c._id === id || c._id.toString() === id.toString());
      if (!contract) return sendError(res, APP_STRINGS.CONTRACT.NOT_FOUND, 404);
      return sendSuccess(res, normalizeContract(contract), 'Contract retrieved successfully');
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.CONTRACT.RETRIEVE_FAILED, 500, error);
  }
};

// @desc    Create new contract review
// @route   POST /api/contracts
// @access  Private
const createContractReview = async (req, res) => {
  try {
    const { title, type, content } = req.body;
    const userId = req.user._id || req.user.id;

    if (!title) {
      return sendError(res, APP_STRINGS.CONTRACT.TITLE_REQUIRED, 400);
    }

    const riskScore = Math.floor(Math.random() * 45) + 30; // 30-75
    const riskLevel = riskScore > 65 ? 'High' : riskScore > 40 ? 'Medium' : 'Low';

    const newContractData = {
      title,
      type: type || 'Commercial Agreement',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      riskScore,
      riskLevel,
      analysis: {
        criticalIssues: [
          'Uncapped indemnity for third-party intellectual property claims',
          'Absence of force majeure clause addressing statutory disruptions',
          'Notice requirement period of 3 business days for default rectification is overly stringent',
        ],
        recommendedAmendments: [
          'Limit liability cap to aggregate contract value',
          'Insert balanced 15-day cure notice period before termination',
        ],
        clausesReviewed: 28,
      },
    };

    if (getIsMongooseConnected()) {
      const contract = await Contract.create({ ...newContractData, user: userId });
      return sendSuccess(res, contract, 'Contract review created', 201);
    } else {
      const contract = {
        _id: `cr_${Date.now()}`,
        user: userId.toString(),
        ...newContractData,
      };
      memoryStore.contracts.unshift(contract);
      return sendSuccess(res, contract, 'Contract review created', 201);
    }
  } catch (error) {
    return sendError(res, error.message || APP_STRINGS.CONTRACT.ANALYSIS_FAILED, 500, error);
  }
};

module.exports = {
  getContracts,
  getContractById,
  createContractReview,
};
