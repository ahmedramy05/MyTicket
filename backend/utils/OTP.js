const crypto = require("crypto");

/**
 * Generates a random 6-digit OTP for authentication
 * @returns {string} A 6-digit OTP
 */
const generateOTP = () => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Creates a hash of the OTP to securely store in JWT
 * @param {string} otp - The plain OTP
 * @param {string} email - User's email as salt
 * @returns {string} Hashed OTP
 */
const hashOTP = (otp, email) => {
  return crypto
    .createHash("sha256")
    .update(otp + email)
    .digest("hex");
};

/**
 * Verifies if the provided OTP matches the hashed OTP
 * @param {string} providedOTP - OTP provided by the user
 * @param {string} hashedOTP - Hashed OTP from JWT
 * @param {string} email - User's email
 * @returns {boolean} Whether the OTP is valid
 */
const verifyOTP = (providedOTP, hashedOTP, email) => {
  const hashedProvidedOTP = hashOTP(providedOTP, email);
  return hashedProvidedOTP === hashedOTP;
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
};
