import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttendanceByDepartment,
  clearAttendance,
} from "../../../../store/Reducers/attendanceReducer";
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
  clearEmployeeData,
} from "../../../../store/Reducers/employeeReducer";
import {
  fetchDutyScheduleByDepartmentAndDate,
  clearDutySchedule,
} from "../../../../store/Reducers/dutyScheduleReducer";
import Pagination from "../../../../components/Pagination";
import EmployeeSearchFrontend from "../../../../components/EmployeeSearchFrontend";
import LoadingIndicator from "../../../../components/LoadingIndicator";

const ManagerEmployeeAttendance = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.employee?._id;

  const {
    loading: departmentLoading,
    managedDepartments,
    errorMessage: employeeErrorMessage,
  } = useSelector((state) => state.employee);

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

  // Debug log Redux state changes (commented out for production)
  // const fullEmployeeState = useSelector((state) => state.employee);
  // useEffect(() => {
  //   console.log("Redux state update - dutySchedule:", dutySchedule);
  //   console.log("Redux state update - attendances:", attendances);
  //   console.log("Redux state update - managedDepartments:", managedDepartments);
  //   console.log("Redux state update - employees:", employees?.length || 0, "employees");
  //   console.log("Redux state update - departmentLoading:", departmentLoading);
  //   console.log("Redux state update - attendanceLoading:", attendanceLoading);
  //   console.log("Redux state update - dutyScheduleLoading:", dutyScheduleLoading);
  //   console.log("Redux state update - employeesLoading:", employeesLoading);
  //   console.log("Redux state update - errorMessage:", errorMessage);
  //   console.log("Full employee state:", fullEmployeeState);
  // }, [dutySchedule, attendances, managedDepartments, employees, departmentLoading, attendanceLoading, dutyScheduleLoading, employeesLoading, errorMessage, fullEmployeeState]);

  // Simplified state variables - remove all loading states
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isDataCleared, setIsDataCleared] = useState(false); // Track if data has been cleared for fresh login
  const [userChangeKey, setUserChangeKey] = useState(0); // Track user changes for component key

  // Track if we've fetched data for the current user
  const fetchedForEmployee = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(10);

  const [originalAttendances, setOriginalAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [totalFilteredAttendance, setTotalFilteredAttendance] = useState(0);

  const loading =
    attendanceLoading ||
    dutyScheduleLoading ||
    employeesLoading ||
    departmentLoading ||
    isDataCleared; // Also show loading when data is being cleared

  // Callback functions definitions - moved here to avoid hoisting issues
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleDepartmentChange = useCallback(
    (e) => {
      const departmentId = e.target.value;

      if (!departmentId) return;

      // Clear attendance data when changing departments
      dispatch(clearAttendance());

      // Clear search value and reset pagination when changing departments
      setSearchValue("");
      setCurrentPage(1);

      // Clear local attendance state
      setOriginalAttendances([]);
      setFilteredAttendances([]);
      setTotalFilteredAttendance(0);

      setSelectedDepartment(departmentId);
    },
    [dispatch]
  );

  const getDutyScheduleAndEmployeesByDepartment = useCallback(
    (departmentId) => {
      // console.log("getDutyScheduleAndEmployeesByDepartment called with:", departmentId);
      const currentDateUTC = convertDatePHToUTCISO(getTodayDatePH());
      // console.log("Current date UTC:", currentDateUTC);

      //return only one schedule  per department per schedule date range
      dispatch(
        fetchDutyScheduleByDepartmentAndDate({
          departmentId,
          currentDate: currentDateUTC,
        })
      );

      dispatch(fetchEmployeesByDepartment(departmentId));
    },
    [dispatch]
  );

  // Memoized search value handler to prevent re-renders
  const handleSearchValueChange = useCallback(
    (value) => {
      setSearchValue(value);
      // Only reset page when actually changing the search, not when clearing
      if (value !== searchValue) {
        setCurrentPage(1);
      }
    },
    [searchValue]
  );

  // Memoized perpage handler
  const handlePerPageChange = useCallback((newPerPage) => {
    setPerpage(newPerPage);
  }, []);

  // Clear attendance data when component unmounts or user changes
  useEffect(() => {
    return () => {
      // Cleanup function runs when component unmounts
      dispatch(clearAttendance());
    };
  }, [dispatch]);

  // Clear attendance data when user changes (employeeId changes)
  useEffect(() => {
    // console.log("Employee ID changed to:", employeeId);

    if (!employeeId) {
      // console.log("No employeeId - clearing all data");
      // Clear everything when no user
      dispatch(clearAttendance());
      dispatch(clearEmployeeData());
      dispatch(clearDutySchedule());

      setOriginalAttendances([]);
      setFilteredAttendances([]);
      setTotalFilteredAttendance(0);
      setSelectedDepartment("");
      setSearchValue("");
      setCurrentPage(1);
      setIsDataCleared(true);
      return;
    }

    // Clear the ref to allow fetching for the new user
    fetchedForEmployee.current = null;

    // console.log("Clearing all data for new user login");
    // Always clear data when employeeId changes (including when it becomes null)
    dispatch(clearAttendance());
    dispatch(clearEmployeeData());
    dispatch(clearDutySchedule());

    // Also clear local state immediately and synchronously
    setOriginalAttendances([]);
    setFilteredAttendances([]);
    setTotalFilteredAttendance(0);
    setSelectedDepartment("");
    setSearchValue("");
    setCurrentPage(1);

    // Set flag to indicate data has been cleared for fresh login
    setIsDataCleared(true);

    // Force a small delay to ensure all state is cleared before proceeding
    const clearingTimeout = setTimeout(() => {
      // console.log("Data clearing timeout completed - allowing new data fetch");
      setIsDataCleared(false);
    }, 300); // Reduced timeout for faster response

    return () => clearTimeout(clearingTimeout);
  }, [employeeId, dispatch]);

  // Additional safeguard: clear data when userInfo becomes null/undefined (logout)
  useEffect(() => {
    if (!userInfo) {
      dispatch(clearAttendance());
      dispatch(clearEmployeeData());
      dispatch(clearDutySchedule());

      setOriginalAttendances([]);
      setFilteredAttendances([]);
      setTotalFilteredAttendance(0);
      setSelectedDepartment("");
      setSearchValue("");
      setCurrentPage(1);
      setIsDataCleared(true);
    }
  }, [userInfo, dispatch]);

  // Fetch managed departments - use ref to avoid dependency loops
  useEffect(() => {
    // console.log("Fetch managed departments effect triggered, employeeId:", employeeId);
    // console.log("Previous fetchedForEmployee.current:", fetchedForEmployee.current);

    if (!employeeId) {
      // console.log("No employeeId, returning");
      return;
    }

    // Always fetch managed departments for a new employee
    if (fetchedForEmployee.current !== employeeId) {
      // console.log("Fetching managed departments for employee:", employeeId);
      // console.log("Clearing previous department data first");

      // Clear any existing managed departments before fetching new ones
      dispatch(clearEmployeeData());

      // Fetch new managed departments
      dispatch(fetchManagedDepartments(employeeId));
      fetchedForEmployee.current = employeeId;
    } else {
      // console.log("Already fetched for this employee, skipping");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, dispatch]); // Don't include managedDepartments to prevent loop

  // Auto-select first department in first render or page load
  useEffect(() => {
    // console.log("Auto-select department effect triggered");
    // console.log("managedDepartments:", managedDepartments?.length || 0);
    // console.log("selectedDepartment:", selectedDepartment);

    // When managed departments change, clear any existing attendance data
    // This ensures no stale data from previous user sessions
    if (managedDepartments) {
      // console.log("Clearing stale attendance data due to managed departments change");
      setOriginalAttendances([]);
      setFilteredAttendances([]);
      setTotalFilteredAttendance(0);
      dispatch(clearAttendance());
    }

    if (
      managedDepartments &&
      managedDepartments.length > 0 &&
      !selectedDepartment
    ) {
      // console.log("Auto-selecting first department:", managedDepartments[0]._id);
      // Only auto-select if no department is currently selected
      setSelectedDepartment(managedDepartments[0]._id);
    } else if (managedDepartments && managedDepartments.length === 0) {
      // console.log("No managed departments found for this user");
      // Clear selected department if user has no managed departments
      setSelectedDepartment("");
    }
  }, [managedDepartments, selectedDepartment, dispatch]);

  // if have selected department,
  useEffect(() => {
    // console.log("Selected department changed:", selectedDepartment);
    if (!selectedDepartment) return;

    // console.log("Clearing attendance and fetching data for department:", selectedDepartment);
    // Immediately clear all attendance data when department changes
    dispatch(clearAttendance());
    setOriginalAttendances([]);
    setFilteredAttendances([]);
    setTotalFilteredAttendance(0);

    getDutyScheduleAndEmployeesByDepartment(selectedDepartment);
  }, [selectedDepartment, getDutyScheduleAndEmployeesByDepartment, dispatch]);

  //
  useEffect(() => {
    // console.log("Duty schedule changed:", dutySchedule);
    if (!dutySchedule?._id) {
      // console.log("No duty schedule ID found, returning");
      return;
    }

    // console.log("Fetching attendance for schedule ID:", dutySchedule._id);
    // Clear old attendance data immediately before fetching new data
    dispatch(clearAttendance());
    setOriginalAttendances([]);
    setFilteredAttendances([]);
    setTotalFilteredAttendance(0);

    dispatch(
      fetchAttendanceByDepartment({
        scheduleId: dutySchedule._id,
      })
    );
  }, [dutySchedule, dispatch]); // Keep dispatch but add dutySchedule._id specifically

  // if have attendances, set them to original and filtered
  useEffect(() => {
    // console.log("Attendances updated:", attendances);
    if (attendances && attendances.length > 0) {
      // console.log("Setting attendance data, count:", attendances.length);
      // Set new data when we have attendances
      setOriginalAttendances(attendances);
      setFilteredAttendances(attendances);
      setTotalFilteredAttendance(attendances.length);
      // Reset the data cleared flag since we now have fresh data
      setIsDataCleared(false);
    } else if (attendances && attendances.length === 0) {
      // console.log("Clearing attendance data - empty array received");
      // Clear local state when attendances is explicitly empty array
      setOriginalAttendances([]);
      setFilteredAttendances([]);
      setTotalFilteredAttendance(0);
      // Also reset the flag for empty legitimate results
      setIsDataCleared(false);
    }
  }, [attendances]); // Remove dispatch from dependencies

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

  // Update key when employeeId changes to force complete component re-render
  useEffect(() => {
    setUserChangeKey((prev) => prev + 1);
  }, [employeeId]);

  return (
    <div
      key={`user-${employeeId || "no-user"}-${userChangeKey}`}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Force complete re-render when user changes */}
      {/* Don't show any content if no employeeId (user not logged in) */}
      {!employeeId ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user information...</p>
          </div>
        </div>
      ) : (
        <>
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
                setPerpage={handlePerPageChange}
                perPage={perPage}
                setSearchValue={handleSearchValueChange}
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
                              Showing results for: "
                              <strong>{searchValue}</strong>"
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

          {/* Show employee error message if there's one */}
          {employeeErrorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-400 mr-2">⚠️</div>
                <div>
                  <h3 className="text-red-800 font-medium">
                    Error loading employee data
                  </h3>
                  <p className="text-red-700 text-sm mt-1">
                    {employeeErrorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Show message when user has no managed departments */}
          {!loading &&
            !isDataCleared &&
            managedDepartments &&
            managedDepartments.length === 0 &&
            !employeeErrorMessage && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="text-amber-400 mr-2">ℹ️</div>
                  <div>
                    <h3 className="text-amber-800 font-medium">
                      No Managed Departments
                    </h3>
                    <p className="text-amber-700 text-sm mt-1">
                      You currently don't have any departments assigned to
                      manage. Please contact your administrator to assign
                      department management permissions to your account.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Loading Spinner - Show when any data is loading */}
          <LoadingIndicator isLoading={loading} />

          {/* Show table when we have data OR when we're ready to show "no records" */}
          {!loading &&
          !isDataCleared &&
          filteredAttendances &&
          filteredAttendances.length > 0 ? (
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
                              filteredAttendances.filter(
                                (a) => a.status === "Late"
                              ).length
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
                              filteredAttendances.filter(
                                (a) => a.status === "Off"
                              ).length
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
                  {filteredAttendances && filteredAttendances.length > 0
                    ? // Show data
                      filteredAttendances
                        .slice(
                          (currentPage - 1) * perPage,
                          currentPage * perPage
                        )
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
                                      ID:{" "}
                                      {attendance.hospitalEmployeeId || "N/A"}
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
                                  <TimeDisplay
                                    time={attendance.timeIn}
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
                                        Morning: {attendance.morningLateMinutes}
                                        m
                                      </div>
                                    )}
                                    {attendance.afternoonLateMinutes > 0 && (
                                      <div className="text-xs text-red-600 font-medium">
                                        Afternoon:{" "}
                                        {attendance.afternoonLateMinutes}m
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
                {filteredAttendances &&
                  filteredAttendances.length > perPage && (
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
          ) : (
            !loading &&
            !isDataCleared &&
            selectedDepartment && (
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
                    No attendance records found for the selected department.
                  </p>
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default ManagerEmployeeAttendance;
