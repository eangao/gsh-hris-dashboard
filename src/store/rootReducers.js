import authReducer from "./Reducers/authReducer";
import employeeReducer from "./Reducers/employeeReducer";
import employmentStatusReducer from "./Reducers/employmentStatusReducer";
import religionReducer from "./Reducers/religionReducer";
import positionReducer from "./Reducers/positionReducer";
import clusterReducer from "./Reducers/clusterReducer";
import departmentReducer from "./Reducers/departmentReducer";
import attendanceReducer from "./Reducers/attendanceReducer";
import holidayReducer from "./Reducers/holidayReducer";
import roleReducer from "./Reducers/roleReducer";
import dutyScheduleReducer from "./Reducers/dutyScheduleReducer";
import shiftTemplateReducer from "./Reducers/shiftTemplateReducer";
import leaveTemplateReducer from "./Reducers/leaveTemplateReducer";

const rootReducer = {
  auth: authReducer,
  employee: employeeReducer,
  employmentStatus: employmentStatusReducer,
  religion: religionReducer,
  attendance: attendanceReducer,
  holidays: holidayReducer,
  role: roleReducer,
  dutySchedule: dutyScheduleReducer,
  shiftTemplate: shiftTemplateReducer,
  position: positionReducer,
  cluster: clusterReducer,
  department: departmentReducer,
  leaveTemplates: leaveTemplateReducer,
};

export default rootReducer;
