import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ProtectedRoute = ({ route, children }) => {
  const { role, userInfo } = useSelector((state) => state.auth);

  const location = useLocation();

  // ✅ Prevent redirect loop if already on change-password page
  if (
    userInfo?.mustChangePassword &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  if (role) {
    if (route.role) {
      if (userInfo) {
        // Check if route.role is an array or string
        //         Explanation:
        // allowedRoles is always an array (even if route.role is a string).
        // Then check if userInfo.role is included in allowedRoles.
        // This lets you set route.role as "admin" or ["admin", "super_admin"] interchangeably.
        const allowedRoles = Array.isArray(route.role)
          ? route.role
          : [route.role];

        if (allowedRoles.includes(userInfo.role)) {
          return <Suspense fallback={null}>{children}</Suspense>;
        } else {
          return <Navigate to="/unauthorized" replace />;
        }
      }
    } else {
      return <Navigate to="/page-not-found" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
