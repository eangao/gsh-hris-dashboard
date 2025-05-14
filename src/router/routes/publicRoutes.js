import { lazy } from "react";

const Login = lazy(() => import("../../views/auth/Login"));
const AdminLogin = lazy(() => import("../../views/auth/AdminLogin"));
const ChangePassword = lazy(() => import("../../views/auth/ChangePassword"));

const Home = lazy(() => import("../../views/Home"));
const UnAuthorized = lazy(() => import("../../views/UnAuthorized"));
const PageNotFound = lazy(() => import("../../views/PageNotFound"));

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
    element: <ChangePassword />,
  },
];

export default publicRoutes;
