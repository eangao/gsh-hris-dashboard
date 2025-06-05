import moment from "moment-timezone";

/**
 * Returns age based on birthdate, calculated in Asia/Manila timezone.
 * If birthdate is invalid or empty, returns a fallback string.
 *
 * @param {string} birthdate - in YYYY-MM-DD format
 * @returns {string} e.g., "42 years old" or "Invalid date"
 */
export function getAge(birthdate) {
  if (!birthdate || !moment(birthdate, "YYYY-MM-DD", true).isValid()) {
    return "Invalid date";
  }

  const todayPH = moment.tz("Asia/Manila");
  const birth = moment.tz(birthdate, "Asia/Manila");
  const age = todayPH.diff(birth, "years");

  return `${age} years old`;
}
