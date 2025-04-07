import { lazy } from "react";

const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const Employee = lazy(() => import("../../views/employee/Employee"));
const EmployeeForm = lazy(() => import("../../views/employee/EmployeeForm"));
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
    path: "admin/dashboard/role",
    element: <Role />,
    role: "admin",
  },
  {
    path: "admin/dashboard",
    element: <AdminDashboard />,
    role: "admin",
  },
  {
    path: "admin/dashboard/holiday",
    element: <Holiday />,
    role: "admin",
  },
  {
    path: "admin/dashboard/daily-attendance",
    element: <DailyAttendance />,
    role: "admin",
  },
  {
    path: "admin/dashboard/employee",
    element: <Employee />,
    role: "admin",
  },
  {
    path: "admin/dashboard/employee/add",
    element: <EmployeeForm />,
    role: "admin",
  },

  {
    path: "admin/dashboard/employee/edit/:id",
    element: <EmployeeForm />,
    role: "admin",
  },
  {
    path: "admin/dashboard/employee/details/:id",
    element: <EmployeeDetails />,
    role: "admin",
  },
  {
    path: "admin/dashboard/user",
    element: <UserManagement />,
    role: "admin",
  },
  {
    path: "admin/dashboard/position",
    element: <Position />,
    role: "admin",
  },
  {
    path: "admin/dashboard/cluster",
    element: <Cluster />,
    role: "admin",
  },
  {
    path: "admin/dashboard/department",
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
