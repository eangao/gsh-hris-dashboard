import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchEmployees,
  deleteEmployee,
  messageClear,
} from "../../../../store/Reducers/employeeReducer";
import EmployeeSearchDatabase from "../../../../components/EmployeeSearchDatabase";
import Pagination from "../../../../components/Pagination";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { fetchAllDepartments } from "../../../../store/Reducers/departmentReducer";

const HrEmployees = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state.department);

  const {
    employees,
    totalEmployee,
    loading,
    successMessage,
    errorMessage,
    statusCounts,
  } = useSelector((state) => state.employee);

  // Status configuration with colors and categories
  const statusConfig = {
    // Active statuses (Green)
    active: { label: "Active", color: "green", category: "active" },
    probationary: { label: "Probationary", color: "blue", category: "active" },

    // Leave statuses (Orange/Yellow)
    on_leave: { label: "On Leave", color: "yellow", category: "leave" },
    maternity_leave: {
      label: "Maternity Leave",
      color: "yellow",
      category: "leave",
    },
    medical_leave: {
      label: "Medical Leave",
      color: "yellow",
      category: "leave",
    },
    sabbatical: { label: "Sabbatical", color: "yellow", category: "leave" },

    // Inactive/Issue statuses (Red/Orange)
    inactive: { label: "Inactive", color: "red", category: "inactive" },
    suspended: { label: "Suspended", color: "red", category: "inactive" },
    disciplinary: { label: "Disciplinary", color: "red", category: "inactive" },

    // Terminated statuses (Gray)
    terminated: { label: "Terminated", color: "gray", category: "terminated" },
    resigned: { label: "Resigned", color: "gray", category: "terminated" },
    retired: { label: "Retired", color: "gray", category: "terminated" },
    deceased: { label: "Deceased", color: "gray", category: "terminated" },

    // Pending/Transfer statuses (Blue)
    pending: { label: "Pending", color: "blue", category: "pending" },
    transferred: { label: "Transferred", color: "blue", category: "pending" },
  };

  // Helper function to get status styling
  const getStatusStyle = (status) => {
    const config = statusConfig[status] || { color: "gray" };

    const colorClasses = {
      green: "bg-green-50 text-green-700 border-green-500",
      blue: "bg-blue-50 text-blue-700 border-blue-500",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-500",
      red: "bg-red-50 text-red-700 border-red-500",
      gray: "bg-gray-50 text-gray-700 border-gray-500",
    };

    const dotClasses = {
      green: "bg-green-500",
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      gray: "bg-gray-500",
    };

    return {
      container: colorClasses[config.color] || colorClasses.gray,
      dot: dotClasses[config.color] || dotClasses.gray,
    };
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(10);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Fetch departments on component mount
  useEffect(() => {
    dispatch(fetchAllDepartments());
  }, [dispatch]);

  // 1️⃣ Reset page to 1 when searchValue or department changes
  useEffect(() => {
    if ((searchValue || selectedDepartment) && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, selectedDepartment]);

  // 2️⃣ Fetch data after currentPage, perPage, searchValue, or selectedDepartment is updated
  useEffect(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
      departmentId: selectedDepartment, // Pass directly since it's either null or department ID
    };

    dispatch(fetchEmployees(obj));
  }, [currentPage, perPage, searchValue, selectedDepartment, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  const handleDelete = () => {
    dispatch(deleteEmployee(deleteId));

    setDeleteId(null);
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleAddEmployee = () => {
    if (role === "HR_ADMIN") {
      navigate("/hr/employees/add");
    } else {
      // Optional: fallback if unauthorized role
      alert("You are not authorized to add employees.");
    }
  };

  const handleEditEmployee = (employeeId) => {
    if (role === "HR_ADMIN") {
      navigate(`/hr/employees/edit/${employeeId}`);
    } else {
      alert("You are not authorized to edit employees.");
    }
  };

  const handleViewEmployee = (employeeId) => {
    if (role === "HR_ADMIN") {
      navigate(`/hr/employees/details/${employeeId}`);
    } else {
      alert("You are not authorized to view this employee.");
    }
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    // Convert empty string to null for database compatibility
    setSelectedDepartment(departmentId || null);
    setCurrentPage(1);
    // Clear search when department changes
    setSearchValue("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Employee Management</h1>
            <p className="text-blue-100">
              Manage and monitor all employee records and information
            </p>
            {selectedDepartment && departments && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                {(
                  departments.find((dept) => dept._id === selectedDepartment)
                    ?.name || "Department"
                ).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-white/10 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <button
              onClick={handleAddEmployee}
              className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center gap-2 hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Add Employee
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Employee Search */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
        <EmployeeSearchDatabase
          setPerpage={setPerpage}
          perPage={perPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder="Search employees by first name, last name, middle name"
          loading={loading}
          departments={departments || []}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={handleDepartmentChange}
        />

        {/* Search Results Info */}
        {(searchValue || selectedDepartment) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">
                {(() => {
                  const isEmployeeId =
                    searchValue.length === 24 &&
                    /^[0-9a-fA-F]{24}$/.test(searchValue);

                  if (isEmployeeId) {
                    const selectedEmployee = employees.find(
                      (emp) => emp._id === searchValue
                    );
                    if (selectedEmployee?.personalInformation) {
                      const { firstName, lastName, middleName } =
                        selectedEmployee.personalInformation;
                      const employeeName = `${firstName || ""} ${
                        middleName ? middleName + " " : ""
                      }${lastName || ""}`.trim();
                      return (
                        <>
                          Showing records for: <strong>{employeeName}</strong>
                        </>
                      );
                    }
                    return <>Showing records for selected employee</>;
                  } else if (searchValue) {
                    return (
                      <>
                        Search results for: "<strong>{searchValue}</strong>"
                      </>
                    );
                  } else if (selectedDepartment) {
                    const deptName =
                      departments
                        .find((dept) => dept._id === selectedDepartment)
                        ?.name?.toUpperCase() || "DEPARTMENT";
                    return (
                      <>
                        Showing employees from: <strong>{deptName}</strong>
                      </>
                    );
                  }
                })()}
              </span>
              <span className="text-blue-600">
                {totalEmployee} employee{totalEmployee !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Status Overview Card - New Addition */}
      {statusCounts && Object.keys(statusCounts).length > 1 && (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Employee Status Overview
            </h3>
            <span className="text-sm text-gray-500">
              {Object.keys(statusCounts).length} different status types
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Object.entries(statusCounts)
              .sort(([, a], [, b]) => b - a) // Sort by count descending
              .map(([status, count]) => {
                const config = statusConfig[status] || {
                  label: status,
                  color: "gray",
                };
                const colorMap = {
                  green: "border-green-200 bg-green-50",
                  blue: "border-blue-200 bg-blue-50",
                  yellow: "border-yellow-200 bg-yellow-50",
                  red: "border-red-200 bg-red-50",
                  gray: "border-gray-200 bg-gray-50",
                };
                const dotColorMap = {
                  green: "bg-green-500",
                  blue: "bg-blue-500",
                  yellow: "bg-yellow-500",
                  red: "bg-red-500",
                  gray: "bg-gray-500",
                };

                return (
                  <div
                    key={status}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                      colorMap[config.color] || colorMap.gray
                    } transition-all duration-200 hover:scale-105`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          dotColorMap[config.color] || dotColorMap.gray
                        }`}
                      ></div>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {config.label}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 ml-2">
                      {count}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        {/* Enhanced Summary Stats */}
        {employees && employees.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm">
              {/* Primary Status - Active */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">
                  Active: {statusCounts?.active || 0}
                </span>
              </div>

              {/* Secondary Statuses - Show significant ones */}
              {statusCounts &&
                Object.entries(statusCounts)
                  .filter(([status]) => status !== "active")
                  .slice(0, 4) // Show up to 4 additional statuses
                  .map(([status, count]) => {
                    const config = statusConfig[status] || {
                      label: status,
                      color: "gray",
                    };
                    const colorMap = {
                      green: "bg-green-500",
                      blue: "bg-blue-500",
                      yellow: "bg-yellow-500",
                      red: "bg-red-500",
                      gray: "bg-gray-500",
                    };

                    return (
                      <div key={status} className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            colorMap[config.color] || colorMap.gray
                          }`}
                        ></div>
                        <span className="text-gray-700 capitalize">
                          {config.label}: {count}
                        </span>
                      </div>
                    );
                  })}

              {/* Total Count */}
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">
                  Total Employees: {totalEmployee}
                </span>
              </div>

              {/* Show more indicator if there are many statuses */}
              {statusCounts && Object.keys(statusCounts).length > 5 && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <span>
                    +{Object.keys(statusCounts).length - 5} more statuses
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 text-left">
              <th className="p-4 text-sm font-semibold text-gray-700">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Full Name
                </div>
              </th>
              <th className="p-4 text-sm font-semibold text-gray-700">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                  </svg>
                  Department
                </div>
              </th>
              <th className="p-4 text-sm font-semibold text-gray-700">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 6V5a6 6 0 0112 0v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-12-1.43V8a2 2 0 012-2h2zm2-1a4 4 0 118 0v1H8V5zm9 6a4.978 4.978 0 00-3-1.48V8.5a1.5 1.5 0 00-3 0V9H8V8.5A1.5 1.5 0 005 8.5V9a4.978 4.978 0 00-3 1.48V8a2 2 0 012-2h12a2 2 0 012 2v3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Employment Status
                </div>
              </th>

              <th className="p-4 text-sm font-semibold text-gray-700">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Status
                </div>
              </th>
              <th className="p-4 text-center text-sm font-semibold text-gray-700">
                <div className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <span className="text-gray-500">Loading employees...</span>
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-12 text-center">
                  <div className="text-blue-400 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No employees found
                  </h3>
                  <p className="text-gray-500">
                    {selectedDepartment || searchValue
                      ? "No employees match your current filters."
                      : "No employees have been added yet."}
                  </p>
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr
                  key={employee._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                        <span className="text-blue-700 font-bold text-sm">
                          {employee.personalInformation?.firstName?.charAt(0)}
                          {employee.personalInformation?.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          <span className="capitalize">
                            {employee.personalInformation?.lastName},
                          </span>{" "}
                          <span className="capitalize">
                            {employee.personalInformation?.firstName}
                          </span>{" "}
                          {employee.personalInformation?.middleName && (
                            <span className="capitalize">
                              {employee.personalInformation?.middleName
                                .charAt(0)
                                .toUpperCase()}
                              .
                            </span>
                          )}
                          {employee.personalInformation?.suffix && (
                            <span className="capitalize">
                              , {employee.personalInformation?.suffix}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          ID:{" "}
                          {employee?.employmentInformation
                            ?.hospitalEmployeeId || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-bold text-gray-900 uppercase tracking-wide text-xs">
                        {employee?.department?.name || "-"}
                      </div>
                      <div className="text-sm  text-gray-600 capitalize mt-1">
                        {employee?.position?.name || "-"}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 capitalize text-gray-700">
                    {employee?.employmentStatus?.name}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        getStatusStyle(employee?.status).container
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-1.5 ${
                          getStatusStyle(employee?.status).dot
                        }`}
                      ></div>
                      {statusConfig[employee?.status]?.label ||
                        employee?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleViewEmployee(employee?._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                        disabled={loading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={() => handleEditEmployee(employee?._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                        disabled={loading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalEmployee > perPage && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Results Summary */}
            <div className="flex items-center text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Showing{" "}
                  <span className="font-medium text-blue-700">
                    {employees.length === 0
                      ? 0
                      : (currentPage - 1) * perPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-blue-700">
                    {Math.min(currentPage * perPage, totalEmployee)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-blue-700">
                    {totalEmployee}
                  </span>{" "}
                  employees
                </span>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Page {currentPage} of {Math.ceil(totalEmployee / perPage)}
                </span>
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalEmployee}
                  perPage={perPage}
                  showItem={Math.min(5, Math.ceil(totalEmployee / perPage))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Confirm Delete
            </h2>
            <p className="text-gray-700 mb-6">{`Are you sure you want to delete ${deleteName}?`}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition-colors"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrEmployees;
