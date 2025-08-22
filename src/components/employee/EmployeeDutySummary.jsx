import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { formatMonthYearPH, formatDatePH } from "../../utils/phDateUtils";
import { fetchAttendanceByDepartment } from "../../store/Reducers/attendanceReducer";
import "./EmployeeAttendancePrint.css";

// Add print styles for colors
const printStyles = `
  .print-bg-yellow { background-color: #ffff00 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-light-yellow { background-color: #ffffe0 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-light-yellow-alt { background-color: #fffacd !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-light-green { background-color: #ccffcc !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-light-green-alt { background-color: #b8e6b8 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-yellow-green { background-color: #adff2f !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-green { background-color: #00ff00 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-cyan { background-color: #00ffff !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-light-blue { background-color: #add8e6 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-red { background-color: #ff0000 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-orange { background-color: #ff8800 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-pink { background-color: #ff00ff !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-header { background-color: #ffcccc !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-header-dark { background-color: #ffaaaa !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-header-dark-alt { background-color: #ff9999 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-bg-white-alt { background-color: #f8f9fa !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
  .print-text-black { color: #000000 !important; }
  
  @media print {
    .print-bg-yellow { background-color: #ffff00 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-light-yellow { background-color: #ffffe0 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-light-yellow-alt { background-color: #fffacd !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-light-green { background-color: #ccffcc !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-light-green-alt { background-color: #b8e6b8 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-yellow-green { background-color: #adff2f !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-green { background-color: #00ff00 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-cyan { background-color: #00ffff !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-light-blue { background-color: #add8e6 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-red { background-color: #ff0000 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-orange { background-color: #ff8800 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-pink { background-color: #ff00ff !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-header { background-color: #ffcccc !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-header-dark { background-color: #ffaaaa !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-header-dark-alt { background-color: #ff9999 !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-bg-white-alt { background-color: #f8f9fa !important; color: #000000 !important; -webkit-print-color-adjust: exact; color-adjust: exact; }
    .print-text-black { color: #000000 !important; }
    * { -webkit-print-color-adjust: exact; color-adjust: exact; }
    
    /* Table header repetition on each page */
    table { 
      page-break-inside: auto !important; 
      border-collapse: collapse !important;
      break-inside: auto !important;
    }
    thead { 
      display: table-header-group !important; 
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }
    tbody { 
      display: table-row-group !important; 
      page-break-inside: auto !important;
      break-inside: auto !important;
    }
    tr { 
      page-break-inside: avoid !important; 
      break-inside: avoid !important;
    }
    
    /* Allow page breaks in table containers */
    .duty-table, 
    .summary-table {
      page-break-inside: auto !important;
      break-inside: auto !important;
    }
    
    /* Ensure table headers stick to top of new pages */
    .duty-table thead,
    .summary-table thead {
      display: table-header-group !important;
      page-break-after: avoid !important;
      break-after: avoid !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    /* Employee rows can break between pages but not within rows */
    .employee-row { 
      page-break-inside: avoid !important; 
      break-inside: avoid !important;
    }
  }
`;

// Inject styles into document head
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = printStyles;
  document.head.appendChild(styleSheet);
}

// Helper function to format date with day of the week (shortened)
const formatDateShort = (date) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  return day.toString();
};

// Helper function to get day name abbreviation
const getDayAbbr = (date) => {
  const dateObj = new Date(date);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dateObj.getDay()];
};

// Helper function to generate calendar weeks for the schedule period
const generateCalendarWeeks = (startDate, endDate) => {
  const weeks = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Find the start of the first week (Sunday before or on start date)
  const firstWeekStart = new Date(start);
  firstWeekStart.setDate(start.getDate() - start.getDay());

  let currentWeekStart = new Date(firstWeekStart);

  while (currentWeekStart <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(currentWeekStart);
      currentDate.setDate(currentWeekStart.getDate() + i);

      week.push({
        date: new Date(currentDate),
        dateString: formatDatePH(currentDate),
        dayAbbr: getDayAbbr(currentDate),
        dayNumber: formatDateShort(currentDate),
        isInPeriod: currentDate >= start && currentDate <= end,
        isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
      });
    }
    weeks.push(week);
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }

  return weeks;
};

const EmployeeDutySummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get parameters from URL
  const scheduleId = searchParams.get("scheduleId");

  const { attendances, loading, dutyScheduleInfo } = useSelector(
    (state) => state.attendance
  );

  console.log(attendances);

  const [groupedAttendances, setGroupedAttendances] = useState({});
  const [calendarWeeks, setCalendarWeeks] = useState([]);

  // Load initial data
  useEffect(() => {
    if (scheduleId) {
      dispatch(
        fetchAttendanceByDepartment({
          scheduleId,
        })
      );
    }
  }, [dispatch, scheduleId]);

  // Set browser title when dutyScheduleInfo is loaded
  useEffect(() => {
    if (dutyScheduleInfo?.departmentName) {
      document.title = `${dutyScheduleInfo.departmentName.toUpperCase()} DUTY SUMMARY | ADVENTIST HOSPITAL GINGOOG`;
    }
  }, [dutyScheduleInfo]);

  // Generate calendar weeks when dutyScheduleInfo is available
  useEffect(() => {
    if (dutyScheduleInfo?.startDate && dutyScheduleInfo?.endDate) {
      const weeks = generateCalendarWeeks(
        dutyScheduleInfo.startDate,
        dutyScheduleInfo.endDate
      );
      setCalendarWeeks(weeks);
    }
  }, [dutyScheduleInfo]);

  // Group attendances by employee when data is loaded
  useEffect(() => {
    if (attendances && attendances.length > 0) {
      const grouped = attendances.reduce((acc, attendance) => {
        const employeeId =
          attendance.employeeId ||
          attendance.employee?._id ||
          attendance.employee;

        const employeeName = attendance.employeeName || "Unknown Employee";
        const employeeEmpId =
          attendance.hospitalEmployeeId ||
          attendance.empId ||
          attendance.employee?.employeeId ||
          "N/A";

        if (!employeeId) {
          console.warn("No employee ID found for attendance:", attendance);
          return acc;
        }

        if (!acc[employeeId]) {
          acc[employeeId] = {
            employee: attendance.employee,
            employeeName,
            employeeEmpId,
            attendances: [],
          };
        }
        acc[employeeId].attendances.push(attendance);
        return acc;
      }, {});

      // Sort attendances within each employee by date
      Object.keys(grouped).forEach((employeeId) => {
        grouped[employeeId].attendances.sort((a, b) => {
          const dateA = new Date(a.datePH || a.date);
          const dateB = new Date(b.datePH || b.date);
          return dateA - dateB;
        });
      });

      // Sort employees by name
      const sortedGrouped = Object.keys(grouped)
        .sort((a, b) => {
          const nameA = grouped[a].employeeName.toLowerCase();
          const nameB = grouped[b].employeeName.toLowerCase();
          return nameA.localeCompare(nameB);
        })
        .reduce((acc, key) => {
          acc[key] = grouped[key];
          return acc;
        }, {});

      setGroupedAttendances(sortedGrouped);
    }
  }, [attendances]);

  // Helper function to get attendance for a specific date
  const getAttendanceForDate = (employeeAttendances, dateString) => {
    return employeeAttendances.find(
      (att) => formatDatePH(att.datePH || att.date) === dateString
    );
  };

  // Helper function to format numbers (show whole numbers without decimals)
  const formatNumber = (num) => {
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  // Helper function to generate abbreviations from template names
  const generateAbbreviation = (templateName) => {
    if (!templateName) return "";

    // Split by spaces and take first letter of each word, convert to uppercase
    return templateName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  // Helper function to calculate summary statistics
  const calculateSummary = (employeeAttendances) => {
    const summary = {
      regularDuty: 0,
      overtimeDuty: 0,
      extraDuty: 0,
      leaveWithPay: 0,
      leaveWithoutPay: 0,
      holidayOff: 0,
      totalDuty: 0,
      regularHoliday: 0,
      specialHoliday: 0,
      noc: 0,
      lateMinutes: 0,
      specialHolidayDays: 0, // Track special holiday additional days
    };

    employeeAttendances.forEach((attendance) => {
      // Skip absent employees
      if (attendance.status?.toLowerCase() === "absent") {
        return;
      }

      // Count regular duty (all duty schedules)
      if (attendance.scheduleType?.toLowerCase() === "duty") {
        summary.regularDuty++;

        // Calculate overtime duty if shift is longer than 8 hours
        if (attendance.shiftTemplate?.type === "Shifting") {
          const startTime = attendance.shiftTemplate.startTime;
          const endTime = attendance.shiftTemplate.endTime;

          if (startTime && endTime) {
            // Parse time strings (assuming HH:MM format)
            const [startHour, startMin] = startTime.split(":").map(Number);
            const [endHour, endMin] = endTime.split(":").map(Number);

            let startMinutes = startHour * 60 + startMin;
            let endMinutes = endHour * 60 + endMin;

            // Handle overnight shifts
            if (endMinutes <= startMinutes) {
              endMinutes += 24 * 60; // Add 24 hours for next day
            }

            const totalMinutes = endMinutes - startMinutes;
            const totalHours = totalMinutes / 60;

            // If more than 8 hours, add overtime duty
            if (totalHours > 8) {
              const overtimeHours = totalHours - 8;
              const overtimeDays = overtimeHours / 8; // Convert overtime hours to days
              summary.overtimeDuty += overtimeDays;
            }
          }
        }

        // Count NOC (night differential)
        if (attendance.shiftTemplate?.isNightDifferential === true) {
          summary.noc++;
        }

        // Calculate total late minutes
        if (attendance.shiftTemplate?.type?.toLowerCase() === "standard") {
          summary.lateMinutes +=
            (attendance.morningLateMinutes || 0) +
            (attendance.afternoonLateMinutes || 0);
        } else {
          summary.lateMinutes += attendance.lateMinutes || 0;
        }

        // Count holidays with duty
        if (attendance.holiday) {
          if (attendance.holiday.type?.toLowerCase().includes("regular")) {
            summary.regularHoliday++;
          } else if (
            attendance.holiday.type?.toLowerCase().includes("special")
          ) {
            summary.specialHoliday++;

            // Calculate special holiday additional days using payMultiplier
            // payMultiplier is already a decimal (e.g., 1.3 for 130%)
            const payMultiplier = attendance.holiday.payMultiplier || 1;
            const additionalDays = payMultiplier - 1; // Subtract 1 (100%) to get additional days
            summary.specialHolidayDays += additionalDays;
          }
        }
      }

      // Count holiday off
      if (attendance.scheduleType?.toLowerCase() === "holiday_off") {
        summary.holidayOff++;
      }

      // Count leaves
      if (attendance.scheduleType?.toLowerCase() === "leave") {
        if (attendance.leaveTemplate?.isPaid) {
          summary.leaveWithPay++;
        } else {
          summary.leaveWithoutPay++;
        }
      }
    });

    // Calculate total duty (regular duty + overtime duty + paid leave + holiday off + regular holiday + special holiday additional days)
    summary.totalDuty =
      summary.regularDuty +
      summary.overtimeDuty +
      summary.leaveWithPay +
      summary.holidayOff +
      summary.regularHoliday +
      summary.specialHolidayDays;

    return summary;
  };

  // Helper function to get date range for the report
  const getDateRange = () => {
    if (dutyScheduleInfo?.startDate && dutyScheduleInfo?.endDate) {
      return `${formatMonthYearPH(
        new Date(dutyScheduleInfo.startDate),
        true
      )} - ${formatMonthYearPH(new Date(dutyScheduleInfo.endDate), true)}`;
    }
    return "No Data";
  };

  const handleCancel = () => {
    if (window.opener) {
      window.close();
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-4 print:p-0 min-h-screen">
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 print:p-0 min-h-screen print-container">
      {/* Header for screen */}
      <div className="mb-6 flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between print:hidden">
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-500 hover:text-gray-700 print:hidden"
        >
          <IoMdArrowBack className="mr-2" />
          Back
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Report
        </button>
      </div>

      {/* Header for screen and print */}
      <div className="mb-4 flex justify-between">
        <div className="text-left leading-tight">
          <h2 className="text-base font-bold uppercase tracking-wide">
            ADVENTIST HOSPITAL GINGOOG
          </h2>
          <h3 className="text-sm font-semibold uppercase">
            {dutyScheduleInfo?.departmentName || "DEPARTMENT"} DUTY SUMMARY
          </h3>
        </div>
        <div className="text-right leading-tight">
          <p className="text-xs">
            <span className="font-bold">Duty Period:</span> {getDateRange()}
          </p>
          {/* Date Printed - hidden in preview, only visible when printing */}
          <p className="text-xs hidden print:block">
            <span className="font-bold">Date Printed:</span>{" "}
            {formatMonthYearPH(new Date(), true)}
          </p>
        </div>
      </div>

      {/* Employee Duty Summary Tables */}
      {Object.keys(groupedAttendances).length > 0 &&
      calendarWeeks.length > 0 ? (
        <div className="mb-6">
          {/* Weekly Summary Tables */}
          {calendarWeeks.map((week, weekIndex) => {
            const weekStart = week.find((day) => day.isInPeriod)?.date;

            if (!weekStart) return null;

            return (
              <div key={weekIndex} className="mb-4">
                <table className="w-full border border-gray-300 mb-2 text-xs table-fixed duty-table">
                  <colgroup>
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "200px" }} />
                    <col style={{ width: "50px" }} />
                    <col style={{ width: "50px" }} />
                    <col style={{ width: "50px" }} />
                    <col style={{ width: "50px" }} />
                    <col style={{ width: "50px" }} />
                    <col style={{ width: "50px" }} />
                    <col style={{ width: "50px" }} />
                    <col style={{ width: "70px" }} />
                    <col style={{ width: "70px" }} />
                    <col style={{ width: "70px" }} />
                    <col style={{ width: "50px" }} />
                  </colgroup>
                  <thead className="print-bg-header print-text-black text-xs">
                    <tr>
                      <th
                        className="border border-gray-300 px-1 py-1 text-left print-text-black"
                        rowSpan="2"
                      >
                        No.
                      </th>
                      <th
                        className="border border-gray-300 px-1 py-1 text-left print-text-black"
                        rowSpan="2"
                      >
                        EMPLOYEES
                      </th>
                      {week.map((day, dayIndex) => (
                        <th
                          key={dayIndex}
                          className="border border-gray-300 px-0.5 py-1 text-center print-text-black print-bg-header-dark font-bold"
                        >
                          {
                            ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
                              dayIndex
                            ]
                          }
                        </th>
                      ))}
                      <th
                        className="border border-gray-300 px-0.5 py-1 text-center print-text-black print-bg-header"
                        rowSpan="2"
                      >
                        WEEKLY
                        <br />
                        TOTAL
                      </th>
                      <th
                        className="border border-gray-300 px-0.5 py-1 text-center print-text-black print-bg-header"
                        rowSpan="2"
                      >
                        OVERTIME
                        <br />
                        DUTY
                      </th>
                      <th
                        className="border border-gray-300 px-0.5 py-1 text-center print-text-black print-bg-header"
                        rowSpan="2"
                      >
                        EXTRA
                        <br />
                        DUTY
                      </th>
                      <th
                        className="border border-gray-300 px-0.5 py-1 text-center print-text-black print-bg-header"
                        rowSpan="2"
                      >
                        NOC
                      </th>
                    </tr>
                    {/* Date row */}
                    <tr className="text-center text-xs print-text-black">
                      {week.map((day, dayIndex) => {
                        // Check if this date has a holiday by looking at attendance data
                        let isHoliday = false;
                        if (day.isInPeriod) {
                          // Check all employees' attendance for this date to see if any have holiday data
                          Object.values(groupedAttendances).forEach(
                            (employeeData) => {
                              const attendance = getAttendanceForDate(
                                employeeData.attendances,
                                day.dateString
                              );
                              if (attendance?.holiday) {
                                isHoliday = true;
                              }
                            }
                          );
                        }

                        return (
                          <td
                            key={dayIndex}
                            className={`border border-gray-300 px-1 py-1 font-bold ${
                              isHoliday
                                ? "text-red-600 print:text-red-600"
                                : "print-text-black"
                            }`}
                            style={
                              isHoliday ? { color: "#dc2626 !important" } : {}
                            }
                          >
                            {day.isInPeriod
                              ? `${day.dayNumber}-${day.date.toLocaleString(
                                  "en-US",
                                  { month: "short" }
                                )}`
                              : ""}
                          </td>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupedAttendances).map(
                      ([employeeId, employeeData], employeeIndex) => {
                        const weeklyDutyCount = week.filter((day) => {
                          const attendance = getAttendanceForDate(
                            employeeData.attendances,
                            day.dateString
                          );
                          return (
                            day.isInPeriod &&
                            attendance?.scheduleType?.toLowerCase() ===
                              "duty" &&
                            attendance?.status?.toLowerCase() !== "absent"
                          );
                        }).length;

                        const weeklyNocCount = week.filter((day) => {
                          const attendance = getAttendanceForDate(
                            employeeData.attendances,
                            day.dateString
                          );
                          return (
                            day.isInPeriod &&
                            attendance?.scheduleType?.toLowerCase() ===
                              "duty" &&
                            attendance?.status?.toLowerCase() !== "absent" &&
                            attendance?.shiftTemplate?.isNightDifferential ===
                              true
                          );
                        }).length;

                        // Calculate weekly overtime duty
                        const weeklyOvertimeDuty = week.reduce((total, day) => {
                          const attendance = getAttendanceForDate(
                            employeeData.attendances,
                            day.dateString
                          );

                          if (
                            day.isInPeriod &&
                            attendance?.scheduleType?.toLowerCase() ===
                              "duty" &&
                            attendance?.status?.toLowerCase() !== "absent" &&
                            attendance?.shiftTemplate?.type === "Shifting"
                          ) {
                            const startTime =
                              attendance.shiftTemplate.startTime;
                            const endTime = attendance.shiftTemplate.endTime;

                            if (startTime && endTime) {
                              // Parse time strings (assuming HH:MM format)
                              const [startHour, startMin] = startTime
                                .split(":")
                                .map(Number);
                              const [endHour, endMin] = endTime
                                .split(":")
                                .map(Number);

                              let startMinutes = startHour * 60 + startMin;
                              let endMinutes = endHour * 60 + endMin;

                              // Handle overnight shifts
                              if (endMinutes <= startMinutes) {
                                endMinutes += 24 * 60; // Add 24 hours for next day
                              }

                              const totalMinutes = endMinutes - startMinutes;
                              const totalHours = totalMinutes / 60;

                              // If more than 8 hours, add overtime duty
                              if (totalHours > 8) {
                                const overtimeHours = totalHours - 8;
                                const overtimeDays = overtimeHours / 8; // Convert overtime hours to days
                                return total + overtimeDays;
                              }
                            }
                          }
                          return total;
                        }, 0);

                        return (
                          <tr
                            key={employeeId}
                            className={`employee-row ${
                              employeeIndex % 2 === 0
                                ? "bg-white"
                                : "print-bg-white-alt"
                            }`}
                          >
                            <td className="border border-gray-300 px-2 py-1 text-center print-text-black">
                              {employeeIndex + 1}
                            </td>
                            <td className="border border-gray-300 px-2 py-1 font-medium print-text-black">
                              {employeeData.employeeName}
                            </td>
                            {week.map((day, dayIndex) => {
                              const attendance = getAttendanceForDate(
                                employeeData.attendances,
                                day.dateString
                              );
                              const isDuty =
                                day.isInPeriod &&
                                attendance?.scheduleType?.toLowerCase() ===
                                  "duty";
                              const isLeave =
                                day.isInPeriod &&
                                attendance?.scheduleType?.toLowerCase() ===
                                  "leave";
                              const isHolidayOff =
                                day.isInPeriod &&
                                attendance?.scheduleType?.toLowerCase() ===
                                  "holiday_off";

                              let cellValue = "";
                              let cellColor = "";

                              // NOC badge logic
                              let nocBadge = null;
                              if (
                                isDuty &&
                                attendance?.shiftTemplate?.isNightDifferential
                              ) {
                                nocBadge = (
                                  <span
                                    className="inline-block align-middle rounded-full text-xs font-bold print-bg-cyan text-blue-900 ml-0.5 text-center"
                                    style={{
                                      minWidth: 14,
                                      width: 14,
                                      height: 14,
                                      fontSize: "8px",
                                      lineHeight: "14px",
                                      padding: 0,
                                    }}
                                  >
                                    N
                                  </span>
                                );
                              }

                              if (isDuty) {
                                cellValue = (
                                  <>
                                    1
                                    {nocBadge ? (
                                      <span> - {nocBadge}</span>
                                    ) : null}
                                  </>
                                );
                                cellColor = ""; // White background for duty days
                              } else if (isHolidayOff) {
                                cellValue = "HO"; // Holiday Off abbreviation
                                cellColor = "print-bg-yellow-green"; // Yellow-green background for holiday off
                              } else if (isLeave) {
                                const isCompensatoryTimeOff =
                                  attendance.leaveTemplate
                                    ?.isCompensatoryTimeOff;
                                if (isCompensatoryTimeOff) {
                                  cellValue = "IL"; // In Lieu abbreviation
                                  cellColor = "print-bg-red"; // Red background for compensatory time off
                                } else if (attendance.leaveTemplate?.isPaid) {
                                  // Check if it's sick leave using category
                                  const isSickLeave =
                                    attendance.leaveTemplate?.category?.toLowerCase() ===
                                    "sick";

                                  // Check if it's birthday leave by name
                                  const isBirthdayLeave =
                                    attendance.leaveTemplate?.name
                                      ?.toLowerCase()
                                      ?.includes("birthday");

                                  // Check if it's bereavement leave using category
                                  const isBereavementLeave =
                                    attendance.leaveTemplate?.category?.toLowerCase() ===
                                    "bereavement";

                                  if (isSickLeave) {
                                    cellValue = "SL"; // Sick Leave abbreviation
                                    cellColor = "print-bg-light-blue"; // Light blue background for sick leave
                                  } else if (isBirthdayLeave) {
                                    cellValue = "BDL"; // Birthday Leave
                                    cellColor = "print-bg-yellow"; // Yellow background for birthday leave
                                  } else if (isBereavementLeave) {
                                    cellValue = "BRL"; // Bereavement Leave
                                    cellColor = "print-bg-yellow"; // Yellow background for bereavement leave
                                  } else {
                                    cellValue = generateAbbreviation(
                                      attendance.leaveTemplate?.name
                                    ); // Other paid leave abbreviation from template name
                                    cellColor = "print-bg-yellow"; // Yellow background for other paid leave
                                  }
                                } else {
                                  cellValue = "LWOP"; // Leave Without Pay abbreviation
                                  cellColor = "print-bg-pink"; // Pink background for unpaid leave
                                }
                              } else if (day.isInPeriod && attendance) {
                                cellValue = "0";
                                cellColor = ""; // No color for regular off days
                              }

                              return (
                                <td
                                  key={dayIndex}
                                  className={`border border-gray-300 px-1 py-1 text-center print-text-black ${cellColor}`}
                                >
                                  {cellValue}
                                </td>
                              );
                            })}
                            <td
                              className={`border border-gray-300 px-1 py-1 text-center font-medium print-text-black ${
                                employeeIndex % 2 === 0
                                  ? "print-bg-light-yellow"
                                  : "print-bg-light-yellow-alt"
                              }`}
                            >
                              {weeklyDutyCount > 0
                                ? weeklyDutyCount % 1 === 0
                                  ? weeklyDutyCount.toString()
                                  : weeklyDutyCount.toFixed(1)
                                : "0"}
                            </td>
                            <td
                              className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                                employeeIndex % 2 === 0
                                  ? "print-bg-light-yellow"
                                  : "print-bg-light-yellow-alt"
                              }`}
                            >
                              {weeklyOvertimeDuty > 0
                                ? weeklyOvertimeDuty % 1 === 0
                                  ? weeklyOvertimeDuty.toString()
                                  : weeklyOvertimeDuty.toFixed(1)
                                : "0"}
                            </td>
                            <td
                              className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                                employeeIndex % 2 === 0
                                  ? "print-bg-light-yellow"
                                  : "print-bg-light-yellow-alt"
                              }`}
                            >
                              0
                            </td>
                            <td
                              className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                                employeeIndex % 2 === 0
                                  ? "print-bg-light-yellow"
                                  : "print-bg-light-yellow-alt"
                              }`}
                            >
                              {weeklyNocCount > 0
                                ? weeklyNocCount % 1 === 0
                                  ? weeklyNocCount.toString()
                                  : weeklyNocCount.toFixed(1)
                                : "0"}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            );
          })}

          {/* Summary Table */}
          <div className="mt-6">
            <table className="w-full border border-gray-300 mb-4 text-xs table-fixed summary-table">
              <colgroup>
                <col style={{ width: "40px" }} />
                <col style={{ width: "200px" }} />
                <col style={{ width: "60px" }} />
                <col style={{ width: "60px" }} />
                <col style={{ width: "60px" }} />
                <col style={{ width: "60px" }} />
                <col style={{ width: "60px" }} />
                <col style={{ width: "60px" }} />
                <col style={{ width: "60px" }} />
                <col style={{ width: "60px" }} />
                <col style={{ width: "60px" }} />
                <col style={{ width: "50px" }} />
                <col style={{ width: "70px" }} />
              </colgroup>
              <thead className="print-bg-header print-text-black text-xs">
                <tr>
                  <th className="border border-gray-300 px-1 py-1 text-left print-text-black">
                    No.
                  </th>
                  <th className="border border-gray-300 px-1 py-1 text-left print-text-black">
                    EMPLOYEES
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    REGULAR
                    <br />
                    DUTY
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    OVERTIME
                    <br />
                    DUTY
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    EXTRA
                    <br />
                    DUTY
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    LEAVE
                    <br />
                    W/PAY
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    LEAVE
                    <br />
                    W/O PAY
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    HOLIDAY
                    <br />
                    OFF
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    TOTAL
                    <br />
                    DUTY
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    REGULAR
                    <br />
                    HOLIDAY
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    SPECIAL
                    <br />
                    HOLIDAY
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    NOC
                    <br />
                    DUTY
                  </th>
                  <th className="border border-gray-300 px-0.5 py-1 text-center print-text-black">
                    MINUTES
                    <br />
                    LATE
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedAttendances).map(
                  ([employeeId, employeeData], employeeIndex) => {
                    const summary = calculateSummary(employeeData.attendances);

                    return (
                      <tr key={employeeId} className="employee-row">
                        <td
                          className={`border border-gray-300 px-2 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "bg-white"
                              : "print-bg-white-alt"
                          }`}
                        >
                          {employeeIndex + 1}
                        </td>
                        <td
                          className={`border border-gray-300 px-2 py-1 font-medium print-text-black ${
                            employeeIndex % 2 === 0
                              ? "bg-white"
                              : "print-bg-white-alt"
                          }`}
                        >
                          {employeeData.employeeName}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-light-yellow"
                              : "print-bg-light-yellow-alt"
                          }`}
                        >
                          {formatNumber(summary.regularDuty)}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-light-yellow"
                              : "print-bg-light-yellow-alt"
                          }`}
                        >
                          {formatNumber(summary.overtimeDuty)}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-light-yellow"
                              : "print-bg-light-yellow-alt"
                          }`}
                        >
                          {formatNumber(summary.extraDuty)}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-light-yellow"
                              : "print-bg-light-yellow-alt"
                          }`}
                        >
                          {formatNumber(summary.leaveWithPay)}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-light-yellow"
                              : "print-bg-light-yellow-alt"
                          }`}
                        >
                          {formatNumber(summary.leaveWithoutPay)}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-light-yellow"
                              : "print-bg-light-yellow-alt"
                          }`}
                        >
                          {formatNumber(summary.holidayOff)}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center font-medium print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-header-dark"
                              : "print-bg-header-dark-alt"
                          }`}
                        >
                          {formatNumber(summary.totalDuty)}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-light-green"
                              : "print-bg-light-green-alt"
                          }`}
                        >
                          {formatNumber(summary.regularHoliday)}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-light-green"
                              : "print-bg-light-green-alt"
                          }`}
                        >
                          {formatNumber(summary.specialHoliday)}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-light-green"
                              : "print-bg-light-green-alt"
                          }`}
                        >
                          {formatNumber(summary.noc)}
                        </td>
                        <td
                          className={`border border-gray-300 px-1 py-1 text-center print-text-black ${
                            employeeIndex % 2 === 0
                              ? "print-bg-light-green"
                              : "print-bg-light-green-alt"
                          }`}
                        >
                          {summary.lateMinutes}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 page-break-inside-avoid">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="font-bold">LEGEND:</span>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 bg-white border border-gray-400 inline-block"></span>
                <span>Duty</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 print-bg-yellow-green border border-gray-400 inline-block"></span>
                <span>Holiday Off</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 print-bg-red border border-gray-400 inline-block"></span>
                <span>In Lieu</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 print-bg-light-blue border border-gray-400 inline-block"></span>
                <span>Sick Leave</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 print-bg-yellow border border-gray-400 inline-block"></span>
                <span>LEAVE W/PAY</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 print-bg-pink border border-gray-400 inline-block"></span>
                <span>LEAVE W/O PAY</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No duty schedule data found for this department.
          </p>
        </div>
      )}

      {/* Signature Section */}
      <div className="print:block hidden mt-10 text-sm page-break-inside-avoid">
        <div className="flex justify-between text-center mt-20">
          <div className="w-1/3">
            <div className="mb-8">Prepared by:</div>
            <div className="border-b border-black w-4/5 mx-auto pt-1">
              {/* Manager signature line */}
            </div>
            <div className="mt-1 uppercase">
              {dutyScheduleInfo?.departmentName || "Unknown Department"} Manager
            </div>
          </div>

          <div className="w-1/3">
            <div className="mb-8">Noted by:</div>
            <div className="border-b border-black w-4/5 mx-auto pt-1">
              {/* Director signature line */}
            </div>
            <div className="mt-1 uppercase text-xs font-semibold">DIRECTOR</div>
          </div>

          <div className="w-1/3">
            <div className="mb-8">Approved by:</div>
            <div className="border-b border-black w-4/5 mx-auto pt-1">
              {/* HR signature line */}
            </div>
            <div className="mt-1">HR</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDutySummary;
