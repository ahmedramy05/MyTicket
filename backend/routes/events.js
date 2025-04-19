const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getAllEventsAdmin,
  updateEventStatus,
} = require("../controllers/eventController");
const authenticate = require("../middleware/authentication"); // Fix import path
const { authorize } = require("../middleware/authorization"); // Fix import path

// Public routes
router.get("/", getAllEvents); // Get all events (public)
router.get("/:id", getEventById); // Get single event (public)

// Protected routes
router.post("/", authenticate, authorize("Organizer"), createEvent); // Create event (organizer) #path, authentication,authorization, function name
router.put(
  "/:id",
  authenticate,
  authorize("Organizer", "System Admin"),
  updateEvent
);

router.delete(
  "/:id",
  authenticate,
  authorize("Organizer", "System Admin"),
  deleteEvent
); // Delete event (organizer/admin)

router.put(
  "/:id/status",
  authenticate,
  authorize("System Admin"),
  updateEventStatus
); // Update event status (admin)

// Organizer-specific routes
router.get(
  "/user/events",
  authenticate,
  authorize("Organizer"),
  getOrganizerEvents
); // Get organizer's events

// Admin routes
router.get("/all", authenticate, authorize("System Admin"), getAllEventsAdmin); // Get all events (admin)

module.exports = router;
