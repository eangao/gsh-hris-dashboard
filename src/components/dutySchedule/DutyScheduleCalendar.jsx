/**
 * Reusable Duty Schedule Calendar Component
 *
 * This component renders a calendar view for duty schedules with employee
 * assignments, holidays, and weekend highlighting. It's designed to be
 * reusable across different views (print, details, etc.).
 *
 * @author HRIS Development Team
 * @version 1.0.0
 */

import React from "react";
import PropTypes from "prop-types";
import {
  WEEK_DAYS,
  isHoliday,
  getHolidayName,
  shouldMarkRed,
  getEmployeesForDate,
  generateCalendarWeeks,
} from "../../utils/dutyScheduleUtils";
import { DEFAULT_HOLIDAYS } from "../../constants/holidays";

/**
 * Individual calendar day cell component
 */
const CalendarDayCell = ({
  day,
  allEntries,
  holidays,
  showEmployeeDetails = true,
  isPrintView = false,
}) => {
  if (!day) {
    return <td className="p-2 border border-gray-300" />;
  }

  const employeeGroups = getEmployeesForDate(day, allEntries);
  const holidayName = getHolidayName(day, holidays);
  const isHolidayDate = isHoliday(day, holidays);
  const shouldHighlight = shouldMarkRed(day, holidays);

  return (
    <td className="border p-1 border-gray-300 align-top">
      {/* Date header with holiday indicator */}
      <div
        className={`flex text-md font-bold mb-1 ${
          isHolidayDate ? "justify-between" : "justify-center"
        }`}
      >
        <span className={shouldHighlight ? "text-red-600" : "text-blue-600"}>
          {day.getDate()}
        </span>
        {isHolidayDate && (
          <span className="italic text-red-600 text-sm">{holidayName}</span>
        )}
      </div>

      {/* Employee schedules */}
      {showEmployeeDetails && (
        <div className="space-y-1">
          {employeeGroups.map((group, index) => (
            <div
              key={`${group.shift}-${index}`}
              className={`rounded text-xs ${group?.shiftColor} ${
                isPrintView ? "print-bg" : ""
              }`}
            >
              {/* Shift time header */}
              <div className="font-bold uppercase text-gray-700">
                {group.shift}
              </div>

              {/* Employee names */}
              <div className="rounded bg-white/50 text-sm">
                {group.employees.map((emp) => emp.name).join(", ")}
              </div>
            </div>
          ))}
        </div>
      )}
    </td>
  );
};

/**
 * Calendar header component
 */
const CalendarHeader = ({ weekDays = WEEK_DAYS }) => (
  <thead className="bg-gray-100">
    <tr>
      {weekDays.map(({ day, isWeekend }, index) => (
        <th
          key={day}
          className={`p-2 text-lg font-bold border border-gray-300 ${
            isWeekend ? "text-red-600" : "text-blue-600"
          }`}
        >
          {day}
        </th>
      ))}
    </tr>
  </thead>
);

/**
 * Main Duty Schedule Calendar Component
 */
const DutyScheduleCalendar = ({
  days = [],
  allEntries = [],
  holidays = DEFAULT_HOLIDAYS,
  showEmployeeDetails = true,
  isPrintView = false,
  className = "",
  weekDays = WEEK_DAYS,
}) => {
  // Generate calendar weeks for table rendering
  const calendarWeeks = generateCalendarWeeks(days);

  // If no days are provided, show empty state
  if (!days.length) {
    return (
      <div className="w-full border border-gray-300 p-8 text-center text-gray-500">
        <p>No calendar data available</p>
      </div>
    );
  }

  return (
    <div className={`duty-schedule-calendar ${className}`}>
      <table
        className={`w-full border border-gray-300 ${
          isPrintView ? "print:table-fixed" : ""
        }`}
      >
        <CalendarHeader weekDays={weekDays} />
        <tbody>
          {calendarWeeks.map((weekRow, weekIndex) => (
            <tr key={`week-${weekIndex}`} className="align-top">
              {weekRow.map((day, dayIndex) => (
                <CalendarDayCell
                  key={
                    day
                      ? `day-${day.getTime()}`
                      : `empty-${weekIndex}-${dayIndex}`
                  }
                  day={day}
                  allEntries={allEntries}
                  holidays={holidays}
                  showEmployeeDetails={showEmployeeDetails}
                  isPrintView={isPrintView}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// PropTypes for type checking and documentation
DutyScheduleCalendar.propTypes = {
  /** Array of Date objects representing calendar days */
  days: PropTypes.arrayOf(PropTypes.instanceOf(Date)),

  /** Array of duty schedule entries with employee assignments */
  allEntries: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.instanceOf(Date),
      employeeSchedules: PropTypes.array,
    })
  ),

  /** Array of holiday objects */
  holidays: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),

  /** Whether to show employee details in calendar cells */
  showEmployeeDetails: PropTypes.bool,

  /** Whether this is for print view (affects styling) */
  isPrintView: PropTypes.bool,

  /** Additional CSS classes */
  className: PropTypes.string,

  /** Week days configuration */
  weekDays: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      isWeekend: PropTypes.bool.isRequired,
    })
  ),
};

CalendarDayCell.propTypes = {
  day: PropTypes.instanceOf(Date),
  allEntries: PropTypes.array,
  holidays: PropTypes.array,
  showEmployeeDetails: PropTypes.bool,
  isPrintView: PropTypes.bool,
};

CalendarHeader.propTypes = {
  weekDays: PropTypes.array,
};

export default DutyScheduleCalendar;
