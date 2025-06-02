import React, { useState } from "react";
import { useSelector } from "react-redux";

const DepartmentAttendance = () => {
  const [viewType, setViewType] = useState("daily"); // daily, range, monthly
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Utility function to convert 24h to 12h format
  const convertTo12Hour = (time24) => {
    if (!time24 || typeof time24 !== "string" || !time24.includes(":")) {
      return ""; // or return null; or throw new Error("Invalid time format");
    }

    const [hours24, minutes] = time24.split(":").map(Number);

    // Additional validation for numbers
    if (
      isNaN(hours24) ||
      isNaN(minutes) ||
      hours24 < 0 ||
      hours24 > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return ""; // or return null; or throw new Error("Invalid time values");
    }

    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;

    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Mock data for testing - replace with actual API calls
  const mockEmployees = [
    {
      id: 1,
      name: "John Doe",
      department: "IT",
      schedule: { startTime: "09:00", endTime: "18:00" },
      attendance: {
        date: new Date(),
        timeIn: "09:15",
        timeOut: "18:05",
        status: "Late",
        lateMinutes: 15,
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      department: "HR",
      schedule: { startTime: "08:30", endTime: "17:30" },
      attendance: {
        date: new Date(),
        timeIn: "08:25",
        timeOut: "17:30",
        status: "Present",
        lateMinutes: 0,
      },
    },
    {
      id: 3,
      name: "Michael Johnson",
      department: "Finance",
      schedule: { startTime: "08:00", endTime: "17:00" },
      attendance: {
        date: new Date(),
        timeIn: "08:10",
        timeOut: "17:00",
        status: "Late",
        lateMinutes: 10,
      },
    },
    {
      id: 4,
      name: "Emily Davis",
      department: "Marketing",
      schedule: { startTime: "09:00", endTime: "18:00" },
      attendance: {
        date: new Date(),
        timeIn: null,
        timeOut: null,
        status: "On Leave",
        lateMinutes: 0,
      },
    },
    {
      id: 5,
      name: "Daniel Wilson",
      department: "IT",
      schedule: { startTime: "10:00", endTime: "19:00" },
      attendance: {
        date: new Date(),
        timeIn: "10:20",
        timeOut: "19:05",
        status: "Late",
        lateMinutes: 20,
      },
    },
    {
      id: 6,
      name: "Sarah Miller",
      department: "HR",
      schedule: { startTime: "08:00", endTime: "17:00" },
      attendance: {
        date: new Date(),
        timeIn: "08:00",
        timeOut: "17:00",
        status: "Present",
        lateMinutes: 0,
      },
    },
    {
      id: 7,
      name: "David Martinez",
      department: "Finance",
      schedule: { startTime: "09:00", endTime: "18:00" },
      attendance: {
        date: new Date(),
        timeIn: null,
        timeOut: null,
        status: "Off Duty",
        lateMinutes: 0,
      },
    },
    {
      id: 8,
      name: "Olivia Garcia",
      department: "Marketing",
      schedule: { startTime: "08:30", endTime: "17:30" },
      attendance: {
        date: new Date(),
        timeIn: "08:25",
        timeOut: "17:30",
        status: "Present",
        lateMinutes: 0,
      },
    },
    {
      id: 9,
      name: "James Anderson",
      department: "IT",
      schedule: { startTime: "09:30", endTime: "18:30" },
      attendance: {
        date: new Date(),
        timeIn: "09:45",
        timeOut: "18:35",
        status: "Late",
        lateMinutes: 15,
      },
    },
    {
      id: 10,
      name: "Emma Thomas",
      department: "HR",
      schedule: { startTime: "07:00", endTime: "16:00" },
      attendance: {
        date: new Date(),
        timeIn: null,
        timeOut: null,
        status: "On Leave",
        lateMinutes: 0,
      },
    },
    {
      id: 11,
      name: "William Lee",
      department: "Finance",
      schedule: { startTime: "08:00", endTime: "17:00" },
      attendance: {
        date: new Date(),
        timeIn: "08:10",
        timeOut: "17:00",
        status: "Late",
        lateMinutes: 10,
      },
    },
    {
      id: 12,
      name: "Isabella Harris",
      department: "Marketing",
      schedule: { startTime: "09:00", endTime: "18:00" },
      attendance: {
        date: new Date(),
        timeIn: "09:00",
        timeOut: "18:00",
        status: "Present",
        lateMinutes: 0,
      },
    },
    {
      id: 13,
      name: "Alexander Clark",
      department: "IT",
      schedule: { startTime: "10:00", endTime: "19:00" },
      attendance: {
        date: new Date(),
        timeIn: "10:05",
        timeOut: "19:00",
        status: "Late",
        lateMinutes: 5,
      },
    },
    {
      id: 14,
      name: "Sophia Lewis",
      department: "HR",
      schedule: { startTime: "08:30", endTime: "17:30" },
      attendance: {
        date: new Date(),
        timeIn: null,
        timeOut: null,
        status: "Off Duty",
        lateMinutes: 0,
      },
    },
    {
      id: 15,
      name: "Benjamin Walker",
      department: "Finance",
      schedule: { startTime: "09:00", endTime: "18:00" },
      attendance: {
        date: new Date(),
        timeIn: "09:00",
        timeOut: "18:00",
        status: "Present",
        lateMinutes: 0,
      },
    },
    {
      id: 16,
      name: "Mia Robinson",
      department: "Marketing",
      schedule: { startTime: "07:00", endTime: "16:00" },
      attendance: {
        date: new Date(),
        timeIn: "07:10",
        timeOut: "16:00",
        status: "Late",
        lateMinutes: 10,
      },
    },
    {
      id: 17,
      name: "Ethan Young",
      department: "IT",
      schedule: { startTime: "08:00", endTime: "17:00" },
      attendance: {
        date: new Date(),
        timeIn: "08:00",
        timeOut: "17:00",
        status: "Present",
        lateMinutes: 0,
      },
    },
    {
      id: 18,
      name: "Ava King",
      department: "HR",
      schedule: { startTime: "09:00", endTime: "18:00" },
      attendance: {
        date: new Date(),
        timeIn: "09:15",
        timeOut: "18:05",
        status: "Late",
        lateMinutes: 15,
      },
    },
    {
      id: 19,
      name: "Logan Wright",
      department: "Finance",
      schedule: { startTime: "08:30", endTime: "17:30" },
      attendance: {
        date: new Date(),
        timeIn: "08:25",
        timeOut: "17:30",
        status: "Present",
        lateMinutes: 0,
      },
    },
  ];

  const handleViewTypeChange = (e) => {
    setViewType(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleDateRangeChange = (type, e) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: new Date(e.target.value),
    }));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(new Date(e.target.value));
  };

  const handleDepartmentFilter = (e) => {
    setFilterDepartment(e.target.value);
  };

  const filteredAttendance = mockEmployees.filter(
    (emp) => filterDepartment === "all" || emp.department === filterDepartment
  );

  const exportAttendanceReport = () => {
    // TODO: Implement export functionality
    console.log("Exporting attendance report...");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Daily Attendance</h1>

      {/* Filters Section */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* View Type Selection */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Type
            </label>
            <select
              value={viewType}
              onChange={handleViewTypeChange}
              className="p-2 border rounded w-full"
            >
              <option value="daily">Daily</option>
              <option value="range">Custom Range</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Date Selection */}
          {viewType === "daily" && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                className="p-2 border rounded w-full"
              />
            </div>
          )}

          {viewType === "range" && (
            <>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start.toISOString().split("T")[0]}
                  onChange={(e) => handleDateRangeChange("start", e)}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end.toISOString().split("T")[0]}
                  onChange={(e) => handleDateRangeChange("end", e)}
                  className="p-2 border rounded w-full"
                />
              </div>
            </>
          )}

          {viewType === "monthly" && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Month
              </label>
              <input
                type="month"
                value={selectedMonth
                  .toISOString()
                  .split("T")[0]
                  .substring(0, 7)}
                onChange={handleMonthChange}
                className="p-2 border rounded w-full"
              />
            </div>
          )}

          {/* Department Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={filterDepartment}
              onChange={handleDepartmentFilter}
              className="p-2 border rounded w-full"
            >
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          {/* Export Button */}
          <div className="flex-none">
            <button
              onClick={exportAttendanceReport}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Department</th>
              <th className="p-3 text-left">Schedule</th>
              <th className="p-3 text-left">Time In</th>
              <th className="p-3 text-left">Time Out</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Late</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((employee) => (
              <tr key={employee.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium text-gray-900">
                    {employee.name}
                  </div>
                </td>
                <td className="p-3">{employee.department}</td>
                <td className="p-3">
                  {convertTo12Hour(employee.schedule.startTime)} -{" "}
                  {convertTo12Hour(employee.schedule.endTime)}
                </td>
                <td className="p-3">
                  {convertTo12Hour(employee.attendance.timeIn)}
                </td>
                <td className="p-3">
                  {convertTo12Hour(employee.attendance.timeOut)}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.attendance.status === "Present"
                        ? "bg-green-100 text-green-800"
                        : employee.attendance.status === "On Leave"
                        ? "bg-yellow-100 text-yellow-800"
                        : employee.attendance.status === "Late"
                        ? "bg-orange-100 text-orange-800"
                        : employee.attendance.status === "Off Duty"
                        ? "bg-blue-100 text-blue-800"
                        : employee.attendance.status === "Absent"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }`}
                  >
                    {employee.attendance.status}
                  </span>
                </td>
                <td className="p-3">
                  {employee.attendance.lateMinutes > 0
                    ? `${employee.attendance.lateMinutes} mins`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentAttendance;
