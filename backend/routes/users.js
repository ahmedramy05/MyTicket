const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserBookings,
  getUserEvents,
  getUserAnalytics,
} = require("../controllers/userController");

const authenticate = require("../middleware/authentication"); // Fix import path
const { authorize } = require("../middleware/authorization"); // Fix import path

router.get("/", authenticate, authorize("System Admin"), getAllUsers);

router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);
router.get("/:id", authenticate, authorize("System Admin"), getUserById);
router.put("/:id", authenticate, authorize("System Admin"), updateUserRole); // Update user role (admin)
router.delete("/:id", authenticate, authorize("System Admin"), deleteUser); // Delete user (admin)
router.get(
  "/:id/bookings",
  authenticate,
  authorize("System Admin"),
  getUserBookings
); // Get user bookings (admin)
router.get(
  "/:id/events",
  authenticate,
  authorize("System Admin"),
  getUserEvents
); // Get user events (admin)
router.get(
  "/:id/analytics",
  authenticate,
  authorize("System Admin"),
  getUserAnalytics
); // Get user analytics (admin)

module.exports = router;
