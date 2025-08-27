import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDutyScheduleById,
  createDutySchedule,
  updateDutySchedule,
  updateHrApprovedDutySchedule,
  messageClear,
} from "../../store/Reducers/dutyScheduleReducer";
import { fetchAllShiftTemplates } from "../../store/Reducers/shiftTemplateReducer";
import { fetchEmployeesByDepartment } from "../../store/Reducers/employeeReducer";
import { fetchDepartmentById } from "../../store/Reducers/departmentReducer";
import { fetchHolidaysDateRange } from "../../store/Reducers/holidayReducer";

import { FaTimes } from "react-icons/fa";
import {
  getCurrentDatePH,
  formatDatePH,
  getDutyScheduleRangePH,
  parseDatePH,
  getMonthLabelPH,
  getCalendarDaysInRangePH,
  convertDatePHToUTCISO,
  formatTimeTo12HourPH,
  formatMonthYearPH,
  formatMonthSchedulePH,
  formatUTCToCompactDatePH,
} from "../../utils/phDateUtils";
import { fetchAllLeaveTemplates } from "store/Reducers/leaveTemplateReducer";

import toast from "react-hot-toast";

const DutyScheduleForm = ({
  departmentId,
  scheduleId = null,
  isHrApprovedUpdate = false,
  onClose, // Callback function for cancel operations
  onSuccess, // Callback function for successful operations
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { departmentId, scheduleId } = useParams();
  const isEditMode = !!scheduleId;

  const isAtCurrentMonth = () => {
    const today = getCurrentDatePH();
    return (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth()
    );
  };

  const { dutySchedule, loading, errorMessage, successMessage } = useSelector(
    (state) => state.dutySchedule
  );

  const { employees } = useSelector((state) => state.employee); // Only for select options
  const { shiftTemplates } = useSelector((state) => state.shiftTemplate); // Only for select options
  const { department } = useSelector((state) => state.department);
  const { holidays } = useSelector((state) => state.holiday);

  const { leaveTemplates } = useSelector((state) => state.leaveTemplates);

  const [currentDate, setCurrentDate] = useState(getCurrentDatePH());
  const [days, setDays] = useState([]);

  const [allEntries, setAllEntries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [employeeInput, setEmployeeInput] = useState("");
  const [scheduleType, setScheduleType] = useState("duty"); // New: duty, off, leave, holiday_off
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(""); // New: for leave template
  const [compensatoryWorkDates, setCompensatoryWorkDates] = useState([]); // New: for multiple compensatory work dates
  const [description, setDescription] = useState("");

  // Legacy compatibility - these are no longer used but kept to prevent errors
  // Removed: Legacy single work date/shift variables - now using compensatoryWorkDates array only

  const [localDutySchedule, setLocalDutySchedule] = useState({
    name: "",
    department: "",
    startDate: "",
    endDate: "",
    monthSchedule: "", // Added monthSchedule field (YYYY-MM format)
    entries: [],
    isFinalized: false,
  });

  const [showCancelModal, setShowCancelModal] = useState(false);

  // HR Approved Update Modal State
  const [showHrUpdateModal, setShowHrUpdateModal] = useState(false);
  const [hrUpdatePassword, setHrUpdatePassword] = useState("");
  const [hrUpdateReason, setHrUpdateReason] = useState("");
  const [hrUpdateLoading, setHrUpdateLoading] = useState(false);

  const [shiftError, setShiftError] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [typeError, setTypeError] = useState(""); // New: for schedule type validation
  const [leaveError, setLeaveError] = useState(""); // New: for leave template validation
  const [compensatoryWorkDatesError, setCompensatoryWorkDatesError] =
    useState(""); // New: for multiple compensatory work dates validation

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
    // Clear any existing success/error messages when component mounts
    dispatch(messageClear());

    dispatch(fetchAllShiftTemplates());
    dispatch(fetchAllLeaveTemplates());

    if (departmentId) {
      dispatch(fetchEmployeesByDepartment(departmentId));
      dispatch(fetchDepartmentById(departmentId));
    }
    if (isEditMode) {
      // If in edit mode, fetch the duty schedule by ID
      dispatch(fetchDutyScheduleById({ scheduleId }));
    }
  }, [dispatch, isEditMode, scheduleId, departmentId]);

  // Fetch holidays when localDutySchedule dates are available
  useEffect(() => {
    if (localDutySchedule.startDate && localDutySchedule.endDate) {
      // console.log("=== Testing fetchHolidaysDateRange ===");
      // console.log("Fetching holidays for duty schedule date range:", {
      //   startDate: localDutySchedule.startDate,
      //   endDate: localDutySchedule.endDate,
      // });

      dispatch(
        fetchHolidaysDateRange({
          startDate: localDutySchedule.startDate,
          endDate: localDutySchedule.endDate,
        })
      );
    }
  }, [dispatch, localDutySchedule.startDate, localDutySchedule.endDate]);

  // Update local state when duty schedule data is loaded
  useEffect(() => {
    // Edit Schedule
    if (isEditMode && dutySchedule) {
      const startDateObj = parseDatePH(dutySchedule.startDate);
      const endDateObj = parseDatePH(dutySchedule.endDate);

      if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
        // Set local duty schedule without entries

        // Compose the schedule name: e.g., "PBO Department June 2025"
        let departmentLabel = "";
        if (department && department.name) {
          departmentLabel = `${departmentLabel} `;
        }

        setLocalDutySchedule({
          ...dutySchedule,
          name: `${departmentLabel}${getMonthLabelPH(endDateObj)}`.trim(),
          department: dutySchedule.department?._id || dutySchedule.department,
          startDate: formatDatePH(startDateObj),
          endDate: formatDatePH(endDateObj),
          monthSchedule: dutySchedule.monthSchedule, // Use existing or generate from endDate
        });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dutySchedule, isEditMode, department]);

  // this will generate the schedule name.
  // ex.output =>  May 2025, April 2025
  //and will set the startDate and endDate
  useEffect(() => {
    const { startDate, endDate } = getDutyScheduleRangePH(currentDate, true);
    const days = getCalendarDaysInRangePH(startDate, endDate);

    // Compose the schedule name: e.g., "PBO Department June 2025"
    let departmentLabel = "";
    if (department && department.name) {
      departmentLabel = `${department.name} `;
    }
    setLocalDutySchedule((prev) => ({
      ...prev,
      name: `${departmentLabel}${getMonthLabelPH(currentDate)}`.trim(),
      department: department?._id || department,
      startDate: formatDatePH(startDate),
      endDate: formatDatePH(endDate),
      monthSchedule: formatMonthSchedulePH(currentDate), // Added monthSchedule field (YYYY-MM)
    }));

    setDays(days);
  }, [currentDate, department]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());

      // If HR approved update and onSuccess callback provided, use it
      if (isHrApprovedUpdate && onSuccess) {
        onSuccess();
      } else {
        navigate(-1);
      }

      if (!isEditMode) {
        setLocalDutySchedule({
          name: "",
          department: "",
          startDate: "",
          endDate: "",
          monthSchedule: "", // Reset monthSchedule field
          entries: [],
          isFinalized: false,
        });
      }
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successMessage, errorMessage, dispatch, isEditMode]);

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

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setShowAddModal(true);
    setEmployeeInput("");
    setScheduleType("duty"); // Reset to default
    setSelectedShift("");
    setSelectedLeave(""); // Reset leave template
    setCompensatoryWorkDates([]); // Reset multiple compensatory work dates
    setDescription("");

    // Clear all error states
    setEmployeeError("");
    setTypeError("");
    setShiftError("");
    setLeaveError("");
    setCompensatoryWorkDatesError(""); // Clear multiple compensatory work dates error
  };

  const getEmployeesForDate = (date) => {
    if (!date) return [];
    const dateKey = formatDatePH(date);

    const entry = allEntries?.find((e) => formatDatePH(e.date) === dateKey);
    if (!entry) return [];

    // First, process all employee schedules
    const processedSchedules = entry.employeeSchedules.map((es) => {
      const empId =
        typeof es.employee === "string" ? es.employee : es.employee?._id;

      let employee =
        typeof es.employee === "object" && es.employee?._id
          ? es.employee
          : employees.find((emp) => emp._id === empId);

      // Handle different schedule types
      let displayInfo = {
        shift: "N/A",
        shiftName: "unknown",
        startIn: "",
        type: es.type || "duty",
      };

      if (es.type === "duty") {
        let shiftTemplate;
        if (es.shiftTemplate) {
          const wsId =
            typeof es.shiftTemplate === "string"
              ? es.shiftTemplate
              : es.shiftTemplate?._id;

          shiftTemplate =
            typeof es.shiftTemplate === "object" && es.shiftTemplate?._id
              ? es.shiftTemplate
              : shiftTemplates.find((ws) => ws._id === wsId);
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
        let leaveTemplate;
        if (es.leaveTemplate) {
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
        displayInfo.shift = "Day Off";
        displayInfo.shiftName = "holiday_off";
        displayInfo.startIn = "holiday_off";
      }

      return {
        id: empId,
        name: employee
          ? `${
              employee.personalInformation.lastName
            }, ${employee.personalInformation.firstName
              .charAt(0)
              .toUpperCase()}`
          : "Unknown Employee",
        lastName: employee?.personalInformation?.lastName || "Unknown",
        shiftName: displayInfo.shiftName,
        shift: displayInfo.shift,
        description: es.remarks || "",
        startIn: displayInfo.startIn,
        type: es.type || "duty",
        leaveAbbreviation: displayInfo.leaveAbbreviation || null,
        leaveTemplateName: displayInfo.leaveTemplateName || null,
        compensatoryWorkDate: es.compensatoryWorkDate || null, // Add compensatory work date to employee object
        compensatoryWorkShift: es.compensatoryWorkShift || null, // Add compensatory work shift to employee object
        compensatoryWorkDates: es.compensatoryWorkDates || [], // Add compensatory work dates array to employee object
      };
    });

    // Group employees by ID to ensure each employee appears only once
    const employeeGroups = processedSchedules.reduce((acc, emp) => {
      if (!acc[emp.id]) {
        acc[emp.id] = emp;
      } else {
        // If employee already exists, we need to merge the data
        // For compensatory time off, combine compensatory work dates
        if (emp.compensatoryWorkDates && emp.compensatoryWorkDates.length > 0) {
          acc[emp.id].compensatoryWorkDates = [
            ...(acc[emp.id].compensatoryWorkDates || []),
            ...emp.compensatoryWorkDates,
          ];
        }

        // Keep the most specific type (duty > leave > off > holiday_off)
        const typeOrder = { duty: 4, leave: 3, off: 2, holiday_off: 1 };
        if ((typeOrder[emp.type] || 0) > (typeOrder[acc[emp.id].type] || 0)) {
          acc[emp.id].type = emp.type;
          acc[emp.id].shiftName = emp.shiftName;
          acc[emp.id].shift = emp.shift;
          acc[emp.id].startIn = emp.startIn;
          acc[emp.id].leaveAbbreviation = emp.leaveAbbreviation;
          acc[emp.id].leaveTemplateName = emp.leaveTemplateName;
        }
      }
      return acc;
    }, {});

    // Convert back to array and sort
    const employeesForDate = Object.values(employeeGroups).sort((a, b) => {
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

  const handleEmployeeAdd = () => {
    let valid = true;

    // Clear all errors first
    setEmployeeError("");
    setTypeError("");
    setShiftError("");
    setLeaveError("");
    setCompensatoryWorkDatesError(""); // Clear multiple compensatory work dates error

    // Validate employee selection
    if (!employeeInput) {
      setEmployeeError("Employee is required.");
      valid = false;
    }

    // Validate schedule type
    if (!scheduleType) {
      setTypeError("Schedule type is required.");
      valid = false;
    }

    // Validate based on schedule type
    if (scheduleType === "duty" && !selectedShift) {
      setShiftError("Shift template is required for duty schedule.");
      valid = false;
    }

    if (scheduleType === "leave" && !selectedLeave) {
      setLeaveError("Leave template is required for leave schedule.");
      valid = false;
    }

    // Validate compensatory work dates for compensatory time off leave
    if (scheduleType === "leave" && selectedLeave) {
      const leaveTemplate = leaveTemplates?.find(
        (lt) => lt._id === selectedLeave
      );
      if (leaveTemplate?.isCompensatoryTimeOff) {
        // Check if at least one complete work date is provided
        if (compensatoryWorkDates.length === 0) {
          setCompensatoryWorkDatesError(
            "At least one work date with shift is required for compensatory time off."
          );
          valid = false;
        } else {
          // Validate each work date entry
          for (let i = 0; i < compensatoryWorkDates.length; i++) {
            const workEntry = compensatoryWorkDates[i];
            if (!workEntry.date) {
              if (compensatoryWorkDates.length === 1) {
                setCompensatoryWorkDatesError("Work date is required.");
              } else {
                setCompensatoryWorkDatesError(
                  `Work date #${i + 1} is required.`
                );
              }
              valid = false;
              break;
            }
            if (!workEntry.shiftTemplate) {
              if (compensatoryWorkDates.length === 1) {
                setCompensatoryWorkDatesError("Work shift is required.");
              } else {
                setCompensatoryWorkDatesError(
                  `Work shift for date #${i + 1} is required.`
                );
              }
              valid = false;
              break;
            }
          }
        }
      }
    }

    // Check if date is a holiday and type is holiday_off
    const isDateHoliday = isHoliday(selectedDate);
    if (scheduleType === "holiday_off" && !isDateHoliday) {
      setTypeError("Holiday Off can only be selected on actual holiday dates.");
      valid = false;
    }

    if (!selectedDate || !valid) return;

    const dateKey = formatDatePH(selectedDate);

    // Deep clone to avoid state mutation
    let entries = JSON.parse(JSON.stringify(allEntries));

    // Check if there's already an entry for the selected date
    let entryIndex = entries.findIndex((e) => formatDatePH(e.date) === dateKey);

    // Build new schedule object based on type
    const newSchedule = {
      employee: employeeInput,
      type: scheduleType,
      remarks: description,
    };

    // Add type-specific fields
    if (scheduleType === "duty") {
      newSchedule.shiftTemplate = selectedShift;
    } else if (scheduleType === "leave") {
      newSchedule.leaveTemplate = selectedLeave;

      // Add compensatory work data if this is compensatory time off
      const leaveTemplate = leaveTemplates?.find(
        (lt) => lt._id === selectedLeave
      );
      if (leaveTemplate?.isCompensatoryTimeOff) {
        // Add compensatory work dates array to the schedule
        if (compensatoryWorkDates.length > 0) {
          const validWorkDates = compensatoryWorkDates
            .filter((workEntry) => workEntry.date && workEntry.shiftTemplate) // Only include complete entries
            .map((workEntry) => ({
              date: new Date(workEntry.date + "T00:00:00.000Z"),
              shiftTemplate: workEntry.shiftTemplate,
              hoursWorked: workEntry.hoursWorked || null,
            }));

          newSchedule.compensatoryWorkDates = validWorkDates;
        }
      }
    }
    // For "off" and "holiday_off", no additional fields needed

    if (entryIndex === -1) {
      // No entry for the date → create a new one
      const newEntry = {
        date: selectedDate,
        employeeSchedules: [newSchedule],
      };

      // Add holiday reference if date is a holiday
      if (isDateHoliday) {
        const holiday = holidays?.find((h) => {
          const holidayDatePH = formatDatePH(new Date(h.date));
          return holidayDatePH === formatDatePH(selectedDate);
        });
        if (holiday) {
          newEntry.holiday = holiday._id;
        }
      }

      entries.push(newEntry);
    } else {
      const employeeSchedules = entries[entryIndex].employeeSchedules;
      const existingIndex = employeeSchedules.findIndex(
        (es) => es.employee === employeeInput
      );

      if (existingIndex === -1) {
        // Not yet scheduled → add
        employeeSchedules.push(newSchedule);
      } else {
        // Already scheduled → update
        employeeSchedules[existingIndex] = newSchedule;
      }

      // Sort by employee last name for consistency
      employeeSchedules.sort((a, b) => {
        const getEmployeeData = (empSched) => {
          const empId =
            typeof empSched.employee === "string"
              ? empSched.employee
              : empSched.employee?._id;
          return typeof empSched.employee === "object" && empSched.employee?._id
            ? empSched.employee
            : employees.find((e) => e._id === empId);
        };

        const empA = getEmployeeData(a);
        const empB = getEmployeeData(b);

        const lastA = empA?.personalInformation?.lastName?.toLowerCase() || "";
        const lastB = empB?.personalInformation?.lastName?.toLowerCase() || "";
        return lastA.localeCompare(lastB);
      });

      entries[entryIndex].employeeSchedules = employeeSchedules;

      // Add holiday reference if date is a holiday and not already set
      if (isDateHoliday && !entries[entryIndex].holiday) {
        const holiday = holidays?.find((h) => {
          const holidayDatePH = formatDatePH(new Date(h.date));
          return holidayDatePH === formatDatePH(selectedDate);
        });
        if (holiday) {
          entries[entryIndex].holiday = holiday._id;
        }
      }
    }

    setAllEntries(entries);
    setShowAddModal(false);

    // Reset form values
    setEmployeeInput("");
    setScheduleType("duty");
    setSelectedShift("");
    setSelectedLeave("");
    setCompensatoryWorkDates([]); // Reset multiple compensatory work dates
    setSelectedDate(null);
    setDescription("");
  };

  const handleEmployeeRemove = (date, employeeId) => {
    if (!date || !employeeId) return;

    const dateKey = formatDatePH(date);
    let entries = [...allEntries]; // Change localDutySchedule.entries to allEntries
    let entryIndex = entries.findIndex((e) => formatDatePH(e.date) === dateKey);

    if (entryIndex === -1) return;

    let employeeSchedules = entries[entryIndex].employeeSchedules;
    employeeSchedules = employeeSchedules.filter((es) => {
      const esEmployeeId =
        typeof es.employee === "string" ? es.employee : es.employee?._id;
      return esEmployeeId !== employeeId;
    });

    if (employeeSchedules.length === 0) {
      entries = entries.filter((e) => formatDatePH(e.date) !== dateKey);
    } else {
      entries[entryIndex].employeeSchedules = employeeSchedules;
    }

    // Save the updated entries to allEntries instead of localDutySchedule
    setAllEntries(entries); // Update the allEntries state
  };

  const getShiftColor = (shiftName) => {
    // Handle special cases for non-duty types
    if (shiftName === "day-off") return "bg-gray-200";
    if (shiftName === "holiday-off") return "bg-orange-200";
    if (shiftName === "leave" || shiftName.startsWith("leave_"))
      return "bg-yellow-200";

    // First try to find the shift template in entries
    let schedule = null;
    for (const entry of allEntries) {
      for (const es of entry.employeeSchedules) {
        if (es.type === "duty" && es.shiftTemplate) {
          const shiftTemplate =
            typeof es.shiftTemplate === "object" && es.shiftTemplate?._id
              ? es.shiftTemplate
              : null;
          if (
            shiftTemplate &&
            shiftTemplate.name?.toLowerCase() === shiftName?.toLowerCase()
          ) {
            schedule = shiftTemplate;
            break;
          }
        }
      }
      if (schedule) break;
    }

    // Fallback to Redux store
    if (!schedule) {
      schedule = shiftTemplates.find(
        (ws) => ws.name?.toLowerCase() === shiftName?.toLowerCase()
      );
    }

    return schedule?.shiftColor || "bg-white"; // fallback to white if not found or no color set
  };

  // Filter entries by date range
  const filterEntriesByDateRange = (entries, start, end) => {
    // Use the formatToPHDateString to format start and end dates in Philippines timezone (YYYY-MM-DD)
    const startDate = formatDatePH(start);
    const endDate = formatDatePH(end);

    return entries.filter((entry) => {
      // Format the entry date using the same function
      const entryDate = formatDatePH(entry.date);

      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const handleNextMonth = () => {
    const nextDate = parseDatePH(currentDate);
    nextDate.setMonth(nextDate.getMonth() + 1);

    // Update the currentDate to reflect the next month
    setCurrentDate(nextDate);
  };

  const handlePrevMonth = () => {
    const prevDate = parseDatePH(currentDate);
    prevDate.setMonth(prevDate.getMonth() - 1);

    const today = getCurrentDatePH();
    const currentMonthStart = parseDatePH(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // Only update the currentDate if the previous month is not earlier than the current month
    if (prevDate >= currentMonthStart) {
      setCurrentDate(prevDate);
    }
  };

  const handleSave = async () => {
    // Check if this is an HR approved update scenario
    if (isHrApprovedUpdate) {
      setShowHrUpdateModal(true);
      return;
    }

    // Proceed with regular save logic
    await performSave();
  };

  const performSave = async () => {
    const startDateUTC = convertDatePHToUTCISO(localDutySchedule.startDate);
    const endDateUTC = convertDatePHToUTCISO(localDutySchedule.endDate);

    const filteredEntries = filterEntriesByDateRange(
      allEntries,
      localDutySchedule.startDate,
      localDutySchedule.endDate
    );

    // Set entry date to PH midnight, then convert to UTC ISO
    const transformedEntries = filteredEntries.map((entry) => {
      const phMidnight = formatDatePH(entry.date);
      return {
        ...entry,
        date: convertDatePHToUTCISO(phMidnight),
      };
    });

    const payload = {
      ...localDutySchedule,
      startDate: startDateUTC,
      endDate: endDateUTC,
      monthSchedule: localDutySchedule.monthSchedule, // Include monthSchedule in payload
      entries: transformedEntries,
    };

    if (isEditMode) {
      dispatch(updateDutySchedule({ _id: scheduleId, ...payload }));
    } else {
      dispatch(createDutySchedule(payload));
    }
  };

  // Handle HR Approved Update
  const handleHrApprovedUpdate = async () => {
    if (!hrUpdateReason.trim() || !hrUpdatePassword.trim()) {
      alert("Both reason and password are required for HR approved updates.");
      return;
    }

    setHrUpdateLoading(true);

    try {
      const startDateUTC = convertDatePHToUTCISO(localDutySchedule.startDate);
      const endDateUTC = convertDatePHToUTCISO(localDutySchedule.endDate);

      const filteredEntries = filterEntriesByDateRange(
        allEntries,
        localDutySchedule.startDate,
        localDutySchedule.endDate
      );

      // Set entry date to PH midnight, then convert to UTC ISO
      const transformedEntries = filteredEntries.map((entry) => {
        const phMidnight = formatDatePH(entry.date);
        return {
          ...entry,
          date: convertDatePHToUTCISO(phMidnight),
        };
      });

      const payload = {
        ...localDutySchedule,
        startDate: startDateUTC,
        endDate: endDateUTC,
        monthSchedule: localDutySchedule.monthSchedule,
        entries: transformedEntries,
        reason: hrUpdateReason.trim(),
        password: hrUpdatePassword.trim(),
      };

      await dispatch(
        updateHrApprovedDutySchedule({ _id: scheduleId, ...payload })
      ).unwrap();

      // Reset modal state
      setShowHrUpdateModal(false);
      setHrUpdatePassword("");
      setHrUpdateReason("");
    } catch (error) {
      console.error("HR approved update failed:", error);
      alert(
        error.message ||
          "Failed to update HR approved schedule. Please try again."
      );

      // If there's an error, show the modal again so user can retry
      setShowHrUpdateModal(true);
    } finally {
      setHrUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    if (allEntries && allEntries.length > 0) {
      setShowCancelModal(true);
    } else {
      // If HR approved update and onClose callback provided, use it
      if (isHrApprovedUpdate && onClose) {
        onClose();
      } else {
        navigate(-1);
      }
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);

    // If HR approved update and onClose callback provided, use it
    if (isHrApprovedUpdate && onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };

  // Drag and Drop State
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  // Drag and Drop Handlers
  const handleDragStart = (e, type, data) => {
    setDraggedItem({ type, data });
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e, date) => {
    e.preventDefault();
    setDragOverDate(formatDatePH(date));
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverDate(null);
    }
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    setDragOverDate(null);
    if (!draggedItem || !targetDate) {
      setDraggedItem(null);
      return;
    }

    // console.log("Dragged Item:", draggedItem);
    if (draggedItem.type === "employee") {
      // Handle single employee drag and drop with new backend structure
      const emp = draggedItem.data;

      if (!emp || !emp.id) {
        setDraggedItem(null);
        return;
      }

      // Handle holiday_off type validation
      if (emp.type === "holiday_off") {
        const isTargetHoliday = isHoliday(targetDate);
        if (!isTargetHoliday) {
          // Skip dragging holiday_off to non-holiday dates
          setDraggedItem(null);
          return;
        }
      }

      setSelectedDate(targetDate);
      setEmployeeInput(emp.id);
      setScheduleType(emp.type || "duty");

      // Set appropriate template based on type
      if (emp.type === "duty") {
        setSelectedShift(emp.shiftTemplate || "");
        setSelectedLeave("");
        // setCompensatoryWorkDate(""); // Reset compensatory work date (legacy) - DISABLED
        // setCompensatoryWorkShift(""); // Reset compensatory work shift (legacy) - DISABLED
        setCompensatoryWorkDates([]); // Reset multiple compensatory work dates
      } else if (emp.type === "leave") {
        setSelectedLeave(emp.leaveTemplate || "");
        // setCompensatoryWorkDate (legacy) - REMOVED
        // setCompensatoryWorkShift (legacy) - REMOVED
        setCompensatoryWorkDates([]); // Reset for now
        setSelectedShift("");
      } else {
        setSelectedShift("");
        setSelectedLeave("");
        // setCompensatoryWorkDate(""); // Reset compensatory work date (legacy) - REMOVED
        // setCompensatoryWorkShift(""); // Reset compensatory work shift (legacy) - REMOVED
        setCompensatoryWorkDates([]); // Reset multiple compensatory work dates
      }

      setDescription(emp.description || "");
      setTimeout(() => {
        handleEmployeeAdd();
        setEmployeeInput("");
        setScheduleType("duty");
        setSelectedShift("");
        setSelectedLeave("");
        // setCompensatoryWorkDate(""); // Reset compensatory work date - REMOVED
        setSelectedDate(null);
        setDescription("");
        setDraggedItem(null);
      }, 0);
    } else if (draggedItem.type === "group") {
      // Handle group drag and drop with new backend structure
      const group = draggedItem.data;
      if (!group || !Array.isArray(group.employees)) {
        setDraggedItem(null);
        return;
      }

      const isTargetHoliday = isHoliday(targetDate);

      group.employees.forEach((emp, idx) => {
        // Skip holiday_off schedules if target is not a holiday
        if (emp.type === "holiday_off" && !isTargetHoliday) {
          return;
        }

        setTimeout(() => {
          setSelectedDate(targetDate);
          setEmployeeInput(emp.id);
          setScheduleType(emp.type || "duty");

          // Set appropriate template based on type
          if (emp.type === "duty") {
            setSelectedShift(emp.shiftTemplate || "");
            setSelectedLeave("");
            // setCompensatoryWorkDate(""); // Reset compensatory work date (legacy) - REMOVED
            // setCompensatoryWorkShift(""); // Reset compensatory work shift (legacy) - REMOVED
            setCompensatoryWorkDates([]); // Reset multiple compensatory work dates
          } else if (emp.type === "leave") {
            setSelectedLeave(emp.leaveTemplate || "");
            // setCompensatoryWorkDate (legacy) - REMOVED
            // setCompensatoryWorkShift (legacy) - REMOVED
            setCompensatoryWorkDates([]); // Reset for now
            setSelectedShift("");
          } else {
            setSelectedShift("");
            setSelectedLeave("");
            // setCompensatoryWorkDate(""); // Reset compensatory work date (legacy) - REMOVED
            // setCompensatoryWorkShift(""); // Reset compensatory work shift (legacy) - REMOVED
            setCompensatoryWorkDates([]); // Reset multiple compensatory work dates
          }

          setDescription(emp.description || "");
          handleEmployeeAdd();
          setEmployeeInput("");
          setScheduleType("duty");
          setSelectedShift("");
          setSelectedLeave("");
          // setCompensatoryWorkDate(""); // Reset compensatory work date (legacy) - REMOVED
          // setCompensatoryWorkShift(""); // Reset compensatory work shift (legacy) - REMOVED
          setCompensatoryWorkDates([]); // Reset multiple compensatory work dates
          setSelectedDate(null);
          setDescription("");
          if (idx === group.employees.length - 1) setDraggedItem(null);
        }, idx * 10);
      });
    } else if (draggedItem.type === "dateBox") {
      // Add all employees from the source date to the target date, preserving all schedule types
      const sourceDate = draggedItem.data.date;
      const sourceDateKey = formatDatePH(sourceDate);
      const targetDateKey = formatDatePH(targetDate);
      let entries = JSON.parse(JSON.stringify(allEntries));

      // Find source entry
      const sourceEntry = entries.find(
        (e) => formatDatePH(e.date) === sourceDateKey
      );
      if (!sourceEntry || !sourceEntry.employeeSchedules.length) {
        setDraggedItem(null);
        return;
      }

      // Find or create target entry
      let targetEntry = entries.find(
        (e) => formatDatePH(e.date) === targetDateKey
      );
      if (!targetEntry) {
        targetEntry = {
          date: targetDate,
          employeeSchedules: [],
        };

        // Add holiday reference if target date is a holiday
        const isTargetHoliday = isHoliday(targetDate);
        if (isTargetHoliday) {
          const holiday = holidays?.find((h) => {
            const holidayDatePH = formatDatePH(new Date(h.date));
            return holidayDatePH === formatDatePH(targetDate);
          });
          if (holiday) {
            targetEntry.holiday = holiday._id;
          }
        }

        entries.push(targetEntry);
      }

      // Get all employee IDs already scheduled for this date
      const scheduledEmpIds = new Set(
        targetEntry.employeeSchedules.map((es) =>
          typeof es.employee === "string" ? es.employee : es.employee?._id
        )
      );

      const isTargetHoliday = isHoliday(targetDate);

      sourceEntry.employeeSchedules.forEach((sched) => {
        const empId =
          typeof sched.employee === "string"
            ? sched.employee
            : sched.employee?._id;

        // Skip if employee is already scheduled for this date
        if (scheduledEmpIds.has(empId)) {
          return;
        }

        // Handle holiday_off type validation
        if (sched.type === "holiday_off" && !isTargetHoliday) {
          // Skip copying holiday_off to non-holiday dates
          return;
        }

        // Handle duty schedule day-specific validations
        if (sched.type === "duty" && sched.shiftTemplate) {
          const shiftTemplate =
            typeof sched.shiftTemplate === "object" && sched.shiftTemplate?._id
              ? sched.shiftTemplate
              : shiftTemplates.find(
                  (ws) =>
                    ws._id === sched.shiftTemplate ||
                    ws._id === sched.shiftTemplate?._id
                );

          // Skip if copying 'Office Friday' to non-Friday or 'Billing Sat' to non-Saturday
          if (
            shiftTemplate &&
            shiftTemplate.name &&
            ((shiftTemplate.name?.toLowerCase() === "office friday" &&
              targetDate.getDay() !== 5) ||
              (shiftTemplate.name?.toLowerCase() === "billing sat" &&
                targetDate.getDay() !== 6))
          ) {
            return;
          }
        }

        // Copy the schedule (all types: duty, off, leave, holiday_off)
        targetEntry.employeeSchedules.push({ ...sched });
        scheduledEmpIds.add(empId);
      });

      setAllEntries(entries);
      setDraggedItem(null);
    }
  };

  // Copy To Modal State
  const [showCopyToModal, setShowCopyToModal] = useState(false);
  const [copySourceDate, setCopySourceDate] = useState(null);
  const [copyTargetDates, setCopyTargetDates] = useState([]);

  // Open Copy To Modal on right click
  const handleDateBoxContextMenu = (e, date) => {
    e.preventDefault();
    setCopySourceDate(date);
    setCopyTargetDates([]);
    setShowCopyToModal(true);
  };

  // Toggle date selection in modal
  const handleToggleCopyTargetDate = (date) => {
    setCopyTargetDates((prev) => {
      const exists = prev.some((d) => formatDatePH(d) === formatDatePH(date));
      if (exists) {
        return prev.filter((d) => formatDatePH(d) !== formatDatePH(date));
      } else {
        return [...prev, date];
      }
    });
  };

  // Perform the copy to selected dates
  const handleCopyToDates = () => {
    if (!copySourceDate || copyTargetDates.length === 0) {
      setShowCopyToModal(false);
      return;
    }
    const sourceDateKey = formatDatePH(copySourceDate);
    let entries = JSON.parse(JSON.stringify(allEntries));
    const sourceEntry = entries.find(
      (e) => formatDatePH(e.date) === sourceDateKey
    );
    if (!sourceEntry || !sourceEntry.employeeSchedules.length) {
      setShowCopyToModal(false);
      return;
    }

    copyTargetDates.forEach((targetDate) => {
      const targetDateKey = formatDatePH(targetDate);
      let targetEntry = entries.find(
        (e) => formatDatePH(e.date) === targetDateKey
      );
      if (!targetEntry) {
        targetEntry = {
          date: targetDate,
          employeeSchedules: [],
        };

        // Add holiday reference if target date is a holiday
        const isTargetHoliday = isHoliday(targetDate);
        if (isTargetHoliday) {
          const holiday = holidays?.find((h) => {
            const holidayDatePH = formatDatePH(new Date(h.date));
            return holidayDatePH === formatDatePH(targetDate);
          });
          if (holiday) {
            targetEntry.holiday = holiday._id;
          }
        }

        entries.push(targetEntry);
      }

      // Get all employee IDs already scheduled for this date
      const scheduledEmpIds = new Set(
        targetEntry.employeeSchedules.map((es) =>
          typeof es.employee === "string" ? es.employee : es.employee?._id
        )
      );

      sourceEntry.employeeSchedules.forEach((sched) => {
        const empId =
          typeof sched.employee === "string"
            ? sched.employee
            : sched.employee?._id;

        // Skip if employee is already scheduled for this date
        if (scheduledEmpIds.has(empId)) {
          return;
        }

        // Handle holiday_off type validation
        const isTargetHoliday = isHoliday(targetDate);
        if (sched.type === "holiday_off" && !isTargetHoliday) {
          // Skip copying holiday_off to non-holiday dates
          return;
        }

        // Handle different schedule types during copy
        if (sched.type === "duty" && sched.shiftTemplate) {
          const shiftTemplate =
            typeof sched.shiftTemplate === "object" && sched.shiftTemplate?._id
              ? sched.shiftTemplate
              : shiftTemplates.find(
                  (ws) =>
                    ws._id === sched.shiftTemplate ||
                    ws._id === sched.shiftTemplate?._id
                );

          // Skip if copying 'Office Friday' to non-Friday or 'Billing Sat' to non-Saturday
          if (
            shiftTemplate &&
            shiftTemplate.name &&
            ((shiftTemplate.name?.toLowerCase() === "office friday" &&
              targetDate.getDay() !== 5) ||
              (shiftTemplate.name?.toLowerCase() === "billing sat" &&
                targetDate.getDay() !== 6))
          ) {
            return;
          }
        }

        // Copy the schedule (all types: duty, off, leave, holiday_off)
        targetEntry.employeeSchedules.push({ ...sched });
        scheduledEmpIds.add(empId);
      });
    });

    setAllEntries(entries);
    setShowCopyToModal(false);
    setCopySourceDate(null);
    setCopyTargetDates([]);
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

  // getShiftHours,  getWeeklySummary and formatHoursAndMinutes in dutyScheduleForm are different in dutyScheduleDetails and dutySchedulePrint
  // Helper: Calculate shift hours
  const getShiftHours = (shift) => {
    if (!shift) return 0;
    if (shift === "off") return "off";
    if (typeof shift === "string" && shift.includes("off")) return "off";

    // Handle shift object or template
    const shiftTemplate = typeof shift === "object" ? shift : null;
    if (!shiftTemplate) return 0;

    if (shiftTemplate.status === "off") return "off";

    if (shiftTemplate.type === "Standard") {
      const morningIn = shiftTemplate.morningIn;
      const morningOut = shiftTemplate.morningOut;
      const afternoonIn = shiftTemplate.afternoonIn;
      const afternoonOut = shiftTemplate.afternoonOut;

      if (morningIn && morningOut && afternoonIn && afternoonOut) {
        try {
          // Calculate total hours for standard shift (morning + afternoon)
          const [mh, mm] = morningIn.split(":").map(Number);
          const [moh, mom] = morningOut.split(":").map(Number);
          const [ah, am] = afternoonIn.split(":").map(Number);
          const [aoh, aom] = afternoonOut.split(":").map(Number);
          const morning = moh * 60 + mom - (mh * 60 + mm);
          const afternoon = aoh * 60 + aom - (ah * 60 + am);
          return ((morning + afternoon) / 60).toFixed(2);
        } catch (error) {
          return 0;
        }
      }
    } else {
      const startTime = shiftTemplate.startTime;
      const endTime = shiftTemplate.endTime;

      if (startTime && endTime) {
        try {
          // Non-standard: single block
          const [sh, sm] = startTime.split(":").map(Number);
          const [eh, em] = endTime.split(":").map(Number);
          let startMins = sh * 60 + sm;
          let endMins = eh * 60 + em;
          // If end time is less than or equal to start time, it means the shift ends the next day
          if (endMins <= startMins) {
            endMins += 24 * 60;
          }
          const mins = endMins - startMins;
          return (mins / 60).toFixed(2);
        } catch (error) {
          return 0;
        }
      }
    }

    return 0;
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

  // Helper: Build summary data for the current visible calendar weeks
  const getWeeklySummary = () => {
    // Build a map of employees from entries
    const employeeMap = {};

    // First, collect all unique employees from entries
    const entryEmployees = new Set();
    allEntries.forEach((entry) => {
      entry.employeeSchedules.forEach((es) => {
        const empId =
          typeof es.employee === "string" ? es.employee : es.employee?._id;
        entryEmployees.add(empId);

        // Use populated employee data if available
        if (typeof es.employee === "object" && es.employee?._id) {
          employeeMap[empId] = es.employee;
        }
      });
    });

    // Fill in missing employee data from Redux store (for select options compatibility)
    entryEmployees.forEach((empId) => {
      if (!employeeMap[empId]) {
        const empFromStore = employees.find((emp) => emp._id === empId);
        if (empFromStore) {
          employeeMap[empId] = empFromStore;
        }
      }
    });

    // Build a map of shift templates from entries
    const shiftMap = {};

    // First, collect all unique shift templates from entries
    allEntries.forEach((entry) => {
      entry.employeeSchedules.forEach((es) => {
        if (es.type === "duty" && es.shiftTemplate) {
          const shiftId =
            typeof es.shiftTemplate === "string"
              ? es.shiftTemplate
              : es.shiftTemplate?._id;

          if (typeof es.shiftTemplate === "object" && es.shiftTemplate?._id) {
            shiftMap[shiftId] = es.shiftTemplate;
          }
        }
      });
    });

    // Fill in missing shift template data from Redux store
    allEntries.forEach((entry) => {
      entry.employeeSchedules.forEach((es) => {
        if (es.type === "duty" && es.shiftTemplate) {
          const shiftId =
            typeof es.shiftTemplate === "string"
              ? es.shiftTemplate
              : es.shiftTemplate?._id;

          if (shiftId && !shiftMap[shiftId]) {
            const shiftFromStore = shiftTemplates.find(
              (st) => st._id === shiftId
            );
            if (shiftFromStore) {
              shiftMap[shiftId] = shiftFromStore;
            }
          }
        }
      });
    });

    // Get all unique employees scheduled in this month
    const scheduledEmployeeIds = new Set();
    allEntries.forEach((entry) => {
      entry.employeeSchedules.forEach((es) => {
        const empId =
          typeof es.employee === "string" ? es.employee : es.employee?._id;
        scheduledEmployeeIds.add(empId);
      });
    });

    // Sort employees by last name using the employeeMap
    const sortedEmployees = Array.from(scheduledEmployeeIds)
      .map((id) => employeeMap[id])
      .filter((emp) => emp) // Remove null/undefined entries
      .sort((a, b) =>
        a.personalInformation.lastName.localeCompare(
          b.personalInformation.lastName
        )
      );

    // Build calendar weeks (array of arrays of dates)
    const weeks = [];
    let week = [];
    days.forEach((date, idx) => {
      if (week.length === 0 && date.getDay() !== 0) {
        // Fill empty days at start
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

    // For each week, build summary rows
    return weeks.map((weekDates) => {
      // For each employee, build row
      return sortedEmployees.map((emp) => {
        let total = 0;
        const row = {
          employee: `${emp.personalInformation.lastName}, ${emp.personalInformation.firstName}`,
          days: [],
          total: 0,
        };
        weekDates.forEach((date) => {
          if (!date) {
            row.days.push("");
            return;
          }
          // Find entry for this date
          const entry = allEntries.find(
            (e) => formatDatePH(e.date) === formatDatePH(date)
          );
          if (!entry) {
            row.days.push("");
            return;
          }
          // Find employee schedule
          const es = entry.employeeSchedules.find((es) => {
            const empId =
              typeof es.employee === "string" ? es.employee : es.employee?._id;
            return empId === emp._id;
          });
          if (!es) {
            row.days.push("");
            return;
          }

          // Get shift data from entries
          let shift = null;
          if (es.type === "duty") {
            if (es.shiftData && es.shiftData.name) {
              // Use shift data from entries
              shift = es.shiftData;
            } else if (es.shiftTemplate) {
              // Use template reference
              const shiftId =
                typeof es.shiftTemplate === "string"
                  ? es.shiftTemplate
                  : es.shiftTemplate?._id;
              shift = shiftMap[shiftId];
            }
          }

          const hours = getShiftHours(shift);
          row.days.push(hours === "off" ? "off" : hours);
          if (hours !== "off" && hours !== "" && !isNaN(Number(hours))) {
            total += Number(hours);
          }
        });
        row.total = total ? total.toFixed(2) : "";
        return row;
      });
    });
  };

  /*
   * EMPLOYEE & SHIFT TEMPLATE DATA USAGE APPROACH:
   *
   * This component uses a hybrid approach for both employee and shift template data:
   * 1. employees (from Redux store) - Used ONLY for select options in the modal
   * 2. shiftTemplates (from Redux store) - Used ONLY for select options in the modal
   * 3. allEntries (from duty schedule entries) - Used for all other data processing
   *
   * The reason for this approach is to prioritize data from entries while
   * maintaining compatibility with the select dropdowns that require the full lists.
   *
   * When processing scheduled data (display, sorting, summaries), the component:
   * - First tries to use employee/shift data from the entry (if populated)
   * - Falls back to Redux store data for backwards compatibility
   * - This ensures the component works with both populated and non-populated data in entries
   */

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Professional Header */}
      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {isEditMode
                ? `Edit ${dutySchedule?.name} Duty Schedule`
                : `Create ${department?.name} ${getMonthLabelPH(
                    currentDate
                  )} Duty Schedule`}
            </h1>
            <p className="text-blue-100">
              {isEditMode
                ? "Modify and update the existing duty schedule"
                : "Plan and organize employee duty schedules for the month"}
            </p>
          </div>

          {!isEditMode && (
            <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 10a1 1 0 001 1h10a1 1 0 001-1L16 7m-6 0V5"
                />
              </svg>
              <div className="flex items-center gap-2">
                {!isAtCurrentMonth() && (
                  <button
                    onClick={handlePrevMonth}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded font-medium transition-all text-sm"
                  >
                    Previous
                  </button>
                )}
                <span className="text-lg font-semibold text-white mx-2">
                  {getMonthLabelPH(currentDate)}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded font-medium transition-all text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && !hrUpdateLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-8 rounded-lg shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading duty schedule...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Calendar Section Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 10a1 1 0 001 1h10a1 1 0 001-1L16 7m-6 0V5"
                    />
                  </svg>
                  Schedule Calendar
                </h2>
                <p className="text-sm text-gray-600">
                  Click on any date to add employees. Drag and drop to copy
                  schedules between dates.
                </p>
              </div>

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
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragOverDate(`WEEKDAY-${index}`);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverDate(null);
                          if (!draggedItem || draggedItem.type !== "dateBox") {
                            setDraggedItem(null);
                            return;
                          }
                          // Find the first date in this column (week day)
                          const firstDate = days.find(
                            (d) => d && d.getDay() === index
                          );
                          if (firstDate) {
                            handleDrop(e, firstDate);
                          } else {
                            setDraggedItem(null);
                          }
                        }}
                        onDragLeave={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget)) {
                            setDragOverDate(null);
                          }
                        }}
                        style={{
                          cursor:
                            draggedItem && draggedItem.type === "dateBox"
                              ? "copy"
                              : "default",
                        }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                      {Array.from({ length: days[0]?.getDay() || 0 }).map(
                        (_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="lg:block hidden"
                          />
                        )
                      )}

                      {days.map((day, index) => (
                        <div key={index}>
                          {day && (
                            <div
                              draggable={true}
                              onDragStart={(e) =>
                                handleDragStart(e, "dateBox", { date: day })
                              }
                              onDragEnd={handleDragEnd}
                              onDragOver={(e) => handleDragOver(e, day)}
                              onDrop={(e) => handleDrop(e, day)}
                              onDragLeave={handleDragLeave}
                              onClick={() => handleDateClick(day)}
                              onContextMenu={(e) =>
                                handleDateBoxContextMenu(e, day)
                              }
                              className={`w-full p-2 min-h-[160px] border rounded-lg hover:border-blue-500 transition-colors bg-white text-left cursor-pointer ${
                                dragOverDate === formatDatePH(day)
                                  ? "ring-4 ring-blue-400"
                                  : ""
                              }`}
                            >
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
                                      title={(() => {
                                        const days = [
                                          "Sunday",
                                          "Monday",
                                          "Tuesday",
                                          "Wednesday",
                                          "Thursday",
                                          "Friday",
                                          "Saturday",
                                        ];
                                        const months = [
                                          "January",
                                          "February",
                                          "March",
                                          "April",
                                          "May",
                                          "June",
                                          "July",
                                          "August",
                                          "September",
                                          "October",
                                          "November",
                                          "December",
                                        ];
                                        return `${days[day.getDay()]}, ${
                                          months[day.getMonth()]
                                        } ${day.getDate()}, ${day.getFullYear()} (Holiday: ${getHolidayName(
                                          day
                                        )})`;
                                      })()}
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
                                        title={(() => {
                                          const days = [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday",
                                          ];
                                          const months = [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December",
                                          ];
                                          return `${days[day.getDay()]}, ${
                                            months[day.getMonth()]
                                          } ${day.getDate()}, ${day.getFullYear()}`;
                                        })()}
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
                                        title={(() => {
                                          const days = [
                                            "Sunday",
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday",
                                            "Saturday",
                                          ];
                                          const months = [
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December",
                                          ];
                                          return `${days[day.getDay()]}, ${
                                            months[day.getMonth()]
                                          } ${day.getDate()}, ${day.getFullYear()}`;
                                        })()}
                                      >
                                        {day.getDate()}
                                      </span>
                                      <span
                                        className={`text-xs ${
                                          day.getDay() === 0 ||
                                          day.getDay() === 6
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
                                {getEmployeesForDate(day).map((group) => (
                                  <div
                                    key={group.shift}
                                    className={`rounded p-1 ${getShiftColor(
                                      group.shiftName
                                    )}`}
                                    // Remove draggable and drag handlers from group
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
                                                {employees.map(
                                                  (emp, empIndex) => (
                                                    <div
                                                      key={`${emp.id}-${empIndex}`}
                                                      className="text-sm mb-1 p-1 rounded bg-white/50 ml-2"
                                                    >
                                                      <div className="flex justify-between items-center">
                                                        <div className="flex flex-col">
                                                          <span
                                                            title={
                                                              emp.leaveTemplateName
                                                            }
                                                            className="text-xs font-medium"
                                                          >
                                                            {emp.name}
                                                          </span>

                                                          {/* Display multiple compensatory work dates */}
                                                          {emp.compensatoryWorkDates &&
                                                            Array.isArray(
                                                              emp.compensatoryWorkDates
                                                            ) &&
                                                            emp
                                                              .compensatoryWorkDates
                                                              .length > 0 &&
                                                            emp.compensatoryWorkDates.map(
                                                              (
                                                                workEntry,
                                                                workIndex
                                                              ) => (
                                                                <div
                                                                  key={
                                                                    workIndex
                                                                  }
                                                                  className="text-xs text-green-600 font-medium mt-0.5"
                                                                >
                                                                  {(() => {
                                                                    try {
                                                                      const compactDate =
                                                                        formatUTCToCompactDatePH(
                                                                          workEntry.date
                                                                        );

                                                                      // Find shift template from Redux or use embedded data
                                                                      const shiftTemplate =
                                                                        typeof workEntry.shiftTemplate ===
                                                                        "object"
                                                                          ? workEntry.shiftTemplate
                                                                          : shiftTemplates?.find(
                                                                              (
                                                                                st
                                                                              ) =>
                                                                                st._id ===
                                                                                workEntry.shiftTemplate
                                                                            );

                                                                      const shiftText =
                                                                        shiftTemplate
                                                                          ? shiftTemplate.type ===
                                                                            "Standard"
                                                                            ? `${formatTimeTo12HourPH(
                                                                                shiftTemplate.morningIn
                                                                              )}-${formatTimeTo12HourPH(
                                                                                shiftTemplate.morningOut
                                                                              )}, ${formatTimeTo12HourPH(
                                                                                shiftTemplate.afternoonIn
                                                                              )}-${formatTimeTo12HourPH(
                                                                                shiftTemplate.afternoonOut
                                                                              )}`
                                                                            : `${formatTimeTo12HourPH(
                                                                                shiftTemplate.startTime
                                                                              )}-${formatTimeTo12HourPH(
                                                                                shiftTemplate.endTime
                                                                              )}`
                                                                          : "";

                                                                      return (
                                                                        <div className="flex flex-col">
                                                                          {compactDate && (
                                                                            <span className="text-green-600 font-medium">
                                                                              {
                                                                                compactDate
                                                                              }
                                                                            </span>
                                                                          )}
                                                                          {shiftText && (
                                                                            <span className="text-blue-600 font-medium">
                                                                              {
                                                                                shiftText
                                                                              }
                                                                            </span>
                                                                          )}
                                                                        </div>
                                                                      );
                                                                    } catch (error) {
                                                                      console.error(
                                                                        "Error parsing compensatory work entry:",
                                                                        workEntry,
                                                                        error
                                                                      );
                                                                      return null;
                                                                    }
                                                                  })()}
                                                                </div>
                                                              )
                                                            )}

                                                          {/* Fallback for legacy single compensatory work date (backward compatibility) */}
                                                          {(!emp.compensatoryWorkDates ||
                                                            emp
                                                              .compensatoryWorkDates
                                                              .length === 0) &&
                                                            emp.compensatoryWorkDate &&
                                                            (() => {
                                                              try {
                                                                const compactDate =
                                                                  formatUTCToCompactDatePH(
                                                                    emp.compensatoryWorkDate
                                                                  );
                                                                return compactDate ? (
                                                                  <span className="text-green-600 font-medium text-xs mt-0.5">
                                                                    {
                                                                      compactDate
                                                                    }
                                                                  </span>
                                                                ) : null;
                                                              } catch (error) {
                                                                console.error(
                                                                  "Error parsing legacy compensatory work date:",
                                                                  emp.compensatoryWorkDate,
                                                                  error
                                                                );
                                                                return null;
                                                              }
                                                            })()}

                                                          {/* Legacy shift display (backward compatibility) */}
                                                          {(!emp.compensatoryWorkDates ||
                                                            emp
                                                              .compensatoryWorkDates
                                                              .length === 0) &&
                                                            emp.compensatoryWorkShift && (
                                                              <div className="text-blue-600 font-medium text-xs mt-0.5">
                                                                {(() => {
                                                                  const shiftTemplate =
                                                                    typeof emp.compensatoryWorkShift ===
                                                                    "object"
                                                                      ? emp.compensatoryWorkShift
                                                                      : shiftTemplates?.find(
                                                                          (
                                                                            st
                                                                          ) =>
                                                                            st._id ===
                                                                            emp.compensatoryWorkShift
                                                                        );

                                                                  if (
                                                                    !shiftTemplate
                                                                  )
                                                                    return "";

                                                                  return (
                                                                    <span
                                                                      title={`Compensatory work shift: ${shiftTemplate.name}`}
                                                                      className="text-xs"
                                                                    >
                                                                      {shiftTemplate.type ===
                                                                      "Standard"
                                                                        ? `${formatTimeTo12HourPH(
                                                                            shiftTemplate.morningIn
                                                                          )}-${formatTimeTo12HourPH(
                                                                            shiftTemplate.morningOut
                                                                          )}, ${formatTimeTo12HourPH(
                                                                            shiftTemplate.afternoonIn
                                                                          )}-${formatTimeTo12HourPH(
                                                                            shiftTemplate.afternoonOut
                                                                          )}`
                                                                        : `${formatTimeTo12HourPH(
                                                                            shiftTemplate.startTime
                                                                          )}-${formatTimeTo12HourPH(
                                                                            shiftTemplate.endTime
                                                                          )}`}
                                                                    </span>
                                                                  );
                                                                })()}
                                                              </div>
                                                            )}
                                                        </div>
                                                        <button
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEmployeeRemove(
                                                              day,
                                                              emp.id
                                                            );
                                                          }}
                                                          className="text-red-500 hover:text-red-700 flex items-center justify-center z-10"
                                                          type="button"
                                                        >
                                                          <FaTimes />
                                                        </button>
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
                                            key={`${emp.id}-${empIndex}`}
                                            className="text-sm mb-1 p-1 rounded bg-white/50"
                                            // Remove draggable and drag handlers from employee
                                          >
                                            <div className="flex justify-between items-center">
                                              <span>{emp.name}</span>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleEmployeeRemove(
                                                    day,
                                                    emp.id
                                                  );
                                                }}
                                                className="text-red-500 hover:text-red-700 flex items-center justify-center z-10"
                                                type="button"
                                              >
                                                <FaTimes />
                                              </button>
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
            </div>
          </div>

          {/* Summary Section Card */}

          <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Weekly Summary
                </h2>
                <p className="text-sm text-gray-600">
                  Review total working hours for each employee by week and
                  month.
                </p>
              </div>

              <div className="overflow-x-auto">
                {(() => {
                  const weekDaysShort = [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ];
                  const summary = getWeeklySummary();
                  // Build a flat map of employeeId to total hours for the month
                  const employeeMonthTotals = {};

                  // Build a map of employees from entries (prioritize entry data)
                  const employeeMap = {};

                  // First, collect all unique employees from entries
                  const entryEmployees = new Set();
                  allEntries.forEach((entry) => {
                    entry.employeeSchedules.forEach((es) => {
                      const empId =
                        typeof es.employee === "string"
                          ? es.employee
                          : es.employee?._id;
                      entryEmployees.add(empId);

                      // If employee data is populated in entry, use it
                      if (typeof es.employee === "object" && es.employee?._id) {
                        employeeMap[empId] = es.employee;
                      }
                    });
                  });

                  // Fill in missing employee data from Redux store (for select options compatibility)
                  entryEmployees.forEach((empId) => {
                    if (!employeeMap[empId]) {
                      const empFromStore = employees.find(
                        (emp) => emp._id === empId
                      );
                      if (empFromStore) {
                        employeeMap[empId] = empFromStore;
                      }
                    }
                  });

                  // Build a map of shiftTemplates from entries (prioritize entry data)
                  const shiftMap = {};

                  // First, collect all unique shift templates from entries
                  const entryShiftTemplates = new Set();
                  allEntries.forEach((entry) => {
                    entry.employeeSchedules.forEach((es) => {
                      const shiftId =
                        typeof es.shiftTemplate === "string"
                          ? es.shiftTemplate
                          : es.shiftTemplate?._id;
                      entryShiftTemplates.add(shiftId);

                      // If shift template data is populated in entry, use it
                      if (
                        typeof es.shiftTemplate === "object" &&
                        es.shiftTemplate?._id
                      ) {
                        shiftMap[shiftId] = es.shiftTemplate;
                      }
                    });
                  });

                  // Fill in missing shift template data from Redux store (for select options compatibility)
                  entryShiftTemplates.forEach((shiftId) => {
                    if (!shiftMap[shiftId]) {
                      const shiftFromStore = shiftTemplates.find(
                        (st) => st._id === shiftId
                      );
                      if (shiftFromStore) {
                        shiftMap[shiftId] = shiftFromStore;
                      }
                    }
                  });

                  // Calculate total per employee for the month
                  allEntries.forEach((entry) => {
                    entry.employeeSchedules.forEach((es) => {
                      const empId =
                        typeof es.employee === "string"
                          ? es.employee
                          : es.employee?._id;
                      const shift =
                        shiftMap[
                          typeof es.shiftTemplate === "string"
                            ? es.shiftTemplate
                            : es.shiftTemplate?._id
                        ];
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

                  // Get all unique employees scheduled in this month, sorted by last name
                  const scheduledEmployeeIds = new Set();
                  allEntries.forEach((entry) => {
                    entry.employeeSchedules.forEach((es) => {
                      const empId =
                        typeof es.employee === "string"
                          ? es.employee
                          : es.employee?._id;
                      scheduledEmployeeIds.add(empId);
                    });
                  });

                  const sortedEmployees = Array.from(scheduledEmployeeIds)
                    .map((id) => employeeMap[id])
                    .filter((emp) => emp) // Remove null/undefined entries
                    .sort((a, b) =>
                      a.personalInformation.lastName.localeCompare(
                        b.personalInformation.lastName
                      )
                    );
                  // Render summary tables per week
                  return (
                    <>
                      {summary.map((rows, weekIdx) => {
                        // Get the weekDates for this week (aligned to calendar)
                        const weekDates = (() => {
                          // The weeks array in getWeeklySummary uses the same logic as the calendar grid
                          // So we can reconstruct the weeks array here for header rendering
                          const weeks = [];
                          let week = [];
                          days.forEach((date) => {
                            if (week.length === 0 && date.getDay() !== 0) {
                              for (let i = 0; i < date.getDay(); i++)
                                week.push(null);
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
                          return weeks[weekIdx] || [];
                        })();
                        return (
                          <div key={weekIdx} className="mb-4">
                            <table className="min-w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
                              <thead>
                                <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
                                  <th className="px-2 py-2 border text-left font-semibold text-gray-700">
                                    Employee
                                  </th>
                                  {weekDaysShort.map((d, i) => {
                                    const dateObj = weekDates[i];
                                    // Check if this date is a holiday
                                    const isHoliday =
                                      dateObj &&
                                      holidays?.some((h) => {
                                        const holidayDatePH = formatDatePH(
                                          new Date(h.date)
                                        );
                                        return (
                                          holidayDatePH ===
                                          formatDatePH(dateObj)
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
                                              : "text-blue-400"
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
                                {rows.map((row, i) => (
                                  <tr
                                    key={i}
                                    className={
                                      i % 2 === 0 ? "bg-white" : "bg-slate-100"
                                    }
                                  >
                                    <td className="px-2 py-2 border text-left whitespace-nowrap text-gray-800 font-medium">
                                      {row.employee}
                                    </td>
                                    {row.days.map((val, j) => (
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
                                      {row.total === ""
                                        ? ""
                                        : formatHoursAndMinutes(row.total)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      })}
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
                                className={
                                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
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
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 border border-gray-300 flex items-center gap-2"
                    disabled={loading}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>

                  {allEntries?.length !== 0 && (
                    <button
                      onClick={handleSave}
                      disabled={loading && !hrUpdateLoading}
                      className={`${
                        isHrApprovedUpdate
                          ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      } text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center gap-2 ${
                        loading && !hrUpdateLoading
                          ? "opacity-75 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {loading && !hrUpdateLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v.93m0 0a2.5 2.5 0 002.5 2.5H13m-2 0a2.5 2.5 0 01-2.5-2.5V9"
                            />
                          </svg>
                          {isHrApprovedUpdate
                            ? "Update Approved Schedule"
                            : isEditMode
                            ? "Update"
                            : "Save"}
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Status Info */}
                <div className="text-sm text-gray-600">
                  {allEntries?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {allEntries.length} schedule entr
                      {allEntries.length === 1 ? "y" : "ies"} created
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Professional Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-200">
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  Discard Changes?
                </h2>
                <p className="mb-6 text-gray-600 leading-relaxed">
                  You have unsaved changes. Are you sure you want to cancel and
                  lose your progress?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleCloseCancelModal}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 border border-gray-300"
                  >
                    No, Go Back
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HR Approved Update Modal */}
      {showHrUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-200">
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                  <svg
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  Update HR Approved Schedule
                </h2>
                <p className="mb-4 text-gray-600 text-sm leading-relaxed">
                  This schedule has been HR approved. Please provide a reason
                  and password confirmation for this update.
                </p>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Update *
                    </label>
                    <textarea
                      value={hrUpdateReason}
                      onChange={(e) => setHrUpdateReason(e.target.value)}
                      placeholder="e.g., Employee requested sick leave, holiday adjustment needed..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Confirmation *
                    </label>
                    <input
                      type="password"
                      value={hrUpdatePassword}
                      onChange={(e) => setHrUpdatePassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <button
                    onClick={() => {
                      setShowHrUpdateModal(false);
                      setHrUpdatePassword("");
                      setHrUpdateReason("");
                    }}
                    disabled={hrUpdateLoading}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 border border-gray-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleHrApprovedUpdate}
                    disabled={
                      hrUpdateLoading ||
                      !hrUpdateReason.trim() ||
                      !hrUpdatePassword.trim()
                    }
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {hrUpdateLoading ? "Updating..." : "Update Schedule"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Copy To Modal */}
      {showCopyToModal && copySourceDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto border border-gray-200">
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Schedule To...
                </h2>
                <p className="text-sm text-gray-600">
                  Select the dates where you want to copy the schedule from{" "}
                  {formatMonthYearPH(copySourceDate, true)}.
                </p>
              </div>

              <div className="flex justify-end mb-4 space-x-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-medium transition-colors"
                  onClick={() =>
                    setCopyTargetDates(
                      days.filter(
                        (date) =>
                          formatDatePH(date) !== formatDatePH(copySourceDate)
                      )
                    )
                  }
                >
                  Select All
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-medium transition-colors"
                  onClick={() => setCopyTargetDates([])}
                >
                  Deselect All
                </button>
              </div>

              {/* Calendar-style layout with weekday headers */}
              <div className="mb-3 grid grid-cols-7 gap-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((wd, i) => (
                  <div
                    key={wd}
                    className={`text-center font-bold text-sm py-2 ${
                      i === 0 || i === 6 ? "text-red-600" : "text-blue-700"
                    }`}
                  >
                    {wd}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 mb-6">
                {/* Empty cells for days before the first day of the month */}
                {Array.from({ length: days[0]?.getDay() || 0 }).map(
                  (_, idx) => (
                    <div key={`empty-${idx}`} className="h-10" />
                  )
                )}
                {/* Render day buttons in calendar grid */}
                {days.map((date, idx) => {
                  const isSelected = copyTargetDates.some(
                    (d) => formatDatePH(d) === formatDatePH(date)
                  );
                  const isSource =
                    formatDatePH(date) === formatDatePH(copySourceDate);
                  // Check if this date is a holiday
                  const isHoliday = holidays?.some((h) => {
                    const holidayDatePH = formatDatePH(new Date(h.date));
                    return holidayDatePH === formatDatePH(date);
                  });
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                  return (
                    <button
                      key={idx}
                      disabled={isSource}
                      onClick={() => handleToggleCopyTargetDate(date)}
                      className={`p-2 rounded-lg border text-center text-sm font-medium transition-all w-full h-10 flex items-center justify-center
                        ${
                          isSource
                            ? "bg-blue-100 text-blue-600 border-blue-200 cursor-not-allowed font-bold"
                            : isSelected
                            ? "bg-green-500 text-white border-green-500 shadow-sm"
                            : "bg-white hover:bg-gray-50 border-gray-300 hover:border-blue-300"
                        }
                      `}
                    >
                      <span
                        className={
                          !isSource && (isHoliday || isWeekend)
                            ? "text-red-600 font-bold"
                            : isSource
                            ? "text-blue-600 font-bold"
                            : isSelected
                            ? "text-white"
                            : "text-gray-700"
                        }
                      >
                        {date.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCopyToModal(false)}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCopyToDates}
                  disabled={copyTargetDates.length === 0}
                  className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-200 shadow-sm ${
                    copyTargetDates.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Copy to {copyTargetDates.length} date
                  {copyTargetDates.length !== 1 ? "s" : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Add Employee Modal */}
      {showAddModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white shadow-2xl rounded-xl w-full max-w-lg mx-auto border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Add Employee Schedule
                  </h2>
                  {/* Enhanced readable date display */}
                  <div className="mt-2 px-3 py-1 bg-blue-50 rounded-lg inline-block">
                    <p className="text-xs text-blue-700 font-medium">
                      Selected Date:{" "}
                      {selectedDate
                        ? (() => {
                            const days = [
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                            ];
                            const months = [
                              "January",
                              "February",
                              "March",
                              "April",
                              "May",
                              "June",
                              "July",
                              "August",
                              "September",
                              "October",
                              "November",
                              "December",
                            ];
                            return `${days[selectedDate.getDay()]}, ${
                              months[selectedDate.getMonth()]
                            } ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
                          })()
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form className="px-6 py-6 space-y-6 overflow-y-auto flex-1 min-h-0">
              {/* Employee Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Employee Name
                </label>

                {(() => {
                  const dateKey = formatDatePH(selectedDate);
                  const scheduledEmployeeIds =
                    allEntries
                      ?.find((entry) => formatDatePH(entry.date) === dateKey)
                      ?.employeeSchedules.map((es) =>
                        typeof es.employee === "string"
                          ? es.employee
                          : es.employee?._id
                      ) || [];

                  const availableEmployees = employees?.filter(
                    (employee) => !scheduledEmployeeIds.includes(employee._id)
                  );

                  return (
                    <select
                      required
                      value={employeeInput}
                      onChange={(e) => setEmployeeInput(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base shadow-sm transition-all"
                      autoFocus
                    >
                      <option value="" className="text-gray-500">
                        -- Select Employee --
                      </option>
                      {availableEmployees?.map((employee) => (
                        <option
                          key={employee._id}
                          value={employee._id}
                          className="capitalize py-2"
                        >
                          {employee.personalInformation.lastName},{" "}
                          {employee.personalInformation.firstName}{" "}
                          {employee.personalInformation.middleName
                            ? employee.personalInformation.middleName.charAt(
                                0
                              ) + "."
                            : ""}
                        </option>
                      ))}
                    </select>
                  );
                })()}
                {employeeError && (
                  <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {employeeError}
                  </div>
                )}
              </div>

              {/* Schedule Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Schedule Type
                </label>
                <select
                  required
                  value={scheduleType}
                  onChange={(e) => {
                    setScheduleType(e.target.value);
                    // Reset dependent fields when type changes
                    setSelectedShift("");
                    setSelectedLeave("");
                    setCompensatoryWorkDates([]); // Reset compensatory work dates
                    setShiftError("");
                    setLeaveError("");
                    setCompensatoryWorkDatesError("");
                  }}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base shadow-sm transition-all"
                >
                  <option value="duty">Duty Schedule</option>
                  <option value="off">Day Off</option>
                  <option value="leave">Leave</option>
                  {isHoliday(selectedDate) && (
                    <option value="holiday_off">Holiday Off</option>
                  )}
                </select>
                {typeError && (
                  <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {typeError}
                  </div>
                )}

                {/* Show holiday info if date is holiday */}
                {isHoliday(selectedDate) && (
                  <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-700">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Holiday: {getHolidayName(selectedDate)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Shift Template Selection - Only for Duty */}
              {scheduleType === "duty" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Shift Schedule
                  </label>
                  <select
                    required
                    value={selectedShift}
                    onChange={(e) => setSelectedShift(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base shadow-sm transition-all"
                  >
                    <option value="" className="text-gray-500">
                      -- Select Schedule --
                    </option>
                    {shiftTemplates &&
                      [...shiftTemplates]
                        .filter((schedule) => {
                          // Remove OFF shift templates as they're now handled by type="off"
                          if (schedule.status === "off") return false;

                          // If the shift is 'Office Friday', only show if selectedDate is Friday
                          if (
                            schedule.name?.toLowerCase() === "office friday"
                          ) {
                            return selectedDate && selectedDate.getDay() === 5; // 5 = Friday
                          }
                          // If the shift is 'Billing Sat', only show if selectedDate is Saturday
                          if (schedule.name?.toLowerCase() === "billing sat") {
                            return selectedDate && selectedDate.getDay() === 6; // 6 = Saturday
                          }
                          return true;
                        })
                        .map((schedule) => (
                          <option
                            key={schedule._id}
                            value={schedule._id}
                            className="py-2"
                          >
                            {schedule.name}
                            {schedule.type === "Standard"
                              ? ` (${formatTimeTo12HourPH(
                                  schedule.morningIn
                                )}-${formatTimeTo12HourPH(
                                  schedule.morningOut
                                )}, ${formatTimeTo12HourPH(
                                  schedule.afternoonIn
                                )}-${formatTimeTo12HourPH(
                                  schedule.afternoonOut
                                )})`
                              : ` (${formatTimeTo12HourPH(
                                  schedule.startTime
                                )}-${formatTimeTo12HourPH(schedule.endTime)})`}
                          </option>
                        ))}
                  </select>
                  {shiftError && (
                    <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {shiftError}
                    </div>
                  )}
                </div>
              )}

              {/* Leave Template Selection - Only for Leave */}
              {scheduleType === "leave" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Leave Type
                  </label>
                  <select
                    required
                    value={selectedLeave}
                    onChange={(e) => {
                      const leaveId = e.target.value;
                      setSelectedLeave(leaveId);

                      // Initialize with one work date entry for compensatory time off
                      if (leaveId) {
                        const leaveTemplate = leaveTemplates?.find(
                          (lt) => lt._id === leaveId
                        );
                        if (leaveTemplate?.isCompensatoryTimeOff) {
                          // Initialize with one empty work date entry if none exist
                          if (compensatoryWorkDates.length === 0) {
                            setCompensatoryWorkDates([
                              {
                                date: "",
                                shiftTemplate: "",
                                hoursWorked: null,
                              },
                            ]);
                          }
                        } else {
                          // Clear compensatory work dates for non-compensatory leave types
                          setCompensatoryWorkDates([]);
                        }
                      } else {
                        // Clear compensatory work dates when no leave is selected
                        setCompensatoryWorkDates([]);
                      }

                      // Clear any existing errors
                      setLeaveError("");
                      setCompensatoryWorkDatesError("");
                    }}
                    className="block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base shadow-sm transition-all"
                  >
                    <option value="" className="text-gray-500">
                      -- Select Leave Type --
                    </option>
                    {leaveTemplates?.map((leave) => (
                      <option
                        key={leave._id}
                        value={leave._id}
                        className="py-2"
                      >
                        {leave.name}{" "}
                        {leave.description && `- ${leave.description}`}
                      </option>
                    ))}
                  </select>
                  {leaveError && (
                    <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {leaveError}
                    </div>
                  )}

                  {/* Compensatory Work Dates - Only for compensatory time off */}
                  {selectedLeave &&
                    (() => {
                      const leaveTemplate = leaveTemplates?.find(
                        (lt) => lt._id === selectedLeave
                      );
                      return leaveTemplate?.isCompensatoryTimeOff;
                    })() && (
                      <div className="space-y-4 mt-4">
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 10a1 1 0 001 1h10a1 1 0 001-1L16 7m-6 0V5"
                                />
                              </svg>
                              Work Date(s) Earned
                            </label>
                          </div>

                          <div className="text-xs text-gray-500 mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                            📝 Add the date(s) duty that entitle you to this
                            compensatory time off.
                          </div>

                          {/* Work date entries in single column format */}
                          <div className="space-y-4">
                            {compensatoryWorkDates.map((workEntry, index) => (
                              <div
                                key={index}
                                className="relative p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200"
                              >
                                {/* Remove button - positioned absolutely in top right corner */}
                                {compensatoryWorkDates.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newWorkDates =
                                        compensatoryWorkDates.filter(
                                          (_, i) => i !== index
                                        );
                                      setCompensatoryWorkDates(newWorkDates);
                                    }}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                    title="Remove this work date"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                      />
                                    </svg>
                                  </button>
                                )}

                                <div className="space-y-4">
                                  {/* Work Date Row */}
                                  <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Work Date
                                    </label>
                                    <input
                                      type="date"
                                      required
                                      value={workEntry.date}
                                      max={
                                        selectedDate
                                          ? (() => {
                                              const maxDate = new Date(
                                                selectedDate
                                              );
                                              maxDate.setDate(
                                                maxDate.getDate() - 1
                                              );
                                              return formatDatePH(maxDate);
                                            })()
                                          : formatDatePH(getCurrentDatePH())
                                      }
                                      onChange={(e) => {
                                        const selectedWorkDate = e.target.value;

                                        // Check if this date is already selected
                                        const isDateAlreadySelected =
                                          compensatoryWorkDates.some(
                                            (entry, i) =>
                                              i !== index &&
                                              entry.date === selectedWorkDate
                                          );

                                        if (isDateAlreadySelected) {
                                          alert(
                                            "This date has already been selected. Please choose a different date."
                                          );
                                          return;
                                        }

                                        // Check if work date is on or after the leave date
                                        if (
                                          selectedDate &&
                                          selectedWorkDate >=
                                            formatDatePH(selectedDate)
                                        ) {
                                          alert(
                                            `Work date must be before the compensatory time off date (${formatDatePH(
                                              selectedDate
                                            )}). You cannot work on or after the day you are taking time off.`
                                          );
                                          return;
                                        }

                                        const newWorkDates = [
                                          ...compensatoryWorkDates,
                                        ];
                                        newWorkDates[index].date =
                                          selectedWorkDate;
                                        setCompensatoryWorkDates(newWorkDates);
                                      }}
                                      className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all"
                                    />
                                    {/* Show warning if trying to select already used date */}
                                    {workEntry.date &&
                                      compensatoryWorkDates.some(
                                        (entry, i) =>
                                          i !== index &&
                                          entry.date === workEntry.date
                                      ) && (
                                        <div className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                          <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                          </svg>
                                          Already selected
                                        </div>
                                      )}
                                  </div>

                                  {/* Work Shift Row */}
                                  <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                      Work Shift
                                    </label>
                                    <select
                                      required
                                      value={workEntry.shiftTemplate}
                                      onChange={(e) => {
                                        const newWorkDates = [
                                          ...compensatoryWorkDates,
                                        ];
                                        newWorkDates[index].shiftTemplate =
                                          e.target.value;
                                        setCompensatoryWorkDates(newWorkDates);
                                      }}
                                      className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm transition-all"
                                    >
                                      <option
                                        value=""
                                        className="text-gray-500"
                                      >
                                        -- Select Shift --
                                      </option>
                                      {shiftTemplates &&
                                        [...shiftTemplates]
                                          .filter(
                                            (schedule) =>
                                              schedule.isActive !== false
                                          )
                                          .map((schedule) => (
                                            <option
                                              key={schedule._id}
                                              value={schedule._id}
                                              className="py-1"
                                            >
                                              {schedule.name}
                                              {schedule.type === "Standard"
                                                ? ` (${formatTimeTo12HourPH(
                                                    schedule.morningIn
                                                  )}-${formatTimeTo12HourPH(
                                                    schedule.morningOut
                                                  )}, ${formatTimeTo12HourPH(
                                                    schedule.afternoonIn
                                                  )}-${formatTimeTo12HourPH(
                                                    schedule.afternoonOut
                                                  )})`
                                                : ` (${formatTimeTo12HourPH(
                                                    schedule.startTime
                                                  )}-${formatTimeTo12HourPH(
                                                    schedule.endTime
                                                  )})`}
                                            </option>
                                          ))}
                                    </select>
                                  </div>
                                </div>

                                {/* Minimum required indicator for single entry */}
                                {compensatoryWorkDates.length === 1 && (
                                  <div className="absolute bottom-2 right-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                      Required
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Compact Add Additional Work Date Button */}
                          <div className="mt-4 flex justify-center">
                            <button
                              type="button"
                              onClick={() => {
                                setCompensatoryWorkDates([
                                  ...compensatoryWorkDates,
                                  {
                                    date: "",
                                    shiftTemplate: "",
                                    hoursWorked: null,
                                  },
                                ]);
                              }}
                              className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 group"
                              title="Add additional work date (optional)"
                            >
                              <svg
                                className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>

                          {/* Initialize with one work date if none exist */}
                          {(() => {
                            // Automatically initialize with one work date for compensatory time off
                            if (compensatoryWorkDates.length === 0) {
                              // Set initial work date entry
                              setTimeout(() => {
                                setCompensatoryWorkDates([
                                  {
                                    date: "",
                                    shiftTemplate: "",
                                    hoursWorked: null,
                                  },
                                ]);
                              }, 0);

                              return (
                                <div className="text-center py-6">
                                  <div className="text-sm text-gray-600 italic">
                                    Initializing work date entry...
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>

                        {/* Show error message for compensatory work dates */}
                        {compensatoryWorkDatesError && (
                          <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {compensatoryWorkDatesError}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              )}

              {/* Description/Remarks */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  Remarks{" "}
                  <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base shadow-sm resize-none transition-all"
                  placeholder="Add any additional notes or comments..."
                  rows={3}
                />
              </div>
            </form>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEmployeeInput("");
                    setScheduleType("duty");
                    setSelectedShift("");
                    setSelectedLeave("");
                    setCompensatoryWorkDates([]); // Reset multiple compensatory work dates
                    setDescription("");
                    setEmployeeError("");
                    setTypeError("");
                    setShiftError("");
                    setLeaveError("");
                    setCompensatoryWorkDatesError(""); // Reset multiple compensatory work dates error
                  }}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 border border-gray-300 flex items-center gap-2 justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleEmployeeAdd}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center gap-2 justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DutyScheduleForm;
