// utils/phDateUtils.js
import moment from "moment-timezone";

/**
 * Formats a Date or string to PH-local formatted string.
 * Default format: 'YYYY-MM-DD'.
 *
 * @param {Date|string} input - JS Date object or date string
 * @param {string} format - moment.js format string
 * @returns {string} - Formatted date string in PH timezone
 */
export const formatDatePH = (input, format = "YYYY-MM-DD") => {
  if (!input) return "";
  const date = input instanceof Date ? moment(input) : moment(input);
  return date.tz("Asia/Manila").format(format);
};

/**
 * Converts a PH-local date string (e.g., '2025-06-05') to a UTC ISO string.
 * Used for submitting dates to APIs or databases.
 *
 * @param {string} phDateStr - Date string in PH-local format
 * @returns {string|null} - UTC ISO date string or null if invalid
 */
export const convertDatePHToUTCISO = (phDateStr) => {
  if (!phDateStr) return null;
  return moment.tz(phDateStr, "Asia/Manila").toISOString();
};

/**
 * Converts 24-hour time string (e.g., '14:30') to 12-hour format (e.g., '2:30 PM') in PH timezone.
 *
 * @param {string} time24 - Time string in HH:mm format
 * @returns {string} - Formatted 12-hour time string
 */
export const formatTime12hPH = (time24) => {
  if (!time24) return "";
  const [hour, minute] = time24.split(":");
  return moment
    .utc()
    .hour(hour)
    .minute(minute)
    .tz("Asia/Manila")
    .format("h:mm A");
};

/**
 * Formats a date into "Month Year" or "Month Day, Year" string.
 *
 * @param {Date|string} date
 * @param {boolean} includeDay - Whether to include the day (e.g., 'April 25, 2025')
 * @returns {string}
 */
export const formatMonthYearPH = (date, includeDay = false) => {
  if (!date) return "";
  return moment(date)
    .tz("Asia/Manila")
    .format(includeDay ? "MMMM D, YYYY" : "MMMM YYYY");
};

/**
 * Returns the PH-local duty schedule range based on a reference date.
 *  - Starts from 26th of the previous month
 *  - Ends on 25th of the current month
 *

 * @param {Date} dateInMonth - A date within the target month
 * @param {boolean} asDateObjects - If true, returns raw Date objects instead of formatted strings
 * @returns {{ startDate: string|Date, endDate: string|Date }}
 */
export const getDutyScheduleRangePH = (
  dateInMonth = new Date(),
  asDateObjects = false
) => {
  const year = dateInMonth.getFullYear();
  const month = dateInMonth.getMonth();

  const startDate = new Date(year, month - 1, 26);
  const endDate = new Date(year, month, 25);

  return asDateObjects
    ? { startDate, endDate }
    : {
        startDate: formatDatePH(startDate),
        endDate: formatDatePH(endDate),
      };
};

/**
 * Returns an array of Date objects between two dates (inclusive).
 * Useful for rendering calendar grids.
 *
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {Date[]}
 */
export const getCalendarDaysInRangePH = (startDate, endDate) => {
  const days = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
};

/**
 * Returns the current date and time in Asia/Manila timezone.
 * Useful for real-time timestamps or when tracking current moment in PH time.
 *
 * @returns {Date} - JavaScript Date object with current PH-local time.
 */
export const getCurrentDatePH = () => {
  return moment().tz("Asia/Manila").toDate();
};

/**
 * Returns today's date set to midnight (00:00:00) in Asia/Manila timezone.
 * Ideal for date-only comparisons or generating calendar days without time offsets.
 *
 * @returns {Date} - JavaScript Date object at start of today in PH time.
 */
export const getTodayDatePH = () => {
  return moment.tz("Asia/Manila").startOf("day").toDate();
};

/**
 * Returns a PH-formatted label for the given date (e.g., 'June 2025').
 *
 * @param {Date|string} date
 * @returns {string}
 */
export const getMonthLabelPH = (date) => {
  return formatDatePH(date, "MMMM YYYY");
};

/**
 * Parses a date string or Date object into a JS Date object in PH timezone.
 *
 * @param {string|Date} input
 * @returns {Date}
 */
export const parseDatePH = (input) => {
  return moment.tz(input, "Asia/Manila").toDate();
};

/**
 * Returns dynamic min and max birthdate limits based on:
 * - Minimum age: 18
 * - Maximum age: 65 (retirement age)
 * Returned as JS Date objects.
 *
 * @returns {{ minDate: Date, maxDate: Date }}
 */
export const getBirthdateLimits = () => {
  const today = moment.tz("Asia/Manila");
  const minDate = today.clone().subtract(65, "years").toDate(); // Oldest allowed
  const maxDate = today.clone().subtract(18, "years").toDate(); // Youngest allowed

  return { minDate, maxDate };
};

/**
 * Calculates age based on birthdate, using Asia/Manila timezone.
 * Accepts date string in 'YYYY-MM-DD' format.
 * Returns a user-friendly string or "Invalid date" if input is invalid.
 *
 * @param {string} birthdate - in 'YYYY-MM-DD' format
 * @returns {string} - e.g., '42 years old'
 */
export const getAgePH = (birthdate) => {
  if (!birthdate || !moment(birthdate, "YYYY-MM-DD", true).isValid()) {
    return "Invalid date";
  }

  const todayPH = moment.tz("Asia/Manila");
  const birth = moment.tz(birthdate, "Asia/Manila");
  const age = todayPH.diff(birth, "years");

  return `${age} years old`;
};
