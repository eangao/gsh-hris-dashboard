// utils/phDateUtils.js
import moment from "moment-timezone";

/**
 * Formats a Date or string to PH-local formatted string at PH midnight (00:00:00).
 * Default format: 'YYYY-MM-DD'.
 *
 * Always sets the time to midnight in Asia/Manila timezone before formatting.
 *
 * @param {Date|string} input - JS Date object or date string
 * @param {string} format - moment.js format string
 * @returns {string} - Formatted date string in PH timezone at midnight
 */
export const formatDatePH = (input, format = "YYYY-MM-DD") => {
  if (!input) return "";
  const date = input instanceof Date ? moment(input) : moment(input);
  return date.tz("Asia/Manila").startOf("day").format(format);
};

/**
 * Combines a date string and time string into a UTC ISO string.
 * Both date and time are treated as Asia/Manila timezone.
 *
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @param {string} timeStr - Time string in HH:mm format
 * @returns {string|null} - UTC ISO string or null if invalid
 */
export const combineDateTimeToUTC = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;

  // Combine date and time in Asia/Manila timezone
  const phDateTime = moment.tz(`${dateStr} ${timeStr}`, "Asia/Manila");

  if (!phDateTime.isValid()) return null;

  return phDateTime.utc().toISOString();
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
 * Formats a date into month schedule format (YYYY-MM) for duty schedules.
 * This format is used for MongoDB indexing and filtering by month/year.
 *
 * @param {Date|string} date - Date object or date string
 * @returns {string} - Formatted month schedule string in YYYY-MM format
 */
export const formatMonthSchedulePH = (date) => {
  if (!date) return "";
  return moment(date).tz("Asia/Manila").format("YYYY-MM");
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

/**
 * Formats a DateTime object (ISO string or Date) to PH-local 12-hour time string (e.g., '7:45 AM').
 * Specifically handles DateTime objects that may contain date and time information.
 * @param {string|Date} dateTime - ISO string or Date object
 * @returns {string} - 12-hour formatted time string in PH timezone
 */
export const formatDateTimeToTimePH = (dateTime) => {
  if (!dateTime) return "";
  const m = moment(dateTime).tz("Asia/Manila");
  return m.format("h:mm A");
};

/**
 * Calculates days remaining until next birthday from a birthdate.
 * Returns negative values for birthdays that have passed this year.
 * @param {string|Date} birthdate - ISO string or Date object
 * @returns {number} - Days until birthday (negative if passed this year)
 */
export const getDaysUntilBirthdayPH = (birthdate) => {
  if (!birthdate) return null;

  const today = moment().tz("Asia/Manila").startOf("day");
  const birth = moment(birthdate).tz("Asia/Manila");

  // Get this year's birthday
  const thisYearBirthday = birth.clone().year(today.year()).startOf("day");

  // If birthday has passed this year, get next year's birthday
  const nextBirthday = thisYearBirthday.isBefore(today)
    ? thisYearBirthday.clone().add(1, "year")
    : thisYearBirthday;

  return nextBirthday.diff(today, "days");
};

/**
 * Gets employees with upcoming birthdays within specified days, sorted by days remaining.
 * @param {Array} employees - Array of employee objects
 * @param {number} withinDays - Number of days to look ahead (default: 30)
 * @returns {Array} - Sorted array of employees with upcoming birthdays
 */
export const getUpcomingBirthdaysPH = (employees, withinDays = 30) => {
  if (!employees || !Array.isArray(employees)) return [];

  const employeesWithBirthdays = employees
    .filter((emp) => emp.personalInformation?.birthdate)
    .map((emp) => {
      const daysUntil = getDaysUntilBirthdayPH(
        emp.personalInformation.birthdate
      );
      return {
        ...emp,
        daysUntilBirthday: daysUntil,
        birthdayThisYear: moment(emp.personalInformation.birthdate)
          .tz("Asia/Manila")
          .year(moment().tz("Asia/Manila").year())
          .format("MMMM D"),
      };
    })
    .filter(
      (emp) => emp.daysUntilBirthday >= 0 && emp.daysUntilBirthday <= withinDays
    )
    .sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);

  return employeesWithBirthdays;
};

