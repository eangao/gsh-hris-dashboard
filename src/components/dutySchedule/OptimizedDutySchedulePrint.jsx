/**
 * Optimized Duty Schedule Print Component
 *
 * This component has been refactored to use shared utilities and components
 * to reduce code duplication and improve maintainability.
 *
 * @author HRIS Development Team
 * @version 2.0.0
 */

import React from "react";
import PropTypes from "prop-types";
import { formatMonthYearPH } from "../../utils/phDateUtils";
import { useDutySchedule } from "../../hooks/useDutySchedule";
import DutyScheduleHeader, { LoadingSpinner } from "./DutyScheduleHeader";
import DutyScheduleCalendar from "./DutyScheduleCalendar";
import "./DutySchedulePrint.css";

/**
 * Print header component for printed documents
 */
const PrintHeader = ({ dutySchedule }) => (
  <div className="mb-1 hidden print:flex print:mb-1 print:justify-between">
    <div className="text-left leading-tight">
      <h2 className="text-base font-bold uppercase tracking-wide">
        ADVENTIST HOSPITAL GINGOOG
      </h2>
      <h3 className="text-sm font-semibold uppercase">
        {dutySchedule?.name} Duty Schedule
      </h3>
    </div>
    <div className="text-right leading-tight">
      <p className="text-xs">
        <span className="font-bold">Schedule Duration:</span>{" "}
        {formatMonthYearPH(dutySchedule?.startDate, true)} -{" "}
        {formatMonthYearPH(dutySchedule?.endDate, true)}
      </p>
      <p className="text-xs">
        <span className="font-bold">Date Printed:</span>{" "}
        {formatMonthYearPH(new Date(), true)}
      </p>
    </div>
  </div>
);

/**
 * Print signature section component
 */
const SignatureSection = ({ dutySchedule }) => (
  <div className="print:block hidden mt-10 text-sm">
    <div className="flex justify-between text-center mt-20">
      {/* Prepared by */}
      <div className="w-1/3">
        <div className="mb-8">Prepared by:</div>
        <div className="border-b border-black w-4/5 mx-auto pt-1">
          <span className="capitalize">
            {dutySchedule?.submittedBy?.firstName}
          </span>{" "}
          {dutySchedule?.submittedBy?.middleName && (
            <span className="capitalize">
              {dutySchedule?.submittedBy?.middleName.charAt(0).toUpperCase()}.
            </span>
          )}{" "}
          <span className="capitalize">
            {dutySchedule?.submittedBy?.lastName}
          </span>{" "}
          <span className="capitalize">
            {dutySchedule?.submittedBy?.suffix || ""}
          </span>
        </div>
        <div className="mt-1 uppercase">
          {dutySchedule?.department?.name} Manager
        </div>
      </div>

      {/* Noted by */}
      <div className="w-1/3">
        <div className="mb-8">Noted by:</div>
        <div className="border-b border-black w-4/5 mx-auto pt-1">
          <span className="capitalize">
            {dutySchedule?.directorApproval?.approvedBy?.firstName}
          </span>{" "}
          {dutySchedule?.directorApproval?.approvedBy?.middleName && (
            <span className="capitalize">
              {dutySchedule?.directorApproval?.approvedBy?.middleName
                .charAt(0)
                .toUpperCase()}
              .
            </span>
          )}{" "}
          <span className="capitalize">
            {dutySchedule?.directorApproval?.approvedBy?.lastName}
          </span>{" "}
          <span className="capitalize">
            {dutySchedule?.directorApproval?.approvedBy?.suffix || ""}
          </span>
        </div>
        <div className="mt-1 uppercase">
          {dutySchedule?.directorApproval?.approvedBy?.position}
        </div>
      </div>

      {/* Approved by */}
      <div className="w-1/3">
        <div className="mb-8">Approved by:</div>
        <div className="border-b border-black w-4/5 mx-auto pt-1">
          <span className="capitalize">
            {dutySchedule?.hrApproval?.approvedBy?.firstName}
          </span>{" "}
          {dutySchedule?.hrApproval?.approvedBy?.middleName && (
            <span className="capitalize">
              {dutySchedule?.hrApproval?.approvedBy?.middleName
                .charAt(0)
                .toUpperCase()}
              .
            </span>
          )}{" "}
          <span className="capitalize">
            {dutySchedule?.hrApproval?.approvedBy?.lastName}
          </span>{" "}
          <span className="capitalize">
            {dutySchedule?.hrApproval?.approvedBy?.suffix || ""}
          </span>
        </div>
        <div className="mt-1">HR</div>
      </div>
    </div>
  </div>
);

/**
 * Print actions component
 */
const PrintActions = ({ onCancel, onPrint, loading }) => (
  <div className="flex justify-between items-center mt-6 print:hidden">
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={onCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        disabled={loading}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onPrint}
        className="no-print bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Print Schedule
      </button>
    </div>
  </div>
);

/**
 * Main Duty Schedule Print Component
 */
const DutySchedulePrint = ({
  scheduleId,
  employeeId = "",
  onCancel,
  className = "",
}) => {
  // Use custom hook for data management
  const { dutySchedule, loading, days, allEntries } = useDutySchedule(
    scheduleId,
    employeeId
  );

  /**
   * Handle cancel action (navigate back)
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    // Navigation is handled by the DutyScheduleHeader component
  };

  /**
   * Handle print action
   */
  const handlePrint = () => {
    window.print();
  };

  // Prepare header actions
  const headerActions = [
    {
      key: "cancel",
      label: "Cancel",
      onClick: handleCancel,
      variant: "secondary",
    },
    {
      key: "print",
      label: "Print Schedule",
      onClick: handlePrint,
      variant: "primary",
    },
  ];

  return (
    <div className={`bg-white p-4 print:p-0 min-h-screen ${className}`}>
      {/* Header for screen view */}
      <DutyScheduleHeader
        title={
          dutySchedule?.name
            ? `${dutySchedule.name} Duty Schedule`
            : "Duty Schedule"
        }
        showBackButton={true}
        actions={headerActions}
        loading={loading}
      />

      {/* Loading state */}
      {loading ? (
        <LoadingSpinner message="Loading duty schedule..." />
      ) : (
        <>
          {/* Print-only header */}
          <PrintHeader dutySchedule={dutySchedule} />

          {/* Calendar component */}
          <DutyScheduleCalendar
            days={days}
            allEntries={allEntries}
            showEmployeeDetails={true}
            isPrintView={true}
            className="mb-6"
          />

          {/* Print-only signature section */}
          <SignatureSection dutySchedule={dutySchedule} />

          {/* Screen-only action buttons */}
          <PrintActions
            onCancel={handleCancel}
            onPrint={handlePrint}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

// PropTypes for type checking and documentation
DutySchedulePrint.propTypes = {
  /** The duty schedule ID to display */
  scheduleId: PropTypes.string.isRequired,

  /** Optional employee ID for employee-specific views */
  employeeId: PropTypes.string,

  /** Custom cancel handler (optional) */
  onCancel: PropTypes.func,

  /** Additional CSS classes */
  className: PropTypes.string,
};

PrintHeader.propTypes = {
  dutySchedule: PropTypes.object,
};

SignatureSection.propTypes = {
  dutySchedule: PropTypes.object,
};

PrintActions.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onPrint: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default DutySchedulePrint;
