import {
  AiFillFileText,
  AiOutlineAreaChart,
  AiOutlineClockCircle,
  AiOutlineCluster,
  AiOutlineFileSearch,
  AiOutlineUsergroupAdd,
  AiOutlineUserSwitch,
  AiOutlineWarning,
} from "react-icons/ai";
import { FaChurch, FaPeopleGroup } from "react-icons/fa6";
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
import { GoPerson } from "react-icons/go";
import {
  MdApartment,
  MdHolidayVillage,
  MdSettingsApplications,
} from "react-icons/md";
import { RiTimeFill } from "react-icons/ri";
import { FaBirthdayCake } from "react-icons/fa";

const hrRoles = ["HR_ADMIN"];
const hrSetupRoles = ["HR_ADMIN"];

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

  {
    title: "Attendance",
    icon: <AiOutlineClockCircle />,
    path: "/hr/employee-attendance",
    role: hrRoles,
    group: "HR Dashboard",
  },
  {
    title: "Birthdays",
    icon: <FaBirthdayCake />,
    path: "/hr/employees/birthdays",
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

  // --- Setups Group Label ---
  {
    title: "Setups",
    isGroupTitle: true,
    icon: <MdSettingsApplications />,
    role: hrSetupRoles,
  },
  {
    title: "Cluster Management",
    icon: <AiOutlineCluster />,
    path: "/hr/setup/cluster",
    role: hrSetupRoles,
    group: "Setups",
  },
  {
    title: "Department Management",
    icon: <MdApartment />,
    path: "/hr/setup/department",
    role: hrSetupRoles,
    group: "Setups",
  },
  {
    title: "Position Titles",
    icon: <AiFillFileText />,
    path: "/hr/setup/position",
    role: hrSetupRoles,
    group: "Setups",
  },

  {
    title: "Employment Types",
    icon: <GoPerson />,
    path: "/hr/setup/employment-status",
    role: hrSetupRoles,
    group: "Setups",
  },
  {
    title: "Religion Masterlist",
    icon: <FaChurch />,
    path: "/hr/setup/religion",
    role: hrSetupRoles,
    group: "Setups",
  },
  {
    title: "Shift Templates",
    icon: <RiTimeFill />,
    path: "/hr/setup/shift-templates",
    role: hrSetupRoles,
    group: "Setups",
  },

  {
    title: "Holiday Calendar",
    icon: <MdHolidayVillage />,
    path: "/hr/setup/holiday",
    role: hrSetupRoles,
    group: "Setups",
  },
];
