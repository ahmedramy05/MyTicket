const bcrypt = require("bcrypt");
const User = require("../Models/User");
const Booking = require("../Models/Booking");
const Event = require("../Models/Event");

const getAllUsers = async (req, res) => {
  try {
    // Find all users but exclude password field for security
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // The user should be attached to the request by auth middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user profile",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // Find the user by ID (from auth middleware)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields that were sent in the request
    const { name, email, password, phone, address } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save the updated user
    const updatedUser = await user.save();
    // Return the updated user without password
    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user profile",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    // Handle case where ID format is invalid
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    // Check if role is provided in request body
    if (!req.body.role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    // Get allowed roles - this should match your User model roles
    const allowedRoles = ["Admin", "User", "EventOrganizer"];

    // Validate that the provided role is allowed
    if (!allowedRoles.includes(req.body.role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${allowedRoles.join(", ")}`,
      });
    }

    // Find the user by ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user's role
    user.role = req.body.role;

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${req.body.role}`,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);

    // Handle case where ID format is invalid
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating user role",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    // Handle case where ID format is invalid
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    // Find all bookings for the current user
    const bookings = await Booking.find({ user: req.user.id })
      .populate("event", "name date location price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user bookings",
    });
  }
};

const getUserEvents = async (req, res) => {
  try {
    // Find all events where the current user is the organizer
    const events = await Event.find({ Organizer: req.user.id }).sort({
      date: 1,
    }); // Sort by upcoming events first

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching user events:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user events",
    });
  }
};

const getUserAnalytics = async (req, res) => {
  try {
    // Find all events where the current user is the organizer
    const events = await Event.find({ Organizer: req.user.id });

    // Calculate total revenue and total bookings
    let totalRevenue = 0;
    let totalBookings = 0;

    for (const event of events) {
      const bookings = await Booking.find({ event: event._id });
      totalBookings += bookings.length;
      totalRevenue += bookings.reduce((sum, booking) => sum + booking.price, 0);
    }

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalBookings,
        eventsCount: events.length,
      },
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user analytics",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserBookings,
  getUserEvents,
  getUserAnalytics,
};
