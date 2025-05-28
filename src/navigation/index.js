import { allNav } from "./allNav";

export const getNav = (role) =>
  allNav.filter((nav) => {
    if (!nav.role) return true; // no role restriction, show to all
    if (Array.isArray(nav.role)) {
      return nav.role.includes(role); // role array includes user role
    }
    return nav.role === role; // role is string, must match exactly
  });
