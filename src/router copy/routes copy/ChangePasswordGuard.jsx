import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ChangePasswordGuard = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }
  if (!userInfo.mustChangePassword) {
    // Logged in but not required to change password
    return <Navigate to="/" replace />;
  }
  // Allowed
  return children;
};

export default ChangePasswordGuard;
