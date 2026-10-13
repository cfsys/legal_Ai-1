const express = require('express');
const router = express.Router();
const { getResearch, getResearchById, createResearch, askThemesAi } = require('../controllers/researchController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/roleMiddleware');

router.use(protect, requirePermission('canResearch'));

router.get('/', getResearch);
router.get('/:id', getResearchById);
router.post('/', createResearch);
router.post('/ask', askThemesAi);

module.exports = router;

