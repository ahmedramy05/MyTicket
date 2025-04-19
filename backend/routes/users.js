const express = require("express");
const router = express.Router();
const{
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserBookings,
  getUserEvents,
  getUserAnalytics
}
= require("../controllers/userController");
const authenticate = require("../middleware/authentication"); // Fix import path
const { authorizeRoles } = require("../middleware/authorization"); // Fix import path

router.get("/", authenticate, authorizeRoles("System Admin"), getAllUsers); 
router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);
router.get("/:id", authenticate, authorizeRoles("System Admin"), getUserById);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("System Admin"),
  updateUserRole
); // Update user role (admin)
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("System Admin"),
  deleteUser
); // Delete user (admin)
router.get(
  "/:id/bookings",
  authenticate,
  authorizeRoles("System Admin"),
  getUserBookings
); // Get user bookings (admin)
router.get(
  "/:id/events",
  authenticate,
  authorizeRoles("System Admin"),
  getUserEvents
); // Get user events (admin)
router.get(
  "/:id/analytics",
  authenticate,
  authorizeRoles("System Admin"),
  getUserAnalytics
); // Get user analytics (admin)

module.exports = router;