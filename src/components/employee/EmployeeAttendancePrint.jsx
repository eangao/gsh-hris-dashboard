import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import {
  formatMonthYearPH,
  formatTimeTo12HourPH,
} from "../../utils/phDateUtils";
import { fetchAttendanceByDepartment } from "../../store/Reducers/attendanceReducer";
import { fetchDepartmentById } from "../../store/Reducers/departmentReducer";
import "./EmployeeAttendancePrint.css";

// Helper function to format date with day of the week
const formatDateWithDay = (date) => {
  const dateObj = new Date(date);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[dateObj.getDay()];
  const monthName = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${dayName} ${monthName} ${day} ${year}`;
};

// Helper function to format holiday information
const formatHolidayInfo = (holiday) => {
  if (!holiday) return null;

  const holidayName = holiday.name || "";
  const holidayType = holiday.type || "";

  // Truncate holiday name to max 2 words
  const words = holidayName.split(" ");
  const truncatedName =
    words.length > 2 ? words.slice(0, 2).join(" ") + "..." : holidayName;

  // Get holiday type abbreviation
  const getTypeAbbreviation = (type) => {
    switch (type?.toLowerCase()) {
      case "regular holiday":
        return "RH";
      case "special holiday":
        return "SH";
      case "special non-working holiday":
        return "SNWH";
      case "local holiday":
        return "LH";
      default:
        return type ? type.charAt(0).toUpperCase() : "";
    }
  };

  return {
    name: truncatedName,
    typeAbbr: getTypeAbbreviation(holidayType),
  };
};

// Helper function to format schedule based on scheduleType (matching EmployeeAttendance.jsx)
const ScheduleDisplay = ({ attendance, isDesktop = true }) => {
  const holidayInfo = formatHolidayInfo(attendance.holiday);

  // Helper function to render schedule content
  const renderScheduleContent = () => {
    if (!attendance.scheduleType) {
      return (
        <span className="text-gray-500 text-sm">
          {attendance.scheduleString || "-"}
        </span>
      );
    }

    switch (attendance.scheduleType) {
      case "duty":
        if (attendance.shiftTemplate) {
          if (attendance.shiftTemplate.type === "Standard") {
            const morningIn = formatTimeTo12HourPH(
              attendance.shiftTemplate.morningIn
            );
            const morningOut = formatTimeTo12HourPH(
              attendance.shiftTemplate.morningOut
            );
            const afternoonIn = formatTimeTo12HourPH(
              attendance.shiftTemplate.afternoonIn
            );
            const afternoonOut = formatTimeTo12HourPH(
              attendance.shiftTemplate.afternoonOut
            );

            return (
              <div className="text-xs leading-tight">
                <div>
                  {morningIn}-{morningOut}
                </div>
                <div>
                  {afternoonIn}-{afternoonOut}
                </div>
              </div>
            );
          } else if (attendance.shiftTemplate.type === "Shifting") {
            const startTime = formatTimeTo12HourPH(
              attendance.shiftTemplate.startTime
            );
            const endTime = formatTimeTo12HourPH(
              attendance.shiftTemplate.endTime
            );

            return (
              <span className="text-xs">
                {startTime}-{endTime}
              </span>
            );
          }
        }
        return <span className="text-sm">Duty</span>;

      case "off":
        return <span className="text-sm text-gray-600">Day Off</span>;

      case "holiday_off":
        return <span className="text-sm text-gray-600">Holiday Off</span>;

      case "leave":
        // Check if this is compensatory time off and display schedule accordingly
        const isCompensatoryTimeOff =
          attendance.leaveTemplate?.isCompensatoryTimeOff;
        const compensatoryWorkShift =
          attendance.leaveTemplate?.compensatoryWorkShift;

        if (isCompensatoryTimeOff && compensatoryWorkShift) {
          // Display time schedule for compensatory time off
          if (compensatoryWorkShift.type === "Standard") {
            // Helper function to format time from HH:mm to 12-hour format
            const formatTime = (timeStr) => {
              if (!timeStr) return "";
              const [hours, minutes] = timeStr.split(":").map(Number);
              const date = new Date();
              date.setHours(hours);
              date.setMinutes(minutes);
              return date.toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              });
            };

            const morningIn = formatTime(compensatoryWorkShift.morningIn);
            const morningOut = formatTime(compensatoryWorkShift.morningOut);
            const afternoonIn = formatTime(compensatoryWorkShift.afternoonIn);
            const afternoonOut = formatTime(compensatoryWorkShift.afternoonOut);

            return (
              <div className="text-sm space-y-1">
                <div className="text-amber-700 font-semibold capitalize mb-1">
                  {attendance.leaveTemplate?.name || "Leave"}
                </div>
                <div className="flex items-center">
                  <span className="text-blue-800">
                    {morningIn}-{morningOut}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-800">
                    {afternoonIn}-{afternoonOut}
                  </span>
                </div>
              </div>
            );
          } else if (compensatoryWorkShift.type === "Shifting") {
            // Helper function to format time from HH:mm to 12-hour format
            const formatTime = (timeStr) => {
              if (!timeStr) return "";
              const [hours, minutes] = timeStr.split(":").map(Number);
              const date = new Date();
              date.setHours(hours);
              date.setMinutes(minutes);
              return date.toLocaleTimeString([], {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              });
            };

            const startTime = formatTime(compensatoryWorkShift.startTime);
            const endTime = formatTime(compensatoryWorkShift.endTime);

            return (
              <div className="text-sm">
                <div className="text-amber-700 font-semibold capitalize mb-1">
                  {attendance.leaveTemplate?.name || "Leave"}
                </div>
                <div className="flex items-center">
                  <span className="text-cyan-800 whitespace-nowrap">
                    {startTime}-{endTime}
                  </span>
                </div>
              </div>
            );
          }
        }

        // Default leave display (non-compensatory)
        return (
          <span className="text-sm text-gray-600">
            {(attendance.leaveTemplate?.name || "Leave")
              .charAt(0)
              .toUpperCase() +
              (attendance.leaveTemplate?.name || "Leave")
                .slice(1)
                .toLowerCase()}
          </span>
        );

      default:
        return <span className="text-sm">{attendance.scheduleType}</span>;
    }
  };

  // If there's holiday information, display schedule and holiday side by side
  if (holidayInfo) {
    return (
      <div className="flex items-start gap-2">
        <div className="flex-1">{renderScheduleContent()}</div>
        <div className="text-xs text-blue-600 leading-tight">
          <div className="font-medium">{holidayInfo.name}</div>
          <div className="text-gray-500">({holidayInfo.typeAbbr})</div>
        </div>
      </div>
    );
  }

  // No holiday information, just show schedule
  return renderScheduleContent();
};

// Status badge component for print (simplified version matching EmployeeAttendance.jsx)
const StatusBadge = ({ status, lateMinutes = 0 }) => {
  const getStatusConfig = (status, lateMinutes) => {
    switch (status) {
      case "Duty":
        return { label: "Duty" };
      case "On Duty":
        return { label: "On Duty" };
      case "Off":
        return { label: "Off" };
      case "Holiday Off":
        return { label: "Holiday Off" };
      case "Leave":
        return { label: "Leave" };
      case "Absent":
        return { label: "Absent" };
      case "Present":
        return { label: "Present" };
      case "Late":
        return { label: `Late (${lateMinutes}m)` };
      case "Incomplete":
        return { label: "Incomplete" };
      case "No Show":
        return { label: "No Show" };
      case "Scheduled":
        return { label: "Scheduled" };
      default:
        return { label: status || "Others" };
    }
  };

  const config = getStatusConfig(status, lateMinutes);
  return <span className="text-xs">{config.label}</span>;
};

// Helper function to format time for display
const formatTime = (time) => {
  if (!time) return "--:--";
  try {
    return formatTimeTo12HourPH(time);
  } catch (error) {
    return "--:--";
  }
};

// Time display component for print (matching EmployeeAttendance.jsx logic)
const TimeDisplay = ({ attendance, type = "in" }) => {
  if (
    !attendance ||
    (attendance.scheduleType !== "duty" &&
      !(
        attendance.scheduleType === "leave" &&
        attendance.leaveTemplate?.isCompensatoryTimeOff
      ))
  ) {
    return <span className="text-gray-400">--:--</span>;
  }

  // Helper function to determine source and get indicator
  const getSourceIndicator = (source) => {
    if (!source) return "";

    const sourceType = source.toLowerCase();
    if (sourceType === "manual") {
      return " - M";
    } else if (sourceType === "biometric") {
      return " - B";
    }
    return "";
  };

  // Determine shift type - for compensatory time off, use compensatoryWorkShift
  const isCompensatoryTimeOff =
    attendance.scheduleType === "leave" &&
    attendance.leaveTemplate?.isCompensatoryTimeOff;
  const shiftTemplate = isCompensatoryTimeOff
    ? attendance.leaveTemplate?.compensatoryWorkShift
    : attendance.shiftTemplate;

  // Check if it's a Standard shift (has morning/afternoon times)
  if (shiftTemplate?.type === "Standard") {
    if (type === "in") {
      // Show morning and afternoon IN times
      const morningIn = attendance.morningInLog
        ? formatTime(attendance.morningInLog)
        : "--:--";
      const afternoonIn = attendance.afternoonInLog
        ? formatTime(attendance.afternoonInLog)
        : "--:--";

      // Get source indicators (using correct field names from EmployeeAttendance.jsx)
      const morningIndicator = getSourceIndicator(
        attendance.morningInLogSource
      );
      const afternoonIndicator = getSourceIndicator(
        attendance.afternoonInLogSource
      );

      return (
        <div className="text-xs">
          <div>
            {morningIn}
            {morningIndicator}
          </div>
          <div>
            {afternoonIn}
            {afternoonIndicator}
          </div>
        </div>
      );
    } else {
      // Show morning and afternoon OUT times
      const morningOut = attendance.morningOutLog
        ? formatTime(attendance.morningOutLog)
        : "--:--";
      const afternoonOut = attendance.afternoonOutLog
        ? formatTime(attendance.afternoonOutLog)
        : "--:--";

      // Get source indicators (using correct field names from EmployeeAttendance.jsx)
      const morningIndicator = getSourceIndicator(
        attendance.morningOutLogSource
      );
      const afternoonIndicator = getSourceIndicator(
        attendance.afternoonOutLogSource
      );

      return (
        <div className="text-xs">
          <div>
            {morningOut}
            {morningIndicator}
          </div>
          <div>
            {afternoonOut}
            {afternoonIndicator}
          </div>
        </div>
      );
    }
  } else {
    // Shifting schedule - single in/out times
    const time = type === "in" ? attendance.timeIn : attendance.timeOut;
    const source =
      type === "in" ? attendance.timeInSource : attendance.timeOutSource;

    const formattedTime = formatTime(time);
    const indicator = getSourceIndicator(source);

    return (
      <span className="text-xs">
        {formattedTime}
        {indicator}
      </span>
    );
  }
};

// Helper function to calculate day equivalents based on schedule
const calculateDayEquivalent = (attendance) => {
  // If employee is Absent, no days are compensated
  if (attendance.status === "Absent") {
    return "--";
  }

  // Holiday Off = 1 day (always paid for both managers and regular workers)
  if (attendance.scheduleType === "holiday_off") {
    return "1";
  }

  // Holiday Duty = based on payMultiplier (duty scheduled on a holiday)
  if (attendance.scheduleType === "duty" && attendance.holiday) {
    const payMultiplier = attendance.holiday.payMultiplier || 1;

    // Use payMultiplier directly as day equivalent
    // payMultiplier: 2.0 = 2 days, 1.5 = 1.5 days, 1.3 = 1.3 days, etc.
    return payMultiplier.toString();
  }

  // Compensatory Time Off = 1 day (employee is working on their leave day)
  if (
    attendance.scheduleType === "leave" &&
    attendance.leaveTemplate?.isCompensatoryTimeOff
  ) {
    return "1";
  }

  // Paid Leave = 1 day
  if (
    attendance.scheduleType === "leave" &&
    attendance.leaveTemplate?.isPaid === true
  ) {
    return "1";
  }

  // Duty schedules
  if (attendance.scheduleType === "duty") {
    // Standard schedule = 1 day (regardless of actual hours)
    if (attendance.shiftTemplate?.type === "Standard") {
      return "1";
    }

    // Shifting schedule - calculate based on scheduled hours
    if (attendance.shiftTemplate?.type === "Shifting") {
      // Get start and end times from shiftTemplate
      const startTime = attendance.shiftTemplate.startTime;
      const endTime = attendance.shiftTemplate.endTime;

      if (startTime && endTime) {
        // Parse time strings (assuming HH:MM format)
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);

        let startMinutes = startHour * 60 + startMin;
        let endMinutes = endHour * 60 + endMin;

        // Handle overnight shifts
        if (endMinutes <= startMinutes) {
          endMinutes += 24 * 60; // Add 24 hours for next day
        }

        const totalMinutes = endMinutes - startMinutes;
        const totalHours = totalMinutes / 60;

        // Calculate day equivalent
        // If 8 hours or less = 1 day (minimum full day credit)
        // If more than 8 hours = proportional (12 hours = 1.5 days, etc.)
        let dayEquivalent;
        if (totalHours <= 8) {
          dayEquivalent = 1;
        } else {
          dayEquivalent = totalHours / 8;
        }

        // Format to one decimal place if needed
        if (dayEquivalent % 1 === 0) {
          return dayEquivalent.toString();
        } else {
          return dayEquivalent.toFixed(1);
        }
      }
    }

    // Fallback for duty without proper shift template
    return "1";
  }

  // All other cases (unpaid leave, off days, etc.)
  return "--";
};

// Late display component for print
const LateDisplay = ({ attendance }) => {
  if (
    !attendance ||
    (attendance.scheduleType !== "duty" &&
      !(
        attendance.scheduleType === "leave" &&
        attendance.leaveTemplate?.isCompensatoryTimeOff
      ))
  ) {
    return <span className="text-gray-400">--</span>;
  }

  // Determine shift type - for compensatory time off, use compensatoryWorkShift
  const isCompensatoryTimeOff =
    attendance.scheduleType === "leave" &&
    attendance.leaveTemplate?.isCompensatoryTimeOff;
  const shiftTemplate = isCompensatoryTimeOff
    ? attendance.leaveTemplate?.compensatoryWorkShift
    : attendance.shiftTemplate;

  // Check if it's a Standard shift (has morning/afternoon late minutes)
  if (shiftTemplate?.type === "Standard") {
    const morningLate = attendance.morningLateMinutes || 0;
    const afternoonLate = attendance.afternoonLateMinutes || 0;
    const totalLate = morningLate + afternoonLate;

    if (totalLate === 0) {
      return <span className="text-gray-400">--</span>;
    }

    return <span className="text-xs text-red-600">{totalLate}M</span>;
  } else {
    // Shifting schedule - single late minutes
    const lateMinutes = attendance.lateMinutes || 0;
    if (lateMinutes === 0) {
      return <span className="text-gray-400">--</span>;
    }
    return <span className="text-xs text-red-600">{lateMinutes}M</span>;
  }
};

const EmployeeAttendancePrint = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get parameters from URL
  const departmentId = searchParams.get("department");
  const scheduleId = searchParams.get("scheduleId");

  const { attendances, loading } = useSelector((state) => state.attendance);
  const { department } = useSelector((state) => state.department);

  const [groupedAttendances, setGroupedAttendances] = useState({});

  // Load initial data
  useEffect(() => {
    if (departmentId) {
      dispatch(fetchDepartmentById(departmentId));
    }

    if (scheduleId) {
      dispatch(
        fetchAttendanceByDepartment({
          scheduleId,
        })
      );
    }
  }, [dispatch, departmentId, scheduleId]);

  // Set browser title when department is loaded
  useEffect(() => {
    if (department?.name) {
      document.title = `${department.name.toUpperCase()} ATTENDANCE REPORT | ADVENTIST HOSPITAL GINGOOG`;
    }
  }, [department]);

  // Group attendances by employee when data is loaded
  useEffect(() => {
    if (attendances && attendances.length > 0) {
      const grouped = attendances.reduce((acc, attendance) => {
        // Use employeeId as the primary key for grouping
        const employeeId =
          attendance.employeeId ||
          attendance.employee?._id ||
          attendance.employee;

        // Use employeeName directly from attendance object (as in EmployeeAttendance.jsx)
        const employeeName = attendance.employeeName || "Unknown Employee";
        const employeeEmpId =
          attendance.hospitalEmployeeId ||
          attendance.empId ||
          attendance.employee?.employeeId ||
          "N/A";

        if (!employeeId) {
          console.warn("No employee ID found for attendance:", attendance);
          return acc;
        }

        if (!acc[employeeId]) {
          acc[employeeId] = {
            employee: attendance.employee,
            employeeName,
            employeeEmpId,
            attendances: [],
          };
        }
        acc[employeeId].attendances.push(attendance);
        return acc;
      }, {});

      // Sort attendances within each employee by date
      Object.keys(grouped).forEach((employeeId) => {
        grouped[employeeId].attendances.sort((a, b) => {
          const dateA = new Date(a.datePH || a.date);
          const dateB = new Date(b.datePH || b.date);
          return dateA - dateB;
        });
      });

      // Sort employees by last name
      const sortedGrouped = Object.keys(grouped)
        .sort((a, b) => {
          const nameA = grouped[a].employeeName.toLowerCase();
          const nameB = grouped[b].employeeName.toLowerCase();
          return nameA.localeCompare(nameB);
        })
        .reduce((acc, key) => {
          acc[key] = grouped[key];
          return acc;
        }, {});

      setGroupedAttendances(sortedGrouped);
    }
  }, [attendances]);

  // Helper function to get date range for the report
  const getDateRange = () => {
    if (!attendances || attendances.length === 0) return "No Data";

    // Try to get schedule start/end dates from attendance data
    let scheduleStartDate = null;
    let scheduleEndDate = null;

    // Check for schedule start/end dates in attendance data
    for (const attendance of attendances) {
      if (attendance.scheduleStartDate && !scheduleStartDate) {
        scheduleStartDate = new Date(attendance.scheduleStartDate);
      }
      if (attendance.scheduleEndDate && !scheduleEndDate) {
        scheduleEndDate = new Date(attendance.scheduleEndDate);
      }
      if (attendance.schedule?.startDate && !scheduleStartDate) {
        scheduleStartDate = new Date(attendance.schedule.startDate);
      }
      if (attendance.schedule?.endDate && !scheduleEndDate) {
        scheduleEndDate = new Date(attendance.schedule.endDate);
      }
      if (attendance.dutySchedule?.startDate && !scheduleStartDate) {
        scheduleStartDate = new Date(attendance.dutySchedule.startDate);
      }
      if (attendance.dutySchedule?.endDate && !scheduleEndDate) {
        scheduleEndDate = new Date(attendance.dutySchedule.endDate);
      }
    }

    // If schedule dates are found, use them
    if (scheduleStartDate && scheduleEndDate) {
      return `${formatMonthYearPH(
        scheduleStartDate,
        true
      )} - ${formatMonthYearPH(scheduleEndDate, true)}`;
    }

    // Fallback to attendance date range if schedule dates not found
    const dates = attendances
      .map((att) => new Date(att.datePH || att.date))
      .sort((a, b) => a - b);
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];

    return `${formatMonthYearPH(startDate, true)} - ${formatMonthYearPH(
      endDate,
      true
    )}`;
  };

  const handleCancel = () => {
    // Check if this window was opened from another window
    if (window.opener) {
      // If opened in new tab/window, close it
      window.close();
    } else {
      // If navigated directly, go back in history
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 print:p-0 min-h-screen">
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 print:p-0 min-h-screen print-container">
      {/* Header for screen */}
      <div className="mb-6 flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between print:hidden">
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-500 hover:text-gray-700 print:hidden"
        >
          <IoMdArrowBack className="mr-2" />
          Back
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Report
        </button>
      </div>

      {/* Header for screen and print */}
      <div className="mb-4 flex justify-between">
        <div className="text-left leading-tight">
          <h2 className="text-base font-bold uppercase tracking-wide">
            ADVENTIST HOSPITAL GINGOOG
          </h2>
          <h3 className="text-sm font-semibold uppercase">
            PBO DAILY TIME RECORD
          </h3>
        </div>
        <div className="text-right leading-tight">
          <p className="text-xs">
            <span className="font-bold">Report Period:</span> {getDateRange()}
          </p>
          {/* Date Printed - hidden in preview, only visible when printing */}
          <p className="text-xs hidden print:block">
            <span className="font-bold">Date Printed:</span>{" "}
            {formatMonthYearPH(new Date(), true)}
          </p>
        </div>
      </div>

      {/* Employee Attendance Tables */}
      {Object.keys(groupedAttendances).length > 0 ? (
        Object.entries(groupedAttendances).map(
          ([employeeId, employeeData], employeeIndex) => (
            <div key={employeeId} className="mb-4">
              {/* Attendance Table */}
              <table
                className="w-full border border-gray-300 mb-2 print:table-fixed attendance-table"
                style={{
                  tableLayout: "fixed",
                  width: "100%",
                }}
              >
                <colgroup>
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "24%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "9%" }} />
                  <col style={{ width: "9%" }} />
                </colgroup>
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      colSpan="7"
                      className="border border-gray-300 px-3 py-3 text-left bg-gray-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-left">
                          <div className="text-lg font-bold text-gray-800">
                            {employeeData.employeeName}
                          </div>
                          <div className="text-sm text-gray-600">
                            Employee ID: {employeeData.employeeEmpId}
                          </div>
                        </div>
                        <div className="text-right">
                          {(() => {
                            // Count attendance types
                            const counts = {
                              duty: 0,
                              holidayDuty: 0,
                              holidayOff: 0,
                              off: 0,
                              leave: 0,
                              absent: 0,
                              totalLateMinutes: 0,
                              totalPaidDays: 0,
                            };

                            employeeData.attendances.forEach((attendance) => {
                              // Calculate late minutes for duty schedules and compensatory time off
                              const isCompensatoryTimeOff =
                                attendance.scheduleType === "leave" &&
                                attendance.leaveTemplate?.isCompensatoryTimeOff;

                              if (
                                attendance.scheduleType === "duty" ||
                                isCompensatoryTimeOff
                              ) {
                                // Determine shift type for late minutes calculation
                                const shiftTemplate = isCompensatoryTimeOff
                                  ? attendance.leaveTemplate
                                      ?.compensatoryWorkShift
                                  : attendance.shiftTemplate;

                                if (shiftTemplate?.type === "Standard") {
                                  const morningLate =
                                    attendance.morningLateMinutes || 0;
                                  const afternoonLate =
                                    attendance.afternoonLateMinutes || 0;
                                  counts.totalLateMinutes +=
                                    morningLate + afternoonLate;
                                } else {
                                  counts.totalLateMinutes +=
                                    attendance.lateMinutes || 0;
                                }
                              }

                              // Calculate total paid days using the same logic as Days column
                              const dayEquivalent =
                                calculateDayEquivalent(attendance);
                              if (
                                dayEquivalent !== "--" &&
                                dayEquivalent !== "0"
                              ) {
                                counts.totalPaidDays +=
                                  parseFloat(dayEquivalent);
                              }

                              // Priority: Check actual attendance status first
                              if (attendance.status === "Absent") {
                                counts.absent++;
                              } else if (
                                attendance.scheduleType === "duty" &&
                                attendance.holiday
                              ) {
                                // Holiday duty counts separately
                                counts.holidayDuty++;
                              } else if (
                                attendance.status === "Present" ||
                                attendance.status === "Late" ||
                                attendance.status === "Incomplete" ||
                                attendance.scheduleType === "duty" ||
                                attendance.status === "Scheduled"
                              ) {
                                counts.duty++;
                              } else if (
                                attendance.scheduleType === "holiday_off"
                              ) {
                                counts.holidayOff++;
                              } else if (attendance.scheduleType === "off") {
                                counts.off++;
                              } else if (attendance.scheduleType === "leave") {
                                counts.leave++;
                              }
                            });

                            return (
                              <div className="text-sm text-gray-600">
                                <div className="flex flex-wrap gap-3">
                                  {counts.duty > 0 && (
                                    <span>Duty: {counts.duty}</span>
                                  )}
                                  {counts.holidayDuty > 0 && (
                                    <span>
                                      Holiday Duty: {counts.holidayDuty}
                                    </span>
                                  )}
                                  {counts.holidayOff > 0 && (
                                    <span>
                                      Holiday Off: {counts.holidayOff}
                                    </span>
                                  )}
                                  {counts.off > 0 && (
                                    <span>Off: {counts.off}</span>
                                  )}
                                  {counts.leave > 0 && (
                                    <span>Leave: {counts.leave}</span>
                                  )}
                                  {counts.absent > 0 && (
                                    <span>Absent: {counts.absent}</span>
                                  )}
                                  <span>
                                    Total: {employeeData.attendances.length}
                                  </span>
                                </div>
                                <div className="flex gap-3 mt-1">
                                  {counts.totalLateMinutes > 0 && (
                                    <span>
                                      Late: {counts.totalLateMinutes} Min
                                    </span>
                                  )}
                                  {counts.totalPaidDays > 0 && (
                                    <span>
                                      Compensated Days:{" "}
                                      {counts.totalPaidDays % 1 === 0
                                        ? counts.totalPaidDays.toString()
                                        : counts.totalPaidDays.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th
                      className="border border-gray-300 px-3 py-2 text-left text-sm font-bold"
                      style={{ width: "20%" }}
                    >
                      Date
                    </th>
                    <th
                      className="border border-gray-300 px-3 py-2 text-left text-sm font-bold"
                      style={{ width: "35%" }}
                    >
                      Schedule
                    </th>
                    <th
                      className="border border-gray-300 px-2 py-2 text-center text-sm font-bold"
                      style={{ width: "10%" }}
                    >
                      Time In
                    </th>
                    <th
                      className="border border-gray-300 px-2 py-2 text-center text-sm font-bold"
                      style={{ width: "10%" }}
                    >
                      Time Out
                    </th>
                    <th
                      className="border border-gray-300 px-2 py-2 text-center text-sm font-bold"
                      style={{ width: "10%" }}
                    >
                      Status
                    </th>
                    <th
                      className="border border-gray-300 px-2 py-2 text-center text-sm font-bold"
                      style={{ width: "7%" }}
                    >
                      Late
                    </th>
                    <th
                      className="border border-gray-300 px-2 py-2 text-center text-sm font-bold"
                      style={{ width: "8%" }}
                    >
                      Days
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeData.attendances.map((attendance, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } attendance-row`}
                    >
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <div className="text-xs">
                          {(() => {
                            const isCompensatoryTimeOff =
                              attendance.scheduleType === "leave" &&
                              attendance.leaveTemplate?.isCompensatoryTimeOff;

                            if (isCompensatoryTimeOff) {
                              return (
                                <div>
                                  <div>
                                    {formatDateWithDay(
                                      attendance.datePH || attendance.date
                                    )}
                                  </div>
                                  {attendance.leaveTemplate
                                    ?.compensatoryWorkDate && (
                                    <div className="text-blue-600 mt-1">
                                      Duty date:{" "}
                                      {formatDateWithDay(
                                        attendance.leaveTemplate
                                          .compensatoryWorkDate
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            return formatDateWithDay(
                              attendance.datePH || attendance.date
                            );
                          })()}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <ScheduleDisplay attendance={attendance} />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        <TimeDisplay attendance={attendance} type="in" />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        <TimeDisplay attendance={attendance} type="out" />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        <StatusBadge
                          status={attendance.status}
                          lateMinutes={attendance.lateMinutes || 0}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        <LateDisplay attendance={attendance} />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        {calculateDayEquivalent(attendance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No attendance records found for this department.
          </p>
        </div>
      )}

      {/* Signature Section */}
      <div className="print:block hidden mt-10 text-sm page-break-inside-avoid">
        <div className="flex justify-between text-center mt-20">
          <div className="w-1/3">
            <div className="mb-8">Prepared by:</div>
            <div className="border-b border-black w-4/5 mx-auto pt-1">
              {/* Manager signature line */}
            </div>
            <div className="mt-1 uppercase">
              {department?.name || "Unknown Department"} Manager
            </div>
          </div>

          <div className="w-1/3">
            <div className="mb-8">Noted by:</div>
            <div className="border-b border-black w-4/5 mx-auto pt-1">
              {/* Director signature line */}
            </div>
            <div className="mt-1 uppercase text-xs font-semibold">DIRECTOR</div>
          </div>

          <div className="w-1/3">
            <div className="mb-8">Approved by:</div>
            <div className="border-b border-black w-4/5 mx-auto pt-1">
              {/* HR signature line */}
            </div>
            <div className="mt-1">HR</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-6 print:hidden">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendancePrint;
