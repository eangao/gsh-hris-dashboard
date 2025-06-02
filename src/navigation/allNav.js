import {
  AiOutlineAreaChart,
  AiOutlineClockCircle,
  AiOutlineCluster,
  AiOutlineFileSearch,
  AiOutlineUsergroupAdd,
  AiOutlineUserSwitch,
  AiOutlineWarning,
} from "react-icons/ai";
import { FaPeopleGroup } from "react-icons/fa6";
import {
  FaLayerGroup,
  FaUserCog,
  FaUserShield,
  FaUserTie,
} from "react-icons/fa";
import { RiCalendarScheduleLine, RiTimeFill } from "react-icons/ri";
import { FiFileText } from "react-icons/fi";
import {
  MdOutlinePersonPin,
  MdHolidayVillage,
  MdOutlineSupervisorAccount,
  MdSettingsApplications,
} from "react-icons/md";
import { FiBarChart2, FiSettings } from "react-icons/fi";
import {
  MdNotificationsActive,
  MdOutlineHistory,
  MdSettingsInputComponent,
  MdBackup,
} from "react-icons/md";
import { RiLoginBoxLine, RiFileList3Line } from "react-icons/ri";
import { BiToggleRight } from "react-icons/bi";
import { AiOutlineSetting } from "react-icons/ai";
import { RiNotification3Line } from "react-icons/ri";
import { FaChurch } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineTeam,
  AiOutlineSchedule,
  AiOutlineForm,
  AiOutlineSafetyCertificate,
  AiOutlineBarChart,
  AiOutlineDollarCircle,
  AiOutlineTrophy,
  AiOutlineNotification,
  AiOutlineFileText,
  AiOutlineCustomerService,
  AiOutlineBook,
  AiOutlineComment,
  AiOutlineBell,
  AiOutlineApartment,
  AiOutlinePieChart,
} from "react-icons/ai";

