import React from "react";
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

  // View type - determines if this is individual employee view
  isIndividualView = false,

  // User role - determines header content based on role
  userRole = "manager", // Options: "manager", "director", "hr", "employee"
}) => {
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
            "Monitor and manage attendance records across all company departments",
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
        case "Present":
          return {
            bg: "bg-green-100",
            text: "text-green-800",
            border: "border-green-200",
            label: "Present",
          };
        case "On Duty":
          return {
            bg: "bg-blue-100",
            text: "text-blue-800",
            border: "border-blue-200",
            label: "On Duty",
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
            bg: "bg-gray-100",
            text: "text-gray-800",
            border: "border-gray-200",
            label: status || "Unknown", // Use the actual status from backend or "Unknown" as fallback
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

    return <span className={` text-sm ${colorClass}`}>{formattedTime}</span>;
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
                    <div className="opacity-75 text-xs">
                      <span>
                        ({currentScheduleIndex + 1} of{" "}
                        {availableDutySchedules.length} available)
                      </span>
                    </div>
                  ) : (
                    <div className="opacity-75 text-xs">
                      <span>Current available schedule</span>
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
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Present:{" "}
                      <span className="font-semibold text-green-700">
                        {
                          attendances.filter((a) => {
                            return a.status === "Present";
                          }).length
                        }
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Late:{" "}
                      <span className="font-semibold text-yellow-700">
                        {
                          attendances.filter((a) => {
                            return a.status === "Late";
                          }).length
                        }
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Absent:{" "}
                      <span className="font-semibold text-red-700">
                        {
                          attendances.filter((a) => {
                            return a.status === "Absent";
                          }).length
                        }
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Off:{" "}
                      <span className="font-semibold text-gray-700">
                        {
                          attendances.filter((a) => {
                            return a.status === "Off";
                          }).length
                        }
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">
                      On Duty:{" "}
                      <span className="font-semibold text-blue-700">
                        {
                          attendances.filter((a) => {
                            return a.status === "On Duty";
                          }).length
                        }
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Other:{" "}
                      <span className="font-semibold text-orange-700">
                        {
                          attendances.filter((a) => {
                            return (
                              a.status === "Incomplete" ||
                              a.status === "No Show" ||
                              a.status === "Scheduled" ||
                              ![
                                "Present",
                                "Late",
                                "Absent",
                                "Off",
                                "On Duty",
                              ].includes(a.status)
                            );
                          }).length
                        }
                      </span>
                    </span>
                  </div>
                  {/* Total Count */}
                  <div className="flex items-center gap-2 border-l border-gray-300 pl-4 col-span-2 sm:col-span-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">
                      Total:{" "}
                      <span className="font-semibold text-blue-700">
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
                    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
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
                        className="p-4 border-b border-gray-200 last:border-b-0"
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
                            <div className="font-semibold text-gray-900">
                              {attendance.scheduleString ||
                                (attendance.dutySchedule &&
                                attendance.dutySchedule[0]?.workSchedule
                                  ? `${formatTimeTo12HourPH(
                                      attendance.dutySchedule[0].workSchedule
                                        .startTime
                                    )} - ${formatTimeTo12HourPH(
                                      attendance.dutySchedule[0].workSchedule
                                        .endTime
                                    )}`
                                  : attendance.status === "Off"
                                  ? "Off"
                                  : "-")}
                            </div>
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
                              {attendance.shiftType === "Standard" ? (
                                <div className="space-y-1">
                                  {attendance.morningInLog && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-gray-600 font-medium min-w-[65px]">
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
                                      <span className="text-xs text-gray-600 font-medium min-w-[65px]">
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
                                        time={attendance.timeIn}
                                        type="in"
                                      />
                                    )}
                                </div>
                              ) : (
                                <TimeDisplay
                                  time={attendance.timeIn}
                                  type="in"
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
                              {attendance.shiftType === "Standard" ? (
                                <div className="space-y-1">
                                  {attendance.morningOutLog && (
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs text-gray-600 font-medium min-w-[65px]">
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
                                      <span className="text-xs text-gray-600 font-medium min-w-[65px]">
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
                                        time={attendance.timeOut}
                                        type="out"
                                      />
                                    )}
                                </div>
                              ) : (
                                <TimeDisplay
                                  time={attendance.timeOut}
                                  type="out"
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
                                      Morning: {attendance.morningLateMinutes}m
                                    </div>
                                  )}
                                  {attendance.afternoonLateMinutes > 0 && (
                                    <div className="text-sm text-red-700 font-semibold">
                                      Afternoon:{" "}
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
                                <div className="text-sm text-blue-700">
                                  {attendance.remarks}
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
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className="grid gap-4 items-center text-sm"
                          style={{
                            gridTemplateColumns:
                              "2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
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
                                    attendance.dutySchedule[0].workSchedule
                                      .endTime
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
                                      time={attendance.timeIn}
                                      type="in"
                                    />
                                  )}
                              </div>
                            ) : (
                              // For Shifting shifts, show single time in
                              <TimeDisplay time={attendance.timeIn} type="in" />
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
                                      time={attendance.timeOut}
                                      type="out"
                                    />
                                  )}
                              </div>
                            ) : (
                              // For Shifting shifts, show single time out
                              <TimeDisplay
                                time={attendance.timeOut}
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
                                    Afternoon: {attendance.afternoonLateMinutes}
                                    m
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
    </div>
  );
};

export default EmployeeAttendance;
