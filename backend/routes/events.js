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
const authenticate = require("../middleware/authentication");
const { authorize } = require("../middleware/authorization");

// Public routes
router.get("/", getAllEvents); // Get all events (public)

// Admin routes - MOVED UP before /:id
router.get("/all", authenticate, authorize("System Admin"), getAllEventsAdmin);

// Organizer-specific routes - MOVED UP before /:id
router.get(
  "/user/events",
  authenticate,
  authorize("Organizer"),
  getOrganizerEvents
);

// This wildcard route must come AFTER any specific routes
router.get("/:id", getEventById); // Get single event (public)

// Protected routes
router.post("/", authenticate, authorize("Organizer"), createEvent);

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
);

router.put(
  "/:id/status",
  authenticate,
  authorize("System Admin"),
  updateEventStatus
);

module.exports = router;