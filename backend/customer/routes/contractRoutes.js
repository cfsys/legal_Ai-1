const express = require('express');
const router = express.Router();
const {
  getContracts,
  getContractById,
  createContractReview,
} = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/roleMiddleware');

router.use(protect, requirePermission('canContracts'));

router.get('/', getContracts);
router.get('/:id', getContractById);
router.post('/', createContractReview);

module.exports = router;
