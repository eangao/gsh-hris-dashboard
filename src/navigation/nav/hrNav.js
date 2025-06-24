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
    title: "HR",
    isGroupTitle: true,
    icon: <FaPeopleGroup />,
    role: hrRoles,
  },
  {
    title: "HR Dashboard",
    icon: <AiOutlineDashboard />, // Overview and stats for HR
    path: "/hr/dashboard",
    role: hrRoles,
    group: "HR",
  },
  {
    title: "Employees",
    icon: <AiOutlineUserSwitch />, // Manage all employee profiles
    path: "/hr/employees",
    role: hrRoles,
    group: "HR",
  },

  {
    title: "Duty Schedule",
    icon: <AiOutlineForm />,
    path: "/hr/duty-schedule",
    role: hrRoles,
    group: "HR",
  },
  // {
  //   title: "Department Attendance",
  //   icon: <AiOutlineCalendar />,
  //   path: "/hr/department-attendance",
  //   role: hrRoles,
  //   group: "HR",
  // },

  // {
  //   title: "Leave Administration",
  //   icon: <AiOutlineForm />,
  //   path: "/hr/leave-admin",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "License Administration",
  //   icon: <AiOutlineSafetyCertificate />,
  //   path: "/hr/license-admin",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "Evaluation Reports",
  //   icon: <AiOutlineBarChart />,
  //   path: "/hr/evaluation-reports",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "Payroll Management",
  //   icon: <AiOutlineDollarCircle />,
  //   path: "/hr/payroll",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "Training & Development",
  //   icon: <AiOutlineTrophy />,
  //   path: "/hr/training",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "Global Announcements",
  //   icon: <AiOutlineNotification />,
  //   path: "/hr/announcements",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "Onboarding & Offboarding",
  //   icon: <AiOutlineUsergroupAdd />,
  //   path: "/hr/onboarding",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "HR Reports & Analytics",
  //   icon: <AiOutlineAreaChart />,
  //   path: "/hr/analytics",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "Timekeeping Integration",
  //   icon: <AiOutlineClockCircle />,
  //   path: "/hr/timekeeping",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "Disciplinary Actions",
  //   icon: <AiOutlineWarning />,
  //   path: "/hr/disciplinary",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "Compliance Calendar",
  //   icon: <AiOutlineCalendar />,
  //   path: "/hr/compliance-calendar",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "Audit Logs",
  //   icon: <AiOutlineFileSearch />,
  //   path: "/hr/audit-logs",
  //   role: hrRoles,
  //   group: "HR",
  // },
  // {
  //   title: "Organization Chart Management",
  //   icon: <AiOutlineApartment />,
  //   path: "/hr/org-chart",
  //   role: hrRoles,
  //   group: "HR",
  // },
];
