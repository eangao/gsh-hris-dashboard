import { lazy } from "react";

const HRDashboard = lazy(() => import("../../views/hr/HRDashboard"));

export const hrRoutes = [
  {
    path: "hr/dashboard",
    element: <HRDashboard />,
    role: "hr",
  },
];
