import { lazy } from "react";

const HRDashboard = lazy(() => import("../../views/hr/HRDashboard"));

const Employee = lazy(() => import("../../views/employee/Employee"));
const EmployeeForm = lazy(() => import("../../views/employee/EmployeeForm"));
const EmployeeDetails = lazy(() =>
  import("../../views/employee/EmployeeDetails")
);

export const hrRoutes = [
  {
    path: "hr/dashboard",
    element: <HRDashboard />,
    role: "hr",
  },
  {
    path: "hr/dashboard/employee",
    element: <Employee />,
    role: "hr",
  },
  {
    path: "hr/dashboard/employee/add",
    element: <EmployeeForm />,
    role: "hr",
  },

  {
    path: "hr/dashboard/employee/edit/:id",
    element: <EmployeeForm />,
    role: "hr",
  },
  {
    path: "hr/dashboard/employee/details/:id",
    element: <EmployeeDetails />,
    role: "hr",
  },
];
