const express = require('express');
const router = express.Router();
const {
  getMasterStats,
  getMasterItems,
  createMasterItem,
  deleteMasterItem,
} = require('../controllers/masterController');
const { protect } = require('../middleware/authMiddleware');

// Mount routes with protect
router.use(protect);

router.get('/stats', getMasterStats);
router.get('/', getMasterItems);
router.post('/', createMasterItem);
router.delete('/:id', deleteMasterItem);

module.exports = router;
