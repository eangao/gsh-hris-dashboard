import { lazy } from "react";

const HrDashboard = lazy(() => import("../../pages/dashboard/hr/HrDashboard"));
const HrEmployees = lazy(() =>
  import("../../pages/dashboard/hr/employees/HrEmployees")
);
const HrEmployeeForm = lazy(() =>
  import("../../pages/dashboard/hr/employees/HrEmployeeForm")
);
const HrEmployeeDetails = lazy(() =>
  import("../../pages/dashboard/hr/employees/HrEmployeeDetails")
);

const HrDutySchedule = lazy(() =>
  import("../../pages/dashboard/hr/dutySchedule/HrDutySchedule")
);
const HrDutyScheduleDetails = lazy(() =>
  import("../../pages/dashboard/hr/dutySchedule/HrDutyScheduleDetails")
);
const HrDutySchedulePrint = lazy(() =>
  import("../../pages/dashboard/hr/dutySchedule/HrDutySchedulePrint")
);

const HrEmployeesBirthdays = lazy(() =>
  import("../../pages/dashboard/hr/employees/HrEmployeesBirthdays")
);

// const DepartmentAttendance = lazy(() =>
//   import("../../pages/dashboard/hr/DepartmentAttendance")
// );

// const LeaveAdministration = lazy(() =>
//   import("../../pages/dashboard/hr/LeaveAdministration")
// );
// const LicenseAdministration = lazy(() =>
//   import("../../pages/dashboard/hr/LicenseAdministration")
// );
// const EvaluationReports = lazy(() =>
//   import("../../pages/dashboard/hr/EvaluationReports")
// );
// const PayrollManagement = lazy(() =>
//   import("../../pages/dashboard/hr/PayrollManagement")
// );
// const TrainingDevelopment = lazy(() =>
//   import("../../pages/dashboard/hr/TrainingDevelopment")
// );
// const GlobalAnnouncements = lazy(() =>
//   import("../../pages/dashboard/hr/GlobalAnnouncements")
// );
// const OnboardingTracker = lazy(() =>
//   import("../../pages/dashboard/hr/OnboardingTracker")
// );
// const HrAnalytics = lazy(() => import("../../pages/dashboard/hr/HrAnalytics"));
// const TimekeepingIntegration = lazy(() =>
//   import("../../pages/dashboard/hr/TimekeepingIntegration")
// );
// const DisciplinaryActions = lazy(() =>
//   import("../../pages/dashboard/hr/DisciplinaryActions")
// );
// const ComplianceCalendar = lazy(() =>
//   import("../../pages/dashboard/hr/ComplianceCalendar")
// );
// const AuditLogs = lazy(() => import("../../pages/dashboard/hr/AuditLogs"));
// const OrgChartManagement = lazy(() =>
//   import("../../pages/dashboard/hr/OrgChartManagement")
// );

//================================
// setup

const Cluster = lazy(() => import("../../pages/dashboard/admin/setup/Cluster"));
const Department = lazy(() =>
  import("../../pages/dashboard/admin/setup/Department")
);

const EmploymentStatus = lazy(() =>
  import("../../pages/dashboard/admin/setup/EmploymentStatus")
);
const Holiday = lazy(() => import("../../pages/dashboard/admin/setup/Holiday"));

const Position = lazy(() =>
  import("../../pages/dashboard/admin/setup/Position")
);
const Religion = lazy(() =>
  import("../../pages/dashboard/admin/setup/Religion")
);
const ShiftTemplates = lazy(() =>
  import("../../pages/dashboard/admin/setup/ShiftTemplates")
);

const hrRoles = ["HR_ADMIN"];

const hrRoutes = [
  {
    path: "/hr/dashboard",
    element: <HrDashboard />,
    role: hrRoles,
  },
  {
    path: "/hr/employees",
    element: <HrEmployees />,
    role: hrRoles,
  },
  {
    path: "/hr/employees/add",
    element: <HrEmployeeForm />,
    role: hrRoles,
  },
  {
    path: "/hr/employees/edit/:employeeId",
    element: <HrEmployeeForm />,
    role: hrRoles,
  },
  {
    path: "/hr/employees/details/:employeeId",
    element: <HrEmployeeDetails />,
    role: hrRoles,
  },

  {
    path: "/hr/employees/birthdays",
    element: <HrEmployeesBirthdays />,
    role: hrRoles,
  },

  {
    path: "/hr/duty-schedule",
    element: <HrDutySchedule />,
    role: hrRoles,
  },
  {
    path: "/hr/duty-schedule/:departmentId/view/:scheduleId",
    element: <HrDutyScheduleDetails />,
    role: hrRoles,
  },
  {
    path: "/hr/duty-schedule/print/department/:departmentId/schedule/:scheduleId",
    element: <HrDutySchedulePrint />,
    role: hrRoles,
  },

  // {
  //   path: "/hr/department-attendance",
  //   element: <DepartmentAttendance />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },

  // {
  //   path: "/hr/leave-admin",
  //   element: <LeaveAdministration />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/license-admin",
  //   element: <LicenseAdministration />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/evaluation-reports",
  //   element: <EvaluationReports />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/payroll",
  //   element: <PayrollManagement />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/training",
  //   element: <TrainingDevelopment />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/announcements",
  //   element: <GlobalAnnouncements />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/onboarding",
  //   element: <OnboardingTracker />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/analytics",
  //   element: <HrAnalytics />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/timekeeping",
  //   element: <TimekeepingIntegration />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/disciplinary",
  //   element: <DisciplinaryActions />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/compliance-calendar",
  //   element: <ComplianceCalendar />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/audit-logs",
  //   element: <AuditLogs />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/hr/org-chart",
  //   element: <OrgChartManagement />,
  //   role: ["HR_ADMIN", "SUPER_ADMIN"],
  // },

  //============================
  // HR Setups page

  {
    path: "/hr/setup/cluster",
    element: <Cluster />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/setup/department",
    element: <Department />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/setup/position",
    element: <Position />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/setup/employment-status",
    element: <EmploymentStatus />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/setup/religion",
    element: <Religion />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/setup/shift-templates",
    element: <ShiftTemplates />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },

  {
    path: "/hr/setup/holiday",
    element: <Holiday />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
];

export default hrRoutes;
