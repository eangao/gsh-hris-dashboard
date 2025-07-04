import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  directorApproval,
  fetchDutyScheduleById,
  hrApproval,
  messageClear,
  submitDutyScheduleForApproval,
} from "../../store/Reducers/dutyScheduleReducer";

import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import {
  getCurrentDatePH,
  formatDatePH,
  getDutyScheduleRangePH,
  parseDatePH,
  formatTimeTo12HourPH,
  getCalendarDaysInRangePH,
} from "../../utils/phDateUtils";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Holiday data for 2025
const HOLIDAYS_2025 = [
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

//approvalType = "" if employee
// is viewing their own schedule, otherwise it will be the employeeId of the schedule being viewed
// approvalType = "hr" | "director" | "manager" to determine the type
const DutyScheduleDetails = ({
  scheduleId,
  approvalType = "", // used when viewing a schedule for approval, empty when employee is viewing their own schedule
  employeeId = "", // used when employee is viewing their own schedule
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dutySchedule, loading, errorMessage, successMessage } = useSelector(
    (state) => state.dutySchedule
  );

  const [currentDate, setCurrentDate] = useState(getCurrentDatePH());
  const [days, setDays] = useState([]);

  const [allEntries, setAllEntries] = useState([]);

  const [passwordModal, setPasswordModal] = useState({
    open: false,
    action: null, // 'approve' or 'reject'
    scheduleId: null,
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remarks, setRemarks] = useState("");

  const weekDays = [
    { day: "Sun", isWeekend: true },
    { day: "Mon", isWeekend: false },
    { day: "Tue", isWeekend: false },
    { day: "Wed", isWeekend: false },
    { day: "Thu", isWeekend: false },
    { day: "Fri", isWeekend: false },
    { day: "Sat", isWeekend: true },
  ];

  // Load initial data and duty schedule if in edit mode
  useEffect(() => {
    dispatch(fetchDutyScheduleById({ scheduleId, employeeId }));
  }, [dispatch, scheduleId]);

  // Update local state when duty schedule data is loaded
  useEffect(() => {
    if (dutySchedule) {
      const startDateObj = parseDatePH(dutySchedule.startDate);
      const endDateObj = parseDatePH(dutySchedule.endDate);

      if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
        // Set allEntries state with the entries from dutySchedule
        setAllEntries(
          dutySchedule.entries?.map((entry) => ({
            ...entry,
            date: parseDatePH(entry.date),
            employeeSchedules: entry.employeeSchedules || [],
          })) || []
        );

        // Set the current date to the end date of the duty schedule
        setCurrentDate(endDateObj);
      }
    }
  }, [dutySchedule]);

  // this will generate the schedule name.
  // ex.output =>  May 2025, April 2025
  //and will set the startDate and endDate
  useEffect(() => {
    const { startDate, endDate } = getDutyScheduleRangePH(currentDate, true);
    const days = getCalendarDaysInRangePH(startDate, endDate);

    setDays(days);
  }, [currentDate]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setPasswordModal({ open: false, action: null, scheduleId: null });
      setPassword("");
      setRemarks("");
      setShowPassword(false);
      navigate(-1);
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
      // Do NOT close modal or reset input here!
    }
  }, [successMessage, errorMessage]);

  const isHoliday = (date) => {
    if (!date) return false;
    const dateStr = formatDatePH(date);
    return HOLIDAYS_2025.some((holiday) => holiday.date === dateStr);
  };

  const getHolidayName = (date) => {
    if (!date) return null;
    const dateStr = formatDatePH(date);
    const holiday = HOLIDAYS_2025?.find((h) => h.date === dateStr);
    return holiday ? holiday.name : null;
  };

  const isWeekend = (date) => {
    if (!date) return false;
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const shouldMarkRed = (date) => {
    if (!date) return false;
    return isWeekend(date) || isHoliday(date);
  };

  const getEmployeesForDate = (date) => {
    if (!date) return [];
    const dateKey = formatDatePH(date);

    const entry = allEntries?.find((e) => formatDatePH(e.date) === dateKey);
    if (!entry) return [];

    const employeesForDate = entry.employeeSchedules.map((es) => {
      const shiftTime = es?.workSchedule
        ? es?.workSchedule.type === "Standard"
          ? `${formatTimeTo12HourPH(
              es?.workSchedule.morningIn
            )}-${formatTimeTo12HourPH(
              es?.workSchedule.morningOut
            )}, ${formatTimeTo12HourPH(
              es?.workSchedule.afternoonIn
            )}-${formatTimeTo12HourPH(es?.workSchedule.afternoonOut)}`
          : `${formatTimeTo12HourPH(
              es?.workSchedule.startTime
            )}-${formatTimeTo12HourPH(es?.workSchedule.endTime)}`
        : "";

      return {
        name: `${
          es?.employee?.personalInformation.lastName
        }, ${es?.employee?.personalInformation.firstName
          .charAt(0)
          .toUpperCase()}.`,
        lastName: es?.employee?.personalInformation?.lastName || "",
        shiftName: es?.workSchedule?.name?.toLowerCase() || "",
        shift: shiftTime,
        description: es?.remarks || "",
        shiftColor: es?.workSchedule?.shiftColor || "",
      };
    });

    // Group by shift
    const grouped = employeesForDate.reduce((acc, emp) => {
      if (!acc[emp.shift]) {
        acc[emp.shift] = {
          shift: emp.shift,
          shiftName: emp.shiftName,
          shiftColor: emp.shiftColor,
          employees: [],
        };
      }

      acc[emp.shift].employees.push(emp);
      return acc;
    }, {});

    // Convert to array, sort groups by shift label, and sort each group by lastName
    return Object.values(grouped)
      .map((group) => ({
        ...group,
        employees: group.employees.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        ),
      }))
      .sort((a, b) => a.shift.localeCompare(b.shift));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Modified approval handler
  const handleApproval = (scheduleId) => {
    setPasswordModal({ open: true, action: "approve", scheduleId });
  };

  // Modified rejection handler
  const handleRejectDutySchedule = (scheduleId) => {
    setPasswordModal({ open: true, action: "reject", scheduleId });
  };

  // New password confirmation handler
  const handlePasswordConfirmation = () => {
    if (!password.trim()) {
      toast.error("Password is required for confirmation.");
      return;
    }
    if (passwordModal.action === "reject" && !remarks.trim()) {
      toast.error("Remarks are required for rejection.");
      return;
    }
    const actionData = {
      id: passwordModal.scheduleId,
      action: passwordModal.action,
      password: password,
    };
    if (passwordModal.action === "reject") {
      actionData.remarks = remarks;
    }

    if (approvalType === "hr") {
      dispatch(hrApproval(actionData));
    } else if (approvalType === "director") {
      dispatch(directorApproval(actionData));
    } else if (approvalType === "manager") {
      dispatch(submitDutyScheduleForApproval(actionData));
    }

    // Do NOT close/reset modal or clear input here!
  };

  const handleClosePasswordModal = () => {
    setPasswordModal({ open: false, action: null, scheduleId: null });
    setPassword("");
    setRemarks("");
    setShowPassword(false);
  };

  console.log(dutySchedule);

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
        {/* create a back button to navigate to the schedule list . use react icons. and suggest better approach */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-700 print:hidden"
        >
          <IoMdArrowBack className="mr-2" />
          Back
        </button>

        <h1 className="text-xl font-bold uppercase">
          {` ${dutySchedule?.name} Duty Schedule`}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2 mb-2">
                {weekDays.map(({ day }, index) => (
                  <div
                    key={day}
                    className={`p-2 font-semibold text-center hidden lg:block ${
                      index === 0 || index === 6 ? "text-red-600" : ""
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                  {Array.from({ length: days[0]?.getDay() || 0 }).map(
                    (_, index) => (
                      <div key={`empty-${index}`} className="lg:block hidden" />
                    )
                  )}
                  {days.map((day, index) => (
                    <div key={index}>
                      {day && (
                        <div className="w-full p-2 min-h-[160px] border rounded-lg hover:border-blue-500 transition-colors bg-white text-left">
                          <div className="mb-1">
                            <div className="hidden lg:flex justify-center">
                              <span
                                className={`font-medium ${
                                  shouldMarkRed(day) ? "text-red-600" : ""
                                }`}
                              >
                                {day.getDate()}
                              </span>
                            </div>
                            <div className="flex lg:hidden justify-between items-start">
                              <span
                                className={`font-medium ${
                                  shouldMarkRed(day) ? "text-red-600" : ""
                                }`}
                                style={{ marginTop: "-4px" }}
                              >
                                {day.getDate()}
                              </span>
                              <span
                                className={`text-xs ${
                                  isWeekend(day) || isHoliday(day)
                                    ? "text-red-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {weekDays[day.getDay()].day}
                              </span>
                            </div>
                          </div>
                          {isHoliday(day) && (
                            <div className="text-xs text-red-600 italic mb-1">
                              {getHolidayName(day)}
                            </div>
                          )}
                          <div className="space-y-1">
                            {getEmployeesForDate(day).map((group) => (
                              <div
                                key={group.shift}
                                className={`rounded p-1 ${group?.shiftColor}`}
                              >
                                <div className="text-xs font-bold mb-1 uppercase text-gray-700">
                                  {group.shift}
                                </div>
                                {group.employees.map((emp) => (
                                  <div
                                    key={emp.id}
                                    className="text-sm mb-1 p-1 rounded bg-white/50"
                                  >
                                    <div className="flex justify-between items-center">
                                      <span>{emp.name}</span>
                                    </div>
                                    {emp.description && (
                                      <div className="text-gray-600 mt-1 text-xs italic">
                                        {emp.description}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Section Save Buttons */}

          {!employeeId && (
            <div className="flex justify-between items-center mt-6 print:hidden">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                {approvalType !== "manager" && (
                  <button
                    onClick={() => handleRejectDutySchedule(scheduleId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    disabled={loading}
                  >
                    Reject
                  </button>
                )}
                <button
                  onClick={() => handleApproval(scheduleId)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  disabled={loading}
                >
                  {approvalType === "manager"
                    ? "Submit for Approval"
                    : "Approve"}
                </button>
              </div>
            </div>
          )}

          {/* Password Confirmation Modal */}
          {passwordModal.open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    Confirm{" "}
                    {passwordModal.action === "approve"
                      ? "Approval"
                      : "Rejection"}
                  </h2>
                  <button
                    onClick={handleClosePasswordModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">
                    You are about to <strong>{passwordModal.action}</strong>{" "}
                    this duty schedule.
                  </p>
                  <p className="text-sm text-gray-500">
                    Please enter your password to confirm this action.
                  </p>
                </div>
                {/* Remarks field for rejection */}
                {passwordModal.action === "reject" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter reason for rejection..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                )}
                {/* Password field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border border-gray-300 rounded-md p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handlePasswordConfirmation()
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleClosePasswordModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordConfirmation}
                    className={`px-4 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      passwordModal.action === "approve"
                        ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                        : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Confirm ${
                        passwordModal.action === "approve"
                          ? "Approval"
                          : "Rejection"
                      }`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DutyScheduleDetails;
