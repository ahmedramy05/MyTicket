const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUserProfile,
} = require("../controllers/userController");
const authenticate = require("../middleware/authentication");
const { authorize } = require("../middleware/authorization");

// Routes

// Public routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login a user

// Authenticated user routes
router.get("/profile", authenticate, updateUserProfile); // Get current user's profile
router.put("/profile", authenticate, updateUserProfile); // Update current user's profile

// Admin routes
router.get(
  "/",
  authenticate,
  authorize("System Admin"),
  async (req, res) => {}
); // Get a list of all users

router.get(
  "/:id",
  authenticate,
  authorize("System Admin"),
  async (req, res) => {}
); // Get details of a single user

router.put(
  "/:id",
  authenticate,
  authorize("System Admin"),
  async (req, res) => {}
); // Update user's role

router.delete(
  "/:id",
  authenticate,
  authorize("System Admin"),
  async (req, res) => {}
); // Delete a user

// Standard User routes
router.get(
  "/bookings",
  authenticate,
  authorize("Standard User"),
  async (req, res) => {}
); // Get current user's bookings

// Event Organizer routes
router.get(
  "/events",
  authenticate,
  authorize("Organizer"),
  async (req, res) => {}
); // Get current user's events

router.get(
  "/events/analytics",
  authenticate,
  authorize("Organizer"),
  async (req, res) => {}
); // Get analytics of current user's events

module.exports = router;
