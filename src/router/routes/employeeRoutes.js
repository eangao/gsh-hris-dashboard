import { lazy } from "react";

const EmployeeDashboard = lazy(() =>
  import("../../pages/dashboard/employee/EmployeeDashboard")
);
const MyProfile = lazy(() =>
  import("../../pages/dashboard/employee/MyProfile")
);
const EmployeeDutySchedule = lazy(() =>
  import("../../pages/dashboard/employee/dutySchedule/EmployeeDutySchedule")
);
const EmployeeDutySchedulePrint = lazy(() =>
  import(
    "../../pages/dashboard/employee/dutySchedule/EmployeeDutySchedulePrint"
  )
);
const EmployeeDutyScheduleDetails = lazy(() =>
  import(
    "../../pages/dashboard/employee/dutySchedule/EmployeeDutyScheduleDetails"
  )
);
const MyAttendance = lazy(() =>
  import("../../pages/dashboard/employee/MyAttendance")
);
const MyDependents = lazy(() =>
  import("../../pages/dashboard/employee/MyDependents")
);
const AccountSettings = lazy(() => import("../../pages/AccountSettings"));
const HelpSupport = lazy(() => import("../../pages/HelpSupport"));

// const MyLeaveRequests = lazy(() =>
//   import("../../pages/dashboard/employee/MyLeaveRequests")
// );
// const MyLicenses = lazy(() =>
//   import("../../pages/dashboard/employee/MyLicenses")
// );
// const PerformanceEvaluation = lazy(() =>
//   import("../../pages/dashboard/employee/PerformanceEvaluation")
// );
// const MyPayroll = lazy(() =>
//   import("../../pages/dashboard/employee/MyPayroll")
// );
// const TrainingCertificates = lazy(() =>
//   import("../../pages/dashboard/employee/TrainingCertificates")
// );
// const Announcements = lazy(() =>
//   import("../../pages/dashboard/employee/Announcements")
// );
// const DocumentRequests = lazy(() =>
//   import("../../pages/dashboard/employee/DocumentRequests")
// );
// const HelpdeskSupportTickets = lazy(() =>
//   import("../../pages/dashboard/employee/HelpdeskSupportTickets")
// );
// const CompanyPolicies = lazy(() =>
//   import("../../pages/dashboard/employee/CompanyPolicies")
// );
// const FeedbackSuggestions = lazy(() =>
//   import("../../pages/dashboard/employee/FeedbackSuggestions")
// );
// const TaskRemindersNotifications = lazy(() =>
//   import("../../pages/dashboard/employee/TaskRemindersNotifications")
// );
// const OrganizationChart = lazy(() =>
//   import("../../pages/dashboard/employee/OrganizationChart")
// );import EmployeeDutyScheduleDetails from './../../pages/dashboard/employee/dutySchedule/EmployeeDutyScheduleDetails';

const employeeAccessRoles = [
  "EMPLOYEE",
  "MANAGER",
  "SUPERVISOR",
  "DIRECTOR",
  "HR_ADMIN",
  "MARKETING_ADMIN",
  "ADMIN",
  "EXECUTIVE",
];

const employeeRoutes = [
  {
    path: "/employee/dashboard",
    element: <EmployeeDashboard />,
    role: employeeAccessRoles,
    // ✅ whoever needs personal dashboard
  },
  {
    path: "/employee/profile",
    element: <MyProfile />,
    role: employeeAccessRoles,
  },

  {
    path: "/employee/duty-schedule",
    element: <EmployeeDutySchedule />,
    role: employeeAccessRoles,
  },
  {
    path: "/employee/duty-schedule/view/employee/:employeeId/department/:departmentId/schedule/:scheduleId",
    element: <EmployeeDutyScheduleDetails />,
    role: employeeAccessRoles,
  },
  {
    path: "/employee/duty-schedule/print/employee/:employeeId/schedule/:scheduleId",
    element: <EmployeeDutySchedulePrint />,
    role: employeeAccessRoles,
  },
  {
    path: "/employee/attendance",
    element: <MyAttendance />,
    role: employeeAccessRoles,
  },

  {
    path: "/employee/dependents",
    element: <MyDependents />,
    role: employeeAccessRoles,
  },
  {
    path: "/employee/account-settings",
    element: <AccountSettings />,
    role: employeeAccessRoles,
  },
  {
    path: "/employee/help-support",
    element: <HelpSupport />,
    role: employeeAccessRoles,
  },

  // {
  //   path: "/employee/leave",
  //   element: <MyLeaveRequests />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/license",
  //   element: <MyLicenses />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/performance-evaluation",
  //   element: <PerformanceEvaluation />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/payroll",
  //   element: <MyPayroll />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/training",
  //   element: <TrainingCertificates />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/announcements",
  //   element: <Announcements />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/documents",
  //   element: <DocumentRequests />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/helpdesk",
  //   element: <HelpdeskSupportTickets />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/policies",
  //   element: <CompanyPolicies />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/feedback-suggestions",
  //   element: <FeedbackSuggestions />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/notifications",
  //   element: <TaskRemindersNotifications />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
  // {
  //   path: "/employee/organization-chart",
  //   element: <OrganizationChart />,
  //   role: [
  //     "EMPLOYEE",
  //     "MANAGER",
  //     "HR_ADMIN",
  //     "DIRECTOR",
  //     "ADMIN",
  //     "SUPER_ADMIN",
  //   ], // ✅ whoever needs personal dashboard
  // },
];

export default employeeRoutes;
