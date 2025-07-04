import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceByEmployee } from "../../../store/Reducers/attendanceReducer";
import {
  formatDatePH,
  getTodayDatePH,
  formatTimeTo12HourPH,
  getAttendanceDateRangePH,
} from "../../../utils/phDateUtils";

const MyAttendance = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { employee: employeeId } = userInfo;

  const { attendances, loading } = useSelector((state) => state.attendance);

  const [viewType, setViewType] = useState("last7");

  // Memoize currentDate to ensure it is only calculated once per component mount.
  // This prevents unnecessary re-renders and avoids infinite update loops in useEffect.
  // getTodayDatePH() returns the current date in PH timezone, so memoizing ensures consistency for all date calculations in this render cycle.
  const currentDate = useMemo(() => getTodayDatePH(), []);

  // Use getAttendanceDateRangePH for initial state
  const initialRange = useMemo(() => getAttendanceDateRangePH("last7"), []);
  const [dateRange, setDateRange] = useState({
    start: initialRange.start,
    end: initialRange.end,
  });

  useEffect(() => {
    // Only update dateRange when viewType changes and the new range is different
    if (viewType === "last7" || viewType === "last30") {
      const range = getAttendanceDateRangePH(viewType);
      // Only update if the range actually changed
      if (
        !dateRange.start ||
        !dateRange.end ||
        dateRange.start.getTime() !== range.start.getTime() ||
        dateRange.end.getTime() !== range.end.getTime()
      ) {
        setDateRange({ start: range.start, end: range.end });
      }
    }
  }, [viewType, currentDate]);

  useEffect(() => {
    if (!employeeId) return;
    // Only fetch when dateRange changes
    const isoStart =
      dateRange.start instanceof Date
        ? dateRange.start.toISOString()
        : new Date(dateRange.start).toISOString();
    const isoEnd =
      dateRange.end instanceof Date
        ? dateRange.end.toISOString()
        : new Date(dateRange.end).toISOString();
    dispatch(
      fetchAttendanceByEmployee({
        employeeId,
        startDate: isoStart,
        endDate: isoEnd,
      })
    );
  }, [dispatch, employeeId, dateRange]);

  const handleViewTypeChange = (e) => {
    setViewType(e.target.value);
  };

  const handleDateRangeChange = (type, e) => {
    const newDate = e.target.value;
    setDateRange((prev) => {
      let start = type === "start" ? newDate : prev.start;
      let end = type === "end" ? newDate : prev.end;
      // Ensure start is not after end
      if (new Date(start) > new Date(end)) {
        if (type === "start") end = start;
        else start = end;
      }
      // Use getAttendanceDateRangePH for custom range
      const range = getAttendanceDateRangePH("range", start, end);
      return { start: range.start, end: range.end };
    });
  };

  console.log(attendances, "Attendances Data");
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">My Attendance</h1>

      {/* Filters Section */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* View Type Selection */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Type
            </label>
            <select
              value={viewType}
              onChange={handleViewTypeChange}
              className="p-2 border rounded w-full"
            >
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="range">Custom Range</option>
            </select>
          </div>

          {/* Date Selection */}

          {(viewType === "last7" || viewType === "last30") && (
            <div className="flex flex-1 min-w-[200px] gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="p-2 border rounded w-full bg-gray-100 text-gray-800">
                  {formatDatePH(dateRange.start, "MMMM D, YYYY")}
                </div>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <div className="p-2 border rounded w-full bg-gray-100 text-gray-800">
                  {formatDatePH(dateRange.end, "MMMM D, YYYY")}
                </div>
              </div>
            </div>
          )}

          {viewType === "range" && (
            <div className="flex flex-1 min-w-[200px] gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  type="date"
                  value={formatDatePH(dateRange.start, "YYYY-MM-DD")}
                  onChange={(e) => handleDateRangeChange("start", e)}
                  max={formatDatePH(currentDate, "YYYY-MM-DD")}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="date"
                  value={formatDatePH(dateRange.end, "YYYY-MM-DD")}
                  onChange={(e) => handleDateRangeChange("end", e)}
                  min={formatDatePH(dateRange.start, "YYYY-MM-DD")}
                  max={formatDatePH(currentDate, "YYYY-MM-DD")}
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Schedule</th>
              <th className="p-3 text-left">Time In</th>
              <th className="p-3 text-left">Time Out</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Late</th>
            </tr>
          </thead>
          <tbody>
            {attendances && attendances.length > 0 ? (
              attendances.map((attendance, idx) => {
                // Extract schedule times from dutySchedule[0].workSchedule if available
                let scheduleStart = "-",
                  scheduleEnd = "-";
                if (
                  attendance.dutySchedule &&
                  attendance.dutySchedule[0] &&
                  attendance.dutySchedule[0].workSchedule
                ) {
                  const ws = attendance.dutySchedule[0].workSchedule;
                  scheduleStart = ws.startTime
                    ? formatTimeTo12HourPH(ws.startTime)
                    : "-";
                  scheduleEnd = ws.endTime
                    ? formatTimeTo12HourPH(ws.endTime)
                    : "-";
                }

                // Extract timeIn and timeOut from biometricLogs
                let timeIn = "-",
                  timeOut = "-";
                if (
                  attendance.biometricLogs &&
                  attendance.biometricLogs.length > 0
                ) {
                  const checkIn = attendance.biometricLogs.find(
                    (log) => log.type === "CheckIn" && log.logTime
                  );
                  const checkOut = attendance.biometricLogs.find(
                    (log) => log.type === "CheckOut" && log.logTime
                  );
                  if (checkIn) {
                    timeIn = formatTimeTo12HourPH(new Date(checkIn.logTime));
                  }
                  if (checkOut) {
                    timeOut = formatTimeTo12HourPH(new Date(checkOut.logTime));
                  }
                }

                // Status and lateMinutes are not in backend data, so show "-"
                return (
                  <tr key={attendance.datePH || idx} className="border-t">
                    <td className="p-3">
                      {scheduleStart} - {scheduleEnd}
                    </td>
                    <td className="p-3">{timeIn}</td>
                    <td className="p-3">{timeOut}</td>
                    <td className="p-3">-</td>
                    <td className="p-3">-</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="p-3 text-center" colSpan={5}>
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAttendance;
