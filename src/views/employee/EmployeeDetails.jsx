import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { employees = [] } = useSelector((state) => state.employee);
  const { departments = [] } = useSelector((state) => state.department);
  const { positions = [] } = useSelector((state) => state.position);
  const { workSchedules = [] } = useSelector((state) => state.workSchedule);

  const employee = employees.find((emp) => emp.id === Number(id));

  if (!employee) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="text-center text-red-600">Employee not found.</div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/admin/dashboard/employee")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  const department = departments.find(
    (dept) => dept.id === employee.departmentId
  );
  const position = positions.find((pos) => pos.id === employee.positionId);
  const workSchedule = workSchedules.find(
    (schedule) => schedule.id === employee.workScheduleId
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Details</h1>
        <button
          onClick={() => navigate("/admin/dashboard/employee")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <div className="mt-1 text-gray-900">{employee.name}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <div className="mt-1 text-gray-900">{employee.email}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <div className="mt-1 text-gray-900">{employee.phone}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Address
                </label>
                <div className="mt-1 text-gray-900">{employee.address}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Gender
                </label>
                <div className="mt-1 text-gray-900">{employee.gender}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Birthdate
                </label>
                <div className="mt-1 text-gray-900">{employee.birthdate}</div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Employment Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Department
                </label>
                <div className="mt-1 text-gray-900">
                  {department?.name || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Position
                </label>
                <div className="mt-1 text-gray-900">
                  {position?.name || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Work Schedule
                </label>
                <div className="mt-1 text-gray-900">
                  {workSchedule?.name || "-"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="mt-1 text-gray-900">{employee.status}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Salary
                </label>
                <div className="mt-1 text-gray-900">${employee.salary}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Date Hired
                </label>
                <div className="mt-1 text-gray-900">{employee.dateHired}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() =>
              navigate(`/admin/dashboard/employee/edit/${employee.id}`)
            }
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
