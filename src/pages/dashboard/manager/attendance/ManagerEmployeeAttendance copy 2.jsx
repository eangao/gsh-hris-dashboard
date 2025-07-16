import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceByDepartment } from "../../../../store/Reducers/attendanceReducer";
import {
  formatDatePH,
  getTodayDatePH,
  formatTimeTo12HourPH,
  formatDateTimeToTimePH,
  convertDatePHToUTCISO,
} from "../../../../utils/phDateUtils";
import { fetchManagedDepartments } from "../../../../store/Reducers/employeeReducer";
import { fetchDutyScheduleByDepartmentAndDate } from "../../../../store/Reducers/dutyScheduleReducer";

const ManagerEmployeeAttendance = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.employee?._id;

  const { loading: managedDepartmentsLoading, managedDepartments } =
    useSelector((state) => state.employee);

  const {
    dutySchedule,

    loading: dutyScheduleLoading,
  } = useSelector((state) => state.dutySchedule);

  const {
    attendances,
    loading: attendanceLoading,
    errorMessage,
  } = useSelector((state) => state.attendance);

  const loading =
    managedDepartmentsLoading || attendanceLoading || dutyScheduleLoading;

  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Fetch managed departments
  useEffect(() => {
    dispatch(fetchManagedDepartments(employeeId));
  }, [employeeId, dispatch]);

  useEffect(() => {
    if (!selectedDepartment) return;

    // Get today's date in PH timezone and convert to UTC ISO format
    const todayPH = getTodayDatePH();
    const currentDateUTC = convertDatePHToUTCISO(formatDatePH(todayPH));

    dispatch(
      fetchDutyScheduleByDepartmentAndDate({
        departmentId: selectedDepartment,
        currentDate: currentDateUTC,
      })
    );
  }, [dispatch, selectedDepartment]);

  // If only one department, set it as selected by default
  useEffect(() => {
    if (
      managedDepartments &&
      managedDepartments.length === 1 &&
      selectedDepartment !== managedDepartments[0]._id
    ) {
      setSelectedDepartment(managedDepartments[0]._id);
    }
  }, [managedDepartments, selectedDepartment]);

  // Set first department as selected and trigger handleDepartmentChange on first load
  useEffect(() => {
    if (
      managedDepartments &&
      managedDepartments.length > 0 &&
      !selectedDepartment
    ) {
      setSelectedDepartment(managedDepartments[0]._id);
      // Simulate event for handleDepartmentChange
      handleDepartmentChange({ target: { value: managedDepartments[0]._id } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managedDepartments]);

  useEffect(() => {
    if (!dutySchedule) return;

    dispatch(
      fetchAttendanceByDepartment({
        scheduleId: dutySchedule._id,
      })
    );
  }, [dispatch, dutySchedule]);

  // Handle department change
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    if (departmentId === "") {
      setSelectedDepartment("");
    } else {
      setSelectedDepartment(departmentId);
    }
  };

  // Status badge component
  const StatusBadge = ({ status, lateMinutes = 0 }) => {
    const getStatusConfig = (status, lateMinutes) => {
      switch (status) {
        case "Present":
          return {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-200",
            label: "Present",
          };
        case "Late":
          return {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-200",
            label: `Late (${lateMinutes}m)`,
          };
        case "Absent":
          return {
            bg: "bg-red-100",
            text: "text-red-800",
            border: "border-red-200",
            label: "Absent",
          };
        case "Off":
          return {
            bg: "bg-gray-100",
            text: "text-gray-800",
            border: "border-gray-200",
            label: "Off",
          };
        default:
          return {
            bg: "bg-gray-100",
            text: "text-gray-800",
            border: "border-gray-200",
            label: "Unknown",
          };
      }
    };

    const config = getStatusConfig(status, lateMinutes);
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {config.label}
      </span>
    );
  };

  // Time display component - formats time to PH timezone 12-hour format
  const TimeDisplay = ({ time, type = "in" }) => {
    if (!time) {
      return <span className="text-gray-400">--:--</span>;
    }

    // Use formatDateTimeToTimePH for DateTime objects (ISO strings with date and time)
    // Use formatTimeTo12HourPH for time-only values (HH:mm format)
    const formattedTime =
      typeof time === "string" && time.includes("T")
        ? formatDateTimeToTimePH(time)
        : formatTimeTo12HourPH(time);

    const colorClass = type === "in" ? "text-green-600" : "text-red-600";

    return (
      <span className={`font-medium text-sm ${colorClass}`}>
        {formattedTime}
      </span>
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4">
          <div className="flex gap-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        {[...Array(7)].map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-200">
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Employee Attendance
        </h1>
        <p className="text-gray-600">
          Monitor attendance records for employees in your departments
        </p>
      </div>

      {/* Department Selection */}
      {managedDepartments && managedDepartments.length > 1 && (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a department...</option>
                {managedDepartments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-shrink-0">
              <div className="text-sm text-gray-500">
                Total Departments: {managedDepartments.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show error message if there's an error */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-400 mr-2">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">
                Error loading attendance data
              </h3>
              <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Show loading skeleton while data is being fetched */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Attendance Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            {/* Summary Stats */}
            {attendances && attendances.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Present:{" "}
                      {attendances.filter((a) => a.status === "Present").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Late:{" "}
                      {attendances.filter((a) => a.status === "Late").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Absent:{" "}
                      {attendances.filter((a) => a.status === "Absent").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-700">
                      Off:{" "}
                      {attendances.filter((a) => a.status === "Off").length}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div
                className="grid gap-2 text-sm font-semibold text-gray-700"
                style={{
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                }}
              >
                <div>Employee</div>
                <div>Date</div>
                <div>Schedule</div>
                <div>Time In</div>
                <div>Time Out</div>
                <div>Status</div>
                <div>Late Minutes</div>
                <div>Remarks</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {attendances && attendances.length > 0 ? (
                attendances.map((attendance, idx) => (
                  <div
                    key={
                      attendance._id ||
                      `${attendance.datePH || attendance.date}-${idx}`
                    }
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="grid gap-4 items-center text-sm"
                      style={{
                        gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                      }}
                    >
                      {/* Employee Name */}
                      <div className="font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-semibold text-xs">
                              {attendance.employeeName
                                ? attendance.employeeName
                                    .split(" ")[0]
                                    ?.charAt(0) +
                                  (attendance.employeeName
                                    .split(" ")[1]
                                    ?.charAt(0) || "")
                                : "N/A"}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 text-sm truncate">
                              {attendance.employeeName || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {attendance.hospitalEmployeeId || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="font-medium text-gray-900">
                        {formatDatePH(
                          attendance.datePH || attendance.date,
                          "MMM D, YYYY"
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDatePH(
                            attendance.datePH || attendance.date,
                            "dddd"
                          )}
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="text-gray-700 ">
                        {attendance.scheduleString ||
                          (attendance.dutySchedule &&
                          attendance.dutySchedule[0]?.workSchedule
                            ? `${formatTimeTo12HourPH(
                                attendance.dutySchedule[0].workSchedule
                                  .startTime
                              )} - ${formatTimeTo12HourPH(
                                attendance.dutySchedule[0].workSchedule.endTime
                              )}`
                            : attendance.status === "Off"
                            ? "Off"
                            : "-")}
                      </div>

                      {/* Time In */}
                      <div>
                        {attendance.shiftType === "Standard" ? (
                          // For Standard shifts, show morning and afternoon separately
                          <div className="space-y-1">
                            {attendance.morningInLog && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 font-medium min-w-[60px]">
                                  Morning:
                                </span>
                                <TimeDisplay
                                  time={attendance.morningInLog}
                                  type="in"
                                />
                              </div>
                            )}
                            {attendance.afternoonInLog && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 font-medium min-w-[60px]">
                                  Afternoon:
                                </span>
                                <TimeDisplay
                                  time={attendance.afternoonInLog}
                                  type="in"
                                />
                              </div>
                            )}
                            {!attendance.morningInLog &&
                              !attendance.afternoonInLog && (
                                <TimeDisplay
                                  time={
                                    attendance.timeIn ||
                                    attendance.biometricLogs?.find(
                                      (log) => log.type === "CheckIn"
                                    )?.logTime
                                  }
                                  type="in"
                                />
                              )}
                          </div>
                        ) : (
                          // For Shifting shifts, show single time in
                          <TimeDisplay
                            time={
                              attendance.timeIn ||
                              attendance.biometricLogs?.find(
                                (log) => log.type === "CheckIn"
                              )?.logTime
                            }
                            type="in"
                          />
                        )}
                      </div>

                      {/* Time Out */}
                      <div>
                        {attendance.shiftType === "Standard" ? (
                          // For Standard shifts, show morning and afternoon separately
                          <div className="space-y-1">
                            {attendance.morningOutLog && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 min-w-[60px]">
                                  Morning:
                                </span>
                                <TimeDisplay
                                  time={attendance.morningOutLog}
                                  type="out"
                                />
                              </div>
                            )}
                            {attendance.afternoonOutLog && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500  min-w-[60px]">
                                  Afternoon:
                                </span>
                                <TimeDisplay
                                  time={attendance.afternoonOutLog}
                                  type="out"
                                />
                              </div>
                            )}
                            {!attendance.morningOutLog &&
                              !attendance.afternoonOutLog && (
                                <TimeDisplay
                                  time={
                                    attendance.timeOut ||
                                    attendance.biometricLogs?.find(
                                      (log) => log.type === "CheckOut"
                                    )?.logTime
                                  }
                                  type="out"
                                />
                              )}
                          </div>
                        ) : (
                          // For Shifting shifts, show single time out
                          <TimeDisplay
                            time={
                              attendance.timeOut ||
                              attendance.biometricLogs?.find(
                                (log) => log.type === "CheckOut"
                              )?.logTime
                            }
                            type="out"
                          />
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <StatusBadge
                          status={attendance.status || "Unknown"}
                          lateMinutes={attendance.lateMinutes || 0}
                        />
                      </div>

                      {/* Late Minutes */}
                      <div>
                        {attendance.morningLateMinutes > 0 ||
                        attendance.afternoonLateMinutes > 0 ? (
                          <div className="space-y-1">
                            {attendance.morningLateMinutes > 0 && (
                              <div className="text-xs text-red-600 font-medium">
                                Morning: {attendance.morningLateMinutes}m
                              </div>
                            )}
                            {attendance.afternoonLateMinutes > 0 && (
                              <div className="text-xs text-red-600 font-medium">
                                Afternoon: {attendance.afternoonLateMinutes}m
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </div>

                      {/* Remarks */}
                      <div className="text-gray-600 text-xs">
                        {attendance.remarks || "--"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 text-lg mb-2">�</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No attendance records found
                  </h3>
                  <p className="text-gray-500">
                    {selectedDepartment
                      ? "No attendance records found for the selected department and date."
                      : "Please select a department to view attendance records."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerEmployeeAttendance;
