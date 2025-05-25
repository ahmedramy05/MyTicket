import { createContext, useState, useEffect } from "react";
import api from "../services/api"; // Import your API service

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add MFA related state
  const [mfaPending, setMfaPending] = useState(false);
  const [tempToken, setTempToken] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);

  // Check if user is already logged in when app loads
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        setIsLoading(true);

        // Check for token in local storage
        const token = localStorage.getItem("token");

        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Configure API headers with token
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Verify token and get user data
        const response = await api.get("/users/profile");

        if (response.data.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
        } else {
          // Token is invalid
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function - UPDATED to handle MFA
  const login = async (email, password) => {
    try {
      console.log("Login attempt for:", email);
      setIsLoading(true);
      setError(null);

      // Reset MFA state
      setMfaPending(false);
      setTempToken(null);
      setPendingEmail(null);

      // FIX: Use correct path with /auth/ prefix
      console.log("Making API call to /login");
      const response = await api.post("/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.success) {
        // Check if MFA is required
        if (response.data.requireMFA) {
          console.log(
            "MFA required, setting tempToken:",
            !!response.data.tempToken
          );
          console.log("Setting pendingEmail:", response.data.email);

          // Set MFA state
          setTempToken(response.data.tempToken);
          setPendingEmail(response.data.email);
          setMfaPending(true);

          console.log("mfaPending set to true");
          return { success: true, requireMFA: true };
        }

        // Regular login (no MFA required)
        console.log("Standard login successful");
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        console.log("Login failed:", response.data.message);
        setError(response.data.message || "Login failed");
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      console.error("Login error details:", err);
      if (err.response) console.error("Response data:", err.response.data);

      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP for MFA - NEW FUNCTION
  const verifyOTP = async (otp) => {
    try {
      console.log("Verifying OTP:", otp);
      setIsLoading(true);
      setError(null);

      if (!tempToken) {
        console.error("No tempToken available for OTP verification");
        setError("Verification session expired. Please login again.");
        return { success: false, message: "Verification session expired" };
      }

      console.log("Sending OTP verification request with token");
      const response = await api.post(
        "/verify-otp",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      console.log("OTP verification response:", response.data);

      if (response.data.success) {
        // MFA verified, set authentication state
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        setIsAuthenticated(true);

        // Clear MFA state
        setMfaPending(false);
        setTempToken(null);
        setPendingEmail(null);

        return { success: true };
      } else {
        setError(response.data.message || "Verification failed");
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMessage =
        err.response?.data?.message || "Verification failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset MFA state - NEW FUNCTION
  const resetMFA = () => {
    console.log("Resetting MFA state");
    setMfaPending(false);
    setTempToken(null);
    setPendingEmail(null);
  };

  // Register function - FIX API PATH
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      // FIX: Use correct path with /auth/ prefix
      const response = await api.post("/register", userData);

      if (response.data.success) {
        // Automatically log in after registration
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setUser(response.data.user);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        setError(response.data.message || "Registration failed");
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);

      // Call logout endpoint to invalidate token on server
      await api.post("/logout");

      // Remove token from storage
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];

      // Update state
      setUser(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      // Even if server-side logout fails, clear local state
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      setIsAuthenticated(false);

      return { success: false, message: "Logout failed on server" };
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset request - FIX API PATH
  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      setError(null);

      // FIX: Use correct path with /auth/ prefix
      const response = await api.put("/forgetPassword", { email });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send password reset email";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password with token - FIX API PATH
  const resetPassword = async (resetToken, password) => {
    try {
      setIsLoading(true);
      setError(null);

      // FIX: Use correct path with /auth/ prefix
      const response = await api.post(`/resetPassword/${resetToken}`, {
        password,
      });

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Password reset failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.put("/users/profile", userData);

      if (response.data.success) {
        setUser(response.data.data);
        return { success: true, user: response.data.data };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Profile update failed";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = (data) => {
    // Store token in localStorage
    localStorage.setItem("token", data.token);

    // Update API headers
    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    // Update authentication state
    setUser(data.user);
    setIsAuthenticated(true);

    // Reset MFA state
    setMfaPending(false);
    setTempToken(null);
    setPendingEmail(null);
  };

  // IMPORTANT: Add MFA related values to the context
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    // MFA related values
    mfaPending,
    tempToken,
    pendingEmail,
    verifyOTP,
    resetMFA,
    handleVerificationSuccess, // Add this
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
