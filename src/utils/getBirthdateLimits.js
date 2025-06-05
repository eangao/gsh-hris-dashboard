import moment from "moment";

/**
 * Returns dynamic min and max birthdate limits based on:
 * - Minimum age: 18
 * - Maximum age: 65 (retirement age)
 */
export function getBirthdateLimits() {
  const today = moment();
  const minDate = today.clone().subtract(65, "years").toDate(); // oldest allowed
  const maxDate = today.clone().subtract(18, "years").toDate(); // youngest allowed

  return { minDate, maxDate };
}
