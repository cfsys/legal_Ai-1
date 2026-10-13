const express = require('express');
const router = express.Router();
const { getJudgments, getJudgmentById } = require('../controllers/judgmentController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/roleMiddleware');

router.use(protect, requirePermission('canJudgments'));

router.get('/', getJudgments);
router.get('/:id', getJudgmentById);

module.exports = router;
