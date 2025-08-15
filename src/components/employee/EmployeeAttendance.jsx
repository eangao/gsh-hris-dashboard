import React, { useState } from "react";
import {
  formatDatePH,
  formatTimeTo12HourPH,
  formatDateTimeToTimePH,
  getMonthLabelPH,
  parseDatePH,
} from "../../utils/phDateUtils";
import Pagination from "../Pagination";
import EmployeeSearchFrontend from "../EmployeeSearchFrontend";
import LoadingIndicator from "../LoadingIndicator";
import ManualAttendanceModal from "../ManualAttendanceModal";
import DutyScheduleForm from "../dutySchedule/DutyScheduleForm";

// Helper function to format schedule based on scheduleType
const ScheduleDisplay = ({ attendance, isDesktop = false }) => {
  if (!attendance.scheduleType) {
    return (
      <div className="text-gray-500 text-sm">
        {attendance.scheduleString || "-"}
      </div>
    );
  }

  const baseClasses = isDesktop ? "text-sm" : "font-semibold";

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
            <div className={`${baseClasses} space-y-1`}>
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
              {!isDesktop && (
                <div className="flex items-center gap-1 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs text-blue-600 font-medium">
                    Standard Shift
                  </span>
                </div>
              )}
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
            <div className={`${baseClasses}`}>
              <div className="flex items-center">
                <span className="text-cyan-800 whitespace-nowrap">
                  {startTime}-{endTime}
                </span>
              </div>
              {!isDesktop && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-cyan-600 font-medium">
                    Shifting Schedule
                  </span>
                </div>
              )}
            </div>
          );
        }
      }
      return (
        <div className={`${baseClasses}`}>
          <span className="text-blue-800 font-medium">Duty</span>
        </div>
      );

    case "off":
      return (
        <div className={`${baseClasses}`}>
          <span className="text-gray-800 font-medium">Off</span>
        </div>
      );

    case "holiday_off":
      return (
        <div className={`${baseClasses} space-y-1`}>
          <div className="flex items-center">
            <span className="text-red-700 font-semibold uppercase text-xs">
              Holiday Off
            </span>
          </div>
        </div>
      );

    case "leave":
      return (
        <div className={`${baseClasses} space-y-1`}>
          <div className="flex items-center">
            <span className="text-amber-700 font-semibold uppercase text-xs">
              {attendance.leaveTemplate?.name || "Leave"}
            </span>
          </div>
          {attendance.leaveTemplate?.category && (
            <div className="text-xs pl-6 space-y-0.5">
              <div className="text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-md border-l-2 border-amber-300 capitalize">
                🏖️ {attendance.leaveTemplate.category}
              </div>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className={`${baseClasses} text-gray-500`}>
          {attendance.scheduleString || "-"}
        </div>
      );
  }
};

// Helper function to get row background color based on schedule type
const getRowBackgroundColor = (attendance, holidays) => {
  // Removed holiday background logic per user request
  // Apply default background for all rows
  return "bg-white hover:bg-gray-50";
};

// Helper function to get holiday information for a specific date
const getHolidayInfo = (attendance, holidays) => {
  if (!attendance?.datePH || !holidays?.length) return null;

  // Use formatDatePH to get consistent YYYY-MM-DD format from attendance datePH
  const attendanceDateFormatted = formatDatePH(attendance.datePH);
  if (!attendanceDateFormatted) return null;

  const holiday = holidays.find((holiday) => {
    // Use formatDatePH to format holiday date for consistent comparison
    const holidayDateFormatted = formatDatePH(holiday.date);
    return holidayDateFormatted === attendanceDateFormatted;
  });

  return holiday || null;
};

// Helper function to format holiday name with type abbreviation
const getHolidayNameWithAbbreviation = (holiday) => {
  if (!holiday) return null;

  // Generate holiday type abbreviation
  const getHolidayTypeAbbreviation = (type) => {
    if (!type) return "H";

    const typeStr = type.toLowerCase();
    if (typeStr.includes("regular")) return "RH";
    if (typeStr.includes("special") && typeStr.includes("non-working"))
      return "SN";
    if (typeStr.includes("special") && typeStr.includes("working")) return "SW";
    if (typeStr.includes("local")) return "LH";

    return "H"; // Default abbreviation
  };

  const abbreviation = getHolidayTypeAbbreviation(holiday.type);
  return `${holiday.name} (${abbreviation})`;
};