/**
 * Formats days until birthday into a readable string.
 * @param {number} days - Days until birthday
 * @returns {string} - Formatted string (e.g., "Today", "Tomorrow", "5 days")
 */
export const formatDaysUntilBirthdayPH = (days) => {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days`;
};

/**
 * Gets employees with birthdays in different time periods.
 * @param {Array} employees - Array of employee objects
 * @param {string} period - 'yesterday', 'today', 'tomorrow', 'thisWeek', 'lastWeek', 'thisMonth', 'nextMonth', 'lastMonth', 'twoDaysAgo', 'threeDaysAgo', 'twoDaysFromNow', 'threeDaysFromNow', 'fourDaysFromNow', 'fiveDaysFromNow', 'sixDaysFromNow', 'oneWeekFromNow'
 * @returns {Array} - Filtered and sorted array of employees
 */
export const getEmployeesBirthdaysByPeriod = (employees, period) => {
  if (!employees || !Array.isArray(employees)) return [];

  const today = moment().tz("Asia/Manila").startOf("day");
  const employeesWithBirthdays = employees
    .filter((emp) => emp.personalInformation?.birthdate)
    .map((emp) => {
      const birthdate = moment(emp.personalInformation.birthdate).tz(
        "Asia/Manila"
      );

      // Calculate this year's birthday
      const thisYearBirthday = birthdate
        .clone()
        .year(today.year())
        .startOf("day");

      // Calculate days difference from today to this year's birthday
      const daysDiff = thisYearBirthday.diff(today, "days");

      // For broader periods, we might need to consider next year's birthday if it's far in the past
      let relevantBirthday = thisYearBirthday;
      let actualDaysFromToday = daysDiff;

      // If birthday was more than 6 months ago, consider next year's birthday for display
      if (daysDiff < -180) {
        relevantBirthday = birthdate
          .clone()
          .year(today.year() + 1)
          .startOf("day");
        actualDaysFromToday = relevantBirthday.diff(today, "days");
      }

      return {
        ...emp,
        daysUntilBirthday: actualDaysFromToday,
        actualDaysFromToday: actualDaysFromToday,
        birthdayThisYear: relevantBirthday.format("MMMM D"),
        relevantBirthday: relevantBirthday.toDate(),
      };
    });

  // Filter based on period
  let filteredEmployees = [];

  switch (period) {
    case "yesterday":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === -1
      );
      break;

    case "today":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === 0
      );
      break;

    case "tomorrow":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === 1
      );
      break;

    case "twoDaysAgo":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === -2
      );
      break;

    case "threeDaysAgo":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === -3
      );
      break;

    case "twoDaysFromNow":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === 2
      );
      break;

    case "threeDaysFromNow":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === 3
      );
      break;

    case "fourDaysFromNow":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === 4
      );
      break;

    case "fiveDaysFromNow":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === 5
      );
      break;

    case "sixDaysFromNow":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === 6
      );
      break;

    case "oneWeekFromNow":
      filteredEmployees = employeesWithBirthdays.filter(
        (emp) => emp.actualDaysFromToday === 7
      );
      break;

    case "thisWeek":
      const weekStart = today.clone().startOf("week");
      const weekEnd = today.clone().endOf("week");
      filteredEmployees = employeesWithBirthdays.filter((emp) => {
        const birthday = moment(emp.relevantBirthday);
        return birthday.isBetween(weekStart, weekEnd, "day", "[]");
      });
      break;

    case "lastWeek":
      const lastWeekStart = today.clone().subtract(1, "week").startOf("week");
      const lastWeekEnd = today.clone().subtract(1, "week").endOf("week");
      filteredEmployees = employeesWithBirthdays.filter((emp) => {
        const birthday = moment(emp.relevantBirthday);
        return birthday.isBetween(lastWeekStart, lastWeekEnd, "day", "[]");
      });
      break;

    case "thisMonth":
      const monthStart = today.clone().startOf("month");
      const monthEnd = today.clone().endOf("month");
      filteredEmployees = employeesWithBirthdays.filter((emp) => {
        const birthday = moment(emp.relevantBirthday);
        return birthday.isBetween(monthStart, monthEnd, "day", "[]");
      });
      break;

    case "lastMonth":
      const lastMonthStart = today
        .clone()
        .subtract(1, "month")
        .startOf("month");
      const lastMonthEnd = today.clone().subtract(1, "month").endOf("month");
      filteredEmployees = employeesWithBirthdays.filter((emp) => {
        const birthday = moment(emp.relevantBirthday);
        return birthday.isBetween(lastMonthStart, lastMonthEnd, "day", "[]");
      });
      break;

    case "nextMonth":
      const nextMonthStart = today.clone().add(1, "month").startOf("month");
      const nextMonthEnd = today.clone().add(1, "month").endOf("month");
      filteredEmployees = employeesWithBirthdays.filter((emp) => {
        const birthday = moment(emp.relevantBirthday);
        return birthday.isBetween(nextMonthStart, nextMonthEnd, "day", "[]");
      });
      break;

    default:
      filteredEmployees = employeesWithBirthdays;
  }

  // Sort by birthday date from past to future
  return filteredEmployees.sort((a, b) => {
    return moment(a.relevantBirthday).diff(moment(b.relevantBirthday));
  });
};

/**
 * Gets birthday statistics for different periods.
 * @param {Array} employees - Array of employee objects
 * @returns {Object} - Statistics object with counts for each period
 */
export const getBirthdayStatsPH = (employees) => {
  return {
    // Past periods
    threeDaysAgo: getEmployeesBirthdaysByPeriod(employees, "threeDaysAgo")
      .length,
    twoDaysAgo: getEmployeesBirthdaysByPeriod(employees, "twoDaysAgo").length,
    yesterday: getEmployeesBirthdaysByPeriod(employees, "yesterday").length,

    // Present
    today: getEmployeesBirthdaysByPeriod(employees, "today").length,

    // Future periods
    tomorrow: getEmployeesBirthdaysByPeriod(employees, "tomorrow").length,
    twoDaysFromNow: getEmployeesBirthdaysByPeriod(employees, "twoDaysFromNow")
      .length,
    threeDaysFromNow: getEmployeesBirthdaysByPeriod(
      employees,
      "threeDaysFromNow"
    ).length,
    fourDaysFromNow: getEmployeesBirthdaysByPeriod(employees, "fourDaysFromNow")
      .length,
    fiveDaysFromNow: getEmployeesBirthdaysByPeriod(employees, "fiveDaysFromNow")
      .length,
    sixDaysFromNow: getEmployeesBirthdaysByPeriod(employees, "sixDaysFromNow")
      .length,
    oneWeekFromNow: getEmployeesBirthdaysByPeriod(employees, "oneWeekFromNow")
      .length,

    // Broader periods
    lastWeek: getEmployeesBirthdaysByPeriod(employees, "lastWeek").length,
    thisWeek: getEmployeesBirthdaysByPeriod(employees, "thisWeek").length,
    thisMonth: getEmployeesBirthdaysByPeriod(employees, "thisMonth").length,
    lastMonth: getEmployeesBirthdaysByPeriod(employees, "lastMonth").length,
    nextMonth: getEmployeesBirthdaysByPeriod(employees, "nextMonth").length,
  };
};

/**
 * Converts a UTC Date object or ISO string to a compact PH date format (M/D/YY).
 * Used for displaying compensatory work dates in a space-efficient format.
 * @param {Date|string} utcDate - UTC Date object or ISO string
 * @returns {string} - Formatted date string in M/D/YY format (PH timezone)
 */
export const formatUTCToCompactDatePH = (utcDate) => {
  if (!utcDate) return "";
  try {
    const date = typeof utcDate === "string" ? new Date(utcDate) : utcDate;
    if (isNaN(date.getTime())) return "";

    return moment(date).tz("Asia/Manila").format("M/D/YY");
  } catch (error) {
    console.error(
      "Error formatting UTC date to compact PH format:",
      utcDate,
      error
    );
    return "";
  }
};
