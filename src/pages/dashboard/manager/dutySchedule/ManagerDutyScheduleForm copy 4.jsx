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
} from "../../../../utils/phDateUtils";

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

const ManagerDutyScheduleForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role } = useSelector((state) => state.auth);

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
  const { shiftTemplates } = useSelector((state) => state.shiftTemplate);
  const { department } = useSelector((state) => state.department);

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
          name: `${departmentLabel}${getMonthLabelPH(currentDate)}`.trim(),
          department: dutySchedule.department?._id || dutySchedule.department,
          startDate: formatDatePH(startDateObj),
          endDate: formatDatePH(endDateObj),
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
  }, [dutySchedule, isEditMode]);

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
          entries: [],
          isFinalized: false,
        });
      }
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, isEditMode, navigate]);

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
        const employee = typeof es.employee === "object" && es.employee?._id 
          ? es.employee 
          : employees.find((emp) => emp._id === empId); // Fallback to Redux store for select options compatibility

        const wsId =
          typeof es.shiftTemplate === "string"
            ? es.shiftTemplate
            : es.shiftTemplate?._id;

        const shiftTemplate = shiftTemplates.find((ws) => ws._id === wsId);

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
          const empId = typeof empSched.employee === "string" ? empSched.employee : empSched.employee?._id;
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
    const schedule = shiftTemplates.find(
      (ws) => ws.name.toLowerCase() === shiftName.toLowerCase()
    );

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
        const shiftTemplate = shiftTemplates.find(
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
        const shiftTemplate = shiftTemplates.find(
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
        const empId = typeof es.employee === "string" ? es.employee : es.employee?._id;
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
    
    // Build a map of shiftTemplates
    const shiftMap = {};
    shiftTemplates.forEach((st) => {
      shiftMap[st._id] = st;
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
      .map(id => employeeMap[id])
      .filter(emp => emp) // Remove null/undefined entries
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
   * EMPLOYEE DATA USAGE APPROACH:
   * 
   * This component uses a hybrid approach for employee data:
   * 1. employees (from Redux store) - Used ONLY for select options in the modal
   * 2. allEntries (from duty schedule entries) - Used for all other employee data processing
   * 
   * The reason for this approach is to prioritize employee data from entries while 
   * maintaining compatibility with the select dropdown that requires the full employee list.
   * 
   * When processing scheduled employees (display, sorting, summaries), the component:
   * - First tries to use employee data from the entry (if populated)
   * - Falls back to Redux store data for backwards compatibility
   * - This ensures the component works with both populated and non-populated employee data in entries
   */

  console.log("dutySchedule:", dutySchedule);
  console.log("employees (for select options only):", employees);
  console.log("allEntries (with employee data):", allEntries);
  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
        <h1 className="text-xl font-bold uppercase">
          {isEditMode
            ? `Edit ${dutySchedule?.name} Duty Schedule`
            : `Create ${department?.name} ${getMonthLabelPH(
                currentDate
              )} Duty Schedule`}
        </h1>

        {!isEditMode && (
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            {!isAtCurrentMonth() && (
              <button
                onClick={handlePrevMonth}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full sm:w-auto"
              >
                Previous
              </button>
            )}
            <span className="text-lg font-semibold text-center">
              {getMonthLabelPH(currentDate)}
            </span>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        )}
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
                      <div key={`empty-${index}`} className="lg:block hidden" />
                    )
                  )}

                  {days.map((day, index) => (
                    <div key={index}>
                      {day && (
                        <button
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
                          className={`w-full p-2 min-h-[160px] border rounded-lg hover:border-blue-500 transition-colors bg-white text-left ${
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
                                        className="text-red-500 hover:text-red-700 flex items-center justify-center"
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
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="overflow-x-auto mb-6 mt-6">
            <h2 className="text-lg font-bold mb-2   text-blue-800">
              Weekly Summary
            </h2>
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
                  const empId = typeof es.employee === "string" ? es.employee : es.employee?._id;
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
              
              // Build a map of shiftTemplates
              const shiftMap = {};
              shiftTemplates.forEach((st) => {
                shiftMap[st._id] = st;
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
                .map(id => employeeMap[id])
                .filter(emp => emp) // Remove null/undefined entries
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
                                  HOLIDAYS_2025.some(
                                    (h) => h.date === formatDatePH(dateObj)
                                  );
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
          <div className="flex justify-between items-center mt-6">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>

              {allEntries?.length !== 0 && (
                <button
                  onClick={handleSaveAsDraft}
                  disabled={loading ? true : false}
                  className={`bg-blue-500  text-white px-4 py-2 rounded ${
                    loading ? "" : " hover:bg-blue-600"
                  } overflow-hidden`}
                >
                  {loading ? (
                    <PropagateLoader
                      color="#fff"
                      cssOverride={buttonOverrideStyle}
                    />
                  ) : isEditMode ? (
                    "Update As Draft"
                  ) : (
                    "Save As Draft"
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-4 text-center">
              Discard Changes?
            </h2>
            <p className="mb-6 text-center text-gray-700">
              You have unsaved changes. Are you sure you want to cancel and lose
              your progress?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseCancelModal}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                No, Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy To Modal */}
      {showCopyToModal && copySourceDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Copy Schedule To...</h2>
            <div className="flex justify-end mb-2 space-x-2">
              <button
                type="button"
                className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold"
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
                className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold"
                onClick={() => setCopyTargetDates([])}
              >
                Deselect All
              </button>
            </div>
            {/* Calendar-style layout with weekday headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((wd, i) => (
                <div
                  key={wd}
                  className={`text-center font-bold text-xs py-1 ${
                    i === 0 || i === 6 ? "text-red-600" : "text-blue-700"
                  }`}
                >
                  {wd}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {/* Empty cells for days before the first day of the month */}
              {Array.from({ length: days[0]?.getDay() || 0 }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}
              {/* Render day buttons in calendar grid */}
              {days.map((date, idx) => {
                const isSelected = copyTargetDates.some(
                  (d) => formatDatePH(d) === formatDatePH(date)
                );
                const isSource =
                  formatDatePH(date) === formatDatePH(copySourceDate);
                // Check if this date is a holiday
                const isHoliday = HOLIDAYS_2025.some(
                  (h) => h.date === formatDatePH(date)
                );
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                return (
                  <button
                    key={idx}
                    disabled={isSource}
                    onClick={() => handleToggleCopyTargetDate(date)}
                    className={`p-2 rounded border text-center text-sm font-medium transition-colors w-full h-10
                      ${
                        isSource
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white hover:bg-blue-100 border-gray-300"
                      }
                    `}
                  >
                    <span
                      className={
                        isHoliday || isWeekend
                          ? "text-red-600 font-bold"
                          : "text-blue-700 font-bold"
                      }
                    >
                      {date.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCopyToModal(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCopyToDates}
                disabled={copyTargetDates.length === 0}
                className={`px-4 py-2 rounded-lg text-white ${
                  copyTargetDates.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white shadow-2xl rounded-xl w-full max-w-lg mx-4 p-0">
            <div className="px-6 pt-6 pb-2 border-b flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Add Employee Schedule
              </h2>
              <span className="text-sm font-medium text-gray-500 mb-2">
                {formatMonthYearPH(selectedDate, true)}
              </span>
            </div>
            <form className="px-6 py-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-base shadow-sm"
                      autoFocus
                    >
                      <option value="">-- Select Employee --</option>
                      {availableEmployees?.map((employee) => (
                        <option
                          key={employee._id}
                          value={employee._id}
                          className="capitalize"
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
                  <div className="text-red-500 text-xs mt-1">
                    {employeeError}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Shift
                </label>
                <select
                  required
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-base shadow-sm"
                >
                  <option value="">-- Select Schedule --</option>
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
                        <option key={schedule._id} value={schedule._id}>
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
                  <div className="text-red-500 text-xs mt-1">{shiftError}</div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description{" "}
                  <span className="font-normal text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-base shadow-sm resize-none"
                  placeholder="Add any additional notes"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setDescription("");
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleEmployeeAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDutyScheduleForm;
