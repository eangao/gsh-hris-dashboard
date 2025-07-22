/**
 * Navigation System
 *
 * Manages the sidebar navigation based on user roles and permissions.
 * Provides a centralized way to filter and organize navigation items.
 *
 * Key Features:
 * - Role-based navigation filtering
 * - Permission inheritance
 * - Flexible role assignment (string or array)
 * - Secure by default (denies access if no role defined)
 *
 * @module Navigation
 */

import { allNav } from "./nav/allNav";

/**
 * Get navigation items filtered by user role and permissions
 *
 * This function implements a secure-by-default approach:
 * - Super admins see everything
 * - Items without roles are hidden (security)
 * - Supports both string and array role definitions
 * - Filters items based on user permissions (managedDepartments, managedCluster)
 * - Manager Dashboard only visible if user has managedDepartments
 * - Director Dashboard only visible if user has managedCluster
 *
 * @param {string} role - User role identifier
 * @param {Object} userInfo - Complete user information object
 * @returns {Array} Filtered navigation items for the user
 */
export const getNav = (role, userInfo = null) => {
  // Input validation
  if (!role || typeof role !== "string") {
    // console.warn("getNav: Invalid role provided, returning empty navigation");
    return [];
  }

  return allNav.filter((navItem) => {
    // Super admin has access to everything
    // if (role === "SUPER_ADMIN") return true;

    // Secure by default: deny access if no role defined
    // This prevents accidental exposure of navigation items
    if (!navItem.role) {
      // console.warn(
      //   `getNav: Navigation item "${navItem.title}" has no role defined, denying access`
      // );
      return false;
    }

    // Handle array of roles (multiple roles can access this item)
    const hasRoleAccess = Array.isArray(navItem.role)
      ? navItem.role.includes(role)
      : navItem.role === role;

    if (!hasRoleAccess) {
      return false;
    }

    // Additional permission checks based on user data
    if (userInfo) {
      // Manager Dashboard permission checks
      if (
        navItem.group === "Manager Dashboard" ||
        navItem.title === "Manager Dashboard"
      ) {
        const managedDepartments =
          userInfo.employee?.employmentInformation?.managedDepartments;
        const hasManagedDepartments =
          managedDepartments && managedDepartments.length > 0;

        if (!hasManagedDepartments) {
          // console.log(`Hiding "${navItem.title}" - user has no managedDepartments`);
          return false;
        }
      }

      // Director Dashboard permission checks
      if (
        navItem.group === "Director Dashboard" ||
        navItem.title === "Director Dashboard"
      ) {
        const managedCluster =
          userInfo.employee?.employmentInformation?.managedCluster;
        const hasManagedCluster =
          managedCluster !== null && managedCluster !== undefined;

        if (!hasManagedCluster) {
          // console.log(`Hiding "${navItem.title}" - user has no managedCluster`);
          return false;
        }
      }
    }

    return true;
  });
};

/**
 * Get navigation items grouped by categories
 *
 * @param {string} role - User role identifier
 * @param {Object} userInfo - Complete user information object
 * @returns {Object} Navigation items organized by groups
 */
export const getGroupedNav = (role, userInfo = null) => {
  const navItems = getNav(role, userInfo);

  return navItems.reduce((acc, item) => {
    const group = item.group || "Ungrouped";

    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push(item);
    return acc;
  }, {});
};

/**
 * Check if user has access to a specific navigation item
 *
 * @param {string} role - User role identifier
 * @param {string} path - Navigation path to check
 * @param {Object} userInfo - Complete user information object
 * @returns {boolean} Whether user has access to the path
 */
export const hasNavAccess = (role, path, userInfo = null) => {
  const navItems = getNav(role, userInfo);
  return navItems.some((item) => item.path === path);
};

/**
 * Get breadcrumb navigation for current path
 *
 * @param {string} role - User role identifier
 * @param {string} currentPath - Current navigation path
 * @param {Object} userInfo - Complete user information object
 * @returns {Array} Breadcrumb navigation items
 */
export const getBreadcrumb = (role, currentPath, userInfo = null) => {
  const navItems = getNav(role, userInfo);
  const currentItem = navItems.find((item) => item.path === currentPath);

  if (!currentItem) return [];

  const breadcrumb = [];

  // Add group if exists
  if (currentItem.group) {
    const groupItem = navItems.find(
      (item) => item.isGroupTitle && item.title === currentItem.group
    );
    if (groupItem) {
      breadcrumb.push({
        title: groupItem.title,
        path: null, // Group headers don't have paths
        icon: groupItem.icon,
      });
    }
  }

  // Add current item
  breadcrumb.push({
    title: currentItem.title,
    path: currentItem.path,
    icon: currentItem.icon,
  });

  return breadcrumb;
};
