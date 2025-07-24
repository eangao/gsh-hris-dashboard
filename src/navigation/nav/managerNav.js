import { FaUserCog } from "react-icons/fa";
import {
  AiOutlineDashboard,
  AiOutlineTeam,
  AiOutlineSchedule,
  AiOutlineForm,
  AiOutlineSafetyCertificate,
  AiOutlineBarChart,
  AiOutlineDollarCircle,
  AiOutlineTrophy,
  AiOutlineNotification,
  AiOutlineFileText,
  AiOutlineApartment,
  AiOutlinePieChart,
  AiOutlineClockCircle,
  AiOutlineUserSwitch,
} from "react-icons/ai";

const managerRoles = ["MANAGER", "HR_ADMIN", "MARKETING_ADMIN", "SUPERVISOR"];

export const managerNav = [
  //====================================
  // Manager Dashboard Navigation
  {
    title: "Manager Dashboard",
    isGroupTitle: true,
    icon: <FaUserCog />,
    role: managerRoles,
  },
  {
    title: "Dashboard Overview",
    icon: <AiOutlineDashboard />,
    path: "/manager/dashboard",
    role: managerRoles,
    group: "Manager Dashboard",
  },

  {
    title: "Employees",
    icon: <AiOutlineUserSwitch />, // Manage all employee profiles
    path: "/manager/employees",
    role: managerRoles,
    group: "Manager Dashboard",
  },

  {
    title: "Duty Schedule",
    icon: <AiOutlineSchedule />,
    path: "/manager/duty-schedule",
    role: managerRoles,
    group: "Manager Dashboard",
  },

  {
    title: "Attendance",
    icon: <AiOutlineClockCircle />,
    path: "/manager/employee-attendance",
    role: managerRoles,
    group: "Manager Dashboard",
  },
  // {
  //   title: "Team Overview",
  //   icon: <AiOutlineTeam />,
  //   path: "/manager/team-overview",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Leave Approvals",
  //   icon: <AiOutlineForm />,
  //   path: "/manager/leave-approvals",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "License Management",
  //   icon: <AiOutlineSafetyCertificate />,
  //   path: "/manager/license-management",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Performance Reviews",
  //   icon: <AiOutlineBarChart />,
  //   path: "/manager/performance-reviews",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Payroll Summary",
  //   icon: <AiOutlineDollarCircle />,
  //   path: "/manager/payroll-summary",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Training Management",
  //   icon: <AiOutlineTrophy />,
  //   path: "/manager/training-management",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Team Announcements",
  //   icon: <AiOutlineNotification />,
  //   path: "/manager/team-announcements",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Reports & Analytics",
  //   icon: <AiOutlinePieChart />,
  //   path: "/manager/reports-analytics",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Team Performance Dashboard",
  //   icon: <AiOutlineBarChart />,
  //   path: "/manager/team-performance-dashboard",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Succession Planning",
  //   icon: <AiOutlineFileText />,
  //   path: "/manager/succession-planning",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Incident Reports",
  //   icon: <AiOutlineForm />,
  //   path: "/manager/incident-reports",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Onboarding Tracker",
  //   icon: <AiOutlineSchedule />,
  //   path: "/manager/onboarding-tracker",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
  // {
  //   title: "Organization Chart",
  //   icon: <AiOutlineApartment />,
  //   path: "/manager/org-chart",
  //   role: managerRoles,
  //   group: "Manager Dashboard",
  // },
];
