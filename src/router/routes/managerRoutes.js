import { lazy } from "react";

const ManagerDashboard = lazy(() =>
  import("../../views/manager/ManagerDashboard")
);
const Employee = lazy(() => import("../../views/employee/Employee"));
const EmployeeDetails = lazy(() =>
  import("../../views/employee/EmployeeDetails")
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
