import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchDutyScheduleById,
  messageClear,
} from "../../../../store/Reducers/dutyScheduleReducer";

import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { buttonOverrideStyle } from "../../../../utils/utils";
import { FaTimes } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import {
  formatMonthYearPH,
  getCurrentDatePH,
  formatDatePH,
  getDutyScheduleRangePH,
  parseDatePH,
  formatTimeTo12HourPH,
  getCalendarDaysInRangePH,
} from "../../../../utils/phDateUtils";

import "./HrDutySchedulePrint.css";
import { hrApproval } from "./../../../../store/Reducers/dutyScheduleReducer";

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

const HrDutySchedulePrint = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { scheduleId } = useParams();

  const { dutySchedule, loading, errorMessage, successMessage } = useSelector(
    (state) => state.dutySchedule
  );

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
    dispatch(fetchDutyScheduleById(scheduleId));
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

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/hr/duty-schedule");
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  console.log(dutySchedule);

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
    navigate("/hr/duty-schedule");
  };

  return (
    <div className="bg-white p-4 print:p-0">
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
        </>
      )}

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
    </div>
  );
};

export default HrDutySchedulePrint;
