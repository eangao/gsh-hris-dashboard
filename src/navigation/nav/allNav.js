import { employeeNav } from "./employeeNav";
import { managerNav } from "./managerNav";
import { directorNav } from "./directorNav";
import { hrNav } from "./hrNav";
import { adminNav } from "./adminNav";

export const allNav = [
  ...employeeNav,
  ...managerNav,
  ...directorNav,
  ...hrNav,
  ...adminNav,
];
