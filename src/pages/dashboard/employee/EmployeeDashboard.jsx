import React from "react";

const EmployeeDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Attendance</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Today's Status</span>
              <span className="font-semibold text-green-600">Present</span>
            </div>
            <div className="flex justify-between">
              <span>Check In Time</span>
              <span className="font-semibold">--:--</span>
            </div>
            <div className="flex justify-between">
              <span>Check Out Time</span>
              <span className="font-semibold">--:--</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Check In/Out
          </button>
        </div>

        {/* Leave Balance Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Leave Balance</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Annual Leave</span>
              <span className="font-semibold">0 days</span>
            </div>
            <div className="flex justify-between">
              <span>Sick Leave</span>
              <span className="font-semibold">0 days</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Requests</span>
              <span className="font-semibold text-orange-600">0</span>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Request Leave
          </button>
        </div>

        {/* Schedule Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Work Hours</span>
              <span className="font-semibold">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Break Time</span>
              <span className="font-semibold">1:00 PM - 2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Meetings</span>
              <span className="font-semibold text-blue-600">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Announcements */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Announcements</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b text-gray-500">No announcements</div>
          </div>
        </div>

        {/* Tasks */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b text-gray-500">No tasks assigned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
