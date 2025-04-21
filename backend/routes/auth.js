// importing necessary modules
const express = require("express");
const router = express.Router();

const { login, register, forgotPassword, verifyOtpAndResetPassword } = require("../controllers/authController"); // Assuming you have an authController with login, register, forgotPassword, and verifyOtpAndResetPassword functions

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
router.post("/register", register);
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post("/login", login);

// Forgot Password - Send OTP
router.post("/forgot-password", forgotPassword);

// Verify OTP and Reset Password
router.post("/reset-password", verifyOtpAndResetPassword);

module.exports = router;
