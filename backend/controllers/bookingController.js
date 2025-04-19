const Booking = require('../Models/Booking');
const Event = require('../Models/Event');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, tickets } = req.body;

    // Get event
    const event = await Event.findById(eventId);

    if (!event) {
      return next(new ErrorResponse(`Event not found with id of ${eventId}`, 404));
    }

    // Check if event is approved
    if (event.status !== 'approved') {
      return next(new ErrorResponse('Cannot book tickets for unapproved event', 400));
    }

    // Check ticket availability
    if (tickets > event.availableTickets) {
      return next(new ErrorResponse(`Only ${event.availableTickets} tickets available`, 400));
    }

    // Calculate total price
    const totalPrice = event.price * tickets;

    // Create booking
    const booking = await Booking.create({
      event: eventId,
      user: req.user.id,
      tickets,
      totalPrice
    });

    // Update available tickets
    event.availableTickets -= tickets;
    await event.save();

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private (User)
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!booking) {
      return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
    }

    if (booking.isCancelled) {
      return next(new ErrorResponse('Booking is already cancelled', 400));
    }

    // Get event and update available tickets
    const event = await Event.findById(booking.event);
    event.availableTickets += booking.tickets;
    await event.save();

    // Update booking status
    booking.isCancelled = true;
    await booking.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};