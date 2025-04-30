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
    role: "admin",
    path: "/admin/dashboard",
  },
  {
    title: "Employee",
    icon: <FaPeopleGroup />,
    role: "admin",
    path: "/admin/dashboard/employee",
  },
  {
    title: "Cluster",
    icon: <AiOutlineCluster />,
    role: "admin",
    path: "/admin/dashboard/cluster",
  },
  {
    title: "Department",
    icon: <FaLayerGroup />,
    role: "admin",
    path: "/admin/dashboard/department",
  },
  {
    title: "Position",
    icon: <FiFileText />,
    role: "admin",
    path: "/admin/dashboard/position",
  },
  {
    title: "Religion",
    icon: <FiFileText />,
    role: "admin",
    path: "/admin/dashboard/religion",
  },
  {
    title: "Employment Status",
    icon: <FiFileText />,
    role: "admin",
    path: "/admin/dashboard/employment-status",
  },
  {
    title: "Work Schedule",
    icon: <RiTimeFill />,
    role: "admin",
    path: "/admin/dashboard/work-schedule",
  },
  {
    title: "Role",
    icon: <FaUserCog />,
    role: "admin",
    path: "/admin/dashboard/role",
  },

  {
    title: "User",
    icon: <FaUserCog />,
    role: "admin",
    path: "/admin/dashboard/user",
  },

  //====================================
  // HR Dashboard Navigation
  {
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "hr",
    path: "/hr/dashboard",
  },

  {
    title: "Employee",
    icon: <FaPeopleGroup />,
    role: "hr",
    path: "/hr/dashboard/employee",
  },

  {
    title: "Cluster",
    icon: <AiOutlineCluster />,
    role: "hr",
    path: "/hr/dashboard/cluster",
  },
  {
    title: "Department",
    icon: <FaLayerGroup />,
    role: "hr",
    path: "/hr/dashboard/department",
  },

  {
    title: "Position",
    icon: <FiFileText />,
    role: "hr",
    path: "/hr/dashboard/position",
  },
  {
    title: "Religion",
    icon: <FiFileText />,
    role: "hr",
    path: "/hr/dashboard/religion",
  },
  {
    title: "Employment Status",
    icon: <FiFileText />,
    role: "hr",
    path: "/hr/dashboard/employment-status",
  },

  {
    title: "Work Schedule",
    icon: <RiTimeFill />,
    role: "hr",
    path: "/hr/dashboard/work-schedule",
  },
  {
    title: "Duty Schedule",
    icon: <RiCalendarScheduleLine />,
    role: "hr",
    path: "/hr/dashboard/duty-schedule",
  },
  {
    title: "Daily Attendance",
    icon: <MdOutlinePersonPin />,
    role: "hr",
    path: "/hr/dashboard/daily-attendance",
  },
  {
    title: "Holiday",
    icon: <MdHolidayVillage />,
    role: "hr",
    path: "/hr/dashboard/holiday",
  },

  //====================================
  // Manager Dashboard Navigation
  {
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "manager",
    path: "/manager/dashboard",
  },
  //====================================

  // Employee Dashboard Navigation
  {
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "employee",
    path: "/employee/dashboard",
  },
];
