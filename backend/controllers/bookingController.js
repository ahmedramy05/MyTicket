const Booking = require("../Models/Booking");
const Event = require("../Models/Event");
const ErrorResponse = require("../../utils/ErrorResponse");
const createBooking = async (req, res, next) => {
  try {
    const { eventId, tickets } = req.body;

    // Get event
    const event = await Event.findById(eventId);

    if (!event) {
      return next(
        new ErrorResponse(`Event not found with id of ${eventId}`, 404)
      );
    }

    // Check if event is approved
    if (event.status !== "approved") {
      return next(
        new ErrorResponse("Cannot book tickets for unapproved event", 400)
      );
    }

    // Check ticket availability
    if (tickets > event.availableTickets) {
      return next(
        new ErrorResponse(
          `Only ${event.availableTickets} tickets available`,
          400
        )
      );
    }

    // Calculate total price
    const totalPrice = event.ticketPrice * tickets;

    // Create booking
    const booking = await Booking.create({
      eventId,
      userId: req.user.id,
      numberOfTickets: tickets,
      totalPrice,
    });

    // Update available tickets
    event.availableTickets -= tickets;
    await event.save();

    res.status(201).json({
      success: true,
      data: booking,  
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private (User)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    if (booking.isCancelled) {
      return next(new ErrorResponse("Booking is already cancelled", 400));
    }

    // Get event and update available tickets
    const event = await Event.findById(booking.eventId);
    event.availableTickets += booking.numberOfTickets;
    await event.save();

    // Update booking status
    booking.isCancelled = true;
    await booking.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a specific booking
// @route   GET /api/v1/bookings/:id
// @access  Private (User)
const getBooking = async (req, res, next) => {
  try {
    // Find booking by ID and verify it belongs to the current user
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate({
      path: "eventId",  // Use the correct field name from the schema
      select: "title date location ticketPrice status",
    });

    if (!booking) {
      return next(
        new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  cancelBooking,
  getBooking,
};
