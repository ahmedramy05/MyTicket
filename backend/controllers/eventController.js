const Event = require("../Models/Event"); // Updated import path
const Booking = require("../Models/Booking"); // Added for potential future booking integrations

// Create Event (Organizer-Only)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      ticketPrice,
      totalTickets,
    } = req.body;

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
      availableTickets: totalTickets, // Match your schema field name
      Organizer: req.user.id, // Match your schema field name (capitalized)
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

    // Improved role checking with readable variables
    const isAdmin = req.user.role === "System Admin";
    
    // Handle both lowercase and uppercase field names
    const organizerId = event.Organizer || event.organizer;
    const isOrganizer = organizerId ? organizerId.toString() === req.user.id : false;

    if (!isAdmin && !isOrganizer) {
      return res.status(403).json({ error: "Unauthorized." });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Approved Events (Public) - With filtering
const getAllEvents = async (req, res) => {
  try {
    const { category, location, date } = req.query;
    const filters = { status: "approved" };

    // Apply optional filters from query parameters
    if (category) filters.category = category;
    if (location) filters.location = location;
    if (date) filters.date = { $gte: new Date(date) }; // Events on or after this date

    const events = await Event.find(filters);
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Event Details (Organizer-Only)
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found." });

    // Check if user is authorized to update
    const isAdmin = req.user.role === "System Admin";
    
    // Handle both lowercase and uppercase field names
    const organizerId = event.Organizer || event.organizer;
    const isOrganizer = organizerId ? organizerId.toString() === req.user.id : false;

    if (!isAdmin && !isOrganizer) {
      return res.status(403).json({
        error: "Unauthorized. Only organizers and administrators can update events.",
      });
    }

    // Allow updating more fields
    const updates = {};
    const allowedFields = ['title', 'description', 'date', 'location', 'category', 
                          'ticketPrice', 'totalTickets', 'image'];
    
    // Update any fields that were provided in the request
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Special handling for totalTickets
    if (updates.totalTickets) {
      // Adjust availableTickets based on how many are already sold
      const availableField = event.availableTickets ? 'availableTickets' : 'remainingTickets';
      const ticketsSold = event.totalTickets - event[availableField];
      updates[availableField] = updates.totalTickets - ticketsSold;

      // Check if new total is valid
      if (updates[availableField] < 0) {
        return res.status(400).json({ 
          error: "Cannot reduce tickets below number already sold." 
        });
      }
    }

    // Apply updates
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
    });

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
    const events = await Event.find({ Organizer: req.user.id });
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add to eventController.js
const getAllEventsAdmin = async (req, res) => {
  try {
    // No status filter - returns all events regardless of status
    const events = await Event.find({});
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add to module.exports
module.exports = {
  createEvent,
  updateEventStatus,
  deleteEvent,
  getAllEvents,
  getAllEventsAdmin,
  updateEvent,
  getEventById,
  getOrganizerEvents,
};
