import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceByEmployee } from "../../../store/Reducers/attendanceReducer";
import {
  formatDatePH,
  getTodayDatePH,
  formatTimeTo12HourPH,
  formatDateTimeToTimePH,
  getAttendanceDateRangePH,
} from "../../../utils/phDateUtils";

const MyAttendance = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { employee: employeeId } = userInfo;

  const { attendances, loading, errorMessage } = useSelector(
    (state) => state.attendance
  );

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

    return <span className={`font-medium ${colorClass}`}>{formattedTime}</span>;
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
            <div className="h-4 bg-gray-200 rounded w-20"></div>
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
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  console.log("Attendances Data:", attendances);
  console.log("Loading:", loading);
  console.log("Error:", errorMessage);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Attendance</h1>
        <p className="text-gray-600">
          Track your daily attendance and schedule
        </p>
      </div>

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
              <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-gray-700">
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
                    key={attendance.datePH || idx}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-7 gap-4 items-center text-sm">
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
                      <div className="text-gray-700">
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
                                <span className="text-xs text-gray-500 font-medium min-w-[60px]">
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
                                <span className="text-xs text-gray-500 font-medium min-w-[60px]">
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
                  <div className="text-gray-400 text-lg mb-2">📅</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No attendance records found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your date range or check back later.
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

export default MyAttendance;
