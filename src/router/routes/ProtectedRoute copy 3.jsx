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
        if (userInfo.role === route.role) {
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
