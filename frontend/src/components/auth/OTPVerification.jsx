import React, { useState, useEffect, useRef } from "react"; // Added useRef
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Container,
  Avatar,
  Grid,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import api from "../../services/api";

const OTPVerification = ({
  email,
  tempToken,
  onVerifySuccess,
  onCancel,
  showToast,
}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Use a ref to track mounted state instead
  const isMounted = useRef(true);

  // Set up proper cleanup when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Handle OTP input change
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 6);
    setOtp(value);
    if (error) setError("");
  };

  // Handle form submission - FIXED PROPERLY
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setLoading(true);
    // Track success for finally block
    let verificationSuccessful = false;

    try {
      // Create a local copy of the token to ensure it's used correctly
      const tokenToUse = tempToken;
      console.log(
        "Using token for verification:",
        tokenToUse?.substring(0, 10) + "..."
      );

      // Make the API request with the specific token
      const response = await api.post(
        "/verify-otp",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        }
      );

      console.log("Verification response:", response.data);

      if (response.data.success) {
        // Clear any error
        setError("");
        verificationSuccessful = true;

        if (showToast) {
          showToast("Verification successful!", "success");
        }

        // Call success handler which will handle navigation
        console.log("Calling onVerifySuccess and redirecting...");
        onVerifySuccess(response.data);

        // Return early to avoid setting loading to false after navigation
        return;
      } else {
        setError(
          response.data.message || "Verification failed. Please try again."
        );
      }
    } catch (err) {
      console.error("OTP verification error:", err);

      if (isMounted.current) {
        setError(
          err.response?.data?.message ||
            "Verification failed. Please try again."
        );
      }
    } finally {
      // Only update loading if we didn't already navigate away in the success case
      if (isMounted.current && !verificationSuccessful) {
        setLoading(false);
      }
    }
  };
  // Handle resending OTP - FIXED
  const handleResendOTP = async () => {
    try {
      setLoading(true);

      // Create a local copy of the token
      const tokenToUse = tempToken;

      const response = await api.post(
        "/resend-otp",
        {},
        {
          headers: {
            Authorization: `Bearer ${tokenToUse}`,
          },
        }
      );

      // Check if component is still mounted
      if (!isMounted.current) return;

      if (response.data.success) {
        // Reset timer and update tempToken
        setTimeLeft(600);
        if (showToast) {
          showToast("New verification code sent to your email", "success");
        }
      } else {
        setError("Failed to send new verification code.");
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      if (isMounted.current) {
        setError("Failed to send new verification code.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Rest of the component remains the same...
  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            Verification Required
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            A verification code has been sent to <strong>{email}</strong>.<br />
            Please enter the 6-digit code to continue.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="6-Digit Verification Code"
              value={otp}
              onChange={handleChange}
              margin="normal"
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
                maxLength: 6,
              }}
              autoFocus
              sx={{ fontSize: "1.2rem" }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, textAlign: "center" }}
            >
              {timeLeft > 0 ? (
                <>
                  Code expires in <strong>{formatTime(timeLeft)}</strong>
                </>
              ) : (
                <span style={{ color: "red" }}>
                  Code expired, please request a new one
                </span>
              )}
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.2 }}
              disabled={loading || timeLeft <= 0}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={onCancel}
                  disabled={loading}
                  fullWidth
                >
                  Back to Login
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleResendOTP}
                  disabled={loading || timeLeft > 540} // Allow resend after 1 minute
                  fullWidth
                >
                  Resend Code
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OTPVerification;
