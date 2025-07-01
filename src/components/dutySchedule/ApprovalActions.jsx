/**
 * Reusable Approval Actions Component
 *
 * This component provides approval/rejection functionality with password
 * confirmation for duty schedules. It includes modal dialogs and form handling.
 *
 * @author HRIS Development Team
 * @version 1.0.0
 */

import React from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ActionButton } from "./DutyScheduleHeader";

/**
 * Password input component with visibility toggle
 */
const PasswordInput = ({
  value,
  onChange,
  showPassword,
  onToggleVisibility,
  placeholder = "Enter your password",
  disabled = false,
}) => (
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 pr-10"
      autoComplete="current-password"
    />
    <button
      type="button"
      onClick={onToggleVisibility}
      disabled={disabled}
      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
    >
      {showPassword ? (
        <AiOutlineEyeInvisible size={20} />
      ) : (
        <AiOutlineEye size={20} />
      )}
    </button>
  </div>
);

/**
 * Remarks textarea component
 */
const RemarksInput = ({
  value,
  onChange,
  placeholder = "Enter remarks (required for rejection)",
  disabled = false,
  required = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Remarks {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={4}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 resize-vertical"
    />
  </div>
);

/**
 * Approval confirmation modal
 */
const ApprovalModal = ({
  isOpen,
  onClose,
  title,
  action,
  password,
  onPasswordChange,
  showPassword,
  onTogglePassword,
  remarks,
  onRemarksChange,
  onSubmit,
  isLoading = false,
  isFormValid = true,
}) => {
  if (!isOpen) return null;

  const isRejectAction = action === "reject";
  const modalTitle =
    title || `${action === "approve" ? "Approve" : "Reject"} Confirmation`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{modalTitle}</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <PasswordInput
              value={password}
              onChange={onPasswordChange}
              showPassword={showPassword}
              onToggleVisibility={onTogglePassword}
              disabled={isLoading}
            />
          </div>

          {/* Remarks Field - Required for rejection */}
          <RemarksInput
            value={remarks}
            onChange={onRemarksChange}
            disabled={isLoading}
            required={isRejectAction}
            placeholder={
              isRejectAction
                ? "Please provide a reason for rejection"
                : "Optional remarks"
            }
          />

          {/* Warning message for rejection */}
          {isRejectAction && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ This action will reject the duty schedule. Please provide a
                clear reason.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <ActionButton
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </ActionButton>
          <ActionButton
            variant={isRejectAction ? "danger" : "success"}
            onClick={onSubmit}
            disabled={!isFormValid || isLoading}
          >
            {isLoading
              ? "Processing..."
              : isRejectAction
              ? "Reject"
              : "Approve"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

/**
 * Approval action buttons component
 */
const ApprovalButtons = ({
  onApprove,
  onReject,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  disabled = false,
  showReject = true,
  className = "",
}) => (
  <div className={`flex space-x-3 ${className}`}>
    <ActionButton variant="success" onClick={onApprove} disabled={disabled}>
      {approveLabel}
    </ActionButton>
    {showReject && (
      <ActionButton variant="danger" onClick={onReject} disabled={disabled}>
        {rejectLabel}
      </ActionButton>
    )}
  </div>
);

/**
 * Status badge component
 */
const StatusBadge = ({ status, className = "" }) => {
  const getStatusConfig = (status) => {
    const configs = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted" },
      manager_approved: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Manager Approved",
      },
      director_approved: {
        color: "bg-orange-100 text-orange-800",
        label: "Director Approved",
      },
      hr_approved: {
        color: "bg-green-100 text-green-800",
        label: "HR Approved",
      },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    return configs[status] || configs.draft;
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
};

/**
 * Main Approval Actions Component
 */
const ApprovalActions = ({
  scheduleId,
  currentStatus,
  approvalType,
  onApprove,
  onReject,
  modalProps = {},
  disabled = false,
  className = "",
}) => {
  // Determine if actions should be shown based on status and approval type
  const shouldShowActions = () => {
    if (!scheduleId || disabled) return false;

    switch (approvalType) {
      case "manager":
        return ["draft", "submitted"].includes(currentStatus);
      case "director":
        return currentStatus === "submitted";
      case "hr":
        return currentStatus === "director_approved";
      default:
        return false;
    }
  };

  const getApprovalLabels = () => {
    switch (approvalType) {
      case "manager":
        return { approve: "Submit for Approval", reject: "Return to Draft" };
      case "director":
        return { approve: "Approve as Director", reject: "Reject Schedule" };
      case "hr":
        return { approve: "Final Approval", reject: "Reject Schedule" };
      default:
        return { approve: "Approve", reject: "Reject" };
    }
  };

  if (!shouldShowActions()) {
    return (
      <div className={`flex items-center ${className}`}>
        <StatusBadge status={currentStatus} />
      </div>
    );
  }

  const labels = getApprovalLabels();

  return (
    <div className={`approval-actions ${className}`}>
      <div className="flex items-center justify-between">
        <StatusBadge status={currentStatus} />
        <ApprovalButtons
          onApprove={() => onApprove(scheduleId)}
          onReject={() => onReject(scheduleId)}
          approveLabel={labels.approve}
          rejectLabel={labels.reject}
          disabled={disabled}
        />
      </div>

      {/* Render modal if props are provided */}
      {modalProps.isOpen && <ApprovalModal {...modalProps} />}
    </div>
  );
};

// PropTypes for type checking and documentation
ApprovalActions.propTypes = {
  scheduleId: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  approvalType: PropTypes.oneOf(["manager", "director", "hr"]).isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  modalProps: PropTypes.object,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

ApprovalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  action: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  onTogglePassword: PropTypes.func.isRequired,
  remarks: PropTypes.string.isRequired,
  onRemarksChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isFormValid: PropTypes.bool,
};

ApprovalButtons.propTypes = {
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  approveLabel: PropTypes.string,
  rejectLabel: PropTypes.string,
  disabled: PropTypes.bool,
  showReject: PropTypes.bool,
  className: PropTypes.string,
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default ApprovalActions;
export {
  ApprovalModal,
  ApprovalButtons,
  StatusBadge,
  PasswordInput,
  RemarksInput,
};
