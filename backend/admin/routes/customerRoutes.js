const express = require('express');
const router = express.Router();
const {
  getCustomerAiModels,
  getCustomerMasterData,
  getCustomerQuota,
} = require('../controllers/customerController');

// Customer-Facing Routes (Accessible by the legal_ai frontend)
router.get('/ai-models', getCustomerAiModels);
router.get('/models', getCustomerAiModels);
router.get('/masters', getCustomerMasterData);
router.get('/quota', getCustomerQuota);

module.exports = router;
