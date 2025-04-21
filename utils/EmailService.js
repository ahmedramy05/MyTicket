const nodemailer = require("nodemailer");
require("dotenv").config();

// Create email transporter with correct configuration
const transporter = nodemailer.createTransport({
  service: "Gmail", // Using predefined service instead of manual host/port
  auth: {
    user: process.env.EMAIL_USERNAME, // Make sure this matches your .env variable name
    pass: process.env.EMAIL_PASSWORD, // Make sure this matches your .env variable name
  },
  tls: {
    rejectUnauthorized: false // Helps avoid certificate issues
  }
});

// Test the connection when server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("Email configuration error:", error.message);
    // Log specific auth errors more clearly
    if (error.code === 'EAUTH') {
      console.error("Authentication failed. Check your email credentials in .env file.");
      console.error("For Gmail, you need to use an App Password if 2FA is enabled.");
    }
  } else {
    console.log("Email service is configured correctly and ready to use");
  }
});

module.exports = transporter;