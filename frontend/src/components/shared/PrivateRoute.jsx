import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

/**
 * PrivateRoute component that protects routes requiring authentication
 * Redirects unauthenticated users to login page and saves the attempted URL
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to render if authenticated
 * @param {string[]} [props.allowedRoles] - Optional array of roles allowed to access the route
 */
export default function PrivateRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login page and save attempted URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is provided and not empty, check if user's role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to unauthorized page if user doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated (and authorized if roles were specified)
  return children;
}