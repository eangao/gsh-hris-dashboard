import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttendanceByDepartment,
  clearAttendance,
} from "../../store/Reducers/attendanceReducer";
import {
  formatDatePH,
  formatTimeTo12HourPH,
  formatDateTimeToTimePH,
  getCurrentDatePH,
  getTodayDatePH,
  getMonthLabelPH,
  parseDatePH,
} from "../../utils/phDateUtils";
import { fetchEmployeesByDepartment } from "../../store/Reducers/employeeReducer";
import {
  fetchDutyScheduleByDepartmentForAttendance,
  clearDutySchedule,
} from "../../store/Reducers/dutyScheduleReducer";
import Pagination from "../Pagination";
import EmployeeSearchFrontend from "../EmployeeSearchFrontend";
import LoadingIndicator from "../LoadingIndicator";
import toast from "react-hot-toast";

const EmployeeAttendance = ({
  departments,
  employees,
  attendances,
  loading,
}) => {
  return (
    <div>
      <h1>Employee Attendance</h1>
      {loading && <LoadingIndicator />}
      {!loading && (
        <>
          <EmployeeSearchFrontend employees={employees} />
          <Pagination />
        </>
      )}
    </div>
  );
};

export default EmployeeAttendance;
