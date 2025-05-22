import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

/**
 * PrivateRoute component that protects routes requiring authentication
 * Redirects unauthenticated users to login page and saves the attempted URL
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to render if authenticated
 * @param {string[]} [props.allowedRoles] - Optional array of roles allowed to access the route
 */
export default function PrivateRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    // Save the current location they tried to access for redirecting after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated (and authorized if roles were specified)

import { useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roles }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}
