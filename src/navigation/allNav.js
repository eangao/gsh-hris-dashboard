import { AiOutlineDashboard, AiOutlineCluster } from "react-icons/ai";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaLayerGroup, FaUserCog } from "react-icons/fa";
import { RiCalendarScheduleLine, RiTimeFill } from "react-icons/ri";
import { FiFileText } from "react-icons/fi";
import { MdOutlinePersonPin, MdHolidayVillage } from "react-icons/md";

export const allNav = [
  //====================================
  // Admin Dashboard Navigation
  {
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard",
  },
  {
    title: "Employee",
    icon: <FaPeopleGroup />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard/employee",
  },
  {
    title: "Cluster",
    icon: <AiOutlineCluster />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard/cluster",
  },
  {
    title: "Department",
    icon: <FaLayerGroup />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard/department",
  },
  {
    title: "Position",
    icon: <FiFileText />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard/position",
  },
  {
    title: "Religion",
    icon: <FiFileText />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard/religion",
  },
  {
    title: "Employment Status",
    icon: <FiFileText />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard/employment-status",
  },
  {
    title: "Work Schedule",
    icon: <RiTimeFill />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard/work-schedule",
  },
  {
    title: "role",
    icon: <FaUserCog />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard/role",
  },

  {
    title: "User",
    icon: <FaUserCog />,
    role: ["ADMIN", "SUPER_ADMIN"],
    path: "/admin/dashboard/user",
  },

  //====================================
  // HR Dashboard Navigation
  {
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "HR_ADMIN",
    path: "/hr/dashboard",
  },

  {
    title: "Employee",
    icon: <FaPeopleGroup />,
    role: "HR_ADMIN",
    path: "/hr/dashboard/employee",
  },

  {
    title: "Cluster",
    icon: <AiOutlineCluster />,
    role: "HR_ADMIN",
    path: "/hr/dashboard/cluster",
  },
  {
    title: "Department",
    icon: <FaLayerGroup />,
    role: "HR_ADMIN",
    path: "/hr/dashboard/department",
  },

  {
    title: "Position",
    icon: <FiFileText />,
    role: "HR_ADMIN",
    path: "/hr/dashboard/position",
  },
  {
    title: "Religion",
    icon: <FiFileText />,
    role: "HR_ADMIN",
    path: "/hr/dashboard/religion",
  },
  {
    title: "Employment Status",
    icon: <FiFileText />,
    role: "HR_ADMIN",
    path: "/hr/dashboard/employment-status",
  },

  {
    title: "Work Schedule",
    icon: <RiTimeFill />,
    role: "HR_ADMIN",
    path: "/hr/dashboard/work-schedule",
  },
  {
    title: "Duty Schedule",
    icon: <RiCalendarScheduleLine />,
    role: "HR_ADMIN",
    path: "/hr/dashboard/duty-schedule",
  },
  {
    title: "Daily Attendance",
    icon: <MdOutlinePersonPin />,
    role: "HR_ADMIN",
    path: "/hr/dashboard/daily-attendance",
  },
  {
    title: "Holiday",
    icon: <MdHolidayVillage />,
    role: "HR_ADMIN",
    path: "/hr/dashboard/holiday",
  },

  //====================================
  // Manager Dashboard Navigation
  {
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "MANAGER",
    path: "/manager/dashboard",
  },
  //====================================

  // Employee Dashboard Navigation
  {
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "EMPLOYEE",
    path: "/employee/dashboard",
  },
];
