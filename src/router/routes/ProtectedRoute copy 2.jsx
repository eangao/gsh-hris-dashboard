import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ route, children }) => {
  const { role, userInfo } = useSelector((state) => state.auth);

  if (userInfo?.mustChangePassword) {
    console.log(userInfo?.mustChangePassword);
    return <Navigate to="/change-password" replace />;
  } else {
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
  }
};

export default ProtectedRoute;
