const express = require('express');
const router = express.Router();
const {
  getDrafts,
  createDraft,
  deleteDraft,
} = require('../controllers/draftController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getDrafts);
router.post('/', createDraft);
router.delete('/:id', deleteDraft);

module.exports = router;
