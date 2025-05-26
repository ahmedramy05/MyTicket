// importing necessary modules
const express = require("express");
const router = express.Router();

const {
  login,
  logout,
  register,
  forgetPassword,
  resetPassword,
  verifyOTP, // Add the new MFA functions
  resendOTP, // Add the new MFA functions
} = require("../controllers/authController");

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
router.post("/register", register);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post("/login", login);

// @desc    Verify OTP for multi-factor authentication
// @route   POST /api/v1/auth/verify-otp
// @access  Public (with temp token)
router.post("/verify-otp", verifyOTP);

// @desc    Resend OTP code
// @route   POST /api/v1/auth/resend-otp
// @access  Public (with temp token)
router.post("/resend-otp", resendOTP);

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
router.post("/logout", logout);

// @desc    Forgot Password - Send reset link
// @route   PUT /api/v1/auth/forgetPassword
// @access  Public
router.put("/forgetPassword", forgetPassword);

// @desc    Reset Password with token
// @route   POST /api/v1/auth/resetPassword/:resetToken
// @access  Public
router.post("/resetPassword/:resetToken", resetPassword);

module.exports = router;
