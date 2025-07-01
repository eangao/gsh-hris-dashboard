/**
 * Custom Hook for Duty Schedule Data Management
 *
 * This hook encapsulates all duty schedule data fetching, state management,
 * and related operations to be reused across different components.
 *
 * @author HRIS Development Team
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchDutyScheduleById,
  messageClear,
} from "../store/Reducers/dutyScheduleReducer";
import {
  getCurrentDatePH,
  getDutyScheduleRangePH,
  parseDatePH,
  getCalendarDaysInRangePH,
} from "../utils/phDateUtils";

/**
 * Hook for managing duty schedule data and state
 * @param {string} scheduleId - The duty schedule ID to fetch
 * @param {string} employeeId - Optional employee ID for employee-specific views
 * @returns {Object} Duty schedule data and related functions
 */
export const useDutySchedule = (scheduleId, employeeId = "") => {
  // Redux state and dispatch
  const dispatch = useDispatch();
  const { dutySchedule, loading, errorMessage, successMessage } = useSelector(
    (state) => state.dutySchedule
  );

  // Local state for calendar data
  const [currentDate, setCurrentDate] = useState(getCurrentDatePH());
  const [days, setDays] = useState([]);
  const [allEntries, setAllEntries] = useState([]);

  /**
   * Fetch duty schedule data on component mount or when dependencies change
   */
  useEffect(() => {
    if (scheduleId) {
      dispatch(fetchDutyScheduleById({ scheduleId, employeeId }));
    }
  }, [dispatch, scheduleId, employeeId]);

  /**
   * Update local state when duty schedule data is loaded
   */
  useEffect(() => {
    if (dutySchedule) {
      const startDateObj = parseDatePH(dutySchedule.startDate);
      const endDateObj = parseDatePH(dutySchedule.endDate);

      // Validate parsed dates
      if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
        // Transform and set entries with parsed dates
        const transformedEntries =
          dutySchedule.entries?.map((entry) => ({
            ...entry,
            date: parseDatePH(entry.date),
            employeeSchedules: entry.employeeSchedules || [],
          })) || [];

        setAllEntries(transformedEntries);
        setCurrentDate(endDateObj);
      }
    }
  }, [dutySchedule]);

  /**
   * Generate calendar days when current date changes
   */
  useEffect(() => {
    const { startDate, endDate } = getDutyScheduleRangePH(currentDate, true);
    const calendarDays = getCalendarDaysInRangePH(startDate, endDate);
    setDays(calendarDays);
  }, [currentDate]);

  /**
   * Handle success and error messages with toast notifications
   */
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  /**
   * Set document title when duty schedule is loaded
   */
  useEffect(() => {
    if (dutySchedule?.name) {
      document.title = `${dutySchedule.name.toUpperCase()} DUTY SCHEDULE | ADVENTIST HOSPITAL GINGOOG`;
    }

    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = "HRIS Dashboard | ADVENTIST HOSPITAL GINGOOG";
    };
  }, [dutySchedule]);

  /**
   * Refresh duty schedule data
   */
  const refreshSchedule = () => {
    if (scheduleId) {
      dispatch(fetchDutyScheduleById({ scheduleId, employeeId }));
    }
  };

  /**
   * Clear any existing messages
   */
  const clearMessages = () => {
    dispatch(messageClear());
  };

  return {
    // Data
    dutySchedule,
    loading,
    errorMessage,
    successMessage,

    // Calendar data
    currentDate,
    setCurrentDate,
    days,
    allEntries,

    // Actions
    refreshSchedule,
    clearMessages,

    // Computed values
    isDataLoaded: !!dutySchedule,
    hasError: !!errorMessage,
    hasSuccess: !!successMessage,
  };
};
