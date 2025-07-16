import { lazy } from "react";
import ChangePasswordGuard from "./ChangePasswordGuard";

const Login = lazy(() => import("../../pages/auth/Login"));
const AdminLogin = lazy(() => import("../../pages/auth/AdminLogin"));
const ChangePassword = lazy(() => import("../../pages/auth/ChangePassword"));

const Home = lazy(() => import("../../pages/Home"));
const UnAuthorized = lazy(() => import("../../pages/errors/UnAuthorized"));
const PageNotFound = lazy(() => import("../../pages/errors/PageNotFound"));

const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/unauthorized",
    element: <UnAuthorized />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/change-password",
    element: (
      <ChangePasswordGuard>
        <ChangePassword />
      </ChangePasswordGuard>
    ),
  },
];

export default publicRoutes;
