import { lazy } from "react";

const HrDashboard = lazy(() => import("../../pages/dashboard/hr/HrDashboard"));
const EmployeeManagement = lazy(() =>
  import("../../pages/dashboard/hr/employees/EmployeeManagement")
);
const EmployeeForm = lazy(() =>
  import("../../pages/dashboard/hr/employees/EmployeeForm")
);
const EmployeeDetails = lazy(() =>
  import("../../pages/dashboard/hr/employees/EmployeeDetails")
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

const hrRoutes = [
  {
    path: "/hr/dashboard",
    element: <HrDashboard />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/employees",
    element: <EmployeeManagement />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/employees/add",
    element: <EmployeeForm />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/employees/edit/:id",
    element: <EmployeeForm />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/employees/details/:id",
    element: <EmployeeDetails />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },

  {
    path: "/hr/duty-schedule",
    element: <HrDutySchedule />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/duty-schedule/:departmentId/view/:scheduleId",
    element: <HrDutyScheduleDetails />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/hr/duty-schedule/print/department/:departmentId/schedule/:scheduleId",
    element: <HrDutySchedulePrint />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
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
];

export default hrRoutes;
