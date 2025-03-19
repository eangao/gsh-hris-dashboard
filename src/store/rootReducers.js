import authReducer from "./Reducers/authReducer";
import employeeReducer from "./Reducers/employeeReducer";
import positionReducer from "./Reducers/positionReducer";
import clusterReducer from "./Reducers/clusterReducer";
import departmentReducer from "./Reducers/departmentReducer";
import attendanceReducer from "./Reducers/attendanceReducer";
import userReducer from "./Reducers/userReducer";
import holidayReducer from "./Reducers/holidayReducer";
import roleReducer from "./Reducers/roleReducer";
import dutyScheduleReducer from "./Reducers/dutyScheduleReducer";
import workScheduleReducer from "./Reducers/workScheduleReducer";

const rootReducer = {
  auth: authReducer,
  employee: employeeReducer,
  attendance: attendanceReducer,
  user: userReducer,
  holidays: holidayReducer,
  role: roleReducer,
  dutySchedule: dutyScheduleReducer,
  workSchedule: workScheduleReducer,
  position: positionReducer,
  cluster: clusterReducer,
  department: departmentReducer,
};

export default rootReducer;
