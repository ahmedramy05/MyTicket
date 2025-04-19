const express = require("express");
const router = express.Router();
const {
  createEvent,
  updateEventStatus,
  deleteEvent,
  getAllEvents,
  getOrganizerAnalytics,
  updateEvent,
  getEventById,
  getOrganizerEvents,
} = require("../controllers/eventController");
const authenticate = require("../middleware/authentication"); // Fix import path
const { authorizeRoles } = require("../middleware/authorization"); // Fix import path

// Public routes
router.get("/", getAllEvents); // Get all events (public)
router.get("/:id", getEventById); // Get single event (public)

// Protected routes
router.post("/", authenticate, authorizeRoles("Organizer"), createEvent); // Create event (organizer) #path, authentication,authorization, function name
router.put(
  "/:id",
  authenticate,
  authorizeRoles("Organizer", "System Admin"),
  updateEvent
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("Organizer", "System Admin"),
  deleteEvent
); // Delete event (organizer/admin)

router.put(
  "/:id/status",
  authenticate,
  authorizeRoles("System Admin"),
  updateEventStatus
); // Update event status (admin)

// Organizer-specific routes
router.get(
  "/user/events",
  authenticate,
  authorizeRoles("Organizer"),
  getOrganizerEvents
); // Get organizer's events


// Admin routes
router.get(
  "/all",
  authenticate,
  authorizeRoles("System Admin"),
  getAllEventsAdmin
); // Get all events (admin)

module.exports = router;
