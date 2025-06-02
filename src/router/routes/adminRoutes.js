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

const Cluster = lazy(() => import("../../pages/dashboard/admin/setup/Cluster"));
const Department = lazy(() =>
  import("../../pages/dashboard/admin/setup/Department")
);

const EmploymentStatus = lazy(() =>
  import("../../pages/dashboard/admin/setup/EmploymentStatus")
);
const Holiday = lazy(() => import("../../pages/dashboard/admin/setup/Holiday"));
const NotificationSettings = lazy(() =>
  import("../../pages/dashboard/admin/setup/NotificationSettings")
);
const Position = lazy(() =>
  import("../../pages/dashboard/admin/setup/Position")
);
const Religion = lazy(() =>
  import("../../pages/dashboard/admin/setup/Religion")
);
const ShiftTemplates = lazy(() =>
  import("../../pages/dashboard/admin/setup/ShiftTemplates")
);

const adminRoutes = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/analytics",
    element: <DashboardAnalytics />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/notifications",
    element: <AdminNotifications />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/login-activity",
    element: <LoginActivity />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/audit-logs",
    element: <AuditLogs />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/system-settings",
    element: <SystemSettings />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/integrations",
    element: <IntegrationSettings />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/feature-toggle",
    element: <FeatureToggleManager />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/backup-recovery",
    element: <BackupRecovery />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/system-logs",
    element: <SystemLogs />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },

  // System Setup page

  {
    path: "/admin/setup/cluster",
    element: <Cluster />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/setup/department",
    element: <Department />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/setup/position",
    element: <Position />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/setup/employment-status",
    element: <EmploymentStatus />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/setup/religion",
    element: <Religion />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/setup/shift-templates",
    element: <ShiftTemplates />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/setup/notification-settings",
    element: <NotificationSettings />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    path: "/admin/setup/holiday",
    element: <Holiday />,
    role: ["ADMIN", "SUPER_ADMIN"],
  },
];

export default adminRoutes;
