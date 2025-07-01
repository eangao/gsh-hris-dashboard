/**
 * Optimized Duty Schedule Details Component
 *
 * This component has been refactored to use shared utilities and components
 * to reduce code duplication and improve maintainability.
 *
 * @author HRIS Development Team
 * @version 2.0.0
 */

import React from "react";
import PropTypes from "prop-types";
import { useDutySchedule } from "../../hooks/useDutySchedule";
import { useApprovalActions } from "../../hooks/useApprovalActions";
import DutyScheduleHeader, {
  LoadingSpinner,
  ErrorMessage,
} from "./DutyScheduleHeader";
import DutyScheduleCalendar from "./DutyScheduleCalendar";
import ApprovalActions, { ApprovalModal } from "./ApprovalActions";
import { formatMonthYearPH } from "../../utils/phDateUtils";

/**
 * Schedule information panel
 */
const ScheduleInfoPanel = ({ dutySchedule }) => {
  if (!dutySchedule) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600">
            Department
          </label>
          <p className="text-lg font-semibold">
            {dutySchedule.department?.name || "N/A"}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">
            Schedule Period
          </label>
          <p className="text-lg font-semibold">
            {formatMonthYearPH(dutySchedule.startDate, true)} -{" "}
            {formatMonthYearPH(dutySchedule.endDate, true)}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">
            Created By
          </label>
          <p className="text-lg font-semibold">
            {dutySchedule.submittedBy?.firstName}{" "}
            {dutySchedule.submittedBy?.lastName}
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Status</label>
          <p className="text-lg font-semibold capitalize">
            {dutySchedule.status?.replace("_", " ") || "Draft"}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Approval history panel
 */
const ApprovalHistoryPanel = ({ dutySchedule }) => {
  if (!dutySchedule) return null;

  const approvals = [
    {
      type: "Manager Submission",
      approver: dutySchedule.submittedBy,
      date: dutySchedule.submittedAt,
      remarks: dutySchedule.submissionRemarks,
    },
    {
      type: "Director Approval",
      approver: dutySchedule.directorApproval?.approvedBy,
      date: dutySchedule.directorApproval?.approvedAt,
      remarks: dutySchedule.directorApproval?.remarks,
      status: dutySchedule.directorApproval?.status,
    },
    {
      type: "HR Approval",
      approver: dutySchedule.hrApproval?.approvedBy,
      date: dutySchedule.hrApproval?.approvedAt,
      remarks: dutySchedule.hrApproval?.remarks,
      status: dutySchedule.hrApproval?.status,
    },
  ].filter((approval) => approval.approver || approval.date);

  if (!approvals.length) return null;

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Approval History</h3>
      <div className="space-y-3">
        {approvals.map((approval, index) => (
          <div key={index} className="border-l-4 border-blue-200 pl-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{approval.type}</p>
                <p className="text-sm text-gray-600">
                  {approval.approver?.firstName} {approval.approver?.lastName}
                </p>
                {approval.remarks && (
                  <p className="text-sm text-gray-500 mt-1">
                    "{approval.remarks}"
                  </p>
                )}
              </div>
              <div className="text-right">
                {approval.date && (
                  <p className="text-sm text-gray-500">
                    {formatMonthYearPH(approval.date, true)}
                  </p>
                )}
                {approval.status && (
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      approval.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {approval.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Main Duty Schedule Details Component
 */
const DutyScheduleDetails = ({
  scheduleId,
  approvalType = "",
  employeeId = "",
  onNavigateBack,
  className = "",
}) => {
  // Use custom hooks for data and approval management
  const {
    dutySchedule,
    loading,
    errorMessage,
    days,
    allEntries,
    refreshSchedule,
  } = useDutySchedule(scheduleId, employeeId);

  const {
    passwordModal,
    password,
    showPassword,
    remarks,
    openApprovalModal,
    closeModal,
    handleApprovalSubmit,
    handleInputChange,
    modalTitle,
    isFormValid,
    isLoading: approvalLoading,
    togglePasswordVisibility,
  } = useApprovalActions(approvalType);

  /**
   * Handle print navigation
   */
  const handlePrint = () => {
    // Navigation logic would depend on your routing setup
    const printUrl = employeeId
      ? `/dashboard/employee/duty-schedule/${employeeId}/${scheduleId}/print`
      : `/dashboard/duty-schedule/${scheduleId}/print`;
    window.open(printUrl, "_blank");
  };

  /**
   * Prepare header actions based on approval type and schedule status
   */
  const getHeaderActions = () => {
    const actions = [];

    // Print action (always available)
    actions.push({
      key: "print",
      label: "Print Schedule",
      onClick: handlePrint,
      variant: "outline",
    });

    // Refresh action
    actions.push({
      key: "refresh",
      label: "Refresh",
      onClick: refreshSchedule,
      variant: "outline",
    });

    return actions;
  };

  // Error state
  if (errorMessage && !loading) {
    return (
      <div className={`min-h-screen bg-white p-4 ${className}`}>
        <DutyScheduleHeader
          title="Duty Schedule Details"
          showBackButton={true}
          onBack={onNavigateBack}
        />
        <ErrorMessage message={errorMessage} onRetry={refreshSchedule} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white p-4 ${className}`}>
      {/* Header */}
      <DutyScheduleHeader
        title={
          dutySchedule?.name
            ? `${dutySchedule.name} Duty Schedule`
            : "Duty Schedule Details"
        }
        subtitle={dutySchedule?.department?.name}
        showBackButton={true}
        onBack={onNavigateBack}
        actions={getHeaderActions()}
        loading={loading}
      />

      {/* Loading state */}
      {loading ? (
        <LoadingSpinner message="Loading duty schedule details..." />
      ) : (
        <>
          {/* Schedule information panel */}
          <ScheduleInfoPanel dutySchedule={dutySchedule} />

          {/* Approval actions (for approvers only) */}
          {approvalType && dutySchedule && (
            <div className="mb-6">
              <ApprovalActions
                scheduleId={scheduleId}
                currentStatus={dutySchedule.status}
                approvalType={approvalType}
                onApprove={(id) => openApprovalModal("approve", id)}
                onReject={(id) => openApprovalModal("reject", id)}
                disabled={loading || approvalLoading}
              />
            </div>
          )}

          {/* Calendar view */}
          <DutyScheduleCalendar
            days={days}
            allEntries={allEntries}
            showEmployeeDetails={true}
            isPrintView={false}
            className="mb-6"
          />

          {/* Approval history */}
          <ApprovalHistoryPanel dutySchedule={dutySchedule} />

          {/* Approval modal */}
          <ApprovalModal
            isOpen={passwordModal.open}
            onClose={closeModal}
            title={modalTitle}
            action={passwordModal.action}
            password={password}
            onPasswordChange={handleInputChange.password}
            showPassword={showPassword}
            onTogglePassword={togglePasswordVisibility}
            remarks={remarks}
            onRemarksChange={handleInputChange.remarks}
            onSubmit={handleApprovalSubmit}
            isLoading={approvalLoading}
            isFormValid={isFormValid}
          />
        </>
      )}
    </div>
  );
};

// PropTypes for type checking and documentation
DutyScheduleDetails.propTypes = {
  /** The duty schedule ID to display */
  scheduleId: PropTypes.string.isRequired,

  /** Type of approval view ('director', 'hr', 'manager', or empty for employee view) */
  approvalType: PropTypes.oneOf(["director", "hr", "manager", ""]),

  /** Optional employee ID for employee-specific views */
  employeeId: PropTypes.string,

  /** Custom navigation handler */
  onNavigateBack: PropTypes.func,

  /** Additional CSS classes */
  className: PropTypes.string,
};

ScheduleInfoPanel.propTypes = {
  dutySchedule: PropTypes.object,
};

ApprovalHistoryPanel.propTypes = {
  dutySchedule: PropTypes.object,
};

export default DutyScheduleDetails;
