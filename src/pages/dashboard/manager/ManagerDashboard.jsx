import React from "react";

const ManagerDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Team Overview Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Team Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Team Members</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Present Today</span>
              <span className="font-semibold text-green-600">0</span>
            </div>
            <div className="flex justify-between">
              <span>On Leave</span>
              <span className="font-semibold text-orange-600">0</span>
            </div>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Tasks Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Pending Approvals</span>
              <span className="font-semibold text-orange-600">0</span>
            </div>
            <div className="flex justify-between">
              <span>Team Tasks</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Completed Tasks</span>
              <span className="font-semibold text-green-600">0</span>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Team Meetings</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Leave Requests</span>
              <span className="font-semibold text-blue-600">0</span>
            </div>
            <div className="flex justify-between">
              <span>Upcoming Deadlines</span>
              <span className="font-semibold text-red-600">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b text-gray-500">
            No recent activities to display
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
