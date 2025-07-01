/**
 * Duty Schedule Utility Functions
 *
 * This file contains reusable utility functions for duty schedule operations
 * including date validation, employee grouping, and calendar calculations.
 *
 * @author HRIS Development Team
 * @version 1.0.0
 */

import { formatDatePH, formatTimeTo12HourPH } from "../utils/phDateUtils";
import { DEFAULT_HOLIDAYS } from "../constants/holidays";

/**
 * Week days configuration for calendar display
 */
export const WEEK_DAYS = [
  { day: "Sun", isWeekend: true },
  { day: "Mon", isWeekend: false },
  { day: "Tue", isWeekend: false },
  { day: "Wed", isWeekend: false },
  { day: "Thu", isWeekend: false },
  { day: "Fri", isWeekend: false },
  { day: "Sat", isWeekend: true },
];

/**
 * Check if a given date is a holiday
 * @param {Date} date - The date to check
 * @param {Array} holidays - Array of holiday objects (optional, defaults to current year holidays)
 * @returns {boolean} True if the date is a holiday
 */
export const isHoliday = (date, holidays = DEFAULT_HOLIDAYS) => {
  if (!date) return false;
  const dateStr = formatDatePH(date);
  return holidays.some((holiday) => holiday.date === dateStr);
};

/**
 * Get the name of a holiday for a given date
 * @param {Date} date - The date to check
 * @param {Array} holidays - Array of holiday objects (optional)
 * @returns {string|null} Holiday name or null if not a holiday
 */
export const getHolidayName = (date, holidays = DEFAULT_HOLIDAYS) => {
  if (!date) return null;
  const dateStr = formatDatePH(date);
  const holiday = holidays?.find((h) => h.date === dateStr);
  return holiday ? holiday.name : null;
};

/**
 * Check if a given date is a weekend (Saturday or Sunday)
 * @param {Date} date - The date to check
 * @returns {boolean} True if the date is a weekend
 */
export const isWeekend = (date) => {
  if (!date) return false;
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
};

/**
 * Check if a date should be marked in red (weekend or holiday)
 * @param {Date} date - The date to check
 * @param {Array} holidays - Array of holiday objects (optional)
 * @returns {boolean} True if the date should be marked in red
 */
export const shouldMarkRed = (date, holidays = DEFAULT_HOLIDAYS) => {
  if (!date) return false;
  return isWeekend(date) || isHoliday(date, holidays);
};

/**
 * Format employee shift time based on work schedule type
 * @param {Object} workSchedule - The work schedule object
 * @returns {string} Formatted shift time string
 */
export const formatShiftTime = (workSchedule) => {
  if (!workSchedule) return "";

  if (workSchedule.type === "Standard") {
    return `${formatTimeTo12HourPH(
      workSchedule.morningIn
    )}-${formatTimeTo12HourPH(workSchedule.morningOut)}, ${formatTimeTo12HourPH(
      workSchedule.afternoonIn
    )}-${formatTimeTo12HourPH(workSchedule.afternoonOut)}`;
  }

  return `${formatTimeTo12HourPH(
    workSchedule.startTime
  )}-${formatTimeTo12HourPH(workSchedule.endTime)}`;
};

/**
 * Format employee name for display
 * @param {Object} personalInformation - Employee's personal information
 * @returns {string} Formatted name (LastName, FirstInitial.)
 */
export const formatEmployeeName = (personalInformation) => {
  if (!personalInformation) return "";

  const { lastName, firstName } = personalInformation;
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";

  return `${lastName}, ${firstInitial}.`;
};

/**
 * Process and group employees by shift for a specific date
 * @param {Array} employeeSchedules - Array of employee schedules for the date
 * @returns {Array} Grouped employees by shift, sorted alphabetically
 */
export const groupEmployeesByShift = (employeeSchedules) => {
  if (!employeeSchedules || !employeeSchedules.length) return [];

  // Transform employee schedules to include formatted data
  const employeesForDate = employeeSchedules.map((es) => {
    const shiftTime = formatShiftTime(es?.workSchedule);

    return {
      name: formatEmployeeName(es?.employee?.personalInformation),
      lastName: es?.employee?.personalInformation?.lastName || "",
      shiftName: es?.workSchedule?.name?.toLowerCase() || "",
      shift: shiftTime,
      description: es?.remarks || "",
      shiftColor: es?.workSchedule?.shiftColor || "",
      workSchedule: es?.workSchedule,
      employee: es?.employee,
      remarks: es?.remarks,
    };
  });

  // Group employees by shift
  const grouped = employeesForDate.reduce((acc, emp) => {
    if (!acc[emp.shift]) {
      acc[emp.shift] = {
        shift: emp.shift,
        shiftName: emp.shiftName,
        shiftColor: emp.shiftColor,
        employees: [],
      };
    }

    acc[emp.shift].employees.push(emp);
    return acc;
  }, {});

  // Convert to array, sort groups by shift label, and sort each group by lastName
  return Object.values(grouped)
    .map((group) => ({
      ...group,
      employees: group.employees.sort((a, b) =>
        a.lastName.localeCompare(b.lastName)
      ),
    }))
    .sort((a, b) => a.shift.localeCompare(b.shift));
};

