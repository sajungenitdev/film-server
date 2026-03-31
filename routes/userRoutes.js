const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getDashboardStats,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getMe,
  updateProfile,
  deleteAccount,
} = require("../controllers/authController");

const router = express.Router();

// Profile routes for authenticated users (no admin required)
router.get("/profile", protect, getMe);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteAccount);

// Stats route for authenticated users
router.get("/stats", protect, async (req, res) => {
  try {
    // Return user stats (adjust based on your models)
    res.json({
      success: true,
      data: {
        totalProjects: 0,
        completedTasks: 0,
        pendingTasks: 0,
        contributions: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin only routes
router.use(protect);
router.use(adminOnly);

router.get("/dashboard/stats", getDashboardStats);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
