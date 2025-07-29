import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttendanceByDepartment,
  clearAttendance,
} from "../../../../store/Reducers/attendanceReducer";
import {
  formatDatePH,
  getCurrentDatePH,
  getTodayDatePH,
  parseDatePH,
} from "../../../../utils/phDateUtils";
import { fetchEmployeesByDepartment } from "../../../../store/Reducers/employeeReducer";
import {
  fetchDutyScheduleByDepartmentForAttendance,
  messageClear,
  clearDutySchedule,
} from "../../../../store/Reducers/dutyScheduleReducer";
import toast from "react-hot-toast";
import EmployeeAttendance from "../../../../components/employee/EmployeeAttendance";
import { fetchDepartmentsByCluster } from "../../../../store/Reducers/departmentReducer";

const DirectorEmployeeAttendance = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  // Extract departments from the new API structure - Memoized for performance
  const managedCluster = useMemo(
    () => userInfo?.employee?.employmentInformation?.managedCluster || {},

    [userInfo?.employee?.employmentInformation?.managedCluster]
  );

  const { departments: clusterDepartments } = useSelector(
    (state) => state.department
  );

  // Fetch departments on component mount
  useEffect(() => {
    dispatch(fetchDepartmentsByCluster(managedCluster?._id));
  }, [dispatch, managedCluster]);

  const {
    dutySchedules,
    loading: dutyScheduleLoading,
    errorMessage: dutyScheduleError,
  } = useSelector((state) => state.dutySchedule);

  const {
    attendances,
    loading: attendanceLoading,
    errorMessage,
  } = useSelector((state) => state.attendance);

  const { employees, loading: employeesLoading } = useSelector(
    (state) => state.employee
  );

  const loading = attendanceLoading || dutyScheduleLoading || employeesLoading;

  // State variables
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

  // Helper function to determine if a date falls within a schedule period
  const isDateInSchedulePeriod = useCallback((date, startDate, endDate) => {
    // Convert all dates to PH date strings for consistent comparison (YYYY-MM-DD format)
    const checkDateStr = formatDatePH(date);
    const startDateStr = formatDatePH(startDate);
    const endDateStr = formatDatePH(endDate);

    // Compare as date strings (YYYY-MM-DD format ensures correct lexicographic comparison)
    const result = checkDateStr >= startDateStr && checkDateStr <= endDateStr;
    return result;
  }, []);

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

      // Clear duty schedule data when changing departments
      dispatch(clearDutySchedule());

      // Clear search value and reset pagination when changing departments
      setSearchValue("");
      setCurrentPage(1);

      // Clear local attendance state
      setOriginalAttendances([]);
      setFilteredAttendances([]);
      setTotalFilteredAttendance(0);

      // Clear duty schedule state when changing departments
      setAvailableDutySchedules([]);
      setCurrentScheduleIndex(0);

      setSelectedDepartment(departmentId);
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

  // Check if we can navigate to previous schedule
  const canNavigatePrevious = useCallback(() => {
    return currentScheduleIndex > 0;
  }, [currentScheduleIndex]);

  // Check if we can navigate to next schedule
  const canNavigateNext = useCallback(() => {
    return currentScheduleIndex < availableDutySchedules.length - 1;
  }, [currentScheduleIndex, availableDutySchedules]);

  // Month navigation handlers - Modified to work with duty schedule array
  const handleNextMonth = useCallback(() => {
    if (canNavigateNext()) {
      const newIndex = currentScheduleIndex + 1;
      setCurrentScheduleIndex(newIndex);

      // Update current date to be within the new schedule period
      const nextSchedule = availableDutySchedules[newIndex];
      if (nextSchedule) {
        // Use the start date + 15 days to ensure we're within the period
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

      // Update current date to be within the new schedule period
      const prevSchedule = availableDutySchedules[newIndex];
      if (prevSchedule) {
        // Use the start date + 15 days to ensure we're within the period
        const targetDate = parseDatePH(prevSchedule.startDate);
        targetDate.setDate(targetDate.getDate() + 15);
        setCurrentDate(targetDate);
      }
    }
  }, [canNavigatePrevious, currentScheduleIndex, availableDutySchedules]);

  const getDutyScheduleByDepartmentForAttendance = useCallback(
    (departmentId) => {
      dispatch(
        fetchDutyScheduleByDepartmentForAttendance({
          departmentId,
        })
      );

      dispatch(fetchEmployeesByDepartment(departmentId));
    },
    [dispatch]
  );

  useEffect(() => {
    return () => {
      // Cleanup function runs when component unmounts
      dispatch(clearAttendance());
    };
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    // if (successMessage) {
    //   toast.success(successMessage);

    //   dispatch(messageClear());
    // }

    if (dutyScheduleError) {
      toast.error(dutyScheduleError);
      dispatch(messageClear());
    }
  }, [dutyScheduleError, dispatch]);

  // Auto-select first department when managed departments are loaded
  useEffect(() => {
    if (
      clusterDepartments &&
      clusterDepartments.length > 0 &&
      !selectedDepartment
    ) {
      // Only auto-select if no department is currently selected
      setSelectedDepartment(clusterDepartments[0]._id);
    } else if (clusterDepartments && clusterDepartments.length === 0) {
      // Clear selected department if user has no managed departments
      setSelectedDepartment("");
    }
  }, [clusterDepartments, selectedDepartment]);

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

    getDutyScheduleByDepartmentForAttendance(selectedDepartment);
  }, [selectedDepartment, getDutyScheduleByDepartmentForAttendance, dispatch]);

  // Process duty schedule data and set up available schedules
  useEffect(() => {
    if (dutySchedules && dutySchedules.length > 0) {
      // Backend now returns array of schedules directly
      const currentDate = getTodayDatePH();

      const schedulesArray = dutySchedules.filter((schedule) => {
        const isValid =
          schedule && schedule._id && schedule.startDate && schedule.endDate;

        if (!isValid) return false;

        // Filter out future schedules - only include schedules that have started
        const scheduleStartDate = parseDatePH(schedule.startDate);
        const isScheduleStarted = scheduleStartDate <= currentDate;

        return isScheduleStarted;
      });

      if (schedulesArray.length > 0) {
        // Sort schedules by start date (chronological order)
        schedulesArray.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );

        setAvailableDutySchedules(schedulesArray);

        // Find the schedule that contains the current date, or default to most recent
        let selectedIndex = 0;

        // Look for schedule containing current date
        const schedulesContainingCurrentDate = schedulesArray.filter(
          (schedule, index) => {
            const isInPeriod = isDateInSchedulePeriod(
              currentDate,
              schedule.startDate,
              schedule.endDate
            );
            return isInPeriod;
          }
        );

        if (schedulesContainingCurrentDate.length > 0) {
          // If multiple schedules contain the current date, prefer the one with current month
          const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-based
          const currentYear = currentDate.getFullYear();
          const currentMonthSchedule = `${currentYear}-${currentMonth
            .toString()
            .padStart(2, "0")}`;

          // SPECIAL LOGIC: If current date is in July but we have an August schedule
          // that contains this date, we should prefer the August schedule
          let preferredSchedule = schedulesContainingCurrentDate.find(
            (schedule) => schedule.monthSchedule === currentMonthSchedule
          );

          // If no direct match, look for the schedule with the latest monthSchedule
          // This handles cases where July 28 falls in an August schedule period
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
            // Fallback to first schedule that contains current date
            selectedIndex = schedulesArray.findIndex(
              (s) => s._id === schedulesContainingCurrentDate[0]._id
            );
          }
        } else {
          // If current date doesn't fall in any schedule, select the most recent/closest one
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
    } else {
      setAvailableDutySchedules([]);
      setCurrentScheduleIndex(0);
    }
  }, [dutySchedules, isDateInSchedulePeriod]);

  // Set attendances data when available
  useEffect(() => {
    if (attendances && attendances.length > 0) {
      // Set new data when we have attendances
      setOriginalAttendances(attendances);
      setFilteredAttendances(attendances);
      setTotalFilteredAttendance(attendances.length);
    } else if (attendances && attendances.length === 0) {
      // Clear local state when attendances is explicitly empty array
      setOriginalAttendances([]);
      setFilteredAttendances([]);
      setTotalFilteredAttendance(0);
    }
  }, [attendances]);

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

  // Fetch attendance data when duty schedule is available
  useEffect(() => {
    if (!availableDutySchedules.length || currentScheduleIndex < 0) return;

    const currentSchedule = availableDutySchedules[currentScheduleIndex];
    if (!currentSchedule?._id) return;

    dispatch(
      fetchAttendanceByDepartment({
        scheduleId: currentSchedule._id,
      })
    );
  }, [availableDutySchedules, currentScheduleIndex, dispatch]);

  return (
    <EmployeeAttendance
      // Essential data props
      departments={clusterDepartments}
      employees={employees}
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
      // Form handlers
      handleDepartmentChange={handleDepartmentChange}
      handlePageChange={handlePageChange}
      handleSearchValueChange={handleSearchValueChange}
      handlePerPageChange={handlePerPageChange}
      // Error handling
      errorMessage={errorMessage}
      // Role-based customization
      userRole="director"
    />
  );
};

export default DirectorEmployeeAttendance;
