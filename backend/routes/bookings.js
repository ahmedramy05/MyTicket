const express = require("express");
const {
  createBooking,
  cancelBooking,
  getBooking,
} = require("../controllers/bookingController");
const authenticate = require("../middleware/authentication");

const router = express.Router();

// @desc    Create a booking
// @route   POST /api/v1/bookings
// @access  Private (User)
router.post("/", authenticate, createBooking); // Create booking (user)

// @desc    Cancel a booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private (User)
router.delete("/:id", authenticate, cancelBooking); // Cancel booking (user)

// @desc    Get booking details
// @route   GET /api/v1/bookings/:id
// @access  Private (User)
router.get("/:id", authenticate, getBooking); // Get booking details (user)

module.exports = router;
