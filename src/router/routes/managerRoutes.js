import { lazy } from "react";

const ManagerDashboard = lazy(() =>
  import("../../views/dashboard/ManagerDashboard")
);
const Employee = lazy(() => import("../../views/employees/Employee"));
const EmployeeDetails = lazy(() =>
  import("../../views/employees/EmployeeDetails")
);

export const managerRoutes = [
  {
    path: "manager/dashboard",
    element: <ManagerDashboard />,
    role: "manager",
  },
  {
    path: "manager/dashboard/employee",
    element: <Employee />,
    role: "manager",
  },
  {
    path: "manager/dashboard/employee/details/:id",
    element: <EmployeeDetails />,
    role: "manager",
  },
];
