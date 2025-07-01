/**
 * Duty Schedule Components Index
 *
 * This file provides a centralized export point for all duty schedule
 * related components, hooks, and utilities.
 *
 * @author HRIS Development Team
 * @version 2.0.0
 */

// Core Components
export { default as DutyScheduleCalendar } from "./DutyScheduleCalendar";
export {
  default as DutyScheduleHeader,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  ActionButton,
  BackButton,
} from "./DutyScheduleHeader";
export {
  default as ApprovalActions,
  ApprovalModal,
  ApprovalButtons,
  StatusBadge,
  PasswordInput,
  RemarksInput,
} from "./ApprovalActions";

// Optimized Components
export { default as OptimizedDutySchedulePrint } from "./OptimizedDutySchedulePrint";
export { default as OptimizedDutyScheduleDetails } from "./OptimizedDutyScheduleDetails";

// Legacy Components (for backward compatibility)
export { default as DutySchedulePrint } from "./DutySchedulePrint";
export { default as DutyScheduleDetails } from "./DutySheduleDetails";

// Re-export hooks
export { useDutySchedule } from "../../hooks/useDutySchedule";
export { useApprovalActions } from "../../hooks/useApprovalActions";

// Re-export utilities
export * from "../../utils/dutyScheduleUtils";
export * from "../../constants/holidays";

/**
 * Usage Examples:
 *
 * // Import specific components
 * import { DutyScheduleCalendar, useDutySchedule } from './components/dutySchedule';
 *
 * // Import utilities
 * import { isHoliday, getEmployeesForDate } from './components/dutySchedule';
 *
 * // Import optimized components
 * import { OptimizedDutySchedulePrint } from './components/dutySchedule';
 */
