// importing necessary modules
const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/authController"); // Assuming you have an authController with login and register functions

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
router.post("/register", register);
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post("/login", login);

module.exports = router;
