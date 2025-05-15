import { lazy } from "react";

const AdminDashboard = lazy(() =>
  import("../../views/dashboard/AdminDashboard")
);
const Employee = lazy(() => import("../../views/employees/Employee"));
const EmployeeForm = lazy(() => import("../../views/employees/EmployeeForm"));
const EmployeeDetails = lazy(() =>
  import("../../views/employees/EmployeeDetails")
);

const UserManagement = lazy(() => import("../../views/users/UserManagement"));
const Position = lazy(() => import("../../views/settings/Position"));
const Cluster = lazy(() => import("../../views/settings/Cluster"));
const Department = lazy(() => import("../../views/departments/Department"));
const WorkSchedule = lazy(() => import("../../views/settings/WorkSchedule"));

const DutySchedule = lazy(() => import("../../views/schedules/DutySchedule"));
const DutyScheduleForm = lazy(() =>
  import("../../views/schedules/DutyScheduleForm")
);

const DailyAttendance = lazy(() =>
  import("../../views/attendance/DailyAttendance")
);
const Holiday = lazy(() => import("../../views/settings/Holiday"));
const Role = lazy(() => import("../../views/roles/Role"));
const Religion = lazy(() => import("../../views/settings/Religion"));
const EmploymentStatus = lazy(() =>
  import("../../views/settings/EmploymentStatus")
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
    path: "admin/dashboard/duty-schedule/add",
    element: <DutyScheduleForm />,
    role: "admin",
  },

  {
    path: "admin/dashboard/duty-schedule/edit/:id",
    element: <DutyScheduleForm />,
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
