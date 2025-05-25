const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const crypto = require("crypto");
const transporter = require("../utils/EmailService");

// OTP utility functions
const generateOTP = () => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOTP = (otp, email) => {
  return crypto
    .createHash("sha256")
    .update(otp + email)
    .digest("hex");
};

const verifyOTPHash = (providedOTP, hashedOTP, email) => {
  const hashedProvidedOTP = hashOTP(providedOTP, email);
  return hashedProvidedOTP === hashedOTP;
};

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

// @desc    Login user - UPDATED for MFA
// @route   POST /auth/login
// @access  Public
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

    // Password is correct, now generate and send OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp, email);

    // Create temporary JWT containing the hashed OTP
    const tempToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        otpHash: otpHash,
        pendingMFA: true,
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "10m" } // Short expiry for security
    );

    // Send OTP email
    try {
      await transporter.sendMail({
        from: '"EventHub" <noreply@eventhub.com>',
        to: user.email,
        subject: "Your Login Verification Code",
        html: `
          <h2>Login Verification</h2>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        `,
      });

      res.status(200).json({
        success: true,
        message: "Verification code sent to your email",
        requireMFA: true,
        tempToken: tempToken,
        email: user.email,
      });
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code. Please try again.",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// @desc    Verify OTP for MFA
// @route   POST /auth/verify-otp
// @access  Public (with temp token)
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const tempToken = req.headers.authorization?.split(" ")[1];

    if (!tempToken) {
      return res.status(401).json({
        success: false,
        message: "Verification session expired. Please login again.",
      });
    }

    // Verify temp token
    let decoded;
    try {
      decoded = jwt.verify(
        tempToken,
        process.env.JWT_SECRET || "your_jwt_secret"
      );
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Verification session expired. Please login again.",
      });
    }

    // Check if this is a pending MFA token
    if (!decoded.pendingMFA || !decoded.otpHash) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification attempt",
      });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify OTP
    if (!verifyOTPHash(otp, decoded.otpHash, decoded.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // OTP is valid, generate full authentication token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "30d" }
    );

    // Return full user data and token
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
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
};

// @desc    Resend OTP code
// @route   POST /auth/resend-otp
// @access  Public (with temp token)
exports.resendOTP = async (req, res) => {
  try {
    const tempToken = req.headers.authorization?.split(" ")[1];

    if (!tempToken) {
      return res.status(401).json({
        success: false,
        message: "Verification session expired. Please login again.",
      });
    }

    // Verify temp token
    let decoded;
    try {
      decoded = jwt.verify(
        tempToken,
        process.env.JWT_SECRET || "your_jwt_secret"
      );
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Verification session expired. Please login again.",
      });
    }

    // Check if this is a pending MFA token
    if (!decoded.pendingMFA) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification attempt",
      });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp, user.email);

    // Create new temporary JWT
    const newTempToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        otpHash: otpHash,
        pendingMFA: true,
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "10m" }
    );

    // Send new OTP email
    await transporter.sendMail({
      from: '"EventHub" <noreply@eventhub.com>',
      to: user.email,
      subject: "Your New Login Verification Code",
      html: `
        <h2>Login Verification</h2>
        <p>Your new verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      `,
    });

    // Return new temp token
    res.status(200).json({
      success: true,
      message: "New verification code sent to your email",
      tempToken: newTempToken,
      email: user.email,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send new verification code",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // Get token from authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided",
      });
    }

    // Since we're not implementing token blacklisting in this version,
    // we'll just return a success message
    // In a production app, you would add the token to a blacklist

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

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Looking for email:", email);

    // Case-insensitive search
    const user = await User.findOne({
      email: { $regex: new RegExp("^" + email + "$", "i") },
    });

    console.log("User found:", !!user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user with that email",
      });
    }

    // Generate reset token (random bytes)
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash the token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expire time (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    // Create reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Create email message
    const message = {
      from: '"EventHub" <noreply@eventhub.com>',
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h1>You requested a password reset</h1>
        <p>Please click on the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    // Save the user with the reset token information
    await user.save();

    try {
      // Try to send email
      await transporter.sendMail(message);

      return res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);

      // If email fails, clear the reset token and return error
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
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
