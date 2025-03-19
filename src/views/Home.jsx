import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { role } = useSelector((state) => state.auth);

  if (role === "employee") return <Navigate to="/employee/dashboard" replace />;
  else if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  else if (role === "manager")
    return <Navigate to="/manager/dashboard" replace />;
  else if (role === "hr") return <Navigate to="/hr/dashboard" replace />;
  else return <Navigate to="/login" replace />;
};

export default Home;
