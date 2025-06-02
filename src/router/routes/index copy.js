import MainLayout from "./../../layout/MainLayout";
import { privateRoutes } from "./privateRoutes";
import ProtectedRoute from "./ProtectedRoute";

export const getRoutes = () => {
  const protectedRoutes = privateRoutes.map((route) => ({
    ...route,
    element: <ProtectedRoute route={route}>{route.element}</ProtectedRoute>,
  }));

  return {
    path: "/",
    element: <MainLayout />,
    children: protectedRoutes,
  };
};
