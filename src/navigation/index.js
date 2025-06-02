import { allNav } from "./allNav";

export const getNav = (role) => {
  return allNav.filter((nav) => {
    // Super admin sees everything
    if (role === "SUPER_ADMIN") return true;

    // Deny access if no role defined — safer
    if (!nav.role) return false;

    if (Array.isArray(nav.role)) {
      return nav.role.includes(role);
    }

    return nav.role === role;
  });
};
