import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchDutyScheduleById,
  createDutySchedule,
  updateDutySchedule,
  messageClear,
} from "../../../../store/Reducers/dutyScheduleReducer";
import { fetchAllShiftTemplates } from "../../../../store/Reducers/shiftTemplateReducer";
import { fetchEmployeesByDepartment } from "../../../../store/Reducers/employeeReducer";
import { fetchDepartmentById } from "../../../../store/Reducers/departmentReducer";
import { fetchHolidaysForLocation } from "../../../../store/Reducers/holidayReducer";

import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { buttonOverrideStyle } from "../../../../utils/utils";
import { FaTimes } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
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
} from "../../../../utils/phDateUtils";

const ManagerDutyScheduleForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { departmentId, scheduleId } = useParams();
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

  const [currentDate, setCurrentDate] = useState(getCurrentDatePH());
  const [days, setDays] = useState([]);

  const [allEntries, setAllEntries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [employeeInput, setEmployeeInput] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [description, setDescription] = useState("");

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

  const [shiftError, setShiftError] = useState("");
  const [employeeError, setEmployeeError] = useState("");

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
    dispatch(fetchAllShiftTemplates());

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
      console.log("=== Testing fetchHolidaysForLocation ===");
      console.log("Fetching holidays for duty schedule date range:", {
        startDate: localDutySchedule.startDate,
        endDate: localDutySchedule.endDate,
      });

      dispatch(
        fetchHolidaysForLocation({
          startDate: localDutySchedule.startDate,
          endDate: localDutySchedule.endDate,
        })
      )
        .then((result) => {
          console.log("fetchHolidaysForLocation result:", result);
          if (result.payload && result.payload.holidays) {
            console.log("Holidays received:", result.payload.holidays);
            console.log("Number of holidays:", result.payload.holidays.length);
          }
        })
        .catch((error) => {
          console.error("fetchHolidaysForLocation error:", error);
        });
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
          departmentLabel = `${department.name} `;
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
      navigate(-1);

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

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setShowAddModal(true);
    setEmployeeInput("");
    setSelectedShift("");
    setDescription("");
  };

  const getEmployeesForDate = (date) => {
    if (!date) return [];
    const dateKey = formatDatePH(date);

    const entry = allEntries?.find((e) => formatDatePH(e.date) === dateKey);
    if (!entry) return [];

    const employeesForDate = entry.employeeSchedules
      .map((es) => {
        const empId =
          typeof es.employee === "string" ? es.employee : es.employee?._id;

        // Try to get employee from the entry first (if it's populated)
        const employee =
          typeof es.employee === "object" && es.employee?._id
            ? es.employee
            : employees.find((emp) => emp._id === empId); // Fallback to Redux store for select options compatibility

        const wsId =
          typeof es.shiftTemplate === "string"
            ? es.shiftTemplate
            : es.shiftTemplate?._id;

        // Try to get shift template from the entry first (if it's populated)
        const shiftTemplate =
          typeof es.shiftTemplate === "object" && es.shiftTemplate?._id
            ? es.shiftTemplate
            : shiftTemplates.find((ws) => ws._id === wsId); // Fallback to Redux store for select options compatibility

        const shiftName = shiftTemplate?.name?.toLowerCase() || "unknown";

        const shiftTime = shiftTemplate
          ? shiftTemplate.status === "off"
            ? "off"
            : shiftTemplate.type === "Standard"
            ? `${formatTimeTo12HourPH(
                shiftTemplate.morningIn
              )}-${formatTimeTo12HourPH(
                shiftTemplate.morningOut
              )}, ${formatTimeTo12HourPH(
                shiftTemplate.afternoonIn
              )}-${formatTimeTo12HourPH(shiftTemplate.afternoonOut)}`
            : `${formatTimeTo12HourPH(
                shiftTemplate.startTime
              )}-${formatTimeTo12HourPH(shiftTemplate.endTime)}`
          : "";

        const startIn = shiftTemplate
          ? shiftTemplate.status === "off"
            ? "off"
            : shiftTemplate.type === "Standard"
            ? shiftTemplate.morningIn
            : shiftTemplate.startTime
          : "";

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
          shiftName,
          shift: shiftTime,
          description: es.remarks || "",
          startIn,
        };
      })
      // Optional: sort flat list by startIn (not required if grouping handles it)
      .sort((a, b) => {
        if (a.startIn === "off") return 1;
        if (b.startIn === "off") return -1;
        if (!a.startIn) return 1;
        if (!b.startIn) return -1;

        const [hA, mA] = a.startIn.split(":").map(Number);
        const [hB, mB] = b.startIn.split(":").map(Number);
        return hA * 60 + mA - (hB * 60 + mB);
      });

    // ✅ Group by shift
    const grouped = employeesForDate.reduce((acc, emp) => {
      if (!acc[emp.shift]) {
        acc[emp.shift] = {
          shift: emp.shift,
          shiftName: emp.shiftName,
          employees: [],
        };
      }

      acc[emp.shift].employees.push(emp);
      return acc;
    }, {});

    // ✅ Helper to get earliest start time in minutes
    const getEarliestStart = (group) => {
      const validTimes = group.employees
        .filter((emp) => emp.startIn && emp.startIn !== "off")
        .map((emp) => {
          const [h, m] = emp.startIn.split(":").map(Number);
          return h * 60 + m;
        });

      return validTimes.length ? Math.min(...validTimes) : Infinity;
    };

    // ✅ Sort each group's employees by last name
    // ✅ Sort the groups by earliest employee startIn time
    return Object.values(grouped)
      .map((group) => ({
        ...group,
        employees: group.employees.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        ),
      }))
      .sort((a, b) => getEarliestStart(a) - getEarliestStart(b));
  };

  const handleEmployeeAdd = () => {
    let valid = true;
    setEmployeeError("");
    setShiftError("");
    if (!employeeInput) {
      setEmployeeError("Employee is required.");
      valid = false;
    }
    if (!selectedShift) {
      setShiftError("Shift is required.");
      valid = false;
    }
    if (!selectedDate) return;
    if (!valid) return;

    const dateKey = formatDatePH(selectedDate);

    // Deep clone to avoid state mutation
    let entries = JSON.parse(JSON.stringify(allEntries));

    // Check if there's already an entry for the selected date
    let entryIndex = entries.findIndex((e) => formatDatePH(e.date) === dateKey);

    const newSchedule = {
      employee: employeeInput,
      shiftTemplate: selectedShift,
      remarks: description,
    };

    if (entryIndex === -1) {
      // No entry for the date → create a new one
      entries.push({
        date: selectedDate,
        employeeSchedules: [newSchedule],
      });
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

      // Optional: sort by last name (optional but good for consistency in data)
      employeeSchedules.sort((a, b) => {
        const getEmployeeData = (empSched) => {
          const empId =
            typeof empSched.employee === "string"
              ? empSched.employee
              : empSched.employee?._id;
          // Try to get from entry first, then fallback to Redux store
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
    }

    setAllEntries(entries);
    setShowAddModal(false);

    // Optional: reset form values if needed
    setEmployeeInput(null);
    setSelectedShift(null);
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
    // First try to find the shift template in entries
    let schedule = null;
    for (const entry of allEntries) {
      for (const es of entry.employeeSchedules) {
        const shiftTemplate =
          typeof es.shiftTemplate === "object" && es.shiftTemplate?._id
            ? es.shiftTemplate
            : null;
        if (
          shiftTemplate &&
          shiftTemplate.name.toLowerCase() === shiftName.toLowerCase()
        ) {
          schedule = shiftTemplate;
          break;
        }
      }
      if (schedule) break;
    }

    // Fallback to Redux store
    if (!schedule) {
      schedule = shiftTemplates.find(
        (ws) => ws.name.toLowerCase() === shiftName.toLowerCase()
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

  const handleSaveAsDraft = async () => {
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

  const handleCancel = () => {
    if (allEntries && allEntries.length > 0) {
      setShowCancelModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);

    // In create mode, go back to previous page
    navigate(-1);
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
      // Only add the single employee to the target date
      const emp = draggedItem.data;
      // Defensive: ensure emp has id and shiftId
      if (!emp || !emp.id || !emp.shiftId) {
        setDraggedItem(null);
        return;
      }
      setSelectedDate(targetDate);
      setEmployeeInput(emp.id);
      setSelectedShift(emp.shiftId);
      setDescription(emp.description || "");
      setTimeout(() => {
        handleEmployeeAdd();
        setEmployeeInput(null);
        setSelectedShift(null);
        setSelectedDate(null);
        setDescription("");
        setDraggedItem(null);
      }, 0);
    } else if (draggedItem.type === "group") {
      // Add each employee in the group to the target date, one by one
      const group = draggedItem.data;
      if (!group || !Array.isArray(group.employees) || !group.shiftId) {
        setDraggedItem(null);
        return;
      }
      group.employees.forEach((emp, idx) => {
        setTimeout(() => {
          setSelectedDate(targetDate);
          setEmployeeInput(emp.id);
          setSelectedShift(group.shiftId);
          setDescription(emp.description || "");
          handleEmployeeAdd();
          setEmployeeInput(null);
          setSelectedShift(null);
          setSelectedDate(null);
          setDescription("");
          if (idx === group.employees.length - 1) setDraggedItem(null);
        }, idx * 10);
      });
    } else if (draggedItem.type === "dateBox") {
      // Add all employees from the source date to the target date, preserving shift/group
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
        targetEntry = { date: targetDate, employeeSchedules: [] };
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
        // Prevent copying 'Office Friday' shift to non-Friday days
        const shiftTemplate =
          typeof sched.shiftTemplate === "object" && sched.shiftTemplate?._id
            ? sched.shiftTemplate
            : shiftTemplates.find(
                (ws) =>
                  ws._id === sched.shiftTemplate ||
                  ws._id === sched.shiftTemplate?._id
              );
        // Fix: Only skip if copying 'Office Friday' to non-Friday, but DO NOT skip any other shift
        if (
          shiftTemplate &&
          shiftTemplate.name &&
          shiftTemplate.name.toLowerCase() === "office friday" &&
          targetDate.getDay() !== 5
        ) {
          // Skip copying this shift if not Friday
          return;
        }
        // Prevent copying 'Billing Sat' to non-Saturday days
        if (
          shiftTemplate &&
          shiftTemplate.name &&
          shiftTemplate.name.toLowerCase() === "billing sat" &&
          targetDate.getDay() !== 6
        ) {
          // Skip copying this shift if not Saturday
          return;
        }
        if (!scheduledEmpIds.has(empId)) {
          targetEntry.employeeSchedules.push({ ...sched });
          scheduledEmpIds.add(empId);
        }
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
        targetEntry = { date: targetDate, employeeSchedules: [] };
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
        // Prevent copying 'Office Friday' shift to non-Friday days
        const shiftTemplate =
          typeof sched.shiftTemplate === "object" && sched.shiftTemplate?._id
            ? sched.shiftTemplate
            : shiftTemplates.find(
                (ws) =>
                  ws._id === sched.shiftTemplate ||
                  ws._id === sched.shiftTemplate?._id
              );
        // Fix: Only skip if copying 'Office Friday' to non-Friday, but DO NOT skip any other shift
        if (
          shiftTemplate &&
          shiftTemplate.name &&
          shiftTemplate.name.toLowerCase() === "office friday" &&
          targetDate.getDay() !== 5
        ) {
          // Skip copying this shift if not Friday
          return;
        }
        // Prevent copying 'Billing Sat' to non-Saturday days
        if (
          shiftTemplate &&
          shiftTemplate.name &&
          shiftTemplate.name.toLowerCase() === "billing sat" &&
          targetDate.getDay() !== 6
        ) {
          // Skip copying this shift if not Saturday
          return;
        }
        if (!scheduledEmpIds.has(empId)) {
          targetEntry.employeeSchedules.push({ ...sched });
          scheduledEmpIds.add(empId);
        }
      });
    });
    setAllEntries(entries);
    setShowCopyToModal(false);
    setCopySourceDate(null);
    setCopyTargetDates([]);
  };

  // getShiftHours,  getWeeklySummary and formatHoursAndMinutes in dutyScheduleForm are different in dutyScheduleDetails and dutySchedulePrint
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

  // Helper: Build summary data for the current visible calendar weeks
  const getWeeklySummary = () => {
    // Build a map of employees from entries (prioritize entry data)
    const employeeMap = {};

    // First, collect all unique employees from entries
    const entryEmployees = new Set();
    allEntries.forEach((entry) => {
      entry.employeeSchedules.forEach((es) => {
        const empId =
          typeof es.employee === "string" ? es.employee : es.employee?._id;
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
        const empFromStore = employees.find((emp) => emp._id === empId);
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
        if (typeof es.shiftTemplate === "object" && es.shiftTemplate?._id) {
          shiftMap[shiftId] = es.shiftTemplate;
        }
      });
    });

    // Fill in missing shift template data from Redux store (for select options compatibility)
    entryShiftTemplates.forEach((shiftId) => {
      if (!shiftMap[shiftId]) {
        const shiftFromStore = shiftTemplates.find((st) => st._id === shiftId);
        if (shiftFromStore) {
          shiftMap[shiftId] = shiftFromStore;
        }
      }
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
          const shift =
            shiftMap[
              typeof es.shiftTemplate === "string"
                ? es.shiftTemplate
                : es.shiftTemplate?._id
            ];
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

      {loading ? (
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

                                    {group.employees.map((emp) => (
                                      <div
                                        key={emp.id}
                                        className="text-sm mb-1 p-1 rounded bg-white/50"
                                        // Remove draggable and drag handlers from employee
                                      >
                                        <div className="flex justify-between items-center">
                                          <span>{emp.name}</span>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEmployeeRemove(day, emp.id);
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
                      onClick={handleSaveAsDraft}
                      disabled={loading}
                      className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center gap-2 ${
                        loading ? "opacity-75 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
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
                          {isEditMode ? "Update As Draft" : "Save As Draft"}
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
          <div className="bg-white shadow-2xl rounded-xl w-full max-w-lg mx-auto border border-gray-200">
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
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
                  <p className="text-sm text-gray-600 mt-1">
                    {formatMonthYearPH(selectedDate, true)}
                  </p>
                </div>
              </div>
            </div>

            <form className="px-6 py-6 space-y-6">
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
                      .sort((a, b) => {
                        if (a.status === "off") return -1;
                        if (b.status === "off") return 1;
                        return 0;
                      })
                      .filter((schedule) => {
                        // If the shift is 'Office Friday', only show if selectedDate is Friday
                        if (schedule.name.toLowerCase() === "office friday") {
                          return selectedDate && selectedDate.getDay() === 5; // 5 = Friday
                        }
                        // If the shift is 'Billing Sat', only show if selectedDate is Saturday
                        if (schedule.name.toLowerCase() === "billing sat") {
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
                          {schedule.status === "off"
                            ? ""
                            : schedule.type === "Standard"
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
                  Description{" "}
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

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setDescription("");
                    setEmployeeError("");
                    setShiftError("");
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

export default ManagerDutyScheduleForm;
