import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { role } = useSelector((state) => state.auth);

  if (role === "EMPLOYEE") return <Navigate to="/employee/dashboard" replace />;
  else if (role === "ADMIN" || role === "SUPER_ADMIN")
    return <Navigate to="/admin/dashboard" replace />;
  else if (role === "MANAGER")
    return <Navigate to="/manager/dashboard" replace />;
  else if (role === "HR_ADMIN") return <Navigate to="/hr/dashboard" replace />;
  else return <Navigate to="/login" replace />;
};

export default Home;
