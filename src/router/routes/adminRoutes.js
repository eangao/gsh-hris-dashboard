import { lazy } from "react";

const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const Employee = lazy(() => import("../../views/employee/Employee"));
const AddEmployee = lazy(() => import("../../views/employee/AddEmployee"));
const EditEmployee = lazy(() => import("../../views/employee/EditEmployee"));
const EmployeeDetails = lazy(() =>
  import("../../views/employee/EmployeeDetails")
);
const UserManagement = lazy(() => import("../../views/admin/UserManagement"));
const Position = lazy(() => import("../../views/admin/Position"));
const Cluster = lazy(() => import("../../views/admin/Cluster"));
const Department = lazy(() => import("../../views/admin/Department"));
const WorkSchedule = lazy(() => import("../../views/admin/WorkSchedule"));
const DutySchedule = lazy(() => import("../../views/admin/DutySchedule"));
const DailyAttendance = lazy(() => import("../../views/admin/DailyAttendance"));
const Holiday = lazy(() => import("../../views/admin/Holiday"));
const Role = lazy(() => import("../../views/admin/Role"));
const Religion = lazy(() => import("../../views/admin/Religion"));
const EmploymentStatus = lazy(() =>
  import("../../views/admin/EmploymentStatus")
);

export const adminRoutes = [
  {
    path: "admin/dashboard/roles",
    element: <Role />,
    role: "admin",
  },
  {
    path: "admin/dashboard",
    element: <AdminDashboard />,
    role: "admin",
  },
  {
    path: "admin/dashboard/holidays",
    element: <Holiday />,
    role: "admin",
  },
  {
    path: "admin/dashboard/daily-attendance",
    element: <DailyAttendance />,
    role: "admin",
  },
  {
    path: "admin/dashboard/employees",
    element: <Employee />,
    role: "admin",
  },
  {
    path: "admin/dashboard/employees/add",
    element: <AddEmployee />,
    role: "admin",
  },

  {
    path: "admin/dashboard/employees/edit/:id",
    element: <EditEmployee />,
    role: "admin",
  },
  {
    path: "admin/dashboard/employees/details/:id",
    element: <EmployeeDetails />,
    role: "admin",
  },
  {
    path: "admin/dashboard/users",
    element: <UserManagement />,
    role: "admin",
  },
  {
    path: "admin/dashboard/position",
    element: <Position />,
    role: "admin",
  },
  {
    path: "admin/dashboard/clusters",
    element: <Cluster />,
    role: "admin",
  },
  {
    path: "admin/dashboard/departments",
    element: <Department />,
    role: "admin",
  },
  {
    path: "admin/dashboard/work-schedule",
    element: <WorkSchedule />,
    role: "admin",
  },
  {
    path: "admin/dashboard/duty-schedule",
    element: <DutySchedule />,
    role: "admin",
  },

  {
    path: "admin/dashboard/religion",
    element: <Religion />,
    role: "admin",
  },
  {
    path: "admin/dashboard/employment-status",
    element: <EmploymentStatus />,
    role: "admin",
  },
];
