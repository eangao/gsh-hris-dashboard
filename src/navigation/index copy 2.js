import { allNav } from "./allNav";

export const getNav = (role) => {
  const finalNavs = [];

  for (let i = 0; i < allNav.length; i++) {
    const navRole = allNav[i].role;

    if (!navRole) {
      // If no role specified, include by default
      finalNavs.push(allNav[i]);
    } else if (Array.isArray(navRole)) {
      // If role is an array, check if user's role is included
      if (navRole.includes(role)) {
        finalNavs.push(allNav[i]);
      }
    } else {
      // Role is a string, check equality
      if (role === navRole) {
        finalNavs.push(allNav[i]);
      }
    }
  }

  return finalNavs;
};