export const allNav = [
  //====================================
  //Employee Dashboard Navigation
  {
    title: "Employee",
    isGroupTitle: true,
    icon: <FaUserTie />,
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
    title: "Dashboard Overview",
    icon: <AiOutlineDashboard />,
    path: "/employee/dashboard",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "My Profile",
    icon: <AiOutlineUser />,
    path: "/employee/profile",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "My Attendance",
    icon: <AiOutlineCalendar />,
    path: "/employee/attendance",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "My Dependents",
    icon: <AiOutlineTeam />,
    path: "/employee/dependents",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "My Duty Schedule",
    icon: <AiOutlineSchedule />,
    path: "/employee/duty-schedule",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "My Leave Requests",
    icon: <AiOutlineForm />,
    path: "/employee/leave",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "My Licenses",
    icon: <AiOutlineSafetyCertificate />,
    path: "/employee/license",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "Performance Evaluation",
    icon: <AiOutlineBarChart />,
    path: "/employee/performance-evaluation",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "My Payroll",
    icon: <AiOutlineDollarCircle />,
    path: "/employee/payroll",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "Training & Certificates",
    icon: <AiOutlineTrophy />,
    path: "/employee/training",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "Announcements",
    icon: <AiOutlineNotification />,
    path: "/employee/announcements",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "Document Requests",
    icon: <AiOutlineFileText />,
    path: "/employee/documents",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "HR_ADMIN Helpdesk / Support Tickets",
    icon: <AiOutlineCustomerService />,
    path: "/employee/helpdesk",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "Company Policies / Handbook",
    icon: <AiOutlineBook />,
    path: "/employee/policies",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "Feedback or Suggestions",
    icon: <AiOutlineComment />,
    path: "/employee/feedback-suggestions",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "Task Reminders / Notifications",
    icon: <AiOutlineBell />,
    path: "/employee/notifications",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  {
    title: "Organization Chart",
    icon: <AiOutlineApartment />,
    path: "/employee/organization-chart",
    role: [
      "EMPLOYEE",
      "MANAGER",
      "HR_ADMIN",
      "DIRECTOR",
      "ADMIN",
      "SUPER_ADMIN",
    ], // ✅ whoever needs personal dashboard
    group: "Employee",
  },
  //====================================
  // Manager Dashboard Navigation
  {
    title: "Manager",
    isGroupTitle: true,
    icon: <FaUserCog />,
    role: ["MANAGER", "SUPER_ADMIN"],
  },
  {
    title: "Manager Dashboard",
    icon: <AiOutlineDashboard />,
    path: "/manager/dashboard",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Team Overview",
    icon: <AiOutlineTeam />,
    path: "/manager/team-overview",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Team Attendance",
    icon: <AiOutlineCalendar />,
    path: "/manager/team-attendance",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Schedule Management",
    icon: <AiOutlineSchedule />,
    path: "/manager/schedule-management",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Leave Approvals",
    icon: <AiOutlineForm />,
    path: "/manager/leave-approvals",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "License Management",
    icon: <AiOutlineSafetyCertificate />,
    path: "/manager/license-management",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Performance Reviews",
    icon: <AiOutlineBarChart />,
    path: "/manager/performance-reviews",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Payroll Summary",
    icon: <AiOutlineDollarCircle />,
    path: "/manager/payroll-summary",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Training Management",
    icon: <AiOutlineTrophy />,
    path: "/manager/training-management",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Team Announcements",
    icon: <AiOutlineNotification />,
    path: "/manager/team-announcements",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Reports & Analytics",
    icon: <AiOutlinePieChart />,
    path: "/manager/reports-analytics",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Team Performance Dashboard",
    icon: <AiOutlineBarChart />,
    path: "/manager/team-performance-dashboard",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Succession Planning",
    icon: <AiOutlineFileText />,
    path: "/manager/succession-planning",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Incident Reports",
    icon: <AiOutlineForm />,
    path: "/manager/incident-reports",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Onboarding Tracker",
    icon: <AiOutlineSchedule />,
    path: "/manager/onboarding-tracker",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  {
    title: "Organization Chart",
    icon: <AiOutlineApartment />,
    path: "/manager/org-chart",
    role: ["MANAGER", "SUPER_ADMIN"],
    group: "Manager",
  },
  //====================================
  // Director Dashboard Navigation
  {
    title: "Director",
    isGroupTitle: true,
    icon: <MdOutlineSupervisorAccount />,
    role: ["DIRECTOR", "SUPER_ADMIN"],
  },
  {
    title: "Director Dashboard",
    icon: <AiOutlineDashboard />,
    path: "/director/dashboard",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Department Overview",
    icon: <AiOutlineTeam />,
    path: "/director/department-overview",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Department Attendance",
    icon: <AiOutlineSchedule />,
    path: "/director/attendance",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Schedule Approvals",
    icon: <AiOutlineForm />,
    path: "/director/schedule-approvals",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Manager Leave Requests",
    icon: <AiOutlineForm />,
    path: "/director/manager-leave",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "License Registry",
    icon: <AiOutlineSafetyCertificate />,
    path: "/director/license-registry",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Manager Evaluations",
    icon: <AiOutlineBarChart />,
    path: "/director/evaluations",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Payroll Summary",
    icon: <AiOutlineDollarCircle />,
    path: "/director/payroll-summary",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Training Oversight",
    icon: <AiOutlineTrophy />,
    path: "/director/training",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Department Announcements",
    icon: <AiOutlineNotification />,
    path: "/director/announcements",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Strategic Reports",
    icon: <AiOutlineBarChart />,
    path: "/director/reports",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Compliance Monitor",
    icon: <AiOutlineBell />,
    path: "/director/compliance",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Budget Requests Overview",
    icon: <AiOutlineFileText />,
    path: "/director/budget-requests",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Policy Review Panel",
    icon: <AiOutlineBook />,
    path: "/director/policy-review",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Leadership Pipeline",
    icon: <AiOutlineComment />,
    path: "/director/succession",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },
  {
    title: "Organization Chart",
    icon: <AiOutlineApartment />,
    path: "/director/org-chart",
    role: ["DIRECTOR", "SUPER_ADMIN"],
    group: "Director",
  },

  //====================================
  // HR Dashboard Navigation
  {
    title: "HR",
    isGroupTitle: true,
    icon: <FaPeopleGroup />,
    role: ["HR_ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "HR Dashboard",
    icon: <AiOutlineDashboard />, // Overview and stats for HR
    path: "/hr/dashboard",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Employee Management",
    icon: <AiOutlineUserSwitch />, // Manage all employee profiles
    path: "/hr/employees",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Department Attendance",
    icon: <AiOutlineCalendar />,
    path: "/hr/department-attendance",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Schedule Finalization",
    icon: <AiOutlineSchedule />,
    path: "/hr/finalize-schedule",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Leave Administration",
    icon: <AiOutlineForm />,
    path: "/hr/leave-admin",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "License Administration",
    icon: <AiOutlineSafetyCertificate />,
    path: "/hr/license-admin",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Evaluation Reports",
    icon: <AiOutlineBarChart />,
    path: "/hr/evaluation-reports",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Payroll Management",
    icon: <AiOutlineDollarCircle />,
    path: "/hr/payroll",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Training & Development",
    icon: <AiOutlineTrophy />,
    path: "/hr/training",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Global Announcements",
    icon: <AiOutlineNotification />,
    path: "/hr/announcements",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Onboarding & Offboarding",
    icon: <AiOutlineUsergroupAdd />,
    path: "/hr/onboarding",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "HR Reports & Analytics",
    icon: <AiOutlineAreaChart />,
    path: "/hr/analytics",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Timekeeping Integration",
    icon: <AiOutlineClockCircle />,
    path: "/hr/timekeeping",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Disciplinary Actions",
    icon: <AiOutlineWarning />,
    path: "/hr/disciplinary",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Compliance Calendar",
    icon: <AiOutlineCalendar />,
    path: "/hr/compliance-calendar",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Audit Logs",
    icon: <AiOutlineFileSearch />,
    path: "/hr/audit-logs",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  {
    title: "Organization Chart Management",
    icon: <AiOutlineApartment />,
    path: "/hr/org-chart",
    role: ["HR_ADMIN", "SUPER_ADMIN"],
    group: "HR",
  },
  //====================================
  // Admin Dashboard Navigation
  {
    title: "Admin",
    isGroupTitle: true,
    icon: <FaUserShield />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Admin Dashboard",
    icon: <AiOutlineDashboard />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard",
    group: "Admin",
  },
  {
    title: "Dashboard Analytics",
    icon: <FiBarChart2 />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/analytics",
    group: "Admin",
  },
  {
    title: "Admin Notifications",
    icon: <MdNotificationsActive />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/notifications",
    group: "Admin",
  },
  {
    title: "User Management",
    icon: <FaUserCog />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/users",
    group: "Admin",
  },
  {
    title: "Login Activity Logs",
    icon: <RiLoginBoxLine />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/login-activity",
    group: "Admin",
  },
  {
    title: "Audit Logs",
    icon: <MdOutlineHistory />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/audit-logs",
    group: "Admin",
  },
  {
    title: "System Settings",
    icon: <FiSettings />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/system-settings",
    group: "Admin",
  },
  {
    title: "Integration Settings",
    icon: <MdSettingsInputComponent />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/integrations",
    group: "Admin",
  },
  {
    title: "Feature Toggle Manager",
    icon: <BiToggleRight />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/feature-toggle",
    group: "Admin",
  },
  {
    title: "Backup & Recovery",
    icon: <MdBackup />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/backup-recovery",
    group: "Admin",
  },
  {
    title: "System Logs",
    icon: <RiFileList3Line />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/system-logs",
    group: "Admin",
  },
  // --- System Setup Group Label ---
  {
    title: "System Setup",
    isGroupTitle: true,
    icon: <MdSettingsApplications />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "Cluster Management",
    icon: <AiOutlineCluster />,
    path: "/admin/setup/cluster",
    role: ["ADMIN", "SUPER_ADMIN"],
    group: "System Setup",
  },
  {
    title: "Position Titles",
    icon: <FiFileText />,
    path: "/admin/setup/position",
    role: ["ADMIN", "SUPER_ADMIN"],
    group: "System Setup",
  },

  {
    title: "Employment Types",
    icon: <GoPerson />,
    path: "/admin/setup/employment-status",
    role: ["ADMIN", "SUPER_ADMIN"],
    group: "System Setup",
  },
  {
    title: "Religion Masterlist",
    icon: <FaChurch />,
    path: "/admin/setup/religion",
    role: ["ADMIN", "SUPER_ADMIN"],
    group: "System Setup",
  },
  {
    title: "Shift Templates",
    icon: <RiTimeFill />,
    path: "/admin/setup/shift-templates",
    role: ["ADMIN", "SUPER_ADMIN"],
    group: "System Setup",
  },
  {
    title: "Notification Settings",
    icon: <RiNotification3Line />,
    path: "/admin/setup/notification-settings",
    role: ["ADMIN", "SUPER_ADMIN"],
    group: "System Setup",
  },
  {
    title: "Holiday Calendar",
    icon: <MdHolidayVillage />,
    path: "/admin/setup/holiday",
    role: ["ADMIN", "SUPER_ADMIN"],
    group: "System Setup",
  },
];
