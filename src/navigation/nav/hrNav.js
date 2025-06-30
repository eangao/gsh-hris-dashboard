import {
  AiOutlineAreaChart,
  AiOutlineClockCircle,
  AiOutlineFileSearch,
  AiOutlineUsergroupAdd,
  AiOutlineUserSwitch,
  AiOutlineWarning,
} from "react-icons/ai";
import { FaPeopleGroup } from "react-icons/fa6";
import {
  AiOutlineDashboard,
  AiOutlineCalendar,
  AiOutlineSchedule,
  AiOutlineForm,
  AiOutlineSafetyCertificate,
  AiOutlineBarChart,
  AiOutlineDollarCircle,
  AiOutlineTrophy,
  AiOutlineNotification,
  AiOutlineApartment,
} from "react-icons/ai";

const hrRoles = ["HR_ADMIN", "SUPER_ADMIN"];

export const hrNav = [
  //====================================
  // HR Dashboard Navigation
  {
    title: "HR Dashboard",
    isGroupTitle: true,
    icon: <FaPeopleGroup />,
    role: hrRoles,
  },
  {
    title: "Dashboard Overview",
    icon: <AiOutlineDashboard />, // Overview and stats for HR
    path: "/hr/dashboard",
    role: hrRoles,
    group: "HR Dashboard",
  },
  {
    title: "Employees",
    icon: <AiOutlineUserSwitch />, // Manage all employee profiles
    path: "/hr/employees",
    role: hrRoles,
    group: "HR Dashboard",
  },

  {
    title: "Duty Schedule",
    icon: <AiOutlineForm />,
    path: "/hr/duty-schedule",
    role: hrRoles,
    group: "HR Dashboard",
  },
  // {
  //   title: "Department Attendance",
  //   icon: <AiOutlineCalendar />,
  //   path: "/hr/department-attendance",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },

  // {
  //   title: "Leave Administration",
  //   icon: <AiOutlineForm />,
  //   path: "/hr/leave-admin",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "License Administration",
  //   icon: <AiOutlineSafetyCertificate />,
  //   path: "/hr/license-admin",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "Evaluation Reports",
  //   icon: <AiOutlineBarChart />,
  //   path: "/hr/evaluation-reports",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "Payroll Management",
  //   icon: <AiOutlineDollarCircle />,
  //   path: "/hr/payroll",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "Training & Development",
  //   icon: <AiOutlineTrophy />,
  //   path: "/hr/training",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "Global Announcements",
  //   icon: <AiOutlineNotification />,
  //   path: "/hr/announcements",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "Onboarding & Offboarding",
  //   icon: <AiOutlineUsergroupAdd />,
  //   path: "/hr/onboarding",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "HR Reports & Analytics",
  //   icon: <AiOutlineAreaChart />,
  //   path: "/hr/analytics",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "Timekeeping Integration",
  //   icon: <AiOutlineClockCircle />,
  //   path: "/hr/timekeeping",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "Disciplinary Actions",
  //   icon: <AiOutlineWarning />,
  //   path: "/hr/disciplinary",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "Compliance Calendar",
  //   icon: <AiOutlineCalendar />,
  //   path: "/hr/compliance-calendar",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "Audit Logs",
  //   icon: <AiOutlineFileSearch />,
  //   path: "/hr/audit-logs",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
  // {
  //   title: "Organization Chart Management",
  //   icon: <AiOutlineApartment />,
  //   path: "/hr/org-chart",
  //   role: hrRoles,
  //   group: "HR Dashboard",
  // },
];
