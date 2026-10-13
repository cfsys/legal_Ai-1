const express = require('express');
const router = express.Router();
const { getMatters, createMatter, updateMatter, deleteMatter } = require('../controllers/matterController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/roleMiddleware');

router.use(protect, requirePermission('canMatters'));

router.get('/', getMatters);
router.post('/', createMatter);
router.put('/:id', updateMatter);
router.delete('/:id', deleteMatter);

module.exports = router;
