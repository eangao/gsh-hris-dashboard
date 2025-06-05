import { useCallback } from "react";
import moment from "moment-timezone";

/**
 * Hook that converts a Manila-local date string (YYYY-MM-DD)
 * into an ISO 8601 string in UTC timezone.
 *
 * Example:
 * Input: "2025-06-05" (assumed to be Asia/Manila)
 * Output: "2025-06-04T16:00:00.000Z" (UTC ISO string)
 *
 * Use this before submitting date data to MongoDB or APIs.
 *
 * @returns {function(string): string|null}
 */
export function useManilaToISODate() {
  return useCallback((manilaDateStr) => {
    if (!manilaDateStr) return null;

    // Parse with Asia/Manila timezone and convert to UTC ISO string
    return moment.tz(manilaDateStr, "Asia/Manila").toISOString();
  }, []);
}
