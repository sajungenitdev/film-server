const express = require('express');
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getDashboardStats
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here require admin access
router.use(protect);
router.use(adminOnly);

// Admin routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;