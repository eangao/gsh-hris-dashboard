import { adminRoutes } from "./adminRoutes";
import { employeeRoutes } from "./employeeRoutes";
import { managerRoutes } from "./managerRoutes";
import { hrRoutes } from "./hrRoutes";

export const privateRoutes = [
  ...adminRoutes,
  ...employeeRoutes,
  ...managerRoutes,
  ...hrRoutes,
];
