import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  logManualAttendance,
  updateManualAttendance,
  messageClear,
} from "../store/Reducers/attendanceReducer";
import {
  formatDatePH,
  formatTimeTo12HourPH,
  combineDateTimeToUTC,
} from "../utils/phDateUtils";

const ManualAttendanceModal = ({
  isOpen,
  onClose,
  attendance,
  timeType, // "morningIn", "morningOut", "afternoonIn", "afternoonOut", "timeIn", "timeOut"
  onSuccess,
  mode = "create", // "create" or "update"
  existingTime = "", // For update mode
  existingRemarks = "", // For update mode
  manualId = null, // For update mode
}) => {
  const dispatch = useDispatch();
  const { manualAttendanceLoading, successMessage, errorMessage } = useSelector(
    (state) => state.attendance
  );

  const [formData, setFormData] = useState({
    time: "",
    remarks: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (successMessage) {
      onSuccess();
      onClose();
      dispatch(messageClear());
    }
  }, [successMessage, onSuccess, onClose, dispatch]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        dispatch(messageClear());
      }, 5000);
    }
  }, [errorMessage, dispatch]);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      if (mode === "update") {
        // For update mode, pre-populate with existing data
        const timeValue = existingTime
          ? typeof existingTime === "string" && existingTime.includes("T")
            ? new Date(existingTime).toTimeString().slice(0, 5)
            : existingTime
          : "";

        setFormData({
          time: timeValue,
          remarks: existingRemarks || "",
        });
      } else {
        // For create mode, start with empty form
        setFormData({
          time: "",
          remarks: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, existingTime, existingRemarks, manualId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.time.trim()) {
      newErrors.time = "Time is required";
    } else {
      // Validate time format (HH:MM)
      const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timePattern.test(formData.time)) {
        newErrors.time = "Please enter a valid time in HH:MM format";
      }
    }

    if (!formData.remarks.trim()) {
      newErrors.remarks = "Remarks are required for manual attendance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Determine the type based on timeType
    let type;
    if (timeType.includes("In") || timeType === "timeIn") {
      type = "CheckIn";
    } else if (timeType.includes("Out") || timeType === "timeOut") {
      type = "CheckOut";
    }

    // Convert date and time to UTC
    const dateStr = attendance.datePH || attendance.date;
    const logTime = combineDateTimeToUTC(dateStr, formData.time);

    if (!logTime) {
      setErrors({ time: "Invalid date or time" });
      return;
    }

    // Create the manual attendance data with new backend format
    const manualAttendanceData = {
      employeeId: attendance.employeeId,
      hospitalEmployeeId:
        attendance.hospitalEmployeeId || attendance.employeeId, // Use hospitalEmployeeId if available
      logTime: logTime, // Combined UTC datetime
      type: type, // 'CheckIn' or 'CheckOut'
      remarks: formData.remarks,
      timeType: timeType, // Additional field to specify which time slot for frontend reference
    };

    if (mode === "update" && manualId) {
      // Update existing manual attendance
      dispatch(
        updateManualAttendance({
          logId: manualId,
          ...manualAttendanceData,
        })
      );
    } else {
      // Create new manual attendance
      dispatch(logManualAttendance(manualAttendanceData));
    }
  };

  const getTimeTypeLabel = () => {
    switch (timeType) {
      case "morningIn":
        return "Morning Time In";
      case "morningOut":
        return "Morning Time Out";
      case "afternoonIn":
        return "Afternoon Time In";
      case "afternoonOut":
        return "Afternoon Time Out";
      case "timeIn":
        return "Time In";
      case "timeOut":
        return "Time Out";
      default:
        return "Manual Time";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {mode === "update"
                  ? "Update Manual Attendance"
                  : "Manual Attendance"}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {mode === "update" ? "Edit" : "Log"}{" "}
                {getTimeTypeLabel().toLowerCase()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={manualAttendanceLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Employee Info */}
          <div className="space-y-3 mb-6">
            <div>
              <span className="text-sm text-gray-500">Employee:</span>
              <p className="text-sm font-medium text-gray-900">
                {attendance.employeeName}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Date:</span>
              <p className="text-sm font-medium text-gray-900">
                {formatDatePH(
                  attendance.datePH || attendance.date,
                  "MMM D, YYYY"
                )}
              </p>
            </div>

            {attendance.shiftTemplate && (
              <div>
                <span className="text-sm text-gray-500">Schedule:</span>
                <div className="text-sm font-medium text-gray-900">
                  {attendance.shiftTemplate.type === "Standard" ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white font-medium bg-sky-500 px-2 py-0.5 rounded flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-yellow-200"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          AM
                        </span>
                        <span>
                          {formatTimeTo12HourPH(
                            attendance.shiftTemplate.morningIn
                          )}{" "}
                          -{" "}
                          {formatTimeTo12HourPH(
                            attendance.shiftTemplate.morningOut
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white font-medium bg-amber-500 px-2 py-0.5 rounded flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-blue-200"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                          </svg>
                          PM
                        </span>
                        <span>
                          {formatTimeTo12HourPH(
                            attendance.shiftTemplate.afternoonIn
                          )}{" "}
                          -{" "}
                          {formatTimeTo12HourPH(
                            attendance.shiftTemplate.afternoonOut
                          )}
                        </span>
                      </div>
                    </div>
                  ) : attendance.shiftTemplate.type === "Shifting" ? (
                    <div className="flex items-center gap-2">
                      <span>
                        {formatTimeTo12HourPH(
                          attendance.shiftTemplate.startTime
                        )}{" "}
                        -{" "}
                        {formatTimeTo12HourPH(attendance.shiftTemplate.endTime)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-medium bg-purple-500 px-2 py-0.5 rounded">
                        {attendance.shiftTemplate.type || "Unknown"}
                      </span>
                      <span>
                        {attendance.shiftTemplate.timeIn &&
                        attendance.shiftTemplate.timeOut
                          ? `${attendance.shiftTemplate.timeIn} - ${attendance.shiftTemplate.timeOut}`
                          : "No schedule details"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex">
                <div className="text-red-400 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-red-700 text-sm">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Time Input */}
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {getTimeTypeLabel()} <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.time ? "border-red-300" : "border-gray-300"
                }`}
                disabled={manualAttendanceLoading}
              />
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>

            {/* Remarks Input */}
            <div>
              <label
                htmlFor="remarks"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                id="remarks"
                name="remarks"
                rows={3}
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder={
                  mode === "update"
                    ? "Please provide a reason for updating this manual attendance entry..."
                    : "Please provide a reason for manual attendance entry..."
                }
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  errors.remarks ? "border-red-300" : "border-gray-300"
                }`}
                disabled={manualAttendanceLoading}
              />
              {errors.remarks && (
                <p className="mt-1 text-sm text-red-600">{errors.remarks}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                disabled={manualAttendanceLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                disabled={manualAttendanceLoading}
              >
                {manualAttendanceLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {mode === "update" ? "Updating..." : "Saving..."}
                  </>
                ) : mode === "update" ? (
                  "Update"
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualAttendanceModal;
