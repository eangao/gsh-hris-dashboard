import { AiOutlineDashboard, AiOutlineCluster } from "react-icons/ai";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaLayerGroup, FaUserCog } from "react-icons/fa";
import { RiCalendarScheduleLine, RiTimeFill } from "react-icons/ri";
import { FiFileText } from "react-icons/fi";
import { MdOutlinePersonPin, MdHolidayVillage } from "react-icons/md";

export const allNav = [
  // Admin Dashboard Navigation
  {
    id: 1,
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "admin",
    path: "/admin/dashboard",
  },
  {
    id: 2,
    title: "Daily Attendance",
    icon: <MdOutlinePersonPin />,
    role: "admin",
    path: "/admin/dashboard/daily-attendance",
  },
  {
    id: 3,
    title: "Users",
    icon: <FaUserCog />,
    role: "admin",
    path: "/admin/dashboard/users",
  },
  {
    id: 4,
    title: "Employees",
    icon: <FaPeopleGroup />,
    role: "admin",
    path: "/admin/dashboard/employees",
  },
  {
    id: 4,
    title: "Test",
    icon: <FaPeopleGroup />,
    role: "admin",
    path: "/admin/dashboard/test",
  },
  {
    id: 5,
    title: "Departments",
    icon: <FaLayerGroup />,
    role: "admin",
    path: "/admin/dashboard/departments",
  },
  {
    id: 6,
    title: "Cluster",
    icon: <AiOutlineCluster />,
    role: "admin",
    path: "/admin/dashboard/clusters",
  },
  {
    id: 7,
    title: "Role",
    icon: <FaUserCog />,
    role: "admin",
    path: "/admin/dashboard/roles",
  },
  {
    id: 8,
    title: "Position",
    icon: <FiFileText />,
    role: "admin",
    path: "/admin/dashboard/position",
  },

  {
    id: 9,
    title: "Work Schedule",
    icon: <RiTimeFill />,
    role: "admin",
    path: "/admin/dashboard/work-schedule",
  },
  {
    id: 10,
    title: "Duty Schedule",
    icon: <RiCalendarScheduleLine />,
    role: "admin",
    path: "/admin/dashboard/duty-schedule",
  },
  {
    id: 11,
    title: "Holidays",
    icon: <MdHolidayVillage />,
    role: "admin",
    path: "/admin/dashboard/holidays",
  },

  // HR Dashboard Navigation
  {
    id: 12,
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "hr",
    path: "/hr/dashboard",
  },

  // Manager Dashboard Navigation
  {
    id: 13,
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "manager",
    path: "/manager/dashboard",
  },

  // Employee Dashboard Navigation
  {
    id: 14,
    title: "Dashboard",
    icon: <AiOutlineDashboard />,
    role: "employee",
    path: "/employee/dashboard",
  },
  {
    id: 15,
    title: "Religion",
    icon: <FiFileText />,
    role: "admin",
    path: "/admin/dashboard/religion",
  },
  {
    id: 16,
    title: "Employment Status",
    icon: <FiFileText />,
    role: "admin",
    path: "/admin/dashboard/employment-status",
  },
];
