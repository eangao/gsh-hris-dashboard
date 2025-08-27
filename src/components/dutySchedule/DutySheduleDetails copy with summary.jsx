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
import { fetchHolidaysDateRange } from "../../store/Reducers/holidayReducer";
import { fetchAllLeaveTemplates } from "../../store/Reducers/leaveTemplateReducer";

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

//approvalType = "" if employee
// is viewing their own schedule, otherwise it will be the employeeId of the schedule being viewed
// approvalType = "hr" | "director" | "manager" to determine the type
const DutyScheduleDetails = ({
  scheduleId,
  departmentId,
  approvalType = "", // used when viewing a schedule for approval, empty when employee is viewing their own schedule
  employeeId = "", // used when employee is viewing their own schedule
  forApproval = false, // used to determine if the schedule is being viewed for approval
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dutySchedule, loading, errorMessage, successMessage } = useSelector(
    (state) => state.dutySchedule
  );

  const { holidays } = useSelector((state) => state.holiday);
  const { leaveTemplates } = useSelector((state) => state.leaveTemplates);

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
    //for duty schedule
    dispatch(fetchDutyScheduleById({ scheduleId, employeeId }));
    dispatch(fetchAllLeaveTemplates());
  }, [dispatch, scheduleId, employeeId]);

  // Fetch holidays when dutySchedule is loaded
  useEffect(() => {
    if (dutySchedule?.startDate && dutySchedule?.endDate) {
      dispatch(
        fetchHolidaysDateRange({
          startDate: dutySchedule.startDate,
          endDate: dutySchedule.endDate,
        })
      );
    }
  }, [dispatch, dutySchedule?.startDate, dutySchedule?.endDate]);

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
  }, [successMessage, errorMessage, dispatch, navigate]);

  const isHoliday = (date) => {
    if (!date || !holidays?.length) return false;
    const dateStr = formatDatePH(date);
    return holidays.some((holiday) => {
      // Convert holiday date from API to PH date format for comparison
      const holidayDatePH = formatDatePH(new Date(holiday.date));
      return holidayDatePH === dateStr;
    });
  };

  const getHolidayName = (date) => {
    if (!date || !holidays?.length) return null;
    const dateStr = formatDatePH(date);
    const holiday = holidays?.find((h) => {
      // Convert holiday date from API to PH date format for comparison
      const holidayDatePH = formatDatePH(new Date(h.date));
      return holidayDatePH === dateStr;
    });

    if (!holiday) return null;

    // Generate holiday type abbreviation
    const getHolidayTypeAbbreviation = (type) => {
      if (!type) return "H";

      const typeStr = type.toLowerCase();
      if (typeStr.includes("regular")) return "RH";
      if (typeStr.includes("special") && typeStr.includes("non-working"))
        return "SN";
      if (typeStr.includes("special") && typeStr.includes("working"))
        return "SW";
      if (typeStr.includes("local")) return "LH";

      return "H"; // Default abbreviation
    };

    const abbreviation = getHolidayTypeAbbreviation(holiday.type);
    return `${holiday.name} (${abbreviation})`;
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

  // Helper: Generate abbreviation for leave types
  const getLeaveAbbreviation = (leaveName) => {
    if (!leaveName) return "L";

    // Common leave type abbreviations
    const commonAbbreviations = {
      "sick leave": "SL",
      "vacation leave": "VL",
      "maternity leave": "ML",
      "paternity leave": "PL",
      "emergency leave": "EL",
      "bereavement leave": "BL",
      "special leave": "SPL",
      "study leave": "STL",
      "compensatory leave": "CL",
      "personal leave": "PL",
      "annual leave": "AL",
      "casual leave": "CL",
    };

    const normalizedName = leaveName?.toLowerCase().trim();

    // Check for common abbreviations first
    if (commonAbbreviations[normalizedName]) {
      return commonAbbreviations[normalizedName];
    }

    // Generate abbreviation from words
    const words = normalizedName.split(/\s+/);
    if (words.length === 1) {
      // Single word: take first two characters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple words: take first letter of each word
      return words.map((word) => word.charAt(0).toUpperCase()).join("");
    }
  };

  const getEmployeesForDate = (date) => {
    if (!date) return [];
    const dateKey = formatDatePH(date);

    const entry = allEntries?.find((e) => formatDatePH(e.date) === dateKey);
    if (!entry) return [];

    const employeesForDate = entry.employeeSchedules
      .map((es) => {
        // Handle different schedule types
        let displayInfo = {
          shift: "N/A",
          shiftName: "unknown",
          startIn: "",
          type: es.type || "duty",
        };

        if (es.type === "duty") {
          // Use denormalized shift data first, fall back to populated template
          let shiftTemplate;
          if (es.shiftTemplate) {
            shiftTemplate = es.shiftTemplate;
          }

          if (shiftTemplate) {
            displayInfo.shiftName =
              shiftTemplate.name?.toLowerCase() || "unknown";
            displayInfo.shift =
              shiftTemplate.type === "Standard"
                ? `${formatTimeTo12HourPH(
                    shiftTemplate.morningIn
                  )}-${formatTimeTo12HourPH(
                    shiftTemplate.morningOut
                  )}, ${formatTimeTo12HourPH(
                    shiftTemplate.afternoonIn
                  )}-${formatTimeTo12HourPH(shiftTemplate.afternoonOut)}`
                : `${formatTimeTo12HourPH(
                    shiftTemplate.startTime
                  )}-${formatTimeTo12HourPH(shiftTemplate.endTime)}`;
            displayInfo.startIn =
              shiftTemplate.type === "Standard"
                ? shiftTemplate.morningIn
                : shiftTemplate.startTime;
          }
        } else if (es.type === "leave") {
          // Use denormalized leave data first, fall back to template reference
          let leaveTemplate;
          if (es.leaveData && es.leaveData.name) {
            // Use denormalized leave data from backend
            leaveTemplate = es.leaveData;
          } else if (es.leaveTemplate) {
            // Fall back to populated or template reference
            const leaveId =
              typeof es.leaveTemplate === "string"
                ? es.leaveTemplate
                : es.leaveTemplate?._id;

            leaveTemplate =
              typeof es.leaveTemplate === "object" && es.leaveTemplate?._id
                ? es.leaveTemplate
                : leaveTemplates.find((lt) => lt._id === leaveId);
          }

          if (leaveTemplate) {
            displayInfo.shift = "LEAVE";
            displayInfo.shiftName = "leave";
            displayInfo.startIn = "leave";
            displayInfo.leaveAbbreviation = getLeaveAbbreviation(
              leaveTemplate.name
            );
            displayInfo.leaveTemplateName = leaveTemplate.name;
          }
        } else if (es.type === "off") {
          displayInfo.shift = "Day Off";
          displayInfo.shiftName = "off";
          displayInfo.startIn = "off";
        } else if (es.type === "holiday_off") {
          displayInfo.shift = "Holiday Off";
          displayInfo.shiftName = "holiday_off";
          displayInfo.startIn = "holiday_off";
        }

        // Use denormalized employee data first, fall back to populated employee
        let employeeId = null;
        let employeeName = "Unknown Employee";
        let lastName = "";
        let shiftColor = "";

        if (es.employeeData && es.employeeData.firstName) {
          // Use denormalized employee data from backend
          employeeId =
            typeof es.employee === "string" ? es.employee : es.employee?._id;
          employeeName = `${
            es.employeeData.lastName
          }, ${es.employeeData.firstName.charAt(0).toUpperCase()}.`;
          lastName = es.employeeData.lastName || "";
        } else if (es.employee?.personalInformation) {
          // Fall back to populated employee data
          employeeId = es.employee._id;
          employeeName = `${
            es.employee.personalInformation.lastName
          }, ${es.employee.personalInformation.firstName
            .charAt(0)
            .toUpperCase()}.`;
          lastName = es.employee.personalInformation.lastName || "";
        }

        // Get shift color from denormalized data or populated template
        if (es.type === "duty") {
          if (es.shiftData && es.shiftData.shiftColor) {
            shiftColor = es.shiftData.shiftColor;
          } else if (es.shiftTemplate?.shiftColor) {
            shiftColor = es.shiftTemplate.shiftColor;
          }
        }

        return {
          id: employeeId,
          name: employeeName,
          lastName: lastName,
          shiftName: displayInfo.shiftName,
          shift: displayInfo.shift,
          description: es?.remarks || "",
          shiftColor: shiftColor || "",
          startIn: displayInfo.startIn,
          type: es.type || "duty",
          leaveAbbreviation: displayInfo.leaveAbbreviation || null,
          leaveTemplateName: displayInfo.leaveTemplateName || null,
        };
      })
      .sort((a, b) => {
        // Sort by type first (duty, leave, off, holiday_off)
        const typeOrder = { duty: 1, leave: 2, off: 3, holiday_off: 4 };
        const typeComparison =
          (typeOrder[a.type] || 5) - (typeOrder[b.type] || 5);
        if (typeComparison !== 0) return typeComparison;

        // Then sort by start time for duty schedules
        if (a.type === "duty" && b.type === "duty") {
          if (a.startIn === "off" || a.startIn === "") return 1;
          if (b.startIn === "off" || b.startIn === "") return -1;
          if (!a.startIn) return 1;
          if (!b.startIn) return -1;

          const [hA, mA] = a.startIn.split(":").map(Number);
          const [hB, mB] = b.startIn.split(":").map(Number);
          return hA * 60 + mA - (hB * 60 + mB);
        }

        // Finally sort by last name
        return a.lastName.localeCompare(b.lastName);
      });

    // Group by type and shift - consolidate all leave types into one group
    const grouped = employeesForDate.reduce((acc, emp) => {
      let groupKey;

      if (emp.type === "duty") {
        groupKey = emp.shift;
      } else if (emp.type === "leave") {
        // Consolidate all leave types into one "LEAVE" group
        groupKey = "LEAVE";
      } else if (emp.type === "off") {
        groupKey = "Day Off";
      } else if (emp.type === "holiday_off") {
        groupKey = "Holiday Off";
      } else {
        groupKey = `${emp.type}: ${emp.shift}`;
      }

      if (!acc[groupKey]) {
        acc[groupKey] = {
          shift: groupKey,
          shiftName:
            emp.type === "leave"
              ? "leave"
              : emp.type === "off"
              ? "day-off"
              : emp.type === "holiday_off"
              ? "holiday-off"
              : emp.shiftName,
          type: emp.type,
          employees: [],
        };
      }

      acc[groupKey].employees.push(emp);
      return acc;
    }, {});

    // Sort groups by type and start time
    return Object.values(grouped)
      .map((group) => ({
        ...group,
        employees: group.employees.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        ),
      }))
      .sort((a, b) => {
        const typeOrder = { duty: 1, leave: 2, off: 3, holiday_off: 4 };
        const typeComparison =
          (typeOrder[a.type] || 5) - (typeOrder[b.type] || 5);
        if (typeComparison !== 0) return typeComparison;

        if (a.type === "duty" && b.type === "duty") {
          const getEarliestStart = (group) => {
            const validTimes = group.employees
              .filter(
                (emp) =>
                  emp.startIn && emp.startIn !== "off" && emp.startIn !== ""
              )
              .map((emp) => {
                const [h, m] = emp.startIn.split(":").map(Number);
                return h * 60 + m;
              });
            return validTimes.length ? Math.min(...validTimes) : Infinity;
          };
          return getEarliestStart(a) - getEarliestStart(b);
        }

        return 0;
      });
  };

  const getShiftColor = (shiftName) => {
    // Handle special cases for non-duty types
    if (shiftName === "day-off") return "bg-gray-200";
    if (shiftName === "holiday-off") return "bg-orange-200";
    if (shiftName === "leave" || shiftName.startsWith("leave_"))
      return "bg-yellow-200";

    // First try to find the shift template in entries using denormalized data
    let schedule = null;
    for (const entry of allEntries) {
      for (const es of entry.employeeSchedules) {
        if (es.type === "duty") {
          // Check denormalized shift data first
          if (es.shiftData && es.shiftData.name) {
            if (es.shiftData.name?.toLowerCase() === shiftName?.toLowerCase()) {
              schedule = es.shiftData;
              break;
            }
          }
          // Fall back to populated template data
          else if (es.shiftTemplate) {
            const shiftTemplate = es.shiftTemplate;
            if (
              shiftTemplate &&
              shiftTemplate.name?.toLowerCase() === shiftName?.toLowerCase()
            ) {
              schedule = shiftTemplate;
              break;
            }
          }
        }
      }
      if (schedule) break;
    }

    return schedule?.shiftColor || "bg-white"; // fallback to white if not found or no color set
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

  // Helper: Calculate shift hours
  const getShiftHours = (shiftTemplate) => {
    if (!shiftTemplate) return 0;
    if (shiftTemplate.status === "off") return "off";
    if (shiftTemplate.type === "Standard") {
      // Calculate total hours for standard shift (morning + afternoon)
      const [mh, mm] = shiftTemplate.morningIn.split(":").map(Number);
      const [moh, mom] = shiftTemplate.morningOut.split(":").map(Number);
      const [ah, am] = shiftTemplate.afternoonIn.split(":").map(Number);
      const [aoh, aom] = shiftTemplate.afternoonOut.split(":").map(Number);
      const morning = moh * 60 + mom - (mh * 60 + mm);
      const afternoon = aoh * 60 + aom - (ah * 60 + am);
      return ((morning + afternoon) / 60).toFixed(2);
    } else {
      // Non-standard: single block
      const [sh, sm] = shiftTemplate.startTime.split(":").map(Number);
      const [eh, em] = shiftTemplate.endTime.split(":").map(Number);
      let startMins = sh * 60 + sm;
      let endMins = eh * 60 + em;
      // If end time is less than or equal to start time, it means the shift ends the next day
      if (endMins <= startMins) {
        endMins += 24 * 60;
      }
      const mins = endMins - startMins;
      return (mins / 60).toFixed(2);
    }
  };

  // Helper: Format hours as "X h Y min"
  function formatHoursAndMinutes(hoursFloat) {
    if (hoursFloat === "off" || hoursFloat === "" || hoursFloat == null)
      return hoursFloat;
    const totalMinutes = Math.round(Number(hoursFloat) * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h > 0 && m > 0) return `${h} h ${m} min`;
    if (h > 0) return `${h} h`;
    return `${m} min`;
  }

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
          {/* <div className="overflow-x-auto">
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
                            {isHoliday(day) ? (
                              <div className="flex justify-between items-start">
                                <span
                                  className={`font-medium ${
                                    shouldMarkRed(day) ? "text-red-600" : ""
                                  }`}
                                  style={{ marginTop: "-4px" }}
                                >
                                  {day.getDate()}
                                </span>
                                <span className="text-xs text-red-600 italic ml-2 whitespace-nowrap">
                                  {getHolidayName(day)}
                                </span>
                              </div>
                            ) : (
                              <>
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
                              </>
                            )}
                          </div>

                          <div className="space-y-1">
                            {getEmployeesForDate(day).map((group) => (
                              <div
                                key={group.shift}
                                className={`rounded p-1 ${getShiftColor(
                                  group.shiftName
                                )}`}
                              >
                                <div className="text-xs font-bold mb-1 uppercase text-gray-700">
                                  {group.shift}
                                </div>
                                
                                {group.type === "leave"
                                  ? // Special rendering for consolidated leave group
                                    (() => {
                                      // Group leave employees by their leave type name
                                      const leaveGroups =
                                        group.employees.reduce(
                                          (acc, emp) => {
                                            const leaveTypeName =
                                              emp.leaveTemplateName ||
                                              "Leave";
                                            if (!acc[leaveTypeName]) {
                                              acc[leaveTypeName] = [];
                                            }
                                            acc[leaveTypeName].push(emp);
                                            return acc;
                                          },
                                          {}
                                        );

                                      return Object.entries(
                                        leaveGroups
                                      ).map(
                                        ([leaveTypeName, employees]) => (
                                          <div
                                            key={leaveTypeName}
                                            className="mb-2"
                                          >
                                            <div className="text-xs font-medium text-blue-700 mb-1 capitalize">
                                              {leaveTypeName?.toLowerCase()}
                                            </div>
                                            {employees.map((emp) => (
                                              <div
                                                key={emp.id}
                                                className="text-sm mb-1 p-1 rounded bg-white/50 ml-2"
                                              >
                                                <div className="flex justify-between items-center">
                                                  <span
                                                    title={
                                                      emp.leaveTemplateName
                                                    }
                                                  >
                                                    {emp.name}
                                                  </span>
                                                </div>
                                                {emp.description && (
                                                  <div className="text-gray-600 mt-1 text-xs italic">
                                                    {emp.description}
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        )
                                      );
                                    })()
                                  : // Regular rendering for non-leave groups
                                    group.employees.map((emp) => (
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
          </div> */}

          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2 mb-2">
                {weekDays.map(({ day }, index) => (
                  <div
                    key={day}
                    className={`p-2 font-semibold text-center hidden lg:block ${
                      index === 0 || index === 6
                        ? "text-red-600"
                        : "text-blue-600"
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
                            {isHoliday(day) ? (
                              <div className="flex justify-between items-start">
                                <span
                                  className={`font-medium ${
                                    shouldMarkRed(day)
                                      ? "text-red-600"
                                      : "text-blue-600"
                                  }`}
                                  style={{ marginTop: "-4px" }}
                                >
                                  {day.getDate()}
                                </span>
                                <span className="text-xs text-red-600 italic ml-2 whitespace-nowrap">
                                  {getHolidayName(day)}
                                </span>
                              </div>
                            ) : (
                              <>
                                <div className="hidden lg:flex justify-center">
                                  <span
                                    className={`font-medium ${
                                      shouldMarkRed(day)
                                        ? "text-red-600"
                                        : "text-blue-600"
                                    }`}
                                  >
                                    {day.getDate()}
                                  </span>
                                </div>
                                <div className="flex lg:hidden justify-between items-start">
                                  <span
                                    className={`font-medium ${
                                      shouldMarkRed(day)
                                        ? "text-red-600"
                                        : "text-blue-600"
                                    }`}
                                    style={{ marginTop: "-4px" }}
                                  >
                                    {day.getDate()}
                                  </span>
                                  <span
                                    className={`text-xs ${
                                      day.getDay() === 0 || day.getDay() === 6
                                        ? "text-red-600"
                                        : "text-blue-600"
                                    }`}
                                  >
                                    {weekDays[day.getDay()].day}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>

                          <div className="space-y-1">
                            {getEmployeesForDate(day).map(
                              (group, groupIndex) => (
                                <div
                                  key={`${formatDatePH(day)}-${
                                    group.shift
                                  }-${groupIndex}`}
                                  className={`rounded p-1 ${getShiftColor(
                                    group.shiftName
                                  )}`}
                                >
                                  <div className="text-xs font-bold mb-1 uppercase text-gray-700">
                                    {group.shift}
                                  </div>

                                  {group.type === "leave"
                                    ? // Special rendering for consolidated leave group
                                      (() => {
                                        // Group leave employees by their leave type name
                                        const leaveGroups =
                                          group.employees.reduce((acc, emp) => {
                                            const leaveTypeName =
                                              emp.leaveTemplateName || "Leave";
                                            if (!acc[leaveTypeName]) {
                                              acc[leaveTypeName] = [];
                                            }
                                            acc[leaveTypeName].push(emp);
                                            return acc;
                                          }, {});

                                        return Object.entries(leaveGroups).map(
                                          ([leaveTypeName, employees]) => (
                                            <div
                                              key={leaveTypeName}
                                              className="mb-2"
                                            >
                                              <div className="text-xs font-medium text-blue-700 mb-1 capitalize">
                                                {leaveTypeName?.toLowerCase()}
                                              </div>
                                              {employees.map(
                                                (emp, empIndex) => (
                                                  <div
                                                    key={
                                                      emp.id ||
                                                      `${formatDatePH(day)}-${
                                                        group.shift
                                                      }-${empIndex}-${emp.name}`
                                                    }
                                                    className="text-sm mb-1 p-1 rounded bg-white/50 ml-2"
                                                  >
                                                    <div className="flex justify-between items-center">
                                                      <span
                                                        title={
                                                          emp.leaveTemplateName
                                                        }
                                                      >
                                                        {emp.name}
                                                      </span>
                                                    </div>
                                                    {emp.description && (
                                                      <div className="text-gray-600 mt-1 text-xs italic">
                                                        {emp.description}
                                                      </div>
                                                    )}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )
                                        );
                                      })()
                                    : // Regular rendering for non-leave groups
                                      group.employees.map((emp, empIndex) => (
                                        <div
                                          key={
                                            emp.id ||
                                            `${formatDatePH(day)}-${
                                              group.shift
                                            }-${empIndex}-${emp.name}`
                                          }
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
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="overflow-x-auto mb-6 mt-6">
            <h2 className="text-lg font-bold mb-2 text-blue-800">
              Weekly Summary
            </h2>
            {(() => {
              // 1. Get all unique employees from allEntries using denormalized data
              const employeeMap = {};
              allEntries.forEach((entry) => {
                entry.employeeSchedules.forEach((es) => {
                  const empId =
                    typeof es.employee === "string"
                      ? es.employee
                      : es.employee?._id;

                  if (empId) {
                    // Prioritize denormalized employee data
                    if (es.employeeData && es.employeeData.firstName) {
                      employeeMap[empId] = {
                        _id: empId,
                        personalInformation: {
                          firstName: es.employeeData.firstName,
                          lastName: es.employeeData.lastName,
                          middleName: es.employeeData.middleName,
                          suffix: es.employeeData.suffix,
                        },
                      };
                    }
                    // Fall back to populated employee data
                    else if (
                      typeof es.employee === "object" &&
                      es.employee?._id
                    ) {
                      employeeMap[empId] = es.employee;
                    }
                  }
                });
              });
              const sortedEmployees = Object.values(employeeMap).sort((a, b) =>
                a.personalInformation.lastName.localeCompare(
                  b.personalInformation.lastName
                )
              );
              // 2. Build a map of employeeId to total hours for the month
              const employeeMonthTotals = {};
              allEntries.forEach((entry) => {
                entry.employeeSchedules.forEach((es) => {
                  const empId =
                    typeof es.employee === "string"
                      ? es.employee
                      : es.employee?._id;

                  // Get shift data prioritizing denormalized data
                  let shift = null;
                  if (es.type === "duty") {
                    if (es.shiftData && es.shiftData.name) {
                      shift = es.shiftData;
                    } else if (es.shiftTemplate) {
                      shift = es.shiftTemplate;
                    }
                  }

                  const hours = getShiftHours(shift);
                  if (
                    hours !== "off" &&
                    hours !== "" &&
                    !isNaN(Number(hours))
                  ) {
                    if (!employeeMonthTotals[empId])
                      employeeMonthTotals[empId] = 0;
                    employeeMonthTotals[empId] += Number(hours);
                  }
                });
              });
              // 3. Build calendar weeks (array of arrays of dates)
              const weekDaysShort = [
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ];
              const weeks = [];
              let week = [];
              days.forEach((date) => {
                if (week.length === 0 && date.getDay() !== 0) {
                  for (let i = 0; i < date.getDay(); i++) week.push(null);
                }
                week.push(date);
                if (week.length === 7) {
                  weeks.push(week);
                  week = [];
                }
              });
              if (week.length > 0) {
                while (week.length < 7) week.push(null);
                weeks.push(week);
              }
              // 4. For each week, build summary rows
              const getDayHours = (empId, date) => {
                if (!date) return "";
                const entry = allEntries.find(
                  (e) => formatDatePH(e.date) === formatDatePH(date)
                );
                if (!entry) return "";
                const es = entry.employeeSchedules.find((es) => {
                  const esEmpId =
                    typeof es.employee === "string"
                      ? es.employee
                      : es.employee?._id;
                  return esEmpId === empId;
                });
                if (!es) return "";

                // Get shift data prioritizing denormalized data
                let shift = null;
                if (es.type === "duty") {
                  if (es.shiftData && es.shiftData.name) {
                    shift = es.shiftData;
                  } else if (es.shiftTemplate) {
                    shift = es.shiftTemplate;
                  }
                }

                const hours = getShiftHours(shift);
                return hours;
              };
              return (
                <>
                  {weeks.map((weekDates, weekIdx) => (
                    <div key={weekIdx} className="mb-4">
                      <table className="min-w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
                        <thead>
                          <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                            <th className="px-2 py-2 border text-left font-semibold text-gray-700">
                              Employee
                            </th>
                            {weekDaysShort.map((d, i) => {
                              const dateObj = weekDates[i];
                              const isHoliday =
                                dateObj &&
                                holidays?.some((h) => {
                                  const holidayDatePH = formatDatePH(
                                    new Date(h.date)
                                  );
                                  return (
                                    holidayDatePH === formatDatePH(dateObj)
                                  );
                                });
                              const isWeekend = i === 0 || i === 6;
                              return (
                                <th
                                  key={i}
                                  className={`px-2 py-2 border text-center font-semibold ${
                                    isHoliday || isWeekend
                                      ? "text-red-600"
                                      : "text-blue-700"
                                  }`}
                                >
                                  <div>{d}</div>
                                  <div
                                    className={`text-xs ${
                                      isHoliday || isWeekend
                                        ? "text-red-600"
                                        : "text-blue-600"
                                    }`}
                                  >
                                    {dateObj ? dateObj.getDate() : ""}
                                  </div>
                                </th>
                              );
                            })}
                            <th className="px-2 py-2 border text-center font-semibold text-gray-700">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedEmployees.map((emp, i) => {
                            let total = 0;
                            const dayVals = weekDates.map((date) => {
                              const val = getDayHours(emp._id, date);
                              if (
                                val !== "off" &&
                                val !== "" &&
                                !isNaN(Number(val))
                              )
                                total += Number(val);
                              return val;
                            });
                            return (
                              <tr
                                key={emp._id}
                                className={
                                  i % 2 === 0 ? "bg-white" : "bg-slate-100"
                                }
                              >
                                <td className="px-2 py-2 border text-left whitespace-nowrap text-gray-800 font-medium">
                                  {emp.personalInformation.lastName},{" "}
                                  {emp.personalInformation.firstName}
                                </td>
                                {dayVals.map((val, j) => (
                                  <td
                                    key={j}
                                    className={`px-2 py-2 border text-center capitalize text-blue-700 ${
                                      val === "off"
                                        ? "bg-gray-200 text-gray-500 font-semibold"
                                        : ""
                                    }`}
                                  >
                                    {val === "off" || val === ""
                                      ? val
                                      : formatHoursAndMinutes(val)}
                                  </td>
                                ))}
                                <td className="px-2 py-2 border text-center font-bold text-blue-900 capitalize">
                                  {total === 0
                                    ? ""
                                    : formatHoursAndMinutes(total)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                  {/* Monthly total row */}
                  <div className="mb-4">
                    <h2 className="text-lg font-bold mb-2 text-blue-800">
                      Summary for this Month
                    </h2>
                    <table className="min-w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-200 to-blue-300">
                          <th className="px-2 py-2 border text-left font-semibold text-gray-700">
                            Employee
                          </th>
                          <th className="px-2 py-2 border text-center font-semibold text-gray-700">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedEmployees.map((emp, i) => (
                          <tr
                            key={emp._id}
                            className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-2 py-2 border text-left whitespace-nowrap text-gray-800 font-medium">
                              {emp.personalInformation.lastName},{" "}
                              {emp.personalInformation.firstName}
                            </td>
                            <td className="px-2 py-2 border text-center font-bold text-blue-900">
                              {employeeMonthTotals[emp._id]
                                ? formatHoursAndMinutes(
                                    employeeMonthTotals[emp._id]
                                  )
                                : "0 min"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()}
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
                  {forApproval === "true" ? "Cancel" : "Back"}
                </button>
                {forApproval === "true" && (
                  <>
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
                  </>
                )}
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
