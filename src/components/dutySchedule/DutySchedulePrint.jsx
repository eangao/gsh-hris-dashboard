import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDutyScheduleById } from "../../store/Reducers/dutyScheduleReducer";

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
    dispatch(fetchDutyScheduleById({ scheduleId, employeeId })); //employeeId is optional, but if provided, it will be used to fetch the duty schedule for that specific employee
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

    const employeesForDate = entry.employeeSchedules
      .map((es) => {
        const shiftTime = es.shiftTemplate
          ? es.shiftTemplate.status === "off"
            ? "off"
            : es.shiftTemplate.type === "Standard"
            ? `${formatTimeTo12HourPH(
                es.shiftTemplate.morningIn
              )}-${formatTimeTo12HourPH(
                es.shiftTemplate.morningOut
              )}, ${formatTimeTo12HourPH(
                es.shiftTemplate.afternoonIn
              )}-${formatTimeTo12HourPH(es.shiftTemplate.afternoonOut)}`
            : `${formatTimeTo12HourPH(
                es.shiftTemplate.startTime
              )}-${formatTimeTo12HourPH(es.shiftTemplate.endTime)}`
          : "";

        const startIn = es.shiftTemplate
          ? es.shiftTemplate.status === "off"
            ? "off"
            : es.shiftTemplate.type === "Standard"
            ? es.shiftTemplate.morningIn
            : es.shiftTemplate.startTime
          : "";

        return {
          name: `${
            es?.employee?.personalInformation.lastName
          }, ${es?.employee?.personalInformation.firstName
            .charAt(0)
            .toUpperCase()}.`,
          lastName: es?.employee?.personalInformation?.lastName || "",
          shiftName: es?.shiftTemplate?.name?.toLowerCase() || "",
          shift: shiftTime,
          description: es?.remarks || "",
          shiftColor: es?.shiftTemplate?.shiftColor || "",
          startIn,
        };
      }) // Optional: sort flat list by startIn (not required if grouping handles it)
      .sort((a, b) => {
        if (a.startIn === "off") return 1;
        if (b.startIn === "off") return -1;
        if (!a.startIn) return 1;
        if (!b.startIn) return -1;

        const [hA, mA] = a.startIn.split(":").map(Number);
        const [hB, mB] = b.startIn.split(":").map(Number);
        return hA * 60 + mA - (hB * 60 + mB);
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

  const handleCancel = () => {
    navigate(-1);
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
                              <span className="italic text-red-600 text-sm">
                                {getHolidayName(day)}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1">
                            {getEmployeesForDate(day).map((group) => (
                              <div
                                key={group.shift}
                                className={`rounded  text-xs ${group?.shiftColor} print-bg`}
                              >
                                <div className="font-bold  uppercase text-gray-700">
                                  {group.shift}
                                </div>
                                <div className=" rounded bg-white/50 text-sm">
                                  {group.employees
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
                  <span className="capitalize">
                    {dutySchedule?.submittedBy?.firstName}
                  </span>{" "}
                  {dutySchedule?.submittedBy?.middleName && (
                    <span className="capitalize">
                      {dutySchedule?.submittedBy?.middleName
                        .charAt(0)
                        .toUpperCase()}
                      .
                    </span>
                  )}{" "}
                  <span className="capitalize">
                    {dutySchedule?.submittedBy?.lastName}
                  </span>{" "}
                  <span className="capitalize">
                    {dutySchedule?.submittedBy?.suffix || ""}
                  </span>
                </div>
                <div className="mt-1 uppercase">
                  {dutySchedule?.department?.name} Manager
                </div>
              </div>

              <div className="w-1/3">
                <div className="mb-8">Noted by:</div>
                <div className="border-b border-black w-4/5 mx-auto pt-1">
                  <span className="capitalize">
                    {dutySchedule?.directorApproval?.approvedBy?.firstName}
                  </span>{" "}
                  {dutySchedule?.directorApproval?.approvedBy?.middleName && (
                    <span className="capitalize">
                      {dutySchedule?.directorApproval?.approvedBy?.middleName
                        .charAt(0)
                        .toUpperCase()}
                      .
                    </span>
                  )}{" "}
                  <span className="capitalize">
                    {dutySchedule?.directorApproval?.approvedBy?.lastName}
                  </span>{" "}
                  <span className="capitalize">
                    {dutySchedule?.directorApproval?.approvedBy?.suffix || ""}
                  </span>
                </div>
                <div className="mt-1 uppercase">
                  {dutySchedule?.directorApproval?.approvedBy?.position}
                </div>
              </div>

              <div className="w-1/3">
                <div className="mb-8">Approved by:</div>
                <div className="border-b border-black w-4/5 mx-auto pt-1">
                  <span className="capitalize">
                    {dutySchedule?.hrApproval?.approvedBy?.firstName}
                  </span>{" "}
                  {dutySchedule?.hrApproval?.approvedBy?.middleName && (
                    <span className="capitalize">
                      {dutySchedule?.hrApproval?.approvedBy?.middleName
                        .charAt(0)
                        .toUpperCase()}
                      .
                    </span>
                  )}{" "}
                  <span className="capitalize">
                    {dutySchedule?.hrApproval?.approvedBy?.lastName}
                  </span>{" "}
                  <span className="capitalize">
                    {dutySchedule?.hrApproval?.approvedBy?.suffix || ""}
                  </span>
                </div>
                <div className="mt-1">HR</div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="overflow-x-auto mb-6 mt-6 print:hidden">
            <h2 className="text-lg font-bold mb-2 text-blue-800">
              Weekly Summary
            </h2>
            {(() => {
              // 1. Get all unique employees from allEntries
              const employeeMap = {};
              allEntries.forEach((entry) => {
                entry.employeeSchedules.forEach((es) => {
                  const emp = es.employee;
                  if (emp && emp._id) {
                    employeeMap[emp._id] = emp;
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
                  const empId = es.employee?._id;
                  const shift = es.shiftTemplate;
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
                const es = entry.employeeSchedules.find(
                  (es) => es.employee?._id === empId
                );
                if (!es) return "";
                const hours = getShiftHours(es.shiftTemplate);
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
