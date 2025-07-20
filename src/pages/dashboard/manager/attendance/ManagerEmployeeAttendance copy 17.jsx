import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendanceByDepartment } from "../../../../store/Reducers/attendanceReducer";
import {
  formatDatePH,
  getTodayDatePH,
  formatTimeTo12HourPH,
  formatDateTimeToTimePH,
  convertDatePHToUTCISO,
} from "../../../../utils/phDateUtils";
import {
  fetchEmployeesByDepartment,
  fetchManagedDepartments,
} from "../../../../store/Reducers/employeeReducer";
import { fetchDutyScheduleByDepartmentAndDate } from "../../../../store/Reducers/dutyScheduleReducer";
import Pagination from "../../../../components/Pagination";
import EmployeeSearchFrontend from "../../../../components/EmployeeSearchFrontend";
import LoadingIndicator from "../../../../components/LoadingIndicator";

const ManagerEmployeeAttendance = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.employee?._id;

  const { loading: departmentLoading, managedDepartments } = useSelector(
    (state) => state.employee
  );

  const { dutySchedule, loading: dutyScheduleLoading } = useSelector(
    (state) => state.dutySchedule
  );

  const {
    attendances,
    loading: attendanceLoading,
    errorMessage,
  } = useSelector((state) => state.attendance);

  const { employees, loading: employeesLoading } = useSelector(
    (state) => state.employee
  );

  const loading =
    attendanceLoading ||
    dutyScheduleLoading ||
    employeesLoading ||
    departmentLoading;

  // Simplified state variables - remove all loading states
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(10);

  const [originalAttendances, setOriginalAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [totalFilteredAttendance, setTotalFilteredAttendance] = useState(0);

  // Fetch managed departments inn first render
  useEffect(() => {
    if (!employeeId) return;

    dispatch(fetchManagedDepartments(employeeId));
  }, [employeeId, dispatch]);

  // Handle page changes
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Auto-select first department in first render or page load
  useEffect(() => {
    if (managedDepartments && managedDepartments.length > 0) {
      setSelectedDepartment(managedDepartments[0]._id);
    }
  }, [managedDepartments]);

  // if have selected department,
  useEffect(() => {
    if (!selectedDepartment) return;

    getDutyScheduleAndEmployeesByDepartment(selectedDepartment);
  }, [dispatch, selectedDepartment]);

  //
  useEffect(() => {
    if (!dutySchedule?._id) return;

    setOriginalAttendances([]);
    setFilteredAttendances([]);
    setTotalFilteredAttendance(0);

    dispatch(
      fetchAttendanceByDepartment({
        scheduleId: dutySchedule._id,
      })
    );
  }, [dispatch, dutySchedule]);

  // if have attendances, set them to original and filtered
  useEffect(() => {
    if (!attendances) return;

    setOriginalAttendances(attendances);
    setFilteredAttendances(attendances);
    setTotalFilteredAttendance(attendances.length);
  }, [dispatch, attendances]);

  // Search filtering effect
  useEffect(() => {
    if (originalAttendances && originalAttendances.length > 0) {
      let filteredData = [...originalAttendances];

      if (searchValue && searchValue.trim() !== "") {
        const isEmployeeId =
          searchValue.length === 24 && /^[0-9a-fA-F]{24}$/.test(searchValue);

        if (isEmployeeId) {
          const searchId = searchValue.toString();
          filteredData = filteredData.filter((record) => {
            return (
              record &&
              record.employeeId &&
              record.employeeId.toString() === searchId
            );
          });
        }
      }

      setFilteredAttendances(filteredData);
      setTotalFilteredAttendance(filteredData.length);

      const totalPages = Math.ceil(filteredData.length / perPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
      }
    } else if (
      originalAttendances &&
      originalAttendances.length === 0 &&
      !searchValue
    ) {
      setFilteredAttendances([]);
      setTotalFilteredAttendance(0);
    }
  }, [searchValue, originalAttendances, perPage, currentPage]);

  const getDutyScheduleAndEmployeesByDepartment = (departmentId) => {
    const currentDateUTC = convertDatePHToUTCISO(getTodayDatePH());

    //return only one schedule  per department per schedule date range
    dispatch(
      fetchDutyScheduleByDepartmentAndDate({
        departmentId,
        currentDate: currentDateUTC,
      })
    );

    dispatch(fetchEmployeesByDepartment(departmentId));
  };

  // Department change handler
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;

    if (!departmentId) return;

    // Clear search value and reset pagination when changing departments
    setSearchValue("");
    setCurrentPage(1);

    setSelectedDepartment(departmentId);
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

    return <span className={` text-sm ${colorClass}`}>{formattedTime}</span>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Employee Attendance</h1>
            <p className="text-blue-100">
              Monitor attendance records for employees in your departments
            </p>
            {selectedDepartment && managedDepartments && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.80a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                {managedDepartments.find(
                  (dept) => dept._id === selectedDepartment
                )?.name || "Department"}
              </div>
            )}
          </div>
          <div className="hidden sm:block">
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

      {/* Enhanced Employee Search */}
      {selectedDepartment && (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
          <EmployeeSearchFrontend
            setPerpage={setPerpage}
            perPage={perPage}
            setSearchValue={(value) => {
              setSearchValue(value);
              // Only reset page when actually changing the search, not when clearing
              if (value !== searchValue) {
                setCurrentPage(1);
              }
            }}
            searchValue={searchValue}
            inputPlaceholder="Search by employee name..."
            employees={employees}
            loading={loading}
            managedDepartments={managedDepartments || []}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDepartmentChange}
          />

          {/* Search Results Info */}
          {searchValue && (
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

      {/* Loading Spinner - Show when any data is loading */}
      <LoadingIndicator isLoading={loading} />

      {/* Show table when we have data OR when we're ready to show "no records" */}
      {!loading && filteredAttendances && filteredAttendances.length > 0 ? (
        <>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            {/* Summary Stats */}
            {filteredAttendances &&
              filteredAttendances.length > 0 &&
              !loading && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Present:{" "}
                        {
                          filteredAttendances.filter(
                            (a) => a.status === "Present"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Late:{" "}
                        {
                          filteredAttendances.filter((a) => a.status === "Late")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Absent:{" "}
                        {
                          filteredAttendances.filter(
                            (a) => a.status === "Absent"
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-gray-700">
                        Off:{" "}
                        {
                          filteredAttendances.filter((a) => a.status === "Off")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {/* Table Header - only show when we have data */}
            {filteredAttendances && filteredAttendances.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
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

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredAttendances && filteredAttendances.length > 0 ? (
                // Show data
                filteredAttendances
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
                            <TimeDisplay time={attendance.timeOut} type="out" />
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
                // Show "no records" message
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
                    No attendance records found for the selected department.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredAttendances && filteredAttendances.length > perPage && (
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Results Summary */}
                  <div className="flex items-center text-sm text-gray-700">
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
                      <span>
                        <span className="font-medium text-blue-700">
                          {filteredAttendances.length === 0
                            ? 0
                            : (currentPage - 1) * perPage + 1}
                        </span>
                        -
                        <span className="font-medium text-blue-700">
                          {Math.min(
                            currentPage * perPage,
                            filteredAttendances.length
                          )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-blue-700">
                          {filteredAttendances.length}
                        </span>{" "}
                        records
                      </span>
                    </div>
                  </div>

                  {/* Page Navigation */}
                  <div className="flex items-center justify-center sm:justify-end">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 hidden sm:block">
                        Page {currentPage} of{" "}
                        {Math.ceil(filteredAttendances.length / perPage)}
                      </span>
                      <Pagination
                        pageNumber={currentPage}
                        setPageNumber={handlePageChange}
                        totalItem={filteredAttendances.length}
                        perPage={perPage}
                        showItem={Math.min(
                          5,
                          Math.ceil(filteredAttendances.length / perPage)
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ManagerEmployeeAttendance;
