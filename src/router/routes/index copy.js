import MainLayout from "./../../layout/MainLayout";
import { privateRoutes } from "./privateRoutes";
import ProtectedRoute from "./ProtectedRoute";

export const getRoutes = () => {
  privateRoutes.map((r) => {
    // console.log(r);
    r.element = <ProtectedRoute route={r}>{r.element}</ProtectedRoute>;
  });

  return {
    path: "/",
    element: <MainLayout />,
    children: privateRoutes,
  };
};
