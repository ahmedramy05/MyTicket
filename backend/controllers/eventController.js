const Event = require("../models/eventModel");

// Create Event (Organizer-Only)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, ticketPrice, totalTickets } = req.body;

    // Validate required fields
    if (!title || !date || !location || !ticketPrice || !totalTickets) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      ticketPrice,
      totalTickets,
      remainingTickets: totalTickets,
      organizer: req.user.id, // From authMiddleware
      status: "pending", // Requires admin approval
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Event Status (Admin-Only)
const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "pending", "declined"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!event) return res.status(404).json({ error: "Event not found." });
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Event (Admin or Organizer)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });

    // Check if user is admin OR the original organizer
    if (req.user.role !== "admin" && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized." });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Approved Events (Public)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Organizer's Events & Analytics (Organizer-Only)
const getOrganizerAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    
    const analytics = events.map(event => ({
      eventId: event._id,
      title: event.title,
      percentageBooked: ((event.totalTickets - event.remainingTickets) / event.totalTickets * 100).toFixed(2) + "%"
    }));

    res.json(analytics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Event Details (Organizer-Only)
const updateEvent = async (req, res) => {
  try {
    const { totalTickets, date, location } = req.body;
    const eventId = req.params.id;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found." });

    // Check if user is the organizer of this event
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized. You can only update your own events." });
    }

    // Update only the allowed fields (tickets, date, location)
    const updates = {};
    if (totalTickets) {
      updates.totalTickets = totalTickets;
      // Adjust availableTickets based on how many are already sold
      const ticketsSold = event.totalTickets - event.remainingTickets;
      updates.remainingTickets = totalTickets - ticketsSold;

      // Check if new total is valid
      if (updates.remainingTickets < 0) {
        return res.status(400).json({ error: "Cannot reduce tickets below number already sold." });
      }
    }
    
    if (date) updates.date = date;
    if (location) updates.location = location;

    // Apply updates
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updates,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Single Event (Public)
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found." });

    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Organizer's Events (Organizer-Only)
const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createEvent,
  updateEventStatus,
  deleteEvent,
  getAllEvents,
  getOrganizerAnalytics,
  updateEvent,
  getEventById,
  getOrganizerEvents
};