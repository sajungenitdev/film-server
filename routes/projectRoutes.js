const express = require('express');
const {
    createProject,
    getAllProjects,
    getUserProjects,
    getProjectById,
    getProjectBySlug,
    updateProject,
    deleteProject,
    addReview,
    submitProject
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/slug/:slug', getProjectBySlug);
router.get('/:id', getProjectById);

// Protected routes (require authentication)
router.use(protect);

router.post('/', createProject);
router.get('/user/my-projects', getUserProjects);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/reviews', addReview);
router.post('/submit', submitProject);  // Make sure this line exists

// Admin only routes
router.get('/admin/all', adminOnly, getAllProjects);

// Test route to verify router is working
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Project routes are working!' });
});

module.exports = router;