/**
 * Get employees scheduled for a specific date
 * @param {Date} date - The target date
 * @param {Array} allEntries - All duty schedule entries
 * @returns {Array} Grouped employees for the date
 */
export const getEmployeesForDate = (date, allEntries) => {
  if (!date || !allEntries) return [];

  const dateKey = formatDatePH(date);
  const entry = allEntries?.find((e) => formatDatePH(e.date) === dateKey);

  if (!entry) return [];

  return groupEmployeesByShift(entry.employeeSchedules);
};

/**
 * Generate calendar weeks for table display
 * @param {Array} days - Array of calendar days
 * @returns {Array} Array of week arrays for table rendering
 */
export const generateCalendarWeeks = (days) => {
  if (!days || !days.length) return [];

  const rows = [];
  let week = [];

  // Fill empty cells before the first day
  const firstDay = days[0];
  const firstDayOfWeek = firstDay?.getDay() ?? 0;
  for (let i = 0; i < firstDayOfWeek; i++) {
    week.push(null); // null for empty cells
  }

  // Add all days to weeks
  for (let i = 0; i < days.length; i++) {
    week.push(days[i]);

    // Complete week or last day
    if (week.length === 7 || i === days.length - 1) {
      // Fill empty cells at end if needed
      while (week.length < 7) week.push(null);

      rows.push([...week]);
      week = [];
    }
  }

  return rows;
};

/**
 * Validation functions for duty schedule data
 */
export const validation = {
  /**
   * Validate if duty schedule data is complete
   * @param {Object} dutySchedule - Duty schedule object
   * @returns {Object} Validation result with isValid and errors
   */
  validateDutySchedule: (dutySchedule) => {
    const errors = [];

    if (!dutySchedule) {
      errors.push("Duty schedule data is required");
      return { isValid: false, errors };
    }

    if (!dutySchedule.name) {
      errors.push("Schedule name is required");
    }

    if (!dutySchedule.startDate || !dutySchedule.endDate) {
      errors.push("Start date and end date are required");
    }

    if (!dutySchedule.department) {
      errors.push("Department information is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate employee schedule entry
   * @param {Object} entry - Employee schedule entry
   * @returns {Object} Validation result
   */
  validateScheduleEntry: (entry) => {
    const errors = [];

    if (!entry.employee) {
      errors.push("Employee information is required");
    }

    if (!entry.workSchedule) {
      errors.push("Work schedule is required");
    }

    if (!entry.date) {
      errors.push("Date is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

/**
 * Approval status constants and utilities
 */
export const APPROVAL_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  MANAGER_APPROVED: "manager_approved",
  DIRECTOR_APPROVED: "director_approved",
  HR_APPROVED: "hr_approved",
  REJECTED: "rejected",
};

/**
 * Get approval status display information
 * @param {string} status - Current approval status
 * @returns {Object} Status display information
 */
export const getApprovalStatusInfo = (status) => {
  const statusMap = {
    [APPROVAL_STATUS.DRAFT]: {
      label: "Draft",
      color: "gray",
      description: "Schedule is being prepared",
    },
    [APPROVAL_STATUS.SUBMITTED]: {
      label: "Submitted",
      color: "blue",
      description: "Waiting for manager approval",
    },
    [APPROVAL_STATUS.MANAGER_APPROVED]: {
      label: "Manager Approved",
      color: "yellow",
      description: "Waiting for director approval",
    },
    [APPROVAL_STATUS.DIRECTOR_APPROVED]: {
      label: "Director Approved",
      color: "orange",
      description: "Waiting for HR approval",
    },
    [APPROVAL_STATUS.HR_APPROVED]: {
      label: "HR Approved",
      color: "green",
      description: "Schedule is fully approved",
    },
    [APPROVAL_STATUS.REJECTED]: {
      label: "Rejected",
      color: "red",
      description: "Schedule has been rejected",
    },
  };

  return statusMap[status] || statusMap[APPROVAL_STATUS.DRAFT];
};
