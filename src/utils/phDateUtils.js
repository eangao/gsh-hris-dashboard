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

/**
 * Converts a PH-local time string (e.g., '08:00') to a UTC ISO string (e.g., '1970-01-01T00:00:00.000Z').
 * Used for storing time-only fields in MongoDB as UTC ISO.
 * @param {string} time24 - Time string in HH:mm format (PH time)
 * @returns {string|null} - UTC ISO string or null if invalid
 */
export const convertTimePHToUTCISO = (time24) => {
  if (!time24) return ""; // Return empty string if no value (model default)
  const [hour, minute] = time24.split(":").map(Number);
  if (isNaN(hour) || isNaN(minute)) return "";
  const m = moment
    .tz("1970-01-01", "Asia/Manila")
    .hour(hour)
    .minute(minute)
    .second(0)
    .millisecond(0);
  return m.clone().utc().toISOString();
};

/**
 * Converts a UTC ISO time string (e.g., '1970-01-01T00:00:00.000Z') to PH-local time string (e.g., '08:00').
 * Used for displaying time-only fields from MongoDB in PH time.
 * @param {string} timeISO - UTC ISO time string
 * @returns {string} - Time string in HH:mm (PH time)
 */
export const convertTimeUTCISOToPH = (timeISO) => {
  if (!timeISO) return "";
  // If already in HH:mm format, just return
  if (/^\d{2}:\d{2}$/.test(timeISO)) return timeISO;
  return moment.utc(timeISO).tz("Asia/Manila").format("HH:mm");
};

/**
 * Formats a time value (ISO string or HH:mm) to PH 12-hour display string (e.g., '2:30 PM').
 * Returns empty string if input is empty or invalid.
 * @param {string} timeValue - ISO string or HH:mm
 * @returns {string} - 12-hour formatted time string in PH time
 */
export const formatTimeTo12HourPH = (timeValue) => {
  if (!timeValue) return "";
  // If ISO string, convert to PH time
  const timePH = convertTimeUTCISOToPH(timeValue);
  if (!timePH) return "";
  const [hours, minutes] = timePH.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return date.toLocaleTimeString([], options);
};

/**
 * Formats a Date object to PH-local date and 12-hour time string (e.g., 'July 1, 2025, 2:30 PM').
 * @param {Date} date - JS Date object
 * @param {string} dateFormat - moment.js format string for date (default: 'MMMM D, YYYY')
 * @returns {string} - Formatted date and time string in PH timezone
 */
export const formatDateTimePH = (date, dateFormat = "MMMM D, YYYY") => {
  if (!date) return "";
  const m = moment(date).tz("Asia/Manila");
  const dateStr = m.format(dateFormat);
  const timeStr = m.format("h:mm A");
  return `${dateStr}, ${timeStr}`;
};

/**
 * Calculates age based on birthdate (ISO string or date string), using Asia/Manila timezone.
 * Accepts ISO string (e.g., '1991-07-30T16:00:00.000Z'), 'YYYY-MM-DD', or Date object.
 * Returns a user-friendly string or "Invalid date" if input is invalid.
 *
 * @param {string|Date} birthdate - ISO string, 'YYYY-MM-DD', or Date
 * @returns {string} - e.g., '42 years old'
 */
export const getAgePHFromISO = (birthdate) => {
  if (!birthdate) return "Invalid date";
  const m = moment.tz(birthdate, "Asia/Manila");
  if (!m.isValid()) return "Invalid date";
  const todayPH = moment.tz("Asia/Manila");
  const age = todayPH.diff(m, "years");
  return `${age} `;
};

/**
 * Formats a date (Date object, ISO string, or PH-local string) to a PH-localized readable string (e.g., 'July 2, 2025').
 * @param {Date|string} input - Date object or date string
 * @param {string} format - moment.js format string (default: 'MMMM D, YYYY')
 * @returns {string}
 */
export const formatReadableDatePH = (input, format = "MMMM D, YYYY") => {
  if (!input) return "";
  return moment(input).tz("Asia/Manila").format(format);
};

/**
 * Returns a PH-localized date range for attendance queries.
 * - On initial render: start = today at 12:00 AM PH time, end = current PH time (now)
 * - For viewType 'last7': start = 6 days before today at 12:00 AM PH time, end = current PH time (now)
 * - For viewType 'last30': start = 29 days before today at 12:00 AM PH time, end = current PH time (now)
 * - For viewType 'range': start and end are provided, but start is set to 12:00 AM PH time, end is set to current PH time if end is today, else 11:59:59 PM PH time
 *
 * @param {string} viewType - 'last7', 'last30', 'range', or 'initial'
 * @param {Date|string} [customStart] - For 'range', the custom start date
 * @param {Date|string} [customEnd] - For 'range', the custom end date
 * @returns {{ start: Date, end: Date }}
 */
export const getAttendanceDateRangePH = (
  viewType = "last7",
  customStart,
  customEnd
) => {
  const nowPH = moment().tz("Asia/Manila");
  let start, end;

  if (viewType === "last7") {
    // Start: 6 days before today at 12:00 AM PH, End: now PH
    start = nowPH.clone().subtract(6, "days").startOf("day").toDate();
    end = nowPH.toDate();
  } else if (viewType === "last30") {
    // Start: 29 days before today at 12:00 AM PH, End: now PH
    start = nowPH.clone().subtract(29, "days").startOf("day").toDate();
    end = nowPH.toDate();
  } else if (viewType === "range") {
    // Custom range: start at 12:00 AM PH, end at 11:59:59 PM PH unless end is today, then use now PH
    const startMoment = moment.tz(customStart, "Asia/Manila").startOf("day");
    let endMoment = moment.tz(customEnd, "Asia/Manila");
    if (endMoment.isSame(nowPH, "day")) {
      endMoment = nowPH;
    } else {
      endMoment = endMoment.endOf("day");
    }
    start = startMoment.toDate();
    end = endMoment.toDate();
  } else {
    // Fallback: today at 12:00 AM PH to now PH
    start = nowPH.clone().startOf("day").toDate();
    end = nowPH.toDate();
  }

  return { start, end };
};
