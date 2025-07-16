import MainLayout from "./../../layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import adminRoutes from "./adminRoutes";
import hrRoutes from "./hrRoutes";
import employeeRoutes from "./employeeRoutes";
import managerRoutes from "./managerRoutes";
import directorRoutes from "./directorRoutes";

export const getRoutes = (role) => {
  let privateRoutes = [];

  switch (role) {
    case "SUPER_ADMIN":
      privateRoutes = [
        ...adminRoutes,
        ...hrRoutes,
        ...managerRoutes,
        ...directorRoutes,
        ...employeeRoutes,
      ];
      break;
    case "ADMIN":
      privateRoutes = [
        ...adminRoutes,
        ...employeeRoutes, // ✅ Admins also have personal dashboard
      ];
      break;
    case "HR_ADMIN":
      privateRoutes = [
        ...hrRoutes,
        ...employeeRoutes, // ✅ HR can access personal dashboard
      ];
      break;
    case "MANAGER":
      privateRoutes = [
        ...managerRoutes,
        ...employeeRoutes, // ✅ Managers get employee dashboard
      ];
      break;
    case "DIRECTOR":
      privateRoutes = [
        ...directorRoutes,
        ...employeeRoutes, // ✅ Director gets employee dashboard
      ];
      break;
    case "EMPLOYEE":
      privateRoutes = employeeRoutes;
      break;
    default:
      privateRoutes = [];
  }

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
