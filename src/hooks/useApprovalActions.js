/**
 * Custom Hook for Approval Actions Management
 *
 * This hook handles all approval-related logic including modal management,
 * password validation, and approval actions for duty schedules.
 *
 * @author HRIS Development Team
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  directorApproval,
  hrApproval,
  submitDutyScheduleForApproval,
  messageClear,
} from "../store/Reducers/dutyScheduleReducer";

/**
 * Hook for managing approval actions and modal state
 * @param {string} approvalType - Type of approval ('director', 'hr', 'manager')
 * @returns {Object} Approval state and action functions
 */
export const useApprovalActions = (approvalType = "") => {
  // Redux state and navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, errorMessage, successMessage } = useSelector(
    (state) => state.dutySchedule
  );

  // Modal and form state
  const [passwordModal, setPasswordModal] = useState({
    open: false,
    action: null, // 'approve' or 'reject'
    scheduleId: null,
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remarks, setRemarks] = useState("");

  /**
   * Handle success/error messages and modal cleanup
   */
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      closeModal();
      navigate(-1); // Navigate back on success
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
      // Keep modal open on error for retry
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  /**
   * Open approval modal
   * @param {string} action - 'approve' or 'reject'
   * @param {string} scheduleId - The schedule ID
   */
  const openApprovalModal = (action, scheduleId) => {
    setPasswordModal({
      open: true,
      action,
      scheduleId,
    });
    // Reset form state
    setPassword("");
    setRemarks("");
    setShowPassword(false);
  };

  /**
   * Close approval modal and reset state
   */
  const closeModal = () => {
    setPasswordModal({
      open: false,
      action: null,
      scheduleId: null,
    });
    setPassword("");
    setRemarks("");
    setShowPassword(false);
  };

  /**
   * Handle approval submission
   */
  const handleApprovalSubmit = () => {
    const { action, scheduleId } = passwordModal;

    // Validation
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (action === "reject" && !remarks.trim()) {
      toast.error("Remarks are required for rejection");
      return;
    }

    // Prepare approval data
    const approvalData = {
      scheduleId,
      password,
      action, // 'approve' or 'reject'
      remarks: remarks.trim() || null,
    };

    // Dispatch appropriate action based on approval type
    switch (approvalType) {
      case "director":
        dispatch(directorApproval(approvalData));
        break;
      case "hr":
        dispatch(hrApproval(approvalData));
        break;
      case "manager":
        dispatch(submitDutyScheduleForApproval(approvalData));
        break;
      default:
        toast.error("Invalid approval type");
        break;
    }
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = {
    password: (value) => setPassword(value),
    remarks: (value) => setRemarks(value),
    showPassword: (value) => setShowPassword(value),
  };

  /**
   * Quick action functions for common operations
   */
  const quickActions = {
    approve: (scheduleId) => openApprovalModal("approve", scheduleId),
    reject: (scheduleId) => openApprovalModal("reject", scheduleId),
    submit: (scheduleId) => openApprovalModal("submit", scheduleId),
  };

  /**
   * Get modal title based on action and approval type
   */
  const getModalTitle = () => {
    const { action } = passwordModal;
    const actionText =
      action === "approve"
        ? "Approve"
        : action === "reject"
        ? "Reject"
        : "Submit";

    const typeText =
      approvalType === "director"
        ? "Director"
        : approvalType === "hr"
        ? "HR"
        : "Manager";

    return `${actionText} - ${typeText} Confirmation`;
  };

  /**
   * Validate form data
   */
  const isFormValid = () => {
    if (!password.trim()) return false;
    if (passwordModal.action === "reject" && !remarks.trim()) return false;
    return true;
  };

  return {
    // Modal state
    passwordModal,
    password,
    showPassword,
    remarks,

    // Modal actions
    openApprovalModal,
    closeModal,
    handleApprovalSubmit,

    // Form handlers
    handleInputChange,

    // Quick actions
    quickActions,

    // Computed values
    modalTitle: getModalTitle(),
    isFormValid: isFormValid(),
    isLoading: loading,

    // Utility functions
    togglePasswordVisibility: () => setShowPassword(!showPassword),
  };
};
