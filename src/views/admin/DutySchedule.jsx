import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDutySchedules,
  createDutySchedule,
  deleteDutySchedule,
  messageClear,
} from "../../store/Reducers/dutyScheduleReducer";
import toast from "react-hot-toast";

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
  // Add more holidays as needed
];

const DutySchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();
  const { schedules, loading, error, success, message } = useSelector(
    (state) => state.dutySchedule
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [employeeInput, setEmployeeInput] = useState("");
  const [selectedShift, setSelectedShift] = useState("morning");
  const [description, setDescription] = useState("");

  const scheduleTypes = [
    { id: "morning", label: "Morning Shift (6:00 AM - 2:00 PM)" },
    { id: "afternoon", label: "Afternoon Shift (2:00 PM - 10:00 PM)" },
    { id: "night", label: "Night Shift (10:00 PM - 6:00 AM)" },
    { id: "off", label: "Off Duty" },
  ];

  const weekDays = [
    { day: "Sun", isWeekend: true },
    { day: "Mon", isWeekend: false },
    { day: "Tue", isWeekend: false },
    { day: "Wed", isWeekend: false },
    { day: "Thu", isWeekend: false },
    { day: "Fri", isWeekend: false },
    { day: "Sat", isWeekend: true },
  ];

  // Function to format date to YYYY-MM-DD
  const formatDateToString = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to check if a date is a holiday
  const isHoliday = (date) => {
    if (!date) return false;
    const dateStr = formatDateToString(date);
    return HOLIDAYS_2025.some((holiday) => holiday.date === dateStr);
  };

  // Function to get holiday name if it exists
  const getHolidayName = (date) => {
    if (!date) return null;
    const dateStr = formatDateToString(date);
    const holiday = HOLIDAYS_2025.find((h) => h.date === dateStr);
    return holiday ? holiday.name : null;
  };

  // Function to check if a date is a weekend
  const isWeekend = (date) => {
    if (!date) return false;
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
  };

  // Function to check if a date should be marked red
  const shouldMarkRed = (date) => {
    if (!date) return false;
    return isWeekend(date) || isHoliday(date);
  };

  const getScheduleDateRange = (date) => {
    if (!date) return [];

    const year = date.getFullYear();
    const month = date.getMonth();

    // Start from 26th of previous month
    const startDate = new Date(year, month - 1, 26);
    const endDate = new Date(year, month, 25);

    const days = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      // Add one day using timestamp calculation
      currentDate.setTime(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    setIsModalOpen(true);
    setEmployeeInput("");
    setSelectedShift("morning");
    setDescription("");
  };

  useEffect(() => {
    dispatch(fetchDutySchedules());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(messageClear());
      setEmployeeInput("");
      setDescription("");
      setIsModalOpen(false);
    }
    if (error) {
      toast.error(error);
      dispatch(messageClear());
    }
  }, [success, error, message, dispatch]);

  const handleEmployeeAdd = () => {
    if (employeeInput.trim() && selectedDate) {
      const dateKey = selectedDate.toISOString().split("T")[0];
      const scheduleData = {
        dateKey,
        schedule: {
          name: employeeInput.trim(),
          shift: selectedShift,
          description: description.trim(),
        },
      };
      dispatch(createDutySchedule(scheduleData));
    }
  };

  const handleEmployeeRemove = (date, employeeId) => {
    if (!date || !employeeId) return;
    dispatch(
      deleteDutySchedule({
        id: employeeId,
        dateKey: date.toISOString().split("T")[0],
      })
    );
  };

  const getEmployeesForDate = (date) => {
    if (!date) return [];

    const dateKey = date.toISOString().split("T")[0];
    return schedules[dateKey] || [];
  };

  const formatDate = (date, includeDay = false) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
      ...(includeDay && { day: "numeric" }),
    }).format(date);
  };

  const getShiftColor = (shiftType) => {
    switch (shiftType) {
      case "morning":
        return "bg-yellow-100";
      case "afternoon":
        return "bg-blue-100";
      case "night":
        return "bg-purple-100";
      case "off":
        return "bg-gray-100";
      default:
        return "bg-white";
    }
  };

  const days = getScheduleDateRange(currentDate);

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-bold">Duty Schedule</h1>
        <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          <button
            onClick={handlePrevMonth}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full sm:w-auto"
          >
            Previous
          </button>
          <span className="text-lg font-semibold text-center">
            {formatDate(currentDate)} {/* Month and Year only */}
          </span>
          <button
            onClick={handleNextMonth}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full sm:w-auto"
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Calendar Header */}
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

            {/* Calendar Grid */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                {/* Empty cells for proper alignment */}
                {Array.from({ length: days[0]?.getDay() || 0 }).map(
                  (_, index) => (
                    <div key={`empty-${index}`} className="lg:block hidden" />
                  )
                )}

                {/* Calendar days */}
                {days.map((day, index) => (
                  <div key={index}>
                    {day && (
                      <button
                        onClick={() => handleDateClick(day)}
                        className="w-full p-2 min-h-[160px] border rounded-lg hover:border-blue-500 transition-colors bg-white text-left"
                      >
                        <div className="mb-1">
                          {/* Large screen - centered date */}
                          <div className="hidden lg:flex justify-center">
                            <span
                              className={`font-medium ${
                                shouldMarkRed(day) ? "text-red-600" : ""
                              }`}
                            >
                              {day.getDate()}
                            </span>
                          </div>

                          {/* Small/Medium screen - date left, day right */}
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
                              className={`text-xs p-1 rounded flex flex-col ${getShiftColor(
                                emp.shift
                              )}`}
                            >
                              <div className="flex justify-between items-center">
                                <span>
                                  {emp.name} -{" "}
                                  {emp.shift.charAt(0).toUpperCase() +
                                    emp.shift.slice(1)}
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

      {/* Employee Assignment Modal */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              Add Employee Schedule
              <br />
              <span className="text-sm font-normal">
                {formatDate(selectedDate, true)} {/* Complete date with day */}
              </span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={employeeInput}
                  onChange={(e) => setEmployeeInput(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter employee name"
                  autoFocus
                />
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
                  {scheduleTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
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

            {/* Current Assignments */}
            {getEmployeesForDate(selectedDate).length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Current Assignments</h3>
                <div className="space-y-1">
                  {getEmployeesForDate(selectedDate).map((emp) => (
                    <div
                      key={emp.id}
                      className={`text-sm p-2 rounded ${getShiftColor(
                        emp.shift
                      )}`}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {emp.name} -{" "}
                          {emp.shift.charAt(0).toUpperCase() +
                            emp.shift.slice(1)}
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
    </div>
  );
};

export default DutySchedule;
