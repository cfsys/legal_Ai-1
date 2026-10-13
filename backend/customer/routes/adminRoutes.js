const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserPermissions,
  updateUserProfile,
  deleteUser,
  getAdminStats,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// All admin routes require authentication and admin role
router.use(protect, isAdmin);

router.get('/users', getAllUsers);
router.put('/users/:id/permissions', updateUserPermissions);
router.put('/users/:id', updateUserProfile);
router.delete('/users/:id', deleteUser);
router.get('/stats', getAdminStats);

module.exports = router;
