import { lazy } from "react";

const DirectorDashboard = lazy(() =>
  import("../../pages/dashboard/director/DirectorDashboard")
);

const DirectorEmployees = lazy(() =>
  import("../../pages/dashboard/director/employees/DirectorEmployees")
);

const DirectorEmployeeDetails = lazy(() =>
  import("../../pages/dashboard/director/employees/DirectorEmployeeDetails")
);

const DirectorDutySchedule = lazy(() =>
  import("../../pages/dashboard/director/dutySchedule/DirectorDutySchedule")
);

const DirectorDutyScheduleDetails = lazy(() =>
  import(
    "../../pages/dashboard/director/dutySchedule/DirectorDutyScheduleDetails"
  )
);

const DirectorDutySchedulePrint = lazy(() =>
  import(
    "../../pages/dashboard/director/dutySchedule/DirectorDutySchedulePrint"
  )
);

// const DepartmentOverview = lazy(() =>
//   import("../../pages/dashboard/director/DepartmentOverview")
// );
// const DepartmentAttendance = lazy(() =>
//   import("../../pages/dashboard/director/DepartmentAttendance")
// );

// const ManagerLeaveRequests = lazy(() =>
//   import("../../pages/dashboard/director/ManagerLeaveRequests")
// );
// const LicenseRegistry = lazy(() =>
//   import("../../pages/dashboard/director/LicenseRegistry")
// );
// const ManagerEvaluations = lazy(() =>
//   import("../../pages/dashboard/director/ManagerEvaluations")
// );
// const PayrollSummary = lazy(() =>
//   import("../../pages/dashboard/director/PayrollSummary")
// );
// const TrainingOversight = lazy(() =>
//   import("../../pages/dashboard/director/TrainingOversight")
// );
// const DepartmentAnnouncements = lazy(() =>
//   import("../../pages/dashboard/director/DepartmentAnnouncements")
// );
// const StrategicReports = lazy(() =>
//   import("../../pages/dashboard/director/StrategicReports")
// );
// const ComplianceMonitor = lazy(() =>
//   import("../../pages/dashboard/director/ComplianceMonitor")
// );
// const BudgetRequests = lazy(() =>
//   import("../../pages/dashboard/director/BudgetRequests")
// );
// const PolicyReview = lazy(() =>
//   import("../../pages/dashboard/director/PolicyReview")
// );
// const LeadershipPipeline = lazy(() =>
//   import("../../pages/dashboard/director/LeadershipPipeline")
// );
// const OrganizationChart = lazy(() =>
//   import("../../pages/dashboard/director/OrganizationChart")
// );

const directorRoles = ["DIRECTOR"];

const directorRoutes = [
  {
    path: "/director/dashboard",
    element: <DirectorDashboard />,
    role: directorRoles,
  },

  {
    path: "/director/employees",
    element: <DirectorEmployees />,
    role: directorRoles,
  },

  {
    path: "/director/employees/details/:employeeId",
    element: <DirectorEmployeeDetails />,
    role: directorRoles,
  },

  {
    path: "/director/duty-schedule",
    element: <DirectorDutySchedule />,
    role: directorRoles,
  },

  {
    path: "/director/duty-schedule/:departmentId/view/:scheduleId",
    element: <DirectorDutyScheduleDetails />,
    role: directorRoles,
  },

  {
    path: "/director/duty-schedule/print/department/:departmentId/schedule/:scheduleId",
    element: <DirectorDutySchedulePrint />,
    role: directorRoles,
  },

  // {
  //   path: "/director/department-overview",
  //   element: <DepartmentOverview />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/attendance",
  //   element: <DepartmentAttendance />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/manager-leave",
  //   element: <ManagerLeaveRequests />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/license-registry",
  //   element: <LicenseRegistry />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/evaluations",
  //   element: <ManagerEvaluations />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/payroll-summary",
  //   element: <PayrollSummary />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/training",
  //   element: <TrainingOversight />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/announcements",
  //   element: <DepartmentAnnouncements />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/reports",
  //   element: <StrategicReports />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/compliance",
  //   element: <ComplianceMonitor />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/budget-requests",
  //   element: <BudgetRequests />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/policy-review",
  //   element: <PolicyReview />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/succession",
  //   element: <LeadershipPipeline />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
  // {
  //   path: "/director/org-chart",
  //   element: <OrganizationChart />,
  //   role: ["DIRECTOR", "SUPER_ADMIN"],
  // },
];

export default directorRoutes;
