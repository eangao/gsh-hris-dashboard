import { lazy } from "react";

const HRDashboard = lazy(() => import("../../views/hr/HRDashboard"));

const Employee = lazy(() => import("../../views/employee/Employee"));
const EmployeeForm = lazy(() => import("../../views/employee/EmployeeForm"));
const EmployeeDetails = lazy(() =>
  import("../../views/employee/EmployeeDetails")
);

const Position = lazy(() => import("../../views/admin/Position"));
const Cluster = lazy(() => import("../../views/admin/Cluster"));
const Department = lazy(() => import("../../views/admin/Department"));
const WorkSchedule = lazy(() => import("../../views/admin/WorkSchedule"));

const DutySchedule = lazy(() => import("../../views/admin/DutySchedule"));
const DutyScheduleForm = lazy(() =>
  import("../../views/admin/DutyScheduleForm")
);

const DailyAttendance = lazy(() => import("../../views/admin/DailyAttendance"));
const Holiday = lazy(() => import("../../views/admin/Holiday"));
const Religion = lazy(() => import("../../views/admin/Religion"));
const EmploymentStatus = lazy(() =>
  import("../../views/admin/EmploymentStatus")
);

export const hrRoutes = [
  { path: "hr/dashboard", element: <HRDashboard />, role: "hr" },
  { path: "hr/dashboard/employee", element: <Employee />, role: "hr" },
  { path: "hr/dashboard/employee/add", element: <EmployeeForm />, role: "hr" },
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
  { path: "hr/dashboard/holiday", element: <Holiday />, role: "hr" },
  {
    path: "hr/dashboard/daily-attendance",
    element: <DailyAttendance />,
    role: "hr",
  },
  { path: "hr/dashboard/position", element: <Position />, role: "hr" },
  { path: "hr/dashboard/cluster", element: <Cluster />, role: "hr" },
  { path: "hr/dashboard/department", element: <Department />, role: "hr" },
  { path: "hr/dashboard/work-schedule", element: <WorkSchedule />, role: "hr" },
  { path: "hr/dashboard/duty-schedule", element: <DutySchedule />, role: "hr" },
  {
    path: "hr/dashboard/duty-schedule/add",
    element: <DutyScheduleForm />,
    role: "hr",
  },
  {
    path: "hr/dashboard/duty-schedule/edit/:id",
    element: <DutyScheduleForm />,
    role: "hr",
  },
  { path: "hr/dashboard/religion", element: <Religion />, role: "hr" },
  {
    path: "hr/dashboard/employment-status",
    element: <EmploymentStatus />,
    role: "hr",
  },
];
