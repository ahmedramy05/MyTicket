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

        // Verify token and get user data
        const response = await api.get("/users/profile");

        if (response.data.success) {
          setUser(response.data.data);
          setIsAuthenticated(true);
        } else {
          // Token is invalid
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post("/api/v1/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        // Set authentication state
        setUser(response.data.user);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        setError(response.data.message || "Login failed");
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post("/api/v1/register", userData);
      if (response.data.success) {
        // Automatically log in after registration
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        setError(response.data.message || "Registration failed");
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      console.error("Registration error details:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
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
      await api.post("/api/v1/auth/logout");

      // Remove token from storage
      localStorage.removeItem("token");

      // Update state
      setUser(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      // Even if server-side logout fails, clear local state
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);

      return { success: false, message: "Logout failed on server" };
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset request
  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post("/api/v1/auth/forgetPassword", { email });

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

  // Reset password with token
  const resetPassword = async (resetToken, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post(
        `/api/v1/auth/resetPassword/${resetToken}`,
        {
          password,
        }
      );

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

  // Context value
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
