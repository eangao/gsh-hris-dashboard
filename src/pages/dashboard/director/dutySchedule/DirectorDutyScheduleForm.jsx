import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchDutyScheduleById,
  createDutySchedule,
  updateDutySchedule,
  messageClear,
} from "../../../../store/Reducers/dutyScheduleReducer";

import { fetchAllWorkSchedules } from "../../../../store/Reducers/workScheduleReducer";
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
  formatTime12hPH,
  getCalendarDaysInRangePH,
  convertDatePHToUTCISO,
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

  const { employees } = useSelector((state) => state.employee);
  const { workSchedules } = useSelector((state) => state.workSchedule);
  const { department } = useSelector((state) => state.department);

  const [currentDate, setCurrentDate] = useState(getCurrentDatePH());
  const [days, setDays] = useState([]);

  const [allEntries, setAllEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    dispatch(fetchAllWorkSchedules());
    if (departmentId) {
      dispatch(fetchEmployeesByDepartment(departmentId));
      dispatch(fetchDepartmentById(departmentId));
    }
    if (isEditMode) {
      dispatch(fetchDutyScheduleById(scheduleId));
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
      navigate("/manager/duty-schedule");

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
    setIsModalOpen(true);
    setEmployeeInput("");
    setSelectedShift("");
    setDescription("");
  };

  const getEmployeesForDate = (date) => {
    if (!date) return [];
    const dateKey = formatDatePH(date);

    const entry = allEntries?.find((e) => formatDatePH(e.date) === dateKey);
    if (!entry) return [];

    const employeesForDate = entry.employeeSchedules.map((es) => {
      const empId =
        typeof es.employee === "string" ? es.employee : es.employee?._id;
      const employee = employees.find((emp) => emp._id === empId);

      const wsId =
        typeof es.workSchedule === "string"
          ? es.workSchedule
          : es.workSchedule?._id;
      const workSchedule = workSchedules.find((ws) => ws._id === wsId);

      const shiftName = workSchedule?.name?.toLowerCase() || "unknown";

      const shiftTime = workSchedule
        ? workSchedule.type === "Standard"
          ? `${formatTime12hPH(workSchedule.morningIn)}-${formatTime12hPH(
              workSchedule.morningOut
            )}, ${formatTime12hPH(workSchedule.afternoonIn)}-${formatTime12hPH(
              workSchedule.afternoonOut
            )}`
          : `${formatTime12hPH(workSchedule.startTime)}-${formatTime12hPH(
              workSchedule.endTime
            )}`
        : "Unknown";

      return {
        id: empId,
        name: employee
          ? `${
              employee.personalInformation.lastName
            }, ${employee.personalInformation.firstName
              .charAt(0)
              .toUpperCase()}`
          : "Unknown",
        lastName: employee?.personalInformation?.lastName || "",
        shiftName,
        shift: shiftTime,
        description: es.remarks || "",
      };
    });

    // Group by shift
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

  const handleEmployeeAdd = () => {
    if (!employeeInput || !selectedShift || !selectedDate) return;

    const dateKey = formatDatePH(selectedDate);

    // Deep clone to avoid state mutation
    let entries = JSON.parse(JSON.stringify(allEntries));

    // Check if there's already an entry for the selected date
    let entryIndex = entries.findIndex((e) => formatDatePH(e.date) === dateKey);

    const newSchedule = {
      employee: employeeInput,
      workSchedule: selectedShift,
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
        const empA = employees.find(
          (e) =>
            e._id ===
            (typeof a.employee === "string" ? a.employee : a.employee?._id)
        );
        const empB = employees.find(
          (e) =>
            e._id ===
            (typeof b.employee === "string" ? b.employee : b.employee?._id)
        );
        const lastA = empA?.personalInformation?.lastName?.toLowerCase() || "";
        const lastB = empB?.personalInformation?.lastName?.toLowerCase() || "";
        return lastA.localeCompare(lastB);
      });

      entries[entryIndex].employeeSchedules = employeeSchedules;
    }

    setAllEntries(entries);
    setIsModalOpen(false);

    // Optional: reset form values if needed
    setEmployeeInput(null);
    setSelectedShift(null);
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
    const schedule = workSchedules.find(
      (ws) => ws.name.toLowerCase() === shiftName.toLowerCase()
    );

    return schedule?.shiftColor || "bg-white"; // fallback to white if not found or no color set
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalDutySchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    const startDateUTC = convertDatePHToUTCISO(localDutySchedule.startDate);
    const endDateUTC = convertDatePHToUTCISO(localDutySchedule.endDate);

    const filteredEntries = filterEntriesByDateRange(
      allEntries,
      localDutySchedule.startDate,
      localDutySchedule.endDate
    );

    const transformedEntries = filteredEntries.map((entry) => ({
      ...entry,
      date: convertDatePHToUTCISO(entry.date),
    }));

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
    if (role === "MANAGER") {
      navigate("/manager/duty-schedule");
    } else {
      alert("You are not authorized to access the schedule list.");
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
        {/* create a back button to navigate to the schedule list . use react icons. and sugget better appraoch
         */}
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <IoMdArrowBack className="mr-2" />
          Back to Schedule List
        </button>

        <h1 className="text-xl font-bold uppercase">
          {isEditMode
            ? `Edit ${
                department?.name ? ` ${department?.name}` : ""
              } Duty Schedule`
            : `Create ${
                department?.name ? ` ${department?.name}` : ""
              } Duty Schedule`}
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
                      <button
                        onClick={() => handleDateClick(day)}
                        className="w-full p-2 min-h-[160px] border rounded-lg hover:border-blue-500 transition-colors bg-white text-left"
                      >
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
                              className={`rounded p-1 ${getShiftColor(
                                group.shiftName
                              )}`}
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
      )}

      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              Add Employee Schedule
              <br />
              <span className="text-sm font-normal">
                {getMonthLabelPH(selectedDate, true)}
              </span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Work Schedule
                </label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">-- Select Work Schedule --</option>
                  {workSchedules?.map((schedule) => (
                    <option key={schedule._id} value={schedule._id}>
                      {schedule.name}{" "}
                      {schedule.type === "Standard"
                        ? `(${formatTime12hPH(
                            schedule.morningIn
                          )}-${formatTime12hPH(
                            schedule.morningOut
                          )}, ${formatTime12hPH(
                            schedule.afternoonIn
                          )}-${formatTime12hPH(schedule.afternoonOut)})`
                        : `(${formatTime12hPH(
                            schedule.startTime
                          )}-${formatTime12hPH(schedule.endTime)})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add any additional notes"
                  rows={2}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setDescription("");
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={handleEmployeeAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>

            {/* {getEmployeesForDate(selectedDate)?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Current Assignments</h3>
                <div className="space-y-1">
                  {getEmployeesForDate(selectedDate).map((emp) => (
                    <div
                      key={emp.id}
                      className={`text-sm p-2 rounded ${getShiftColor(
                        emp.shiftName
                      )}`}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {emp.name} - {emp.shift}
                        </span>
                        <button
                          onClick={() =>
                            handleEmployeeRemove(selectedDate, emp.id)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      {emp.description && (
                        <div className="text-gray-600 mt-1 text-sm italic">
                          {emp.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}

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

          {allEntries.length !== 0 && (
            <button
              onClick={handleSave}
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
                "Update Duty Schedule"
              ) : (
                "Create Duty Schedule"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDutyScheduleForm;
