const nodemailer = require("nodemailer");
require("dotenv").config(); // Add this to ensure env vars are loaded

// Create email transporter using Gmail service configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Use service name instead of host/port
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test the connection when server starts
transporter.verify(function (error, success) {
  if (error) {
    console.error("Email server error:", error.message);
    // Add more helpful error information
    if (error.code === "EAUTH") {
      console.error("Authentication failed. This usually means:");
      console.error("1. Your Gmail password is incorrect");
      console.error(
        "2. You need to generate an App Password if 2FA is enabled"
      );
      console.error("3. Gmail security settings are blocking the connection");
    }
  } else {
    console.log("Email server is ready to send messages");
  }
});

module.exports = transporter;
