import { AiOutlineCluster } from "react-icons/ai";
import { FaUserCog, FaUserShield } from "react-icons/fa";
import { RiTimeFill } from "react-icons/ri";
import { FiFileText } from "react-icons/fi";
import {
  MdHolidayVillage,
  MdSettingsApplications,
  MdApartment,
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
import { RiNotification3Line } from "react-icons/ri";
import { FaChurch } from "react-icons/fa";
import { GoPerson } from "react-icons/go";
import { AiOutlineDashboard } from "react-icons/ai";

const adminRoles = ["ADMIN", "SUPER_ADMIN"];
const adminSystemSetupRoles = ["ADMIN", "SUPER_ADMIN"];

export const adminNav = [
  //====================================
  // Admin Dashboard Navigation
  {
    title: "Admin",
    isGroupTitle: true,
    icon: <FaUserShield />,
    role: adminRoles,
  },
  {
    title: "Admin Dashboard",
    icon: <AiOutlineDashboard />,
    role: adminRoles,
    path: "/admin/dashboard",
    group: "Admin",
  },
  {
    title: "Dashboard Analytics",
    icon: <FiBarChart2 />,
    role: adminRoles,
    path: "/admin/analytics",
    group: "Admin",
  },
  {
    title: "Admin Notifications",
    icon: <MdNotificationsActive />,
    role: adminRoles,
    path: "/admin/notifications",
    group: "Admin",
  },
  {
    title: "User Management",
    icon: <FaUserCog />,
    role: adminRoles,
    path: "/admin/users",
    group: "Admin",
  },
  {
    title: "Login Activity Logs",
    icon: <RiLoginBoxLine />,
    role: adminRoles,
    path: "/admin/login-activity",
    group: "Admin",
  },
  {
    title: "Audit Logs",
    icon: <MdOutlineHistory />,
    role: adminRoles,
    path: "/admin/audit-logs",
    group: "Admin",
  },
  {
    title: "System Settings",
    icon: <FiSettings />,
    role: adminRoles,
    path: "/admin/system-settings",
    group: "Admin",
  },
  {
    title: "Integration Settings",
    icon: <MdSettingsInputComponent />,
    role: adminRoles,
    path: "/admin/integrations",
    group: "Admin",
  },
  {
    title: "Feature Toggle Manager",
    icon: <BiToggleRight />,
    role: adminRoles,
    path: "/admin/feature-toggle",
    group: "Admin",
  },
  {
    title: "Backup & Recovery",
    icon: <MdBackup />,
    role: adminRoles,
    path: "/admin/backup-recovery",
    group: "Admin",
  },
  {
    title: "System Logs",
    icon: <RiFileList3Line />,
    role: adminRoles,
    path: "/admin/system-logs",
    group: "Admin",
  },
  // --- System Setup Group Label ---
  {
    title: "System Setup",
    isGroupTitle: true,
    icon: <MdSettingsApplications />,
    role: adminSystemSetupRoles,
  },
  {
    title: "Cluster Management",
    icon: <AiOutlineCluster />,
    path: "/admin/setup/cluster",
    role: adminSystemSetupRoles,
    group: "System Setup",
  },
  {
    title: "Department Management",
    icon: <MdApartment />,
    path: "/admin/setup/department",
    role: adminSystemSetupRoles,
    group: "System Setup",
  },
  {
    title: "Position Titles",
    icon: <FiFileText />,
    path: "/admin/setup/position",
    role: adminSystemSetupRoles,
    group: "System Setup",
  },

  {
    title: "Employment Types",
    icon: <GoPerson />,
    path: "/admin/setup/employment-status",
    role: adminSystemSetupRoles,
    group: "System Setup",
  },
  {
    title: "Religion Masterlist",
    icon: <FaChurch />,
    path: "/admin/setup/religion",
    role: adminSystemSetupRoles,
    group: "System Setup",
  },
  {
    title: "Shift Templates",
    icon: <RiTimeFill />,
    path: "/admin/setup/shift-templates",
    role: adminSystemSetupRoles,
    group: "System Setup",
  },
  {
    title: "Notification Settings",
    icon: <RiNotification3Line />,
    path: "/admin/setup/notification-settings",
    role: adminSystemSetupRoles,
    group: "System Setup",
  },
  {
    title: "Holiday Calendar",
    icon: <MdHolidayVillage />,
    path: "/admin/setup/holiday",
    role: adminSystemSetupRoles,
    group: "System Setup",
  },
];
