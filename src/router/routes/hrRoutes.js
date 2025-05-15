import { lazy } from "react";

const HRDashboard = lazy(() => import("../../views/dashboard/HRDashboard"));

const Employee = lazy(() => import("../../views/employees/Employee"));
const EmployeeForm = lazy(() => import("../../views/employees/EmployeeForm"));
const EmployeeDetails = lazy(() =>
  import("../../views/employees/EmployeeDetails")
);

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
const Religion = lazy(() => import("../../views/settings/Religion"));
const EmploymentStatus = lazy(() =>
  import("../../views/settings/EmploymentStatus")
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
