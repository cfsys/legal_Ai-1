const express = require('express');
const router = express.Router();
const { globalSearch } = require('../controllers/searchController');
const { optionalProtect } = require('../middleware/authMiddleware');

// Route for dynamic database and legal search
router.get('/', optionalProtect, globalSearch);

module.exports = router;

