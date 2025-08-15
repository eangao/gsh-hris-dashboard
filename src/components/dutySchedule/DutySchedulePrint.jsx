import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDutyScheduleByIdSnapshot } from "../../store/Reducers/dutyScheduleReducer";

import { IoMdArrowBack } from "react-icons/io";
import {
  formatMonthYearPH,
  getCurrentDatePH,
  formatDatePH,
  getDutyScheduleRangePH,
  parseDatePH,
  formatTimeTo12HourPH,
  getCalendarDaysInRangePH,
} from "../../utils/phDateUtils";

import "./DutySchedulePrint.css";

const DutySchedulePrint = ({ scheduleId, employeeId = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dutySchedule, loading } = useSelector((state) => state.dutySchedule);

  const [currentDate, setCurrentDate] = useState(getCurrentDatePH());
  const [days, setDays] = useState([]);

  const [allEntries, setAllEntries] = useState([]);

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
    // Use snapshot endpoint for denormalized data
    dispatch(fetchDutyScheduleByIdSnapshot({ scheduleId, employeeId })); //employeeId is optional, but if provided, it will be used to fetch the duty schedule for that specific employee
  }, [dispatch, scheduleId, employeeId]);

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

  // ✅ Set browser title when dutySchedule is loaded
  useEffect(() => {
    if (dutySchedule?.name) {
      document.title = `${dutySchedule.name.toUpperCase()} DUTY SCHEDULE | ADVENTIST HOSPITAL GINGOOG`;
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

  const isHoliday = (date) => {
    if (!date || !allEntries?.length) return false;
    const dateStr = formatDatePH(date);

    // Check if any entry for this date has holiday data
    return allEntries.some((entry) => {
      const entryDateStr = formatDatePH(entry.date);
      return entryDateStr === dateStr && entry.holiday;
    });
  };

  const getHolidayName = (date) => {
    if (!date || !allEntries?.length) return null;
    const dateStr = formatDatePH(date);

    // Find entry for this date that has holiday data
    const entry = allEntries.find((entry) => {
      const entryDateStr = formatDatePH(entry.date);
      return entryDateStr === dateStr && entry.holiday;
    });

    if (!entry || !entry.holiday) return null;

    const holiday = entry.holiday;

    // Get holiday type abbreviation
    const getHolidayTypeAbbreviation = (type) => {
      const abbreviations = {
        "Regular Holiday": "RH",
        "Special Non-Working Holiday": "SN",
        "Special Working Holiday": "SW",
        "Local Holiday": "LH",
      };
      return abbreviations[type] || "H"; // Default to "H" if type not found
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
          let shiftTemplate = es.shiftTemplate;

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
          let leaveTemplate = es.leaveTemplate;

          if (leaveTemplate) {
            displayInfo.shift = "LEAVE";
            displayInfo.shiftName = "leave";
            displayInfo.startIn = "leave";
            displayInfo.leaveTemplateName = leaveTemplate.name;
            displayInfo.leaveAbbreviation = getLeaveAbbreviation(
              leaveTemplate.name
            );
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

        // Use employee data from snapshot (already denormalized by backend)
        let employeeName = "Unknown Employee";
        let lastName = "";
        let shiftColor = "";

        if (es.employee?.personalInformation) {
          employeeName = `${
            es.employee.personalInformation.lastName
          }, ${es.employee.personalInformation.firstName
            .charAt(0)
            .toUpperCase()}.`;
          lastName = es.employee.personalInformation.lastName || "";
        }

        // Get shift color from snapshot data
        if (es.type === "duty" && es.shiftTemplate?.shiftColor) {
          shiftColor = es.shiftTemplate.shiftColor;
        }

        return {
          name: employeeName,
          lastName: lastName,
          shiftName: displayInfo.shiftName,
          shift: displayInfo.shift,
          description: es?.remarks || "",
          shiftColor: shiftColor || "",
          startIn: displayInfo.startIn,
          type: es.type || "duty",
          leaveTemplateName: displayInfo.leaveTemplateName || null,
          leaveAbbreviation: displayInfo.leaveAbbreviation || null,
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

    // Find the shift template in entries using snapshot data
    let schedule = null;
    for (const entry of allEntries) {
      for (const es of entry.employeeSchedules) {
        if (es.type === "duty" && es.shiftTemplate) {
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
      if (schedule) break;
    }

    return schedule?.shiftColor || "bg-white"; // fallback to white if not found or no color set
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

    const normalizedName = leaveName.toLowerCase().trim();

    // Check for common abbreviations first
    if (commonAbbreviations[normalizedName]) {
      return commonAbbreviations[normalizedName];
    }

    // For unknown leave types, generate abbreviation from first letters
    const words = normalizedName.split(" ");
    if (words.length === 1) {
      // Single word: take first 2-3 letters
      return normalizedName.substring(0, 3).toUpperCase();
    } else {
      // Multiple words: take first letter of each word
      return words
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase();
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Helper function to format signatory names
  const formatSignatoryName = (signatoryData, fallbackData) => {
    // Check for new format with individual name fields first
    if (signatoryData && (signatoryData.firstName || signatoryData.lastName)) {
      let formattedName = "";
      if (signatoryData.firstName) {
        formattedName += `${signatoryData.firstName
          .charAt(0)
          .toUpperCase()}${signatoryData.firstName.slice(1).toLowerCase()}`;
      }
      if (signatoryData.middleName) {
        formattedName += ` ${signatoryData.middleName
          .charAt(0)
          .toUpperCase()}.`;
      }
      if (signatoryData.lastName) {
        formattedName += ` ${signatoryData.lastName
          .charAt(0)
          .toUpperCase()}${signatoryData.lastName.slice(1).toLowerCase()}`;
      }
      if (signatoryData.suffix) {
        formattedName += ` ${signatoryData.suffix}`;
      }
      return formattedName;
    }

    // Legacy support: Check for fullName format
    if (signatoryData?.fullName) {
      // Parse the fullName from denormalized data
      const nameParts = signatoryData.fullName.trim().split(/\s+/);
      if (nameParts.length >= 2) {
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        const middleParts = nameParts.slice(1, -1);

        let formattedName = `${firstName.charAt(0).toUpperCase()}${firstName
          .slice(1)
          .toLowerCase()}`;

        // Add middle initial if exists
        if (middleParts.length > 0) {
          const middleInitial = middleParts[0].charAt(0).toUpperCase();
          formattedName += ` ${middleInitial}.`;
        }

        formattedName += ` ${lastName.charAt(0).toUpperCase()}${lastName
          .slice(1)
          .toLowerCase()}`;

        // Add suffix if available in signatoryData
        if (signatoryData.suffix) {
          formattedName += ` ${signatoryData.suffix}`;
        }

        return formattedName;
      }
      // If fullName format is unexpected, still add suffix if available
      let formattedName = signatoryData.fullName;
      if (signatoryData.suffix) {
        formattedName += ` ${signatoryData.suffix}`;
      }
      return formattedName;
    }

    // Fallback to individual name fields from fallbackData
    if (fallbackData) {
      let formattedName = "";
      if (fallbackData.firstName) {
        formattedName += `${fallbackData.firstName
          .charAt(0)
          .toUpperCase()}${fallbackData.firstName.slice(1).toLowerCase()}`;
      }
      if (fallbackData.middleName) {
        formattedName += ` ${fallbackData.middleName.charAt(0).toUpperCase()}.`;
      }
      if (fallbackData.lastName) {
        formattedName += ` ${fallbackData.lastName
          .charAt(0)
          .toUpperCase()}${fallbackData.lastName.slice(1).toLowerCase()}`;
      }
      if (fallbackData.suffix) {
        formattedName += ` ${fallbackData.suffix}`;
      }
      return formattedName;
    }

    return "";
  };

  return (
    <div className="bg-white p-4 print:p-0 min-h-screen">
      <div className=" mb-6 flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between print:hidden">
        {/* create a back button to navigate to the schedule list . use react icons. and suggest better approach */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-700 print:hidden"
        >
          <IoMdArrowBack className="mr-2" />
          Back
        </button>

        <h1 className="text-xl font-bold uppercase print:hidden">
          {` ${dutySchedule?.name} Duty Schedule`}
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="mb-1 hidden print:flex print:mb-1 print:justify-between ">
            <div className="text-left leading-tight">
              <h2 className="text-base font-bold uppercase tracking-wide">
                ADVENTIST HOSPITAL GINGOOG
              </h2>
              <h3 className="text-sm font-semibold uppercase">
                {` ${dutySchedule?.name} Duty Schedule`}
              </h3>
            </div>
            <div className="text-right leading-tight">
              <p className="text-xs">
                <span className="font-bold">Schedule Duration:</span>{" "}
                {formatMonthYearPH(dutySchedule?.startDate, true)} -{" "}
                {formatMonthYearPH(dutySchedule?.endDate, true)}
              </p>
              <p className="text-xs">
                <span className="font-bold">Date Printed:</span>{" "}
                {formatMonthYearPH(new Date(), true)}
              </p>
            </div>
          </div>

          <table className="w-full border border-gray-300 print:table-fixed">
            <thead className="bg-gray-100">
              <tr>
                {weekDays.map(({ day }, index) => (
                  <th
                    key={day}
                    className={`p-2 text-lg font-bold border border-gray-300 ${
                      index === 0 || index === 6
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(() => {
                const rows = [];
                let week = [];

                // Fill empty cells before the first day
                const firstDay = days[0];
                const firstDayOfWeek = firstDay?.getDay() ?? 0;
                for (let i = 0; i < firstDayOfWeek; i++) {
                  week.push(null); // null for empty cells
                }

                for (let i = 0; i < days.length; i++) {
                  week.push(days[i]);

                  if (week.length === 7 || i === days.length - 1) {
                    // Fill empty cells at end if needed
                    while (week.length < 7) week.push(null);

                    rows.push([...week]);
                    week = [];
                  }
                }

                return rows.map((weekRow, weekIndex) => (
                  <tr key={weekIndex} className="align-top">
                    {weekRow.map((day, dayIndex) =>
                      day ? (
                        <td
                          key={dayIndex}
                          className=" border p-1 border-gray-300 align-top"
                        >
                          <div
                            className={`flex  text-md font-bold mb-1 ${
                              isHoliday(day)
                                ? "justify-between"
                                : "justify-center"
                            }`}
                          >
                            <span
                              className={`${
                                shouldMarkRed(day)
                                  ? "text-red-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {day.getDate()}
                            </span>
                            {isHoliday(day) && (
                              <span className="italic text-red-600 text-xs">
                                {getHolidayName(day)}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            {getEmployeesForDate(day).map((group) => (
                              <div
                                key={group.shift}
                                className={`rounded  text-xs ${getShiftColor(
                                  group.shiftName
                                )} print-bg`}
                              >
                                <div className="font-bold  uppercase text-gray-700">
                                  {group.shift}
                                </div>
                                <div className=" rounded bg-white/50 text-sm">
                                  {group.type === "leave"
                                    ? // For leave groups, group by leave abbreviation and show name
                                      (() => {
                                        const leaveGroups =
                                          group.employees.reduce((acc, emp) => {
                                            const leaveAbbreviation =
                                              emp.leaveAbbreviation || "L";
                                            if (!acc[leaveAbbreviation]) {
                                              acc[leaveAbbreviation] = [];
                                            }
                                            acc[leaveAbbreviation].push(emp);
                                            return acc;
                                          }, {});

                                        return Object.entries(leaveGroups).map(
                                          ([leaveAbbreviation, employees]) => (
                                            <div
                                              key={leaveAbbreviation}
                                              className="mb-1"
                                            >
                                              <div className="text-xs font-medium mb-1">
                                                <span className="font-bold mr-1 text-blue-600">
                                                  {leaveAbbreviation}
                                                </span>
                                                <span className="ml-1">
                                                  {employees
                                                    .map((emp) => emp.name)
                                                    .join(", ")}
                                                </span>
                                              </div>
                                            </div>
                                          )
                                        );
                                      })()
                                    : // For non-leave groups, just show names
                                      group.employees
                                        .map((emp) => emp.name)
                                        .join(", ")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      ) : (
                        <td
                          key={`empty-${dayIndex}`}
                          className="p-2 border border-gray-300"
                        />
                      )
                    )}
                  </tr>
                ));
              })()}
            </tbody>
          </table>

          <div className="print:block hidden mt-10 text-sm">
            <div className="flex justify-between text-center mt-20">
              <div className="w-1/3">
                <div className="mb-8">Prepared by:</div>
                <div className="border-b border-black w-4/5 mx-auto pt-1">
                  {formatSignatoryName(dutySchedule?.submittedBy, null)}
                </div>
                <div className="mt-1 uppercase">
                  {dutySchedule?.department?.name || "Unknown Department"}{" "}
                  Manager
                </div>
              </div>

              <div className="w-1/3">
                <div className="mb-8">Noted by:</div>
                <div className="border-b border-black w-4/5 mx-auto pt-1">
                  {formatSignatoryName(
                    dutySchedule?.directorApproval?.approvedBy,
                    null
                  )}
                </div>
                <div className="mt-1 uppercase text-xs font-semibold">
                  {dutySchedule?.directorApproval?.approvedBy?.position ||
                    "DIRECTOR"}
                </div>
              </div>

              <div className="w-1/3">
                <div className="mb-8">Approved by:</div>
                <div className="border-b border-black w-4/5 mx-auto pt-1">
                  {formatSignatoryName(
                    dutySchedule?.hrApproval?.approvedBy,
                    null
                  )}
                </div>
                <div className="mt-1">HR</div>
              </div>
            </div>
          </div>

          {/* Section Save Buttons */}
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
                Print Schedule
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DutySchedulePrint;
