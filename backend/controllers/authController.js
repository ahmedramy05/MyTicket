const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
//const BlacklistedToken = require("../Models/BlacklistedToken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// Fix this path to point to the correct location
const transporter = require("../../utils/EmailService");

// @desc    Register new user
// @route   POST /auth/register
// @access  Public

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Registration attempt:", { name, email, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Creating new user...");

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Standard User",
    });

    console.log("User created in database:", user._id);

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error details:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "30d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // Get token from authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Decode token to get expiry time (without verifying)
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // Add token to blacklist until its natural expiration
    await BlacklistedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000), // Convert from unix timestamp to Date
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user with that email",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Hash the OTP and save it in the database with an expiration time
    user.resetPasswordToken = crypto.createHash("sha256").update(otp).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const mailOptions = {
      from: '"MyTicket Support" <support@myticket.com>',
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset request",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // Get token from params and convert it to hashed version for database comparison
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    // Find user with matching token and valid expiration
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    // Check if user exists and token is valid
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Set new password and hash it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save the updated user
    await user.save();

    // Return success
    res.status(200).json({
      success: true,
      message: "Password successfully reset",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user with that email",
      });
    }

    // Hash the provided OTP and compare it with the stored token
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (
      hashedOtp !== user.resetPasswordToken ||
      user.resetPasswordExpire < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Reset the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password successfully reset",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during password reset",
    });
  }
};