import React from "react";
import {
  PageContainer,
  PageHeader,
  StatCard,
  Button,
  Card,
  Section,
} from "../../../components/ui";
import {
  BiTime,
  BiCalendar,
  BiUser,
  BiCheckCircle,
  BiClock,
} from "react-icons/bi";

const EmployeeDashboard = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Employee Dashboard"
        subtitle="Welcome back! Here's your overview for today."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Today's Status"
          value="Present"
          subtitle="Checked in at 9:00 AM"
          icon={<BiCheckCircle className="w-6 h-6 text-blue-500" />}
          trend={{ value: "On time", positive: true, label: "this week" }}
        />

        <StatCard
          title="Leave Balance"
          value="15 days"
          subtitle="Annual leave remaining"
          icon={<BiCalendar className="w-6 h-6 text-blue-500" />}
          trend={{ value: "5 days", positive: false, label: "used this month" }}
        />

        <StatCard
          title="Work Hours"
          value="8.5 hrs"
          subtitle="Today's target"
          icon={<BiTime className="w-6 h-6 text-blue-500" />}
          trend={{ value: "Average", positive: true, label: "this week" }}
        />
      </div>

      {/* Main Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Attendance Card */}
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Attendance</h3>
            <BiUser className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Today's Status</span>
              <span className="font-semibold text-green-600">Present</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check In Time</span>
              <span className="font-semibold">9:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check Out Time</span>
              <span className="font-semibold">--:--</span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <Button className="w-full" variant="primary">
              <BiClock className="w-4 h-4 mr-2" />
              Check In/Out
            </Button>
            <Button className="w-full" variant="secondary">
              View History
            </Button>
          </div>
        </Card>

        {/* Leave Balance Card */}
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Leave Balance
            </h3>
            <BiCalendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Leave</span>
              <span className="font-semibold">15 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sick Leave</span>
              <span className="font-semibold">5 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Requests</span>
              <span className="font-semibold text-orange-600">0</span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <Button className="w-full" variant="primary">
              Request Leave
            </Button>
            <Button className="w-full" variant="secondary">
              View Calendar
            </Button>
          </div>
        </Card>

        {/* Schedule Card */}
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Schedule
            </h3>
            <BiTime className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Work Hours</span>
              <span className="font-semibold">9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Break Time</span>
              <span className="font-semibold">1:00 PM - 2:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Meetings</span>
              <span className="font-semibold text-blue-600">0</span>
            </div>
          </div>
          <div className="mt-6">
            <Button className="w-full" variant="secondary">
              View Full Schedule
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activities Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Recent Announcements">
          <Card>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiCalendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No announcements available</p>
              <Button variant="secondary" size="sm">
                View All Announcements
              </Button>
            </div>
          </Card>
        </Section>

        <Section title="My Tasks">
          <Card>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiCheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No tasks assigned</p>
              <Button variant="secondary" size="sm">
                View Task History
              </Button>
            </div>
          </Card>
        </Section>
      </div>
    </PageContainer>
  );
};

export default EmployeeDashboard;
