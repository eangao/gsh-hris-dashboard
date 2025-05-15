import { lazy } from "react";

const EmployeeDashboard = lazy(() =>
  import("../../views/dashboard/EmployeeDashboard")
);
const EmployeeDetails = lazy(() =>
  import("../../views/employees/EmployeeDetails")
);

export const employeeRoutes = [
  {
    path: "employee/dashboard",
    element: <EmployeeDashboard />,
    role: "employee",
  },
  {
    path: "employee/dashboard/employee-details/:id",
    element: <EmployeeDetails />,
    role: "employee",
  },
];
