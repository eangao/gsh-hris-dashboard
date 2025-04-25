import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchDutyScheduleById,
  createDutySchedule,
  updateDutySchedule,
  messageClear,
} from "../../store/Reducers/dutyScheduleReducer";

import { fetchAllWorkSchedules } from "../../store/Reducers/workScheduleReducer";
import { fetchAllEmployees } from "../../store/Reducers/employeeReducer";
import { fetchAllDepartments } from "../../store/Reducers/departmentReducer";

import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { buttonOverrideStyle } from "./../../utils/utils";

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

const DutyScheduleForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const isEditMode = !!id;

  const isAtCurrentMonth = () => {
    const today = new Date();
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
  const { departments } = useSelector((state) => state.department);

  const [currentDate, setCurrentDate] = useState(new Date());
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
    dispatch(fetchAllEmployees());
    dispatch(fetchAllDepartments());

    if (isEditMode) {
      dispatch(fetchDutyScheduleById(id));
    }
  }, [dispatch, isEditMode, id]);

  // Update local state when duty schedule data is loaded
  useEffect(() => {
    // Edit Schedule
    if (isEditMode && dutySchedule) {
      const startDateObj = new Date(dutySchedule.startDate);
      const endDateObj = new Date(dutySchedule.endDate);

      if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
        // Set local duty schedule without entries
        setLocalDutySchedule({
          ...dutySchedule,
          name: dutySchedule.name,
          department: dutySchedule.department?._id || dutySchedule.department,
          startDate: formatToPHDateString(startDateObj),
          endDate: formatToPHDateString(endDateObj),
        });

        // Set allEntries state with the entries from dutySchedule
        setAllEntries(
          dutySchedule.entries?.map((entry) => ({
            ...entry,
            date: new Date(entry.date),
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
    const { startDate, endDate } = calculateDutyPeriod(currentDate);

    const days = [];
    const currentDateSelected = new Date(startDate);

    while (currentDateSelected <= endDate) {
      days.push(new Date(currentDateSelected));
      currentDateSelected.setTime(
        currentDateSelected.getTime() + 24 * 60 * 60 * 1000
      );
    }

    setLocalDutySchedule((prev) => ({
      ...prev,
      name: formatPHMonthYear(currentDate),
      startDate: formatToPHDateString(startDate),
      endDate: formatToPHDateString(endDate),
    }));

    setDays(days);
  }, [currentDate]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/admin/dashboard/duty-schedule");

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

  const calculateDutyPeriod = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const startDate = new Date(year, month - 1, 26);
    const endDate = new Date(year, month, 25);

    return {
      startDate,
      endDate,
    };
  };

  //You can use this to format it as YYYY-MM-DD in Philippines timezone:
  const formatToPHDateString = (date) => {
    // Add 8 hours for Philippines timezone (UTC+8)
    const philippinesDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return philippinesDate.toISOString().split("T")[0];
  };

  const isHoliday = (date) => {
    if (!date) return false;
    const dateStr = formatToPHDateString(date);
    return HOLIDAYS_2025.some((holiday) => holiday.date === dateStr);
  };

  const getHolidayName = (date) => {
    if (!date) return null;
    const dateStr = formatToPHDateString(date);
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
    const dateKey = formatToPHDateString(date);

    const entry = allEntries?.find(
      (e) => formatToPHDateString(new Date(e.date)) === dateKey
    );
    if (!entry) return [];

    return entry.employeeSchedules.map((es) => {
      // Normalize employee
      const empId =
        typeof es.employee === "string" ? es.employee : es.employee?._id;
      const employee = employees.find((emp) => emp._id === empId);

      // Normalize workSchedule
      const wsId =
        typeof es.workSchedule === "string"
          ? es.workSchedule
          : es.workSchedule?._id;
      const workSchedule = workSchedules.find((ws) => ws._id === wsId);

      const shiftName = workSchedule?.name?.toLowerCase() || "unknown";

      const shiftTime = workSchedule
        ? workSchedule.type === "Standard"
          ? `(${formatTimePH(workSchedule.morningIn)}-${formatTimePH(
              workSchedule.morningOut
            )}, ${formatTimePH(workSchedule.afternoonIn)}-${formatTimePH(
              workSchedule.afternoonOut
            )})`
          : `(${formatTimePH(workSchedule.startTime)}-${formatTimePH(
              workSchedule.endTime
            )})`
        : "";

      return {
        id: empId,
        name: employee
          ? `${
              employee.personalInformation.lastName
            }, ${employee.personalInformation.firstName.charAt(0).toUpperCase()}
`
          : "Unknown",
        shiftName,
        shiftTime,
        shift: `${shiftTime}`,
        // shift: `${shiftName} ${shiftTime}`,
        description: es.remarks || "",
      };
    });
  };

  const handleEmployeeAdd = () => {
    if (!employeeInput || !selectedShift || !selectedDate) return;

    const dateKey = formatToPHDateString(selectedDate);

    // Create a deep copy of allEntries to avoid mutation errors
    let entries = JSON.parse(JSON.stringify(allEntries));

    let entryIndex = entries.findIndex(
      (e) => formatToPHDateString(new Date(e.date)) === dateKey
    );

    if (entryIndex === -1) {
      // If no entry found for the selected date, create a new one
      entries.push({
        date: selectedDate,
        employeeSchedules: [
          {
            employee: employeeInput,
            workSchedule: selectedShift,
            remarks: description,
          },
        ],
      });
    } else {
      const employeeSchedules = entries[entryIndex].employeeSchedules;
      const existingIndex = employeeSchedules.findIndex(
        (es) => es.employee === employeeInput
      );

      if (existingIndex === -1) {
        // If employee not already scheduled, add new schedule
        employeeSchedules.push({
          employee: employeeInput,
          workSchedule: selectedShift,
          remarks: description,
        });
      } else {
        // If employee is already scheduled, update their schedule
        employeeSchedules[existingIndex] = {
          employee: employeeInput,
          workSchedule: selectedShift,
          remarks: description,
        };
      }

      entries[entryIndex].employeeSchedules = employeeSchedules;
    }

    // Update the allEntries state with the modified entries
    setAllEntries(entries);

    // Close the modal
    setIsModalOpen(false);
  };

  const handleEmployeeRemove = (date, employeeId) => {
    if (!date || !employeeId) return;

    const dateKey = formatToPHDateString(date);
    let entries = [...allEntries]; // Change localDutySchedule.entries to allEntries
    let entryIndex = entries.findIndex(
      (e) => formatToPHDateString(new Date(e.date)) === dateKey
    );

    if (entryIndex === -1) return;

    let employeeSchedules = entries[entryIndex].employeeSchedules;
    employeeSchedules = employeeSchedules.filter((es) => {
      const esEmployeeId =
        typeof es.employee === "string" ? es.employee : es.employee?._id;
      return esEmployeeId !== employeeId;
    });

    if (employeeSchedules.length === 0) {
      entries = entries.filter(
        (e) => formatToPHDateString(new Date(e.date)) !== dateKey
      );
    } else {
      entries[entryIndex].employeeSchedules = employeeSchedules;
    }

    // Save the updated entries to allEntries instead of localDutySchedule
    setAllEntries(entries); // Update the allEntries state
  };

  // output ex. April 2025
  const formatPHMonthYear = (date, includeDay = false) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Manila", // This ensures it uses PH timezone
      month: "long",
      year: "numeric",
      ...(includeDay && { day: "numeric" }),
    }).format(date);
  };

  const getShiftColor = (shiftName) => {
    const schedule = workSchedules.find(
      (ws) => ws.name.toLowerCase() === shiftName.toLowerCase()
    );

    return schedule?.shiftColor || "bg-white"; // fallback to white if not found or no color set
  };

  const formatTimePH = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const date = new Date(Date.UTC(1970, 0, 1, hours - 8, minutes)); // UTC time minus 8 to align with PH time
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Manila",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
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
    const startDate = formatToPHDateString(new Date(start));
    const endDate = formatToPHDateString(new Date(end));

    return entries.filter((entry) => {
      // Format the entry date using the same function
      const entryDate = formatToPHDateString(new Date(entry.date));

      // Debugging logs
      // console.log("Entry date:", entryDate);
      // console.log("Start date:", startDate);
      // console.log("End date:", endDate);

      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const handleNextMonth = () => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + 1);

    // Update the currentDate to reflect the next month
    setCurrentDate(nextDate);
  };

  const handlePrevMonth = () => {
    const prevDate = new Date(currentDate);
    prevDate.setMonth(prevDate.getMonth() - 1);

    const today = new Date();
    const currentMonthStart = new Date(
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
    // If in edit mode, update the duty schedule, otherwise create a new one
    if (isEditMode) {
      const payload = {
        ...localDutySchedule,
        entries: allEntries, // becuase next and prev month button is hidden
      };

      // console.log("Updating duty schedule:", localDutySchedule);
      dispatch(updateDutySchedule({ _id: id, ...payload }));
    } else {
      const { startDate, endDate } = localDutySchedule;

      // Debugging logs
      // console.log("Start Date:", startDate);
      // console.log("End Date:", endDate);
      // console.log("All Entries:", allEntries);

      // Filter entries based on current date rangez
      const filteredEntries = filterEntriesByDateRange(
        allEntries,
        startDate,
        endDate
      );

      // Debugging log for filtered entries
      // console.log("Filtered Entries:", filteredEntries);

      const payload = {
        ...localDutySchedule,
        entries: filteredEntries,
      };
      // console.log("Creating new duty schedule:", payload);
      dispatch(createDutySchedule(payload));
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-bold">
          {isEditMode ? "Edit Duty Schedule" : "Create Duty Schedule"}
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
              {formatPHMonthYear(currentDate)}
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

      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <select
            name="department"
            value={localDutySchedule.department}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mt-1"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
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
                          {getEmployeesForDate(day).map((emp) => (
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEmployeeRemove(day, emp.id);
                                  }}
                                  className="text-red-500 hover:text-red-700 ml-1"
                                >
                                  ×
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
                {formatPHMonthYear(selectedDate, true)}
              </span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee Name
                </label>

                {(() => {
                  const dateKey = formatToPHDateString(selectedDate);
                  const scheduledEmployeeIds =
                    allEntries
                      ?.find(
                        (entry) =>
                          formatToPHDateString(new Date(entry.date)) === dateKey
                      )
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
                        ? `(${formatTimePH(schedule.morningIn)}-${formatTimePH(
                            schedule.morningOut
                          )}, ${formatTimePH(
                            schedule.afternoonIn
                          )}-${formatTimePH(schedule.afternoonOut)})`
                        : `(${formatTimePH(schedule.startTime)}-${formatTimePH(
                            schedule.endTime
                          )})`}
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

            {getEmployeesForDate(selectedDate)?.length > 0 && (
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
            )}
          </div>
        </div>
      )}

      {/* Section Save Buttons */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard/duty-schedule")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading ? true : false}
            className={`bg-blue-500  text-white px-4 py-2 rounded ${
              loading ? "" : " hover:bg-blue-600"
            } overflow-hidden`}
          >
            {loading ? (
              <PropagateLoader color="#fff" cssOverride={buttonOverrideStyle} />
            ) : isEditMode ? (
              "Update Duty Schedule"
            ) : (
              "Create Duty Schedule"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DutyScheduleForm;
