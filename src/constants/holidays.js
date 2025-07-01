/**
 * Holiday Constants for the HRIS System
 *
 * This file contains holiday data that can be used across the application
 * for duty schedule calculations and calendar displays.
 *
 * @author HRIS Development Team
 * @version 1.0.0
 */

/**
 * Philippine holidays for 2025
 * Format: { date: 'YYYY-MM-DD', name: 'Holiday Name' }
 */
export const HOLIDAYS_2025 = [
  { date: "2025-01-01", name: "New Year's Day" },
  { date: "2025-04-18", name: "Good Friday" },
  { date: "2025-05-01", name: "Labor Day" },
  { date: "2025-06-12", name: "Independence Day" },
  { date: "2025-08-21", name: "Ninoy Aquino Day" },
  { date: "2025-08-25", name: "National Heroes Day" },
  { date: "2025-11-30", name: "Bonifacio Day" },
  { date: "2025-12-25", name: "Christmas Day" },
  { date: "2025-12-30", name: "Rizal Day" },
];

/**
 * Get all holidays for a specific year
 * @param {number} year - The year to get holidays for
 * @returns {Array} Array of holiday objects
 */
export const getHolidaysForYear = (year) => {
  // For now, only 2025 is supported
  if (year === 2025) {
    return HOLIDAYS_2025;
  }

  // Add support for other years as needed
  return [];
};

/**
 * Default holiday data (current year)
 */
export const DEFAULT_HOLIDAYS = HOLIDAYS_2025;
