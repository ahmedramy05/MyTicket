import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
  Avatar,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { AuthContext } from "../../contexts/AuthContext";
import OTPVerification from "./OTPVerification"; // Add this import

const LoginForm = ({ showToast }) => {
  const navigate = useNavigate();
  const {
    login,
    forgotPassword,
    isLoading,
    // Add these MFA-related context values
    mfaPending,
    pendingEmail,
    tempToken,
    verifyOTP,
    resetMFA,
    handleVerificationSuccess,
  } = useContext(AuthContext);

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // UI states
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle input changes for login form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }

    // Clear general submit error when any field changes
    if (submitError) {
      setSubmitError(null);
    }
  };

  // Handle forgot email input change
  const handleForgotEmailChange = (e) => {
    setForgotEmail(e.target.value);

    // Clear errors when field is changed
    if (submitError) {
      setSubmitError(null);
    }
  };

  // Toggle remember me checkbox
  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  // Password visibility toggle
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle between login and forgot password forms
  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setSubmitError(null);
    setSuccessMessage(null);
  };

  // Form validation for login
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Forgot password form validation
  const validateForgotPasswordForm = () => {
    if (!forgotEmail.trim()) {
      setSubmitError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setSubmitError("Email is invalid");
      return false;
    }
    return true;
  };

  // Login form submission - UPDATED to handle MFA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Call login function from AuthContext
      const result = await login(formData.email, formData.password, rememberMe);

      if (result.success) {
        // Check if MFA verification is required
        if (!result.requireMFA) {
          // If MFA not required (standard flow)
          if (showToast) {
            showToast("Login successful! Welcome back!", "success");
          }
          navigate("/");
        }
        // If MFA required, component will re-render showing OTP verification
        // because mfaPending will be true in the AuthContext
      } else {
        setSubmitError(
          result.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      setSubmitError("Login failed. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySuccess = (data) => {
    // Use the context function to properly update auth state
    handleVerificationSuccess(data);

    // Show success message and redirect
    if (showToast) {
      showToast("Login successful! Welcome back!", "success");
    }
    navigate("/");
  };

  // Handle OTP verification cancel
  const handleVerifyCancel = () => {
    resetMFA(); // Reset MFA state in the context
  };

  // Forgot password form submission
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    // Validate form
    if (!validateForgotPasswordForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const result = await forgotPassword(forgotEmail);

      if (result.success) {
        setSuccessMessage(
          "Password reset instructions have been sent to your email."
        );
        setForgotEmail(""); // Clear the email field
      } else {
        setSubmitError(
          result.message || "Failed to process password reset request."
        );
      }
    } catch (error) {
      setSubmitError(
        "Failed to process password reset request. Please try again later."
      );
      console.error("Forgot password error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Render forgot password form
  const renderForgotPasswordForm = () => (
    <Box
      component="form"
      onSubmit={handleForgotPasswordSubmit}
      sx={{ width: "100%" }}
    >
      <Typography variant="h6" gutterBottom>
        Reset Your Password
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your email address and we'll send you instructions to reset your
        password.
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="forgotEmail"
            label="Email Address"
            fullWidth
            required
            type="email"
            autoFocus
            value={forgotEmail}
            onChange={handleForgotEmailChange}
            disabled={submitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.2 }}
        disabled={submitting || isLoading}
      >
        {submitting || isLoading ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Sending...
          </>
        ) : (
          "Send Reset Instructions"
        )}
      </Button>

      <Button
        variant="text"
        fullWidth
        onClick={toggleForgotPassword}
        disabled={submitting}
        sx={{ textTransform: "none" }}
      >
        Back to Sign In
      </Button>
    </Box>
  );

  // Render login form
  const renderLoginForm = () => (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="email"
            label="Email Address"
            fullWidth
            required
            type="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={submitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            name="password"
            label="Password"
            fullWidth
            required
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={submitting}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={handleRememberMeChange}
              color="primary"
              size="small"
            />
          }
          label={<Typography variant="body2">Remember me</Typography>}
        />

        <Button
          variant="text"
          size="small"
          onClick={toggleForgotPassword}
          sx={{ textTransform: "none" }}
        >
          Forgot password?
        </Button>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.2 }}
        disabled={submitting || isLoading}
      >
        {submitting || isLoading ? (
          <>
            <CircularProgress size={24} sx={{ mr: 1 }} />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ py: 1 }}
            startIcon={<GoogleIcon />}
          >
            Google
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ py: 1 }}
            startIcon={<FacebookIcon />}
          >
            Facebook
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2">
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ textDecoration: "none", fontWeight: "bold" }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );

  // ADD THIS CONDITIONAL RENDERING FOR OTP VERIFICATION
  // If MFA verification is pending, show OTP verification component
  if (mfaPending) {
    return (
      <OTPVerification
        email={pendingEmail}
        tempToken={tempToken}
        onVerifySuccess={handleVerifySuccess}
        onCancel={handleVerifyCancel}
        showToast={showToast}
      />
    );
  }

  // Main component return (unchanged)
  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, width: 56, height: 56, bgcolor: "primary.main" }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
            {showForgotPassword ? "Forgot Password" : "Sign In"}
          </Typography>

          {!showForgotPassword && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Welcome back! Please enter your details
            </Typography>
          )}

          {submitError && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {showForgotPassword ? renderForgotPasswordForm() : renderLoginForm()}
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
