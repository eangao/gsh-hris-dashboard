import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { role } = useSelector((state) => state.auth);

  // If the user's role is SUPER_ADMIN, redirect to the admin dashboard
  if (role === "SUPER_ADMIN") return <Navigate to="/admin/dashboard" replace />;
  // If the user has any other role (e.g., EMPLOYEE, MANAGER, HR, etc.), redirect to the employee dashboard
  else if (
    role === "EMPLOYEE" ||
    role === "MANAGER" ||
    role === "DIRECTOR" ||
    role === "HR_ADMIN" ||
    role === "ADMIN" ||
    role === "MARKETING_ADMIN" ||
    role === "SUPERVISOR"
  )
    return <Navigate to="/employee/dashboard" replace />;
  // If no role is set (user is not authenticated), redirect to the login page
  else return <Navigate to="/login" replace />;
};

export default Home;
