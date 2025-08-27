import { MdOutlineSupervisorAccount } from "react-icons/md";

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
  AiOutlineBook,
  AiOutlineComment,
  AiOutlineBell,
  AiOutlineApartment,
  AiOutlineUserSwitch,
  AiOutlineClockCircle,
} from "react-icons/ai";
import { FaBirthdayCake } from "react-icons/fa";

const directorRoles = ["DIRECTOR", "EXECUTIVE"];

export const directorNav = [
  //====================================
  // Director Dashboard Navigation
  {
    title: "Director Dashboard",
    isGroupTitle: true,
    icon: <MdOutlineSupervisorAccount />,
    role: directorRoles,
  },
  // {
  //   title: "Dashboard Overview",
  //   icon: <AiOutlineDashboard />,
  //   path: "/director/dashboard",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  {
    title: "Employees",
    icon: <AiOutlineUserSwitch />, // Manage all employee profiles
    path: "/director/employees",
    role: directorRoles,
    group: "Director Dashboard",
  },
  {
    title: "Duty Schedule",
    icon: <AiOutlineForm />,
    path: "/director/duty-schedule",
    role: directorRoles,
    group: "Director Dashboard",
  },

  {
    title: "Attendance",
    icon: <AiOutlineClockCircle />,
    path: "/director/employee-attendance",
    role: directorRoles,
    group: "Director Dashboard",
  },

  {
    title: "Birthdays",
    icon: <FaBirthdayCake />,
    path: "/director/employees/birthdays",
    role: directorRoles,
    group: "Director Dashboard",
  },
  // {
  //   title: "Department Overview",
  //   icon: <AiOutlineTeam />,
  //   path: "/director/department-overview",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Department Attendance",
  //   icon: <AiOutlineSchedule />,
  //   path: "/director/attendance",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },

  // {
  //   title: "Manager Leave Requests",
  //   icon: <AiOutlineForm />,
  //   path: "/director/manager-leave",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "License Registry",
  //   icon: <AiOutlineSafetyCertificate />,
  //   path: "/director/license-registry",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Manager Evaluations",
  //   icon: <AiOutlineBarChart />,
  //   path: "/director/evaluations",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Payroll Summary",
  //   icon: <AiOutlineDollarCircle />,
  //   path: "/director/payroll-summary",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Training Oversight",
  //   icon: <AiOutlineTrophy />,
  //   path: "/director/training",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Department Announcements",
  //   icon: <AiOutlineNotification />,
  //   path: "/director/announcements",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Strategic Reports",
  //   icon: <AiOutlineBarChart />,
  //   path: "/director/reports",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Compliance Monitor",
  //   icon: <AiOutlineBell />,
  //   path: "/director/compliance",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Budget Requests Overview",
  //   icon: <AiOutlineFileText />,
  //   path: "/director/budget-requests",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Policy Review Panel",
  //   icon: <AiOutlineBook />,
  //   path: "/director/policy-review",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Leadership Pipeline",
  //   icon: <AiOutlineComment />,
  //   path: "/director/succession",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
  // {
  //   title: "Organization Chart",
  //   icon: <AiOutlineApartment />,
  //   path: "/director/org-chart",
  //   role: directorRoles,
  //   group: "Director Dashboard",
  // },
];
