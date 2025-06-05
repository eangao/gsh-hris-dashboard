import moment from "moment-timezone";

/**
 * Returns today's date in Asia/Manila timezone
 * as a native JavaScript Date object
 */
export function getTodayDate() {
  return moment.tz("Asia/Manila").startOf("day").toDate();
}
