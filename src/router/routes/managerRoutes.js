import { lazy } from "react";

const ManagerDashboard = lazy(() =>
  import("../../views/manager/ManagerDashboard")
);

export const managerRoutes = [
  {
    path: "manager/dashboard",
    element: <ManagerDashboard />,
    role: "manager",
  },
];
