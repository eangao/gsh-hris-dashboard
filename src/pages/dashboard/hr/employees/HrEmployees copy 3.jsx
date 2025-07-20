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

  const { employees, totalEmployee, loading, successMessage, errorMessage } =
    useSelector((state) => state.employee);

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
                {departments.find((dept) => dept._id === selectedDepartment)
                  ?.name || "Department"}
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
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm border border-white/20"
            >
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
                    const deptName = departments.find(
                      (dept) => dept._id === selectedDepartment
                    )?.name;
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

      {/* Employees Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        {/* Summary Stats */}
        {employees && employees.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">
                  Active:{" "}
                  {employees.filter((emp) => emp.status === "Active").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">
                  Inactive:{" "}
                  {employees.filter((emp) => emp.status === "Inactive").length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">
                  Total Employees: {totalEmployee}
                </span>
              </div>
            </div>
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 text-left">
              <th className="p-3 text-sm font-semibold text-gray-700">
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
              <th className="p-3 text-sm font-semibold text-gray-700">
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
              <th className="p-3 text-sm font-semibold text-gray-700">
                Position
              </th>
              <th className="p-3 text-sm font-semibold text-gray-700">
                Employment Status
              </th>
              <th className="p-3 text-sm font-semibold text-gray-700">
                Employee Id
              </th>
              <th className="p-3 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="p-3 text-center text-sm font-semibold text-gray-700">
                Actions
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
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-xs">
                          {employee.personalInformation?.firstName?.charAt(0)}
                          {employee.personalInformation?.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
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
                      </div>
                    </div>
                  </td>
                  <td className="p-3 capitalize text-gray-700">
                    {employee?.department?.name || "-"}
                  </td>
                  <td className="p-3 capitalize text-gray-700">
                    {employee?.position?.name}
                  </td>
                  <td className="p-3 capitalize text-gray-700">
                    {employee?.employmentStatus?.name}
                  </td>
                  <td className="p-3 font-mono text-sm">
                    {employee?.employmentInformation?.hospitalEmployeeId}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee?.status === "Active"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {employee?.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleViewEmployee(employee?._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        disabled={loading}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditEmployee(employee?._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                        disabled={loading}
                      >
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
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Showing{" "}
              <span className="font-medium text-blue-700 mx-1">
                {employees.length === 0 ? 0 : (currentPage - 1) * perPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-blue-700 mx-1">
                {Math.min(currentPage * perPage, totalEmployee)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-blue-700 mx-1">
                {totalEmployee}
              </span>{" "}
              employees
            </div>
            <div className="flex justify-center sm:justify-end">
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
