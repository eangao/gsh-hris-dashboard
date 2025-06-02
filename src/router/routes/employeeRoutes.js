import { lazy } from "react";

const EmployeeDashboard = lazy(() =>
  import("../../pages/dashboard/employee/EmployeeDashboard")
);
const MyProfile = lazy(() =>
  import("../../pages/dashboard/employee/MyProfile")
);
const MyAttendance = lazy(() =>
  import("../../pages/dashboard/employee/MyAttendance")
);
const MyDependents = lazy(() =>
  import("../../pages/dashboard/employee/MyDependents")
);
const MyDutySchedule = lazy(() =>
  import("../../pages/dashboard/employee/MyDutySchedule")
);
const MyLeaveRequests = lazy(() =>
  import("../../pages/dashboard/employee/MyLeaveRequests")
);
const MyLicenses = lazy(() =>
  import("../../pages/dashboard/employee/MyLicenses")
);
const PerformanceEvaluation = lazy(() =>
  import("../../pages/dashboard/employee/PerformanceEvaluation")
);
const MyPayroll = lazy(() =>
  import("../../pages/dashboard/employee/MyPayroll")
);
const TrainingCertificates = lazy(() =>
  import("../../pages/dashboard/employee/TrainingCertificates")
);
const Announcements = lazy(() =>
  import("../../pages/dashboard/employee/Announcements")
);
const DocumentRequests = lazy(() =>
  import("../../pages/dashboard/employee/DocumentRequests")
);
const HelpdeskSupportTickets = lazy(() =>
  import("../../pages/dashboard/employee/HelpdeskSupportTickets")
);
const CompanyPolicies = lazy(() =>
  import("../../pages/dashboard/employee/CompanyPolicies")
);
const FeedbackSuggestions = lazy(() =>
  import("../../pages/dashboard/employee/FeedbackSuggestions")
);
const TaskRemindersNotifications = lazy(() =>
  import("../../pages/dashboard/employee/TaskRemindersNotifications")
);
const OrganizationChart = lazy(() =>
  import("../../pages/dashboard/employee/OrganizationChart")
);
const employeeRoutes = [
  {
    path: "/employee/dashboard",
    element: <EmployeeDashboard />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/profile",
    element: <MyProfile />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/attendance",
    element: <MyAttendance />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/dependents",
    element: <MyDependents />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/duty-schedule",
    element: <MyDutySchedule />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/leave",
    element: <MyLeaveRequests />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/license",
    element: <MyLicenses />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/performance-evaluation",
    element: <PerformanceEvaluation />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/payroll",
    element: <MyPayroll />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/training",
    element: <TrainingCertificates />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/announcements",
    element: <Announcements />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/documents",
    element: <DocumentRequests />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/helpdesk",
    element: <HelpdeskSupportTickets />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/policies",
    element: <CompanyPolicies />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/feedback-suggestions",
    element: <FeedbackSuggestions />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/notifications",
    element: <TaskRemindersNotifications />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/organization-chart",
    element: <OrganizationChart />,
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
  },
];

export default employeeRoutes;
