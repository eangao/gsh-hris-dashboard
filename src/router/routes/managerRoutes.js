import { lazy } from "react";

const ManagerDashboard = lazy(() =>
  import("../../pages/dashboard/manager/ManagerDashboard")
);
const TeamOverview = lazy(() =>
  import("../../pages/dashboard/manager/TeamOverview")
);
const TeamAttendance = lazy(() =>
  import("../../pages/dashboard/manager/TeamAttendance")
);
const ScheduleManagement = lazy(() =>
  import("../../pages/dashboard/manager/ScheduleManagement")
);
const LeaveApprovals = lazy(() =>
  import("../../pages/dashboard/manager/LeaveApprovals")
);
const LicenseManagement = lazy(() =>
  import("../../pages/dashboard/manager/LicenseManagement")
);
const PerformanceReviews = lazy(() =>
  import("../../pages/dashboard/manager/PerformanceReviews")
);
const PayrollSummary = lazy(() =>
  import("../../pages/dashboard/manager/PayrollSummary")
);
const TrainingManagement = lazy(() =>
  import("../../pages/dashboard/manager/TrainingManagement")
);
const TeamAnnouncements = lazy(() =>
  import("../../pages/dashboard/manager/TeamAnnouncements")
);
const ReportsAnalytics = lazy(() =>
  import("../../pages/dashboard/manager/ReportsAnalytics")
);
const TeamPerformanceDashboard = lazy(() =>
  import("../../pages/dashboard/manager/TeamPerformanceDashboard")
);
const SuccessionPlanning = lazy(() =>
  import("../../pages/dashboard/manager/SuccessionPlanning")
);
const IncidentReports = lazy(() =>
  import("../../pages/dashboard/manager/IncidentReports")
);
const OnboardingTracker = lazy(() =>
  import("../../pages/dashboard/manager/OnboardingTracker")
);
const OrganizationChart = lazy(() =>
  import("../../pages/dashboard/manager/OrganizationChart")
);

const managerRoutes = [
  {
    path: "/manager/dashboard",
    element: <ManagerDashboard />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/team-overview",
    element: <TeamOverview />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/team-attendance",
    element: <TeamAttendance />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/schedule-management",
    element: <ScheduleManagement />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/leave-approvals",
    element: <LeaveApprovals />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/license-management",
    element: <LicenseManagement />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/performance-reviews",
    element: <PerformanceReviews />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/payroll-summary",
    element: <PayrollSummary />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/training-management",
    element: <TrainingManagement />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/team-announcements",
    element: <TeamAnnouncements />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/reports-analytics",
    element: <ReportsAnalytics />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/team-performance-dashboard",
    element: <TeamPerformanceDashboard />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/succession-planning",
    element: <SuccessionPlanning />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/incident-reports",
    element: <IncidentReports />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/onboarding-tracker",
    element: <OnboardingTracker />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    path: "/manager/org-chart",
    element: <OrganizationChart />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
];

export default managerRoutes;
