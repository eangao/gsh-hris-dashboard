import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttendanceByDepartment,
  clearAttendance,
} from "../../../store/Reducers/attendanceReducer";
import {
  formatDatePH,
  getCurrentDatePH,
  getTodayDatePH,
  parseDatePH,
} from "../../../utils/phDateUtils";
import { fetchEmployeeDepartmentId } from "../../../store/Reducers/employeeReducer";
import {
  fetchDutyScheduleByDepartmentForAttendance,
  messageClear,
} from "../../../store/Reducers/dutyScheduleReducer";
import { fetchHolidaysDateRange } from "../../../store/Reducers/holidayReducer";
import toast from "react-hot-toast";
import EmployeeAttendance from "../../../components/employee/EmployeeAttendance";

const MyAttendance = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.employee?._id;

  // For individual employee, we get their department
  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee
  );

  const {
    dutySchedules,
    loading: dutyScheduleLoading,
    errorMessage: dutyScheduleError,
  } = useSelector((state) => state.dutySchedule);

  const {
    attendances,
    loading: attendanceLoading,
    dutyScheduleInfo,
    errorMessage,
  } = useSelector((state) => state.attendance);

  const { holidays } = useSelector((state) => state.holiday);

  const loading = attendanceLoading || dutyScheduleLoading || employeeLoading;

  // State variables - same as manager but for individual employee
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [currentDate, setCurrentDate] = useState(getCurrentDatePH());
  const [availableDutySchedules, setAvailableDutySchedules] = useState([]);
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(10);

  const [originalAttendances, setOriginalAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [totalFilteredAttendance, setTotalFilteredAttendance] = useState(0);

  // Add retry counter for attendance fetching
  const [attendanceRetryCount, setAttendanceRetryCount] = useState(0);

  // Helper function - same as manager
  const isDateInSchedulePeriod = useCallback((date, startDate, endDate) => {
    const checkDateStr = formatDatePH(date);
    const startDateStr = formatDatePH(startDate);
    const endDateStr = formatDatePH(endDate);
    const result = checkDateStr >= startDateStr && checkDateStr <= endDateStr;
    return result;
  }, []);

  // Modified function for individual employee - includes employeeId
  const getDutyScheduleByDepartmentForAttendance = useCallback(
    (departmentId) => {
      dispatch(
        fetchDutyScheduleByDepartmentForAttendance({
          departmentId,
          employeeId, // THIS IS THE KEY DIFFERENCE - specific employee
        })
      );
    },
    [dispatch, employeeId]
  );
  // Same handlers as manager component
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSearchValueChange = useCallback(
    (value) => {
      setSearchValue(value);
      if (value !== searchValue) {
        setCurrentPage(1);
      }
    },
    [searchValue]
  );

  const handlePerPageChange = useCallback((newPerPage) => {
    setPerpage(newPerPage);
  }, []);

  // Navigation handlers - same as manager
  const canNavigatePrevious = useCallback(() => {
    return currentScheduleIndex > 0;
  }, [currentScheduleIndex]);

  const canNavigateNext = useCallback(() => {
    return currentScheduleIndex < availableDutySchedules.length - 1;
  }, [currentScheduleIndex, availableDutySchedules]);

  const handleNextMonth = useCallback(() => {
    if (canNavigateNext()) {
      const newIndex = currentScheduleIndex + 1;
      setCurrentScheduleIndex(newIndex);
      const nextSchedule = availableDutySchedules[newIndex];
      if (nextSchedule) {
        const targetDate = parseDatePH(nextSchedule.startDate);
        targetDate.setDate(targetDate.getDate() + 15);
        setCurrentDate(targetDate);
      }
    }
  }, [canNavigateNext, currentScheduleIndex, availableDutySchedules]);

  const handlePrevMonth = useCallback(() => {
    if (canNavigatePrevious()) {
      const newIndex = currentScheduleIndex - 1;
      setCurrentScheduleIndex(newIndex);
      const prevSchedule = availableDutySchedules[newIndex];
      if (prevSchedule) {
        const targetDate = parseDatePH(prevSchedule.startDate);
        targetDate.setDate(targetDate.getDate() + 15);
        setCurrentDate(targetDate);
      }
    }
  }, [canNavigatePrevious, currentScheduleIndex, availableDutySchedules]);

  // Fetch employee department info
  useEffect(() => {
    if (!employeeId) return;
    dispatch(fetchEmployeeDepartmentId(employeeId));
  }, [employeeId, dispatch]);

  // Same cleanup as manager
  useEffect(() => {
    return () => {
      dispatch(clearAttendance());
    };
  }, [dispatch]);

  // Handle error messages
  useEffect(() => {
    if (dutyScheduleError) {
      toast.error(dutyScheduleError);
      dispatch(messageClear());
    }
  }, [dutyScheduleError, dispatch]);

  // Auto-select employee's department with retry logic
  useEffect(() => {
    if (employee?.employmentInformation?.department && !selectedDepartment) {
      setSelectedDepartment(employee.employmentInformation.department);
    } else if (!employee && employeeId && !selectedDepartment) {
      // Retry fetching employee data if it's missing
      const retryTimeout = setTimeout(() => {
        dispatch(fetchEmployeeDepartmentId(employeeId));
      }, 1000);

      return () => clearTimeout(retryTimeout);
    }
  }, [employee, selectedDepartment, employeeId, dispatch]);

  // Fetch duty schedules when department is selected
  useEffect(() => {
    if (!selectedDepartment || !employeeId) return;

    // Clear all attendance data before fetching new duty schedules
    dispatch(clearAttendance());
    setOriginalAttendances([]);
    setFilteredAttendances([]);
    setTotalFilteredAttendance(0);

    // Clear duty schedule state
    setAvailableDutySchedules([]);
    setCurrentScheduleIndex(0);

    getDutyScheduleByDepartmentForAttendance(selectedDepartment);
  }, [
    selectedDepartment,
    employeeId,
    getDutyScheduleByDepartmentForAttendance,
    dispatch,
  ]);

  // Same duty schedule processing as manager
  useEffect(() => {
    if (!dutySchedules || dutySchedules.length === 0) {
      setAvailableDutySchedules([]);
      setCurrentScheduleIndex(0);
      return;
    }

    const currentDate = getTodayDatePH();
    const schedulesArray = dutySchedules.filter((schedule) => {
      const isValid =
        schedule && schedule._id && schedule.startDate && schedule.endDate;
      if (!isValid) return false;
      const scheduleStartDate = parseDatePH(schedule.startDate);
      const isScheduleStarted = scheduleStartDate <= currentDate;
      return isScheduleStarted;
    });

    if (schedulesArray.length > 0) {
      schedulesArray.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      setAvailableDutySchedules(schedulesArray);

      let selectedIndex = 0;
      const schedulesContainingCurrentDate = schedulesArray.filter(
        (schedule) => {
          return isDateInSchedulePeriod(
            currentDate,
            schedule.startDate,
            schedule.endDate
          );
        }
      );

      if (schedulesContainingCurrentDate.length > 0) {
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const currentMonthSchedule = `${currentYear}-${currentMonth
          .toString()
          .padStart(2, "0")}`;

        let preferredSchedule = schedulesContainingCurrentDate.find(
          (schedule) => schedule.monthSchedule === currentMonthSchedule
        );

        if (!preferredSchedule && schedulesContainingCurrentDate.length > 1) {
          preferredSchedule = schedulesContainingCurrentDate.reduce(
            (latest, current) => {
              return current.monthSchedule > latest.monthSchedule
                ? current
                : latest;
            }
          );
        }

        if (preferredSchedule) {
          selectedIndex = schedulesArray.findIndex(
            (s) => s._id === preferredSchedule._id
          );
        } else {
          selectedIndex = schedulesArray.findIndex(
            (s) => s._id === schedulesContainingCurrentDate[0]._id
          );
        }
      } else {
        const today = currentDate.getTime();
        let closestIndex = 0;
        let closestDistance = Math.abs(
          new Date(schedulesArray[0].startDate).getTime() - today
        );

        for (let i = 1; i < schedulesArray.length; i++) {
          const distance = Math.abs(
            new Date(schedulesArray[i].startDate).getTime() - today
          );
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        }
        selectedIndex = closestIndex;
      }

      setCurrentScheduleIndex(selectedIndex);
    } else {
      setAvailableDutySchedules([]);
      setCurrentScheduleIndex(0);
    }
  }, [dutySchedules, isDateInSchedulePeriod]);

  // Fetch attendance data when duty schedule is available
  useEffect(() => {
    if (
      !availableDutySchedules.length ||
      currentScheduleIndex < 0 ||
      !employeeId
    )
      return;

    const currentSchedule = availableDutySchedules[currentScheduleIndex];
    if (!currentSchedule?._id) return;

    // Reset retry count when schedule changes
    setAttendanceRetryCount(0);

    // Add a small delay to ensure duty schedule state is stable
    const timeoutId = setTimeout(() => {
      dispatch(
        fetchAttendanceByDepartment({
          scheduleId: currentSchedule._id,
          employeeId, // THIS IS THE KEY DIFFERENCE - filter for specific employee
        })
      );
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [availableDutySchedules, currentScheduleIndex, employeeId, dispatch]);

  // Retry attendance fetch if no data received after reasonable time
  useEffect(() => {
    if (
      !availableDutySchedules.length ||
      currentScheduleIndex < 0 ||
      !employeeId
    )
      return;
    if (attendances !== null && attendances !== undefined) return; // Data already received
    if (attendanceRetryCount >= 3) return; // Max retries reached
    if (loading) return; // Still loading, don't retry yet

    const currentSchedule = availableDutySchedules[currentScheduleIndex];
    if (!currentSchedule?._id) return;

    // Retry after 2 seconds if no attendance data
    const retryTimeout = setTimeout(() => {
      console.log(
        `Retrying attendance fetch, attempt ${attendanceRetryCount + 1}`
      );
      setAttendanceRetryCount((prev) => prev + 1);
      dispatch(
        fetchAttendanceByDepartment({
          scheduleId: currentSchedule._id,
          employeeId,
        })
      );
    }, 2000);

    return () => clearTimeout(retryTimeout);
  }, [
    availableDutySchedules,
    currentScheduleIndex,
    employeeId,
    attendances,
    attendanceRetryCount,
    loading,
    dispatch,
  ]);

  // Same attendance processing as manager
  useEffect(() => {
    // Always update local state based on attendance data
    if (attendances && Array.isArray(attendances)) {
      if (attendances.length > 0) {
        setOriginalAttendances(attendances);
        setFilteredAttendances(attendances);
        setTotalFilteredAttendance(attendances.length);
        // Reset retry count on successful data load
        setAttendanceRetryCount(0);
      } else {
        // Only clear if we explicitly received an empty array (not undefined/null)
        setOriginalAttendances([]);
        setFilteredAttendances([]);
        setTotalFilteredAttendance(0);
      }
    } else if (
      attendances === null ||
      (Array.isArray(attendances) && attendances.length === 0)
    ) {
      // Handle explicit null or empty array
      setOriginalAttendances([]);
      setFilteredAttendances([]);
      setTotalFilteredAttendance(0);
    }
  }, [attendances]);

  // Fetch holidays when dutyScheduleInfo is available
  useEffect(() => {
    if (
      dutyScheduleInfo &&
      dutyScheduleInfo.startDate &&
      dutyScheduleInfo.endDate
    ) {
      dispatch(
        fetchHolidaysDateRange({
          startDate: dutyScheduleInfo.startDate,
          endDate: dutyScheduleInfo.endDate,
        })
      );
    }
  }, [dispatch, dutyScheduleInfo]);

  // Same search filtering as manager
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

  // Use the same reusable component with different data
  return (
    <EmployeeAttendance
      // Essential data props - FOR INDIVIDUAL EMPLOYEE
      departments={[]} // Individual employees don't manage departments
      employees={[]} // Empty for individual view
      attendances={filteredAttendances}
      loading={loading}
      // UI state props
      selectedDepartment={selectedDepartment}
      currentPage={currentPage}
      searchValue={searchValue}
      perPage={perPage}
      totalFilteredAttendance={totalFilteredAttendance}
      // Schedule management props
      availableDutySchedules={availableDutySchedules}
      currentScheduleIndex={currentScheduleIndex}
      currentDate={currentDate}
      // Navigation handlers
      canNavigatePrevious={canNavigatePrevious}
      canNavigateNext={canNavigateNext}
      handleNextMonth={handleNextMonth}
      handlePrevMonth={handlePrevMonth}
      // Form handlers - modified for individual employee
      handleDepartmentChange={() => {}} // Disabled for individual employee
      handlePageChange={handlePageChange}
      handleSearchValueChange={handleSearchValueChange}
      handlePerPageChange={handlePerPageChange}
      // Error handling
      errorMessage={errorMessage}
      // Holiday data
      holidays={holidays}
      // View type - indicates this is individual employee view
      isIndividualView={true}
      // Role-based customization
      userRole="employee"
    />
  );
};

export default MyAttendance;
