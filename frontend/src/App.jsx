import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

// Simple components you've already implemented
import Toast from "./components/shared/Toast";
import LandingPage from "./LandingPage";

// Auth Components
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

// Event Components
import EventList from "./components/events/EventList";
import EventDetails from "./components/events/EventDetails";

// Profile and Route Protection
import ProfilePage from "./components/user/ProfilePage";
import PrivateRoute from "./components/shared/PrivateRoute";

// Booking Components
import UserBookingsPage from "./components/bookings/UserBookingsPage";

// If you have a BookingDetails component, import it here
// import BookingDetails from "./components/bookings/BookingDetails";

// Loading component
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <div>Loading...</div>
  </div>
);

// Error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Component Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Placeholder for unimplemented features
const ComingSoon = ({ title }) => (
  <div style={{ padding: "40px", textAlign: "center" }}>
    <h2>{title}</h2>
    <p>This feature is coming soon</p>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Simulate initial app loading - remove in production
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Toast notification handler
  const showToast = (message, type = "info", duration = 4000) => {
    setToast({ message, type, duration });
    setTimeout(() => setToast(null), duration);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app-container">
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onClose={() => setToast(null)}
              />
            )}

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage showToast={showToast} />} />

              {/* Auth Routes */}
              <Route
                path="/login"
                element={<LoginForm showToast={showToast} />}
              />
              <Route
                path="/register"
                element={<RegisterForm showToast={showToast} />}
              />

              {/* Events Routes */}
              <Route
                path="/events"
                element={<EventList showToast={showToast} />}
              />
              <Route
                path="/events/:id"
                element={<EventDetails showToast={showToast} />}
              />

              {/* Bookings Route - Protected for any authenticated user */}
              <Route
                path="/bookings"
                element={
                  <PrivateRoute>
                    <UserBookingsPage showToast={showToast} />
                  </PrivateRoute>
                }
              />

              {/* Uncomment and implement BookingDetails if you have it */}
              {/* <Route
                path="/bookings/:id"
                element={
                  <PrivateRoute>
                    <BookingDetails showToast={showToast} />
                  </PrivateRoute>
                }
              /> */}

              {/* User Profile Route - Protected */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage showToast={showToast} />
                  </PrivateRoute>
                }
              />

              {/* Basic informational pages */}
              <Route path="/about" element={<ComingSoon title="About Us" />} />
              <Route
                path="/contact"
                element={<ComingSoon title="Contact Us" />}
              />
              <Route
                path="/how-it-works"
                element={<ComingSoon title="How It Works" />}
              />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;