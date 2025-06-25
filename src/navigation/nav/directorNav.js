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
} from "react-icons/ai";

const directorRoles = ["DIRECTOR", "SUPER_ADMIN"];

export const directorNav = [
  //====================================
  // Director Dashboard Navigation
  {
    title: "Director",
    isGroupTitle: true,
    icon: <MdOutlineSupervisorAccount />,
    role: directorRoles,
  },
  {
    title: "Director Dashboard",
    icon: <AiOutlineDashboard />,
    path: "/director/dashboard",
    role: directorRoles,
    group: "Director",
  },
  {
    title: "Duty Schedule",
    icon: <AiOutlineForm />,
    path: "/director/duty-schedule",
    role: directorRoles,
    group: "Director",
  },
  // {
  //   title: "Department Overview",
  //   icon: <AiOutlineTeam />,
  //   path: "/director/department-overview",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Department Attendance",
  //   icon: <AiOutlineSchedule />,
  //   path: "/director/attendance",
  //   role: directorRoles,
  //   group: "Director",
  // },

  // {
  //   title: "Manager Leave Requests",
  //   icon: <AiOutlineForm />,
  //   path: "/director/manager-leave",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "License Registry",
  //   icon: <AiOutlineSafetyCertificate />,
  //   path: "/director/license-registry",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Manager Evaluations",
  //   icon: <AiOutlineBarChart />,
  //   path: "/director/evaluations",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Payroll Summary",
  //   icon: <AiOutlineDollarCircle />,
  //   path: "/director/payroll-summary",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Training Oversight",
  //   icon: <AiOutlineTrophy />,
  //   path: "/director/training",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Department Announcements",
  //   icon: <AiOutlineNotification />,
  //   path: "/director/announcements",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Strategic Reports",
  //   icon: <AiOutlineBarChart />,
  //   path: "/director/reports",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Compliance Monitor",
  //   icon: <AiOutlineBell />,
  //   path: "/director/compliance",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Budget Requests Overview",
  //   icon: <AiOutlineFileText />,
  //   path: "/director/budget-requests",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Policy Review Panel",
  //   icon: <AiOutlineBook />,
  //   path: "/director/policy-review",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Leadership Pipeline",
  //   icon: <AiOutlineComment />,
  //   path: "/director/succession",
  //   role: directorRoles,
  //   group: "Director",
  // },
  // {
  //   title: "Organization Chart",
  //   icon: <AiOutlineApartment />,
  //   path: "/director/org-chart",
  //   role: directorRoles,
  //   group: "Director",
  // },
];
