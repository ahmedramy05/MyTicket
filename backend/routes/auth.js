// importing necessary modules
const express = require("express");
const router = express.Router();

const {
  login,
  logout,
  register,
  forgetPassword,
  resetPassword,
} = require("../controllers/authController"); // Assuming you have an authController with login, register, forgotPassword, and verifyOtpAndResetPassword functions

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
router.post("/register", register);
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post("/login", login);

router.post("/logout", logout);
// Forgot Password - Send OTP
router.put("/forgetPassword", forgetPassword);

// Verify OTP and Reset Password
router.post("/resetPassword/:resetToken", resetPassword);

module.exports = router;
