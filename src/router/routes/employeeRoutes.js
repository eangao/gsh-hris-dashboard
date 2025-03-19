import { lazy } from "react";

const EmployeeDashboard = lazy(() =>
  import("../../views/employee/EmployeeDashboard")
);

export const employeeRoutes = [
  {
    path: "employee/dashboard",
    element: <EmployeeDashboard />,
    role: "employee",
  },
];
