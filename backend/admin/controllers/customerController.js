const adminStorage = require('../services/storageService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * Customer-Facing Controller
 * Exposes ONLY sanitized, client-safe configurations added by the Admin.
 * Sensitive data (margins, costs, backend GPU infrastructure, internal bitmasks) are stripped.
 */

// @desc    Get Available AI Models for Customer Side (Ask Legal AI / Drafting)
// @route   GET /api/customer/ai-models
const getCustomerAiModels = async (req, res) => {
  try {
    const models = await adminStorage.getCustomerAiModels();
    return sendSuccess(res, {
      count: models.length,
      models,
    }, 'Available AI models retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get Sanitized Master Legal Taxonomies for Case Filing & Forms
// @route   GET /api/customer/masters
const getCustomerMasterData = async (req, res) => {
  try {
    const { category, search } = req.query;
    const rawResult = await adminStorage.getMasterData({ category, search, limit: 1000 });
    const allMasters = Array.isArray(rawResult) ? rawResult : (rawResult?.items || []);
    
    // Only return active records and client-facing fields
    const clientMasters = allMasters
      .filter((m) => m.isActive !== false)
      .map((m) => ({
        id: m.id || m._id,
        category: m.category,
        name: m.name,
        code: m.code,
        tier: m.tier,
        jurisdiction: m.jurisdiction,
        description: m.description,
        act: m.act,
        benches: m.benches,
        templateContent: m.templateContent,
      }));

    return sendSuccess(res, {
      count: clientMasters.length,
      category: category || 'all',
      items: clientMasters,
    }, 'Master taxonomies retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

// @desc    Get Current Customer AI Quota & Remaining Balance
// @route   GET /api/customer/quota
const getCustomerQuota = async (req, res) => {
  try {
    const quotas = await adminStorage.getAiQuotas();
    const userBalance = req.user?.credits || 84250;
    const dailyLimit = 100000;
    const usedToday = 15750;

    return sendSuccess(res, {
      balance: userBalance,
      dailyLimit,
      usedToday,
      remainingToday: Math.max(0, dailyLimit - usedToday),
      percentUsed: Math.round((usedToday / dailyLimit) * 100),
      currency: 'Legal AI Credits',
    });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getCustomerAiModels,
  getCustomerMasterData,
  getCustomerQuota,
};
