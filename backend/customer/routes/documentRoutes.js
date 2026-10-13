const express = require('express');
const router = express.Router();
const {
  getDocuments,
  getDocumentById,
  uploadDocument,
  runDocumentAction,
  deleteDocument,
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/roleMiddleware');
router.use(protect, requirePermission('canDocuments'));
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/', uploadDocument);
router.post('/:id/action', runDocumentAction);
router.delete('/:id', deleteDocument);
module.exports = router;

