import { lazy } from "react";

const ManagerDashboard = lazy(() =>
  import("../../pages/dashboard/manager/ManagerDashboard")
);

const ManagerEmployees = lazy(() =>
  import("../../pages/dashboard/manager/employees/ManagerEmployees")
);

const ManagerEmployeeDetails = lazy(() =>
  import("../../pages/dashboard/manager/employees/ManagerEmployeeDetails")
);

const ManagerEmployeesBirthdays = lazy(() =>
  import("../../pages/dashboard/manager/employees/ManagerEmployeesBirthdays")
);

const ManagerDutySchedule = lazy(() =>
  import("../../pages/dashboard/manager/dutySchedule/ManagerDutySchedule")
);

const OptimizedManagerDutySchedule = lazy(() =>
  import(
    "../../pages/dashboard/manager/dutySchedule/OptimizedManagerDutySchedule"
  )
);

const ManagerDutyScheduleForm = lazy(() =>
  import("../../pages/dashboard/manager/dutySchedule/ManagerDutyScheduleForm")
);

const ManagerDutyScheduleDetails = lazy(() =>
  import(
    "../../pages/dashboard/manager/dutySchedule/ManagerDutyScheduleDetails"
  )
);
const ManagerDutySchedulePrint = lazy(() =>
  import("../../pages/dashboard/manager/dutySchedule/ManagerDutySchedulePrint")
);

const ManagerEmployeeAttendance = lazy(() =>
  import("../../pages/dashboard/manager/attendance/ManagerEmployeeAttendance")
);
// const TeamOverview = lazy(() =>
//   import("../../pages/dashboard/manager/TeamOverview")
// );
// const DepartmentAttendance = lazy(() =>
//   import("../../pages/dashboard/manager/DepartmentAttendance")
// );

// const LeaveApprovals = lazy(() =>
//   import("../../pages/dashboard/manager/LeaveApprovals")
// );
// const LicenseManagement = lazy(() =>
//   import("../../pages/dashboard/manager/LicenseManagement")
// );
// const PerformanceReviews = lazy(() =>
//   import("../../pages/dashboard/manager/PerformanceReviews")
// );
// const PayrollSummary = lazy(() =>
//   import("../../pages/dashboard/manager/PayrollSummary")
// );
// const TrainingManagement = lazy(() =>
//   import("../../pages/dashboard/manager/TrainingManagement")
// );
// const TeamAnnouncements = lazy(() =>
//   import("../../pages/dashboard/manager/TeamAnnouncements")
// );
// const ReportsAnalytics = lazy(() =>
//   import("../../pages/dashboard/manager/ReportsAnalytics")
// );
// const TeamPerformanceDashboard = lazy(() =>
//   import("../../pages/dashboard/manager/TeamPerformanceDashboard")
// );
// const SuccessionPlanning = lazy(() =>
//   import("../../pages/dashboard/manager/SuccessionPlanning")
// );
// const IncidentReports = lazy(() =>
//   import("../../pages/dashboard/manager/IncidentReports")
// );
// const OnboardingTracker = lazy(() =>
//   import("../../pages/dashboard/manager/OnboardingTracker")
// );
// const OrganizationChart = lazy(() =>
//   import("../../pages/dashboard/manager/OrganizationChart")
// );

const managerRoles = [
  "MANAGER",
  "HR_ADMIN",
  "MARKETING_ADMIN",
  "SUPERVISOR",
  "ADMIN",
];

const managerRoutes = [
  {
    path: "/manager/dashboard",
    element: <ManagerDashboard />,
    role: managerRoles,
  },
  {
    path: "/manager/employees",
    element: <ManagerEmployees />,
    role: managerRoles,
  },

  {
    path: "/manager/employees/details/:employeeId",
    element: <ManagerEmployeeDetails />,
    role: managerRoles,
  },

  {
    path: "/manager/employees/birthdays",
    element: <ManagerEmployeesBirthdays />,
    role: managerRoles,
  },

  {
    path: "/manager/duty-schedule",
    element: <ManagerDutySchedule />,
    // element: <OptimizedManagerDutySchedule />,
    role: managerRoles,
  },

  {
    path: "/manager/duty-schedule/:departmentId/create",
    element: <ManagerDutyScheduleForm />,
    role: managerRoles,
  },
  {
    path: "/manager/duty-schedule/:departmentId/edit/:scheduleId",
    element: <ManagerDutyScheduleForm />,
    role: managerRoles,
  },

  {
    path: "/manager/duty-schedule/:departmentId/view/:scheduleId",
    element: <ManagerDutyScheduleDetails />,
    role: managerRoles,
  },

  {
    path: "/manager/duty-schedule/print/department/:departmentId/schedule/:scheduleId",
    element: <ManagerDutySchedulePrint />,
    role: managerRoles,
  },

  {
    path: "/manager/employee-attendance",
    element: <ManagerEmployeeAttendance />,
    role: managerRoles,
  },
  // {
  //   path: "/manager/team-overview",
  //   element: <TeamOverview />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/leave-approvals",
  //   element: <LeaveApprovals />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/license-management",
  //   element: <LicenseManagement />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/performance-reviews",
  //   element: <PerformanceReviews />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/payroll-summary",
  //   element: <PayrollSummary />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/training-management",
  //   element: <TrainingManagement />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/team-announcements",
  //   element: <TeamAnnouncements />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/reports-analytics",
  //   element: <ReportsAnalytics />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/team-performance-dashboard",
  //   element: <TeamPerformanceDashboard />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/succession-planning",
  //   element: <SuccessionPlanning />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/incident-reports",
  //   element: <IncidentReports />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/onboarding-tracker",
  //   element: <OnboardingTracker />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/manager/org-chart",
  //   element: <OrganizationChart />,
  //   role: ["MANAGER", "SUPER_ADMIN"],
  // },
];

export default managerRoutes;
