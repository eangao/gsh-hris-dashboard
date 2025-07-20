/**
 * Protected Route Component
 *
 * Provides route-level protection with:
 * - Role-based access control
 * - Password change enforcement
 * - Authentication validation
 * - Proper error handling and redirects
 *
 * @component
 * @param {Object} props
 * @param {Object} props.route - Route configuration with role information
 * @param {React.ReactNode} props.children - Child components to render if authorized
 */

import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

/**
 * Loading component for protected routes
 */
const ProtectedRouteLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const ProtectedRoute = ({ route, children }) => {
  const { role, userInfo, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // Debug logging
  // console.log("ProtectedRoute:", {
  //   role,
  //   hasUserInfo: !!userInfo,
  //   loading,
  //   pathname: location.pathname,
  // });

  // ===============================
  // LOADING STATE HANDLING
  // ===============================

  // Show loading while authentication is being checked
  if (loading) {
    // console.log("ProtectedRoute: Showing loading state");
    return <ProtectedRouteLoader />;
  }

  // ===============================
  // AUTHENTICATION CHECKS
  // ===============================

  // Check if user is authenticated
  if (!role || !userInfo) {
    // console.warn(
    //   "ProtectedRoute: User not authenticated, redirecting to login",
    //   { role, userInfo: !!userInfo }
    // );
    return <Navigate to="/login" replace />;
  }

  // ===============================
  // PASSWORD CHANGE ENFORCEMENT
  // ===============================

  // Force password change if required (prevent redirect loop)
  if (
    userInfo?.mustChangePassword &&
    location.pathname !== "/change-password"
  ) {
    // console.info("ProtectedRoute: User must change password, redirecting");
    return <Navigate to="/change-password" replace />;
  }

  // ===============================
  // ROUTE VALIDATION
  // ===============================

  // Check if route configuration is valid
  if (!route) {
    // console.error("ProtectedRoute: No route configuration provided");
    return <Navigate to="/page-not-found" replace />;
  }

  // Check if route has role requirements
  if (!route.role) {
    // console.error(
    //   `ProtectedRoute: Route "${
    //     route.path || "unknown"
    //   }" has no role requirements`
    // );
    return <Navigate to="/page-not-found" replace />;
  }

  // ===============================
  // ROLE-BASED ACCESS CONTROL
  // ===============================

  // Normalize route roles to always be an array
  const allowedRoles = Array.isArray(route.role) ? route.role : [route.role];

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(userInfo.role)) {
    // console.warn(
    //   `ProtectedRoute: User role "${userInfo.role}" not authorized for route "${
    //     route.path || "unknown"
    //   }". Required roles: ${allowedRoles.join(", ")}`
    // );
    return <Navigate to="/unauthorized" replace />;
  }

  // ===============================
  // RENDER AUTHORIZED CONTENT
  // ===============================

  // User is authenticated and authorized, render the protected content
  return <Suspense fallback={<ProtectedRouteLoader />}>{children}</Suspense>;
};

export default ProtectedRoute;
