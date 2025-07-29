/**
 * Route Configuration Manager
 *
 * This module manages route configuration based on user roles and permissions.
 * It provides a centralized way to define and organize routes for different user types.
 *
 * Key Features:
 * - Role-based route access control
 * - Hierarchical permission inheritance
 * - Centralized route management
 * - Easy maintenance and updates
 *
 * @module RouteConfig
 */

import MainLayout from "./../../layout/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import adminRoutes from "./adminRoutes";
import hrRoutes from "./hrRoutes";
import employeeRoutes from "./employeeRoutes";
import managerRoutes from "./managerRoutes";
import directorRoutes from "./directorRoutes";

/**
 * Role hierarchy and permissions mapping
 * Higher roles inherit permissions from lower roles
 */
const ROLE_HIERARCHY = {
  SUPER_ADMIN: {
    level: 5,
    inherits: ["ADMIN", "HR_ADMIN", "DIRECTOR", "MANAGER", "EMPLOYEE"],
    description: "Full system access with all permissions",
  },
  ADMIN: {
    level: 4,
    inherits: ["EMPLOYEE"],
    description: "Administrative access with employee dashboard",
  },
  EXECUTIVE: {
    level: 3,
    inherits: ["EMPLOYEE"],
    description: "Executive level access with employee dashboard",
  },
  HR_ADMIN: {
    level: 3,
    inherits: ["EMPLOYEE"],
    description: "HR management with employee dashboard access",
  },

  DIRECTOR: {
    level: 3,
    inherits: ["EMPLOYEE"],
    description: "Executive level access with employee dashboard",
  },
  MANAGER: {
    level: 2,
    inherits: ["EMPLOYEE"],
    description: "Management level access with employee dashboard",
  },
  SUPERVISOR: {
    level: 2,
    inherits: ["EMPLOYEE"],
    description: "Supervisory level access with manager dashboard features",
  },
  MARKETING_ADMIN: {
    level: 2,
    inherits: ["EMPLOYEE"],
    description:
      "Marketing administrative access with manager dashboard features",
  },
  EMPLOYEE: {
    level: 1,
    inherits: [],
    description: "Basic employee access to personal dashboard",
  },
};

/**
 * Get routes based on user role with proper inheritance
 *
 * @param {string} role - User role identifier
 * @returns {Array} Array of route configurations for the given role
 */
export const getRoutes = (role) => {
  // Input validation
  if (!role || typeof role !== "string") {
    return [];
  }

  // Check if role exists in hierarchy
  if (!ROLE_HIERARCHY[role]) {
    return employeeRoutes;
  }

  let privateRoutes = [];

  // Role-based route assignment with inheritance
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
        ...employeeRoutes, // Admins have access to personal dashboard
      ];
      break;

    case "DIRECTOR":
    case "EXECUTIVE":
      privateRoutes = [
        ...directorRoutes,
        ...employeeRoutes, // Directors and Executives have access to employee features
      ];
      break;

    case "HR_ADMIN":
      privateRoutes = [
        ...hrRoutes,
        ...managerRoutes, // HR_ADMIN with managedDepartments can access manager routes
        ...employeeRoutes, // HR staff can access personal dashboard
      ];
      break;

    case "MARKETING_ADMIN":
      privateRoutes = [
        ...managerRoutes, // MARKETING_ADMIN with managedDepartments can access manager routes
        ...employeeRoutes, // MARKETING_ADMIN staff can access personal dashboard
      ];
      break;

    case "MANAGER":
      privateRoutes = [
        ...managerRoutes,
        ...employeeRoutes, // Managers have access to employee features
      ];
      break;

    case "SUPERVISOR":
      privateRoutes = [
        ...managerRoutes,
        ...employeeRoutes, // Supervisors have access to manager and employee features
      ];
      break;

    case "EMPLOYEE":
      privateRoutes = employeeRoutes;
      break;

    default:
      privateRoutes = employeeRoutes;
  }

  // Remove duplicates and sort routes
  const uniqueRoutes = privateRoutes.filter(
    (route, index, self) =>
      index === self.findIndex((r) => r.path === route.path)
  );

  return uniqueRoutes;
};

/**
 * Get complete route configuration including public and private routes
 *
 * @param {string} role - User role identifier
 * @returns {Array} Complete route configuration
 */
export const getAllRoutes = (role) => {
  const privateRoutes = getRoutes(role);

  // Import public routes dynamically to avoid circular dependency
  const { default: publicRoutes } = require("./publicRoutes");

  // Wrap each route with ProtectedRoute to maintain compatibility with existing structure
  const protectedRoutes = privateRoutes.map((route) => ({
    ...route,
    element: <ProtectedRoute route={route}>{route.element}</ProtectedRoute>,
  }));

  // Separate catch-all route and home route from other public routes
  const catchAllRoute = publicRoutes.find((route) => route.path === "*");
  const homeRoute = publicRoutes.find((route) => route.path === "/");
  const otherPublicRoutes = publicRoutes.filter(
    (route) => route.path !== "*" && route.path !== "/"
  );

  const routeConfig = [
    // Other public routes (login, unauthorized, etc.) - excluding catch-all and home
    ...otherPublicRoutes,
    // Private routes (wrapped in MainLayout) - this will handle the "/" path for authenticated users
    {
      path: "/",
      element: <MainLayout />,
      children: [
        // Add index route for authenticated users (redirects "/" to appropriate dashboard)
        {
          index: true,
          element: homeRoute ? homeRoute.element : <div>Loading...</div>,
        },
        ...protectedRoutes,
      ],
    },
    // Catch-all route MUST be last to avoid catching protected routes
    ...(catchAllRoute ? [catchAllRoute] : []),
  ];

  return routeConfig;
};

/**
 * Get role information and permissions
 *
 * @param {string} role - User role identifier
 * @returns {Object} Role information including level, inheritance, and description
 */
export const getRoleInfo = (role) => {
  return ROLE_HIERARCHY[role] || ROLE_HIERARCHY.EMPLOYEE;
};

/**
 * Check if a role has specific permissions
 *
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required role for access
 * @returns {boolean} Whether the user has the required permissions
 */
export const hasPermission = (userRole, requiredRole) => {
  const userRoleInfo = ROLE_HIERARCHY[userRole];
  const requiredRoleInfo = ROLE_HIERARCHY[requiredRole];

  if (!userRoleInfo || !requiredRoleInfo) {
    return false;
  }

  // Check if user role level is higher or equal to required role
  return userRoleInfo.level >= requiredRoleInfo.level;
};
