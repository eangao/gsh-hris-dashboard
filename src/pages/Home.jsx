import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { role, userInfo } = useSelector((state) => state.auth);

  // If the user's role is SUPER_ADMIN, redirect to the admin dashboard
  if (role === "SUPER_ADMIN") return <Navigate to="/admin/dashboard" replace />;
  else if (role === "MANAGER")
    return <Navigate to="/manager/employees" replace />;
  else if (role === "DIRECTOR")
    return <Navigate to="/director/employees" replace />;
  else if (role === "HR_ADMIN") return <Navigate to="/hr/employees" replace />;
  else if (
    (role === "ADMIN" || role === "MARKETING_ADMIN" || role === "SUPERVISOR") &&
    userInfo?.employee?.employmentInformation?.managedDepartments?.length > 0
  )
    return <Navigate to="/manager/employees" replace />;
  else if (
    role === "EXECUTIVE" &&
    userInfo?.employee?.employmentInformation?.managedCluster
  )
    return <Navigate to="/director/employees" replace />;
  // If the user does not manage departments and clusters, redirect to the employee dashboard
  else if (
    role === "EMPLOYEE" ||
    role === "MANAGER" ||
    role === "DIRECTOR" ||
    role === "EXECUTIVE" ||
    role === "HR_ADMIN" ||
    role === "ADMIN" ||
    role === "MARKETING_ADMIN" ||
    role === "SUPERVISOR"
  )
    return <Navigate to="/employee/profile" replace />;
  // If no role is set (user is not authenticated), redirect to the login page
  else return <Navigate to="/login" replace />;
};

export default Home;
