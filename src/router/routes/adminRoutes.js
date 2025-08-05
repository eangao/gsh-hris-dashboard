import { lazy } from "react";

const AdminDashboard = lazy(() =>
  import("../../pages/dashboard/admin/AdminDashboard")
);
const DashboardAnalytics = lazy(() =>
  import("../../pages/dashboard/admin/DashboardAnalytics")
);
const AdminNotifications = lazy(() =>
  import("../../pages/dashboard/admin/AdminNotifications")
);
const UserManagement = lazy(() =>
  import("../../pages/dashboard/admin/UserManagement")
);
const LoginActivity = lazy(() =>
  import("../../pages/dashboard/admin/LoginActivity")
);
const AuditLogs = lazy(() => import("../../pages/dashboard/admin/AuditLogs"));
const SystemSettings = lazy(() =>
  import("../../pages/dashboard/admin/SystemSettings")
);
const IntegrationSettings = lazy(() =>
  import("../../pages/dashboard/admin/IntegrationSettings")
);
const FeatureToggleManager = lazy(() =>
  import("../../pages/dashboard/admin/FeatureToggleManager")
);
const BackupRecovery = lazy(() =>
  import("../../pages/dashboard/admin/BackupRecovery")
);
const SystemLogs = lazy(() => import("../../pages/dashboard/admin/SystemLogs"));

//================================
// setup

const Cluster = lazy(() => import("../../pages/dashboard/hr/setup/Cluster"));
const Department = lazy(() =>
  import("../../pages/dashboard/hr/setup/Department")
);

const EmploymentStatus = lazy(() =>
  import("../../pages/dashboard/hr/setup/EmploymentStatus")
);

const NotificationSettings = lazy(() =>
  import("../../pages/dashboard/hr/setup/NotificationSettings")
);
const Position = lazy(() => import("../../pages/dashboard/hr/setup/Position"));
const Religion = lazy(() => import("../../pages/dashboard/hr/setup/Religion"));
const ShiftTemplates = lazy(() =>
  import("../../pages/dashboard/hr/setup/ShiftTemplates")
);

const adminRoles = ["ADMIN", "SUPER_ADMIN"];
const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    role: adminRoles,
  },
  {
    path: "/admin/analytics",
    element: <DashboardAnalytics />,
    role: adminRoles,
  },
  {
    path: "/admin/notifications",
    element: <AdminNotifications />,
    role: adminRoles,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
    role: adminRoles,
  },
  {
    path: "/admin/login-activity",
    element: <LoginActivity />,
    role: adminRoles,
  },
  {
    path: "/admin/audit-logs",
    element: <AuditLogs />,
    role: adminRoles,
  },
  {
    path: "/admin/system-settings",
    element: <SystemSettings />,
    role: adminRoles,
  },
  {
    path: "/admin/integrations",
    element: <IntegrationSettings />,
    role: adminRoles,
  },
  {
    path: "/admin/feature-toggle",
    element: <FeatureToggleManager />,
    role: adminRoles,
  },
  {
    path: "/admin/backup-recovery",
    element: <BackupRecovery />,
    role: adminRoles,
  },
  {
    path: "/admin/system-logs",
    element: <SystemLogs />,
    role: adminRoles,
  },

  // System Setup page

  // {
  //   path: "/admin/setup/cluster",
  //   element: <Cluster />,
  //   role: adminRoles,
  // },
  // {
  //   path: "/admin/setup/department",
  //   element: <Department />,
  //   role: adminRoles,
  // },
  // {
  //   path: "/admin/setup/position",
  //   element: <Position />,
  //   role: adminRoles,
  // },
  // {
  //   path: "/admin/setup/employment-status",
  //   element: <EmploymentStatus />,
  //   role: adminRoles,
  // },
  // {
  //   path: "/admin/setup/religion",
  //   element: <Religion />,
  //   role: adminRoles,
  // },
  // {
  //   path: "/admin/setup/shift-templates",
  //   element: <ShiftTemplates />,
  //   role: adminRoles,
  // },
  // {
  //   path: "/admin/setup/notification-settings",
  //   element: <NotificationSettings />,
  //   role: adminRoles,
  // },
];

export default adminRoutes;