const EmployeeAttendance = ({
  // Essential data props
  departments,
  employees,
  attendances,
  loading,

  // UI state props
  selectedDepartment,
  currentPage,
  searchValue,
  perPage,
  totalFilteredAttendance,

  // Schedule management props
  availableDutySchedules,
  currentScheduleIndex,
  currentDate,

  // Navigation handlers
  canNavigatePrevious,
  canNavigateNext,
  handleNextMonth,
  handlePrevMonth,

  // Form handlers
  handleDepartmentChange,
  handlePageChange,
  handleSearchValueChange,
  handlePerPageChange,

  // Error handling
  errorMessage,

  // Holiday data
  holidays,

  // View type - determines if this is individual employee view
  isIndividualView = false,

  // User role - determines header content based on role
  userRole = "", // Options: "manager", "director", "hr", "employee"

  // Manual attendance handler
  onManualAttendanceSuccess,
}) => {
  // Manual attendance modal state
  const [remarksModal, setRemarksModal] = useState({
    isOpen: false,
    remarks: "",
    employeeName: "",
    date: "",
  });

  // Component to display truncated remarks with "more" option
  const RemarksDisplay = ({
    remarks,
    employeeName,
    date,
    onShowMore,
    schedule,
  }) => {
    const maxLength = 15; // Maximum characters to show - kept short to prevent row expansion

    if (!remarks || remarks === "--") {
      return <span className="text-gray-400">--</span>;
    }

    if (remarks.length <= maxLength) {
      return <span className="text-gray-600 text-xs">{remarks}</span>;
    }

    return (
      <span className="text-gray-600 text-xs">
        {remarks.substring(0, maxLength)}...
        <button
          onClick={() =>
            onShowMore({
              remarks,
              employeeName,
              date: formatDatePH(date, "MMM D, YYYY"),
              schedule,
            })
          }
          className="text-blue-600 hover:text-blue-800 font-medium ml-1 underline"
        >
          more
        </button>
      </span>
    );
  };

  const [manualAttendanceModal, setManualAttendanceModal] = useState({
    isOpen: false,
    attendance: null,
    timeType: null,
    mode: "create", // "create" or "update"
    existingTime: "",
    existingRemarks: "",
    manualId: null,
  });

  const [managerEditModalOpen, setManagerEditModalOpen] = useState(false);

  // Helper function to check if manual attendance is allowed
  const isManualAttendanceAllowed = (attendance, timeType) => {
    // Only allow managers to add manual attendance
    if (userRole?.toLowerCase() !== "manager") {
      return false;
    }

    // Only allow for duty schedules (not off, holiday_off, leave, holiday, on duty)
    const restrictedScheduleTypes = [
      "off",
      "holiday_off",
      "holiday",
      "leave",
      "on duty",
    ];

    const scheduleType = attendance.scheduleType?.toLowerCase();
    const status = attendance.status?.toLowerCase();

    // Check if schedule type is restricted
    if (restrictedScheduleTypes.includes(scheduleType)) {
      return false;
    }

    // Check if status is restricted (for "on duty" status)
    if (restrictedScheduleTypes.includes(status)) {
      return false;
    }

    // Only allow for "duty" schedule type or similar work schedules
    if (scheduleType === "duty" || scheduleType === "work") {
      return true;
    }

    // If we can't determine the schedule type, be conservative and disallow
    return false;
  };

  // Handle opening manual attendance modal
  const handleManualAttendanceClick = (attendance, timeType) => {
    if (isManualAttendanceAllowed(attendance, timeType)) {
      setManualAttendanceModal({
        isOpen: true,
        attendance,
        timeType,
        mode: "create",
        existingTime: "",
        existingRemarks: "",
        manualId: null,
      });
    }
  };

  // Handle closing manual attendance modal
  const handleCloseManualAttendanceModal = () => {
    setManualAttendanceModal({
      isOpen: false,
      attendance: null,
      timeType: null,
      mode: "create",
      existingTime: "",
      existingRemarks: "",
      manualId: null,
    });
  };

  // Handle manual attendance success
  const handleManualAttendanceSuccess = () => {
    // Close modal
    handleCloseManualAttendanceModal();

    // Call parent callback if provided
    if (onManualAttendanceSuccess) {
      onManualAttendanceSuccess();
    }
  };
  // Helper function to get header content based on role
  const getHeaderContent = () => {
    if (isIndividualView) {
      return {
        title: "My Attendance",
        description: "Track your daily attendance and schedule",
      };
    }

    switch (userRole) {
      case "hr":
        return {
          title: "Employee Attendance Management",
          description:
            "Monitor and manage attendance records across all departments",
        };
      case "director":
        return {
          title: "Department Attendance Overview",
          description:
            "Monitor attendance records for departments under your cluster management",
        };
      case "manager":
      default:
        return {
          title: "Employee Attendance",
          description:
            "Monitor attendance records for employees in your departments",
        };
    }
  };

  const headerContent = getHeaderContent();
  // Status badge component
  const StatusBadge = ({ status, lateMinutes = 0 }) => {
    const getStatusConfig = (status, lateMinutes) => {
      switch (status) {
        case "Duty":
          return {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-200",
            label: "Duty",
          };
        case "On Duty":
          return {
            bg: "bg-cyan-100",
            text: "text-cyan-800",
            border: "border-cyan-200",
            label: "On Duty",
          };
        case "Off":
          return {
            bg: "bg-gray-100",
            text: "text-gray-800",
            border: "border-gray-200",
            label: "Off",
          };
        case "Holiday Off":
          return {
            bg: "bg-orange-100",
            text: "text-orange-800",
            border: "border-orange-200",
            label: "Holiday Off",
          };
        case "Leave":
          return {
            bg: "bg-yellow-100",
            text: "text-yellow-800",
            border: "border-yellow-200",
            label: "Leave",
          };
        case "Absent":
          return {
            bg: "bg-red-100",
            text: "text-red-800",
            border: "border-red-200",
            label: "Absent",
          };
        // Legacy status handling for backward compatibility
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
        case "Incomplete":
          return {
            bg: "bg-orange-100",
            text: "text-orange-800",
            border: "border-orange-200",
            label: "Incomplete",
          };
        case "No Show":
          return {
            bg: "bg-red-100",
            text: "text-red-800",
            border: "border-red-200",
            label: "No Show",
          };
        case "Scheduled":
          return {
            bg: "bg-indigo-100",
            text: "text-indigo-800",
            border: "border-indigo-200",
            label: "Scheduled",
          };
        default:
          return {
            bg: "bg-purple-100",
            text: "text-purple-800",
            border: "border-purple-200",
            label: status || "Others", // Use the actual status from backend or "Others" as fallback
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
  const TimeDisplay = ({
    time,
    type = "in",
    attendance,
    timeType,
    source, // New parameter for source tracking
    manualId = null, // Manual attendance ID for update
    showManualOption = false,
  }) => {
    if (!time) {
      // Show clickable empty slot for manual attendance if conditions are met
      if (showManualOption && isManualAttendanceAllowed(attendance, timeType)) {
        return (
          <button
            onClick={() => handleManualAttendanceClick(attendance, timeType)}
            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors border border-dashed border-gray-300 hover:border-blue-400"
            title="Click to add manual attendance"
          >
            --:-- ✏️
          </button>
        );
      }
      return <span className="text-gray-400">--:--</span>;
    }

    // Use formatDateTimeToTimePH for DateTime objects (ISO strings with date and time)
    // Use formatTimeTo12HourPH for time-only values (HH:mm format)
    const formattedTime =
      typeof time === "string" && time.includes("T")
        ? formatDateTimeToTimePH(time)
        : formatTimeTo12HourPH(time);

    const colorClass = type === "in" ? "text-green-600" : "text-red-600";

    // Determine source indicator and styling
    const getSourceIndicator = (source) => {
      if (!source) return null;

      const sourceType = source.toLowerCase();

      if (sourceType === "manual") {
        return {
          label: "M",
          className: "bg-amber-100 text-amber-800 border-amber-200",
          title: "Manual entry",
        };
      } else if (sourceType === "biometric") {
        return {
          label: "B",
          className: "bg-emerald-100 text-emerald-800 border-emerald-200",
          title: "Biometric scan",
        };
      }

      return null;
    };

    const sourceIndicator = getSourceIndicator(source);
    const isManualEntry = source && source.toLowerCase() === "manual";

    // Handle click for manual entries (edit functionality)
    const handleManualEditClick = () => {
      if (isManualEntry) {
        // Extract time from the full datetime for editing
        const timeValue =
          typeof time === "string" && time.includes("T")
            ? new Date(time).toTimeString().slice(0, 5)
            : time;

        setManualAttendanceModal({
          isOpen: true,
          attendance,
          timeType,
          mode: "update",
          existingTime: timeValue,
          existingRemarks: "", // You might want to fetch this from the manual log
          manualId: manualId || `temp-${Date.now()}`, // Temporary ID if missing
        });
      }
    };

    return (
      <div className="flex items-center">
        <span className={`text-sm ${colorClass} font-medium`}>
          {formattedTime}
        </span>
        {sourceIndicator && (
          <>
            {isManualEntry ? (
              // Show M badge for manual entries, pen icon only if editing is allowed
              <div className="flex items-center ml-1">
                {/* Original M badge */}
                <span
                  className={`inline-flex items-center justify-center w-4 h-4 text-xs font-semibold rounded-full border ${sourceIndicator.className}`}
                  title={sourceIndicator.title}
                >
                  {sourceIndicator.label}
                </span>
                {/* Pen icon for editing - only show if allowed */}
                {isManualAttendanceAllowed(attendance, timeType) && (
                  <button
                    onClick={handleManualEditClick}
                    className="inline-flex items-center justify-center w-4 h-4 text-xs font-semibold rounded-full border ml-1 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:border-blue-300 cursor-pointer transition-colors"
                    title="Click to edit manual entry"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2.5 w-2.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <span
                className={`inline-flex items-center justify-center w-4 h-4 text-xs font-semibold rounded-full border ml-1 ${sourceIndicator.className}`}
                title={sourceIndicator.title}
              >
                {sourceIndicator.label}
              </span>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Don't show any content if no employeeId (user not logged in) */}

      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 truncate">
              {headerContent.title}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              {headerContent.description}
            </p>
            {selectedDepartment && departments && !isIndividualView && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs uppercase font-medium bg-blue-600 text-white max-w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.80a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>

                {departments.find((dept) => dept._id === selectedDepartment)
                  ?.name || "Department"}
              </div>
            )}
          </div>

          {/* Month Navigation - Only show when duty schedules are available */}
          {availableDutySchedules.length > 0 && (
            <div className="flex flex-col items-end gap-3 mx-4">
              <div className="flex items-center gap-2">
                {canNavigatePrevious() && (
                  <button
                    onClick={handlePrevMonth}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded font-medium transition-all text-sm flex items-center gap-1"
                    disabled={loading}
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>
                )}
                <span className="text-lg font-semibold text-white mx-2 whitespace-nowrap">
                  {availableDutySchedules[currentScheduleIndex]
                    ? (() => {
                        const currentSchedule =
                          availableDutySchedules[currentScheduleIndex];

                        // Use monthSchedule field (YYYY-MM format) instead of parsing startDate
                        if (currentSchedule.monthSchedule) {
                          const [year, month] =
                            currentSchedule.monthSchedule.split("-");
                          const monthDate = new Date(
                            parseInt(year),
                            parseInt(month) - 1,
                            15
                          ); // month is 0-based in Date()
                          const monthLabel = getMonthLabelPH(monthDate);
                          return monthLabel;
                        } else {
                          // Fallback to startDate parsing if monthSchedule is not available
                          const scheduleDate = parseDatePH(
                            currentSchedule.startDate
                          );
                          scheduleDate.setDate(15);
                          const monthLabel = getMonthLabelPH(scheduleDate);
                          return monthLabel;
                        }
                      })()
                    : getMonthLabelPH(currentDate)}
                </span>
                {canNavigateNext() && (
                  <button
                    onClick={handleNextMonth}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded font-medium transition-all text-sm flex items-center gap-1"
                    disabled={loading}
                  >
                    Next
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Duty Schedule Info */}
              {availableDutySchedules[currentScheduleIndex] && (
                <div className="text-xs text-blue-100 text-right">
                  <div>
                    Period:{" "}
                    {formatDatePH(
                      availableDutySchedules[currentScheduleIndex].startDate,
                      "MMM D"
                    )}{" "}
                    -{" "}
                    {formatDatePH(
                      availableDutySchedules[currentScheduleIndex].endDate,
                      "MMM D, YYYY"
                    )}
                  </div>
                  <div className="opacity-75">
                    Schedule:{" "}
                    {availableDutySchedules[currentScheduleIndex].name}
                  </div>
                  {availableDutySchedules.length > 1 ? (
                    <div className="opacity-75 text-xs flex items-center justify-between">
                      <span>
                        ({currentScheduleIndex + 1} of{" "}
                        {availableDutySchedules.length} available)
                      </span>
                      {userRole?.toLowerCase() === "manager" && (
                        <button
                          onClick={() => setManagerEditModalOpen(true)}
                          className="text-white/80 hover:text-white ml-2 p-1 rounded transition-colors"
                          title="Edit Schedule"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="opacity-75 text-xs flex items-center justify-between">
                      <span>Current available schedule</span>
                      {userRole?.toLowerCase() === "manager" && (
                        <button
                          onClick={() => setManagerEditModalOpen(true)}
                          className="text-white/80 hover:text-white ml-2 p-1 rounded transition-colors"
                          title="Edit Schedule"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="hidden sm:block flex-shrink-0">
            <div className="bg-white/10 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Department Selector - Always show when managed departments exist */}
      {departments && departments.length > 0 && !isIndividualView && (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
          <EmployeeSearchFrontend
            setPerpage={handlePerPageChange}
            perPage={perPage}
            setSearchValue={handleSearchValueChange}
            searchValue={searchValue}
            inputPlaceholder={
              availableDutySchedules.length > 0
                ? "Search by employee name..."
                : "No duty schedules available - search disabled"
            }
            employees={availableDutySchedules.length > 0 ? employees : []} // Pass empty array when no duty schedules
            loading={loading}
            departments={departments || []}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDepartmentChange}
            showEmptySelectOptionValue={false} // Hide empty select option value
          />

          {/* Search Results Info - Only show when search is active and duty schedules exist */}
          {searchValue && availableDutySchedules.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">
                  {(() => {
                    // Check if searchValue is an employee ID (24-character MongoDB ObjectId)
                    const isEmployeeId =
                      searchValue.length === 24 &&
                      /^[0-9a-fA-F]{24}$/.test(searchValue);

                    if (isEmployeeId) {
                      // Find employee name from the employees array
                      if (employees && employees.length > 0) {
                        const selectedEmployee = employees.find(
                          (emp) => emp._id === searchValue
                        );
                        if (
                          selectedEmployee &&
                          selectedEmployee.personalInformation
                        ) {
                          const { firstName, lastName, middleName } =
                            selectedEmployee.personalInformation;
                          const employeeName = `${firstName || ""} ${
                            middleName ? middleName + " " : ""
                          }${lastName || ""}`.trim();
                          return (
                            <>
                              Showing records for:{" "}
                              <strong>{employeeName}</strong>
                            </>
                          );
                        }
                      }
                      return <>Showing records for selected employee</>;
                    } else {
                      // Regular text search
                      return (
                        <>
                          Showing results for: "<strong>{searchValue}</strong>"
                        </>
                      );
                    }
                  })()}
                </span>
                <span className="text-blue-600">
                  {totalFilteredAttendance} record
                  {totalFilteredAttendance !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show message when department is selected but no duty schedules are available */}
      {selectedDepartment &&
        availableDutySchedules.length === 0 &&
        !loading && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-amber-400 mr-2">📅</div>
              <div>
                <h3 className="text-amber-800 font-medium">
                  No Duty Schedules Available
                </h3>
                <p className="text-amber-700 text-sm mt-1">
                  No approved duty schedules found for the selected department.
                  Employee attendance search is disabled until duty schedules
                  are available. Please ensure duty schedules are created and
                  approved for this department.
                </p>
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

      {/* Show message when user has no managed departments */}
      {!loading &&
        departments &&
        departments.length === 0 &&
        !isIndividualView && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-amber-400 mr-2">ℹ️</div>
              <div>
                <h3 className="text-amber-800 font-medium">
                  No Managed Departments
                </h3>
                <p className="text-amber-700 text-sm mt-1">
                  You currently don't have any departments assigned to manage.
                  Please contact your system administrator to assign department
                  management permissions to your account.
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Loading Spinner - Show when any data is loading */}
      <LoadingIndicator isLoading={loading} />

      {/* Show table when we have data OR when we're ready to show "no records" */}
      {!loading && attendances && attendances.length > 0 ? (
        <>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            {/* Summary Stats */}
            {attendances && attendances.length > 0 && !loading && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 text-sm">
                  {/* Duty */}
                  {(() => {
                    const count = attendances.filter(
                      (a) => a.status === "Duty"
                    ).length;
                    return count > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">
                          Duty:{" "}
                          <span className="font-semibold text-blue-700">
                            {count}
                          </span>
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* On Duty */}
                  {(() => {
                    const count = attendances.filter(
                      (a) => a.status === "On Duty"
                    ).length;
                    return count > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">
                          On Duty:{" "}
                          <span className="font-semibold text-cyan-700">
                            {count}
                          </span>
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Off */}
                  {(() => {
                    const count = attendances.filter(
                      (a) => a.status === "Off"
                    ).length;
                    return count > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">
                          Off:{" "}
                          <span className="font-semibold text-gray-700">
                            {count}
                          </span>
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Holiday Off */}
                  {(() => {
                    const count = attendances.filter(
                      (a) => a.status === "Holiday Off"
                    ).length;
                    return count > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">
                          Holiday Off:{" "}
                          <span className="font-semibold text-orange-700">
                            {count}
                          </span>
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Leave */}
                  {(() => {
                    const count = attendances.filter(
                      (a) => a.status === "Leave"
                    ).length;
                    return count > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">
                          Leave:{" "}
                          <span className="font-semibold text-yellow-700">
                            {count}
                          </span>
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Absent */}
                  {(() => {
                    const count = attendances.filter(
                      (a) => a.status === "Absent"
                    ).length;
                    return count > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">
                          Absent:{" "}
                          <span className="font-semibold text-red-700">
                            {count}
                          </span>
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Others */}
                  {(() => {
                    const count = attendances.filter(
                      (a) =>
                        ![
                          "Duty",
                          "On Duty",
                          "Off",
                          "Holiday Off",
                          "Leave",
                          "Absent",
                        ].includes(a.status)
                    ).length;
                    return count > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">
                          Others:{" "}
                          <span className="font-semibold text-purple-700">
                            {count}
                          </span>
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Total Count */}
                  <div className="flex items-center gap-2 border-l border-gray-300 pl-4 col-span-2 sm:col-span-1">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Total:{" "}
                      <span className="font-semibold text-indigo-700">
                        {attendances.length}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Table Header - only show on large screens */}
            {attendances && attendances.length > 0 && (
              <div className="hidden lg:block bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                <div
                  className="grid gap-2 text-sm font-semibold text-gray-700"
                  style={{
                    gridTemplateColumns:
                      "2fr 1fr 1.2fr 1.3fr 1.3fr 1fr 1fr 1fr",
                  }}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Employee
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Date
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Schedule
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Time In
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-red-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Time Out
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Status
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Late Minutes
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Remarks
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Card View - show on small/medium screens */}
            <div className="lg:hidden">
              {attendances && attendances.length > 0
                ? attendances
                    .slice((currentPage - 1) * perPage, currentPage * perPage)
                    .map((attendance, idx) => (
                      <div
                        key={
                          attendance._id ||
                          `${attendance.datePH || attendance.date}-${idx}`
                        }
                        className={`p-4 border-b border-gray-200 last:border-b-0 transition-colors ${getRowBackgroundColor(
                          attendance,
                          holidays
                        )}`}
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-3">
                          {/* Employee Info Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-bold text-sm">
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
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 text-base truncate">
                                {attendance.employeeName || "N/A"}
                              </div>
                              <div className="text-sm text-gray-600">
                                ID: {attendance.hospitalEmployeeId || "N/A"}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <StatusBadge
                                status={attendance.status || "Unknown"}
                                lateMinutes={attendance.lateMinutes || 0}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Attendance Details Grid */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {/* Date */}
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium text-gray-700">
                                Date
                              </span>
                            </div>
                            <div className="font-semibold text-gray-900">
                              {formatDatePH(
                                attendance.datePH || attendance.date,
                                "MMM D, YYYY"
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDatePH(
                                attendance.datePH || attendance.date,
                                "dddd"
                              )}
                            </div>
                            {(() => {
                              const holidayInfo = getHolidayInfo(
                                attendance,
                                holidays
                              );
                              return holidayInfo ? (
                                <div className="mt-2">
                                  <div className="text-xs font-semibold text-red-600 capitalize">
                                    {getHolidayNameWithAbbreviation(
                                      holidayInfo
                                    )}
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>

                          {/* Schedule */}
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium text-gray-700">
                                Schedule
                              </span>
                            </div>
                            <ScheduleDisplay
                              attendance={attendance}
                              isDesktop={false}
                            />
                          </div>

                          {/* Time In */}
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-green-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium text-gray-700">
                                Time In
                              </span>
                            </div>
                            <div>
                              {attendance.shiftTemplate?.type === "Standard" ? (
                                <div className="space-y-1">
                                  {/* Morning In - Always show for Standard */}
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-white font-medium bg-sky-500 px-1 py-0.5 rounded flex items-center gap-0.5">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 text-yellow-200"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      AM
                                    </span>
                                    <TimeDisplay
                                      time={attendance.morningInLog}
                                      type="in"
                                      attendance={attendance}
                                      timeType="morningIn"
                                      source={attendance.morningInLogSource}
                                      manualId={attendance.morningInLogManualId}
                                      showManualOption={true}
                                    />
                                  </div>
                                  {/* Afternoon In - Always show for Standard */}
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-white font-medium bg-amber-500 px-1 py-0.5 rounded flex items-center gap-0.5">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 text-blue-200"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                      </svg>
                                      PM
                                    </span>
                                    <TimeDisplay
                                      time={attendance.afternoonInLog}
                                      type="in"
                                      attendance={attendance}
                                      timeType="afternoonIn"
                                      source={attendance.afternoonInLogSource}
                                      manualId={
                                        attendance.afternoonInLogManualId
                                      }
                                      showManualOption={true}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <TimeDisplay
                                  time={attendance.timeIn}
                                  type="in"
                                  attendance={attendance}
                                  timeType="timeIn"
                                  source={attendance.timeInSource}
                                  manualId={attendance.timeInManualId}
                                  showManualOption={true}
                                />
                              )}
                            </div>
                          </div>

                          {/* Time Out */}
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-red-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium text-gray-700">
                                Time Out
                              </span>
                            </div>
                            <div>
                              {attendance.shiftTemplate?.type === "Standard" ? (
                                <div className="space-y-1">
                                  {/* Morning Out - Always show for Standard */}
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-white font-medium bg-sky-500 px-1 py-0.5 rounded flex items-center gap-0.5">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 text-yellow-200"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      AM
                                    </span>
                                    <TimeDisplay
                                      time={attendance.morningOutLog}
                                      type="out"
                                      attendance={attendance}
                                      timeType="morningOut"
                                      source={attendance.morningOutLogSource}
                                      manualId={
                                        attendance.morningOutLogManualId
                                      }
                                      showManualOption={true}
                                    />
                                  </div>
                                  {/* Afternoon Out - Always show for Standard */}
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-white font-medium bg-amber-500 px-1 py-0.5 rounded flex items-center gap-0.5">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 text-blue-200"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                      </svg>
                                      PM
                                    </span>
                                    <TimeDisplay
                                      time={attendance.afternoonOutLog}
                                      type="out"
                                      attendance={attendance}
                                      timeType="afternoonOut"
                                      source={attendance.afternoonOutLogSource}
                                      manualId={
                                        attendance.afternoonOutLogManualId
                                      }
                                      showManualOption={true}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <TimeDisplay
                                  time={attendance.timeOut}
                                  type="out"
                                  attendance={attendance}
                                  timeType="timeOut"
                                  source={attendance.timeOutSource}
                                  manualId={attendance.timeOutManualId}
                                  showManualOption={true}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Late Minutes & Remarks - Full Width */}
                        {(attendance.morningLateMinutes > 0 ||
                          attendance.afternoonLateMinutes > 0 ||
                          attendance.remarks) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            {/* Late Minutes */}
                            {(attendance.morningLateMinutes > 0 ||
                              attendance.afternoonLateMinutes > 0) && (
                              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-red-600"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="font-medium text-red-800">
                                    Late Minutes
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {attendance.morningLateMinutes > 0 && (
                                    <div className="text-sm text-red-700 font-semibold">
                                      <span className="text-xs text-white font-medium bg-sky-500 px-1 py-0.5 rounded mr-2 inline-flex items-center gap-0.5">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 text-yellow-200"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        AM
                                      </span>
                                      {attendance.morningLateMinutes}m
                                    </div>
                                  )}
                                  {attendance.afternoonLateMinutes > 0 && (
                                    <div className="text-sm text-red-700 font-semibold">
                                      <span className="text-xs text-white font-medium bg-amber-500 px-1 py-0.5 rounded mr-2 inline-flex items-center gap-0.5">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 text-blue-200"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                        </svg>
                                        PM
                                      </span>
                                      {attendance.afternoonLateMinutes}m
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Remarks */}
                            {attendance.remarks && (
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-blue-600"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="font-medium text-blue-800">
                                    Remarks
                                  </span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">
                                    Remarks:
                                  </span>
                                  <div className="mt-1">
                                    <RemarksDisplay
                                      remarks={attendance.remarks}
                                      employeeName={attendance.employeeName}
                                      date={
                                        attendance.datePH || attendance.date
                                      }
                                      schedule={attendance.shiftTemplate}
                                      onShowMore={(remarksData) =>
                                        setRemarksModal({
                                          isOpen: true,
                                          data: remarksData,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                : null}
            </div>

            {/* Desktop Table Body - show on large screens */}
            <div className="hidden lg:block divide-y divide-gray-200">
              {attendances && attendances.length > 0
                ? // Show data
                  attendances
                    .slice((currentPage - 1) * perPage, currentPage * perPage)
                    .map((attendance, idx) => (
                      <div
                        key={
                          attendance._id ||
                          `${attendance.datePH || attendance.date}-${idx}`
                        }
                        className={`px-6 py-4 transition-colors ${getRowBackgroundColor(
                          attendance,
                          holidays
                        )}`}
                      >
                        <div
                          className="grid gap-4 items-center text-sm"
                          style={{
                            gridTemplateColumns:
                              "2fr 1fr 1.2fr 1.3fr 1.3fr 1fr 1fr 1fr",
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
                            {(() => {
                              const holidayInfo = getHolidayInfo(
                                attendance,
                                holidays
                              );
                              return holidayInfo ? (
                                <div className="mt-1">
                                  <div className="text-xs font-semibold text-red-600 capitalize">
                                    {getHolidayNameWithAbbreviation(
                                      holidayInfo
                                    )}
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>

                          {/* Schedule */}
                          <div className="text-gray-700">
                            <ScheduleDisplay
                              attendance={attendance}
                              isDesktop={true}
                            />
                          </div>

                          {/* Time In */}
                          <div>
                            {attendance.shiftTemplate?.type === "Standard" ? (
                              // For Standard shifts, show morning and afternoon separately
                              <div className="space-y-1">
                                {/* Morning In - Always show for Standard */}
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-white font-medium bg-sky-500 px-1 py-0.5 rounded flex items-center gap-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 text-yellow-200"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    AM
                                  </span>
                                  <TimeDisplay
                                    time={attendance.morningInLog}
                                    type="in"
                                    attendance={attendance}
                                    timeType="morningIn"
                                    source={attendance.morningInLogSource}
                                    manualId={attendance.morningInLogManualId}
                                    showManualOption={true}
                                  />
                                </div>
                                {/* Afternoon In - Always show for Standard */}
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-white font-medium bg-amber-500 px-1 py-0.5 rounded flex items-center gap-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 text-blue-200"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                    PM
                                  </span>
                                  <TimeDisplay
                                    time={attendance.afternoonInLog}
                                    type="in"
                                    attendance={attendance}
                                    timeType="afternoonIn"
                                    source={attendance.afternoonInLogSource}
                                    manualId={attendance.afternoonInLogManualId}
                                    showManualOption={true}
                                  />
                                </div>
                              </div>
                            ) : (
                              // For Shifting shifts, show single time in
                              <TimeDisplay
                                time={attendance.timeIn}
                                type="in"
                                attendance={attendance}
                                timeType="timeIn"
                                source={attendance.timeInSource}
                                manualId={attendance.timeInManualId}
                                showManualOption={true}
                              />
                            )}
                          </div>

                          {/* Time Out */}
                          <div>
                            {attendance.shiftTemplate?.type === "Standard" ? (
                              // For Standard shifts, show morning and afternoon separately
                              <div className="space-y-1">
                                {/* Morning Out - Always show for Standard */}
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-white font-medium bg-sky-500 px-1 py-0.5 rounded flex items-center gap-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 text-yellow-200"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    AM
                                  </span>
                                  <TimeDisplay
                                    time={attendance.morningOutLog}
                                    type="out"
                                    attendance={attendance}
                                    timeType="morningOut"
                                    source={attendance.morningOutLogSource}
                                    manualId={attendance.morningOutLogManualId}
                                    showManualOption={true}
                                  />
                                </div>
                                {/* Afternoon Out - Always show for Standard */}
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-white font-medium bg-amber-500 px-1 py-0.5 rounded flex items-center gap-0.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 text-blue-200"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                    PM
                                  </span>
                                  <TimeDisplay
                                    time={attendance.afternoonOutLog}
                                    type="out"
                                    attendance={attendance}
                                    timeType="afternoonOut"
                                    source={attendance.afternoonOutLogSource}
                                    manualId={
                                      attendance.afternoonOutLogManualId
                                    }
                                    showManualOption={true}
                                  />
                                </div>
                              </div>
                            ) : (
                              // For Shifting shifts, show single time out
                              <TimeDisplay
                                time={attendance.timeOut}
                                type="out"
                                attendance={attendance}
                                timeType="timeOut"
                                source={attendance.timeOutSource}
                                manualId={attendance.timeOutManualId}
                                showManualOption={true}
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
                                  <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                                    <span className="text-xs text-white font-medium bg-sky-500 px-1 py-0.5 rounded inline-flex items-center gap-0.5">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 text-yellow-200"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      AM
                                    </span>
                                    <span>
                                      {attendance.morningLateMinutes}m
                                    </span>
                                  </div>
                                )}
                                {attendance.afternoonLateMinutes > 0 && (
                                  <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                                    <span className="text-xs text-white font-medium bg-amber-500 px-1 py-0.5 rounded flex items-center gap-0.5">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 text-blue-200"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                      </svg>
                                      PM
                                    </span>
                                    <span>
                                      {attendance.afternoonLateMinutes}m
                                    </span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">--</span>
                            )}
                          </div>

                          {/* Remarks */}
                          <div>
                            <RemarksDisplay
                              remarks={attendance.remarks}
                              employeeName={attendance.employeeName}
                              date={attendance.datePH || attendance.date}
                              schedule={attendance.shiftTemplate}
                              onShowMore={(remarksData) =>
                                setRemarksModal({
                                  isOpen: true,
                                  data: remarksData,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))
                : null}
            </div>

            {/* Pagination */}
            {attendances && attendances.length > perPage && (
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Results Summary */}
                  <div className="flex items-center justify-center sm:justify-start text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-center sm:text-left">
                        <span className="font-medium text-blue-700">
                          {attendances.length === 0
                            ? 0
                            : (currentPage - 1) * perPage + 1}
                        </span>
                        -
                        <span className="font-medium text-blue-700">
                          {Math.min(currentPage * perPage, attendances.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-blue-700">
                          {attendances.length}
                        </span>{" "}
                        records
                      </span>
                    </div>
                  </div>

                  {/* Page Navigation */}
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3">
                    <span className="text-sm text-gray-600 text-center sm:text-right order-2 sm:order-1">
                      Page {currentPage} of{" "}
                      {Math.ceil(attendances.length / perPage)}
                    </span>
                    <div className="order-1 sm:order-2">
                      <Pagination
                        pageNumber={currentPage}
                        setPageNumber={handlePageChange}
                        totalItem={attendances.length}
                        perPage={perPage}
                        showItem={Math.min(
                          3, // Show fewer items on mobile
                          Math.ceil(attendances.length / perPage)
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        !loading &&
        (selectedDepartment || isIndividualView) && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-12 text-center">
              <div className="text-blue-400 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No attendance records found
              </h3>
              <p className="text-gray-500">
                {isIndividualView
                  ? "No attendance records found for your account. Please check back later or contact your administrator if you believe this is an error."
                  : "No attendance records found for the selected department."}
              </p>
            </div>
          </div>
        )
      )}

      {/* Manual Attendance Modal */}
      <ManualAttendanceModal
        isOpen={manualAttendanceModal.isOpen}
        onClose={handleCloseManualAttendanceModal}
        attendance={manualAttendanceModal.attendance}
        timeType={manualAttendanceModal.timeType}
        onSuccess={handleManualAttendanceSuccess}
        mode={manualAttendanceModal.mode}
        existingTime={manualAttendanceModal.existingTime}
        existingRemarks={manualAttendanceModal.existingRemarks}
        manualId={manualAttendanceModal.manualId}
      />

      {/* Remarks Modal */}
      {remarksModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Remarks Details
              </h3>
              <button
                onClick={() => setRemarksModal({ isOpen: false, data: {} })}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {remarksModal.data.employeeName && (
                <div>
                  <span className="text-sm text-gray-500">Employee:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {remarksModal.data.employeeName}
                  </p>
                </div>
              )}

              {remarksModal.data.date && (
                <div>
                  <span className="text-sm text-gray-500">Date:</span>
                  <p className="text-sm font-medium text-gray-900">
                    {remarksModal.data.date}
                  </p>
                </div>
              )}

              {remarksModal.data.schedule && (
                <div>
                  <span className="text-sm text-gray-500">Schedule:</span>
                  <div className="text-sm font-medium text-gray-900">
                    {remarksModal.data.schedule.type === "Standard" ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white font-medium bg-sky-500 px-2 py-0.5 rounded flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-yellow-200"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            AM
                          </span>
                          <span>
                            {formatTimeTo12HourPH(
                              remarksModal.data.schedule.morningIn
                            )}{" "}
                            -{" "}
                            {formatTimeTo12HourPH(
                              remarksModal.data.schedule.morningOut
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white font-medium bg-amber-500 px-2 py-0.5 rounded flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-blue-200"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                            PM
                          </span>
                          <span>
                            {formatTimeTo12HourPH(
                              remarksModal.data.schedule.afternoonIn
                            )}{" "}
                            -{" "}
                            {formatTimeTo12HourPH(
                              remarksModal.data.schedule.afternoonOut
                            )}
                          </span>
                        </div>
                      </div>
                    ) : remarksModal.data.schedule.type === "Shifting" ? (
                      <div className="flex items-center gap-2">
                        <span>
                          {formatTimeTo12HourPH(
                            remarksModal.data.schedule.startTime
                          )}{" "}
                          -{" "}
                          {formatTimeTo12HourPH(
                            remarksModal.data.schedule.endTime
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white font-medium bg-purple-500 px-2 py-0.5 rounded">
                          {remarksModal.data.schedule.type || "Unknown"}
                        </span>
                        <span>
                          {remarksModal.data.schedule.timeIn &&
                          remarksModal.data.schedule.timeOut
                            ? `${remarksModal.data.schedule.timeIn} - ${remarksModal.data.schedule.timeOut}`
                            : "No schedule details"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <span className="text-sm text-gray-500">Remarks:</span>
                <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                  {remarksModal.data.remarks}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setRemarksModal({ isOpen: false, data: {} })}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manager Edit Schedule Modal */}
      {managerEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Duty Schedule
              </h2>
              <button
                onClick={() => setManagerEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <DutyScheduleForm
                departmentId={selectedDepartment?._id}
                scheduleId={
                  availableDutySchedules &&
                  availableDutySchedules[currentScheduleIndex]?._id
                }
                isHrApprovedUpdate={true}
                onClose={() => setManagerEditModalOpen(false)}
                onSuccess={() => {
                  // Close modal first, then refresh data from parent
                  setManagerEditModalOpen(false);
                  // Call parent's refresh function if provided
                  if (onManualAttendanceSuccess) {
                    onManualAttendanceSuccess();
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;
