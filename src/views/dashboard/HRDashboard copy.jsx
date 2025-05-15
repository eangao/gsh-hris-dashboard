import React from "react";

const HRDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">HR Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Employee Overview Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Employee Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Employees</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Active Employees</span>
              <span className="font-semibold text-green-600">0</span>
            </div>
            <div className="flex justify-between">
              <span>On Leave</span>
              <span className="font-semibold text-orange-600">0</span>
            </div>
          </div>
        </div>

        {/* Recruitment Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recruitment</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Open Positions</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Applications</span>
              <span className="font-semibold text-blue-600">0</span>
            </div>
            <div className="flex justify-between">
              <span>Interviews Scheduled</span>
              <span className="font-semibold text-orange-600">0</span>
            </div>
          </div>
        </div>

        {/* Leave Management Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Leave Management</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Pending Requests</span>
              <span className="font-semibold text-orange-600">0</span>
            </div>
            <div className="flex justify-between">
              <span>Approved Today</span>
              <span className="font-semibold text-green-600">0</span>
            </div>
            <div className="flex justify-between">
              <span>Rejected Today</span>
              <span className="font-semibold text-red-600">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b text-gray-500">
              No pending approvals
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b text-gray-500">No recent updates</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
