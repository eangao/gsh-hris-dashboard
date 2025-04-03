import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  // fetchEmployees,
  // deleteEmployee,
  messageClear,
} from "../../store/Reducers/employeeReducer";
import toast from "react-hot-toast";

const Employee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    employees = [],
    loading,
    errorMessage,
    successMessage,
  } = useSelector((state) => state.employee);
  const { departments = [] } = useSelector((state) => state.department);
  const { positions = [] } = useSelector((state) => state.position);
  const { workSchedules = [] } = useSelector((state) => state.workSchedule);

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    // dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setDeleteId(null);
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const handleDeleteConfirm = (id) => setDeleteId(id);

  const handleDelete = () => {
    // dispatch(deleteEmployee(deleteId));
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Employee Management
      </h1>

      {/* Search and Add Employee */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-64"
        />
        <button
          onClick={() => navigate("/admin/dashboard/employees/add")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Add Employee
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Full Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Position</th>
              <th className="p-3">Employment Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee._id} className="border-t">
                  <td className="p-3">{`${
                    employee.personalInformation?.firstName || ""
                  } ${employee.personalInformation?.lastName || ""}`}</td>
                  <td className="p-3">
                    {departments.find(
                      (dept) =>
                        dept._id ===
                        employee.employmentInformation?.departmentId
                    )?.name || "-"}
                  </td>
                  <td className="p-3">
                    {positions.find(
                      (pos) =>
                        pos._id === employee.employmentInformation?.positionId
                    )?.name || "-"}
                  </td>
                  <td className="p-3">
                    {employee.employmentInformation?.employmentStatus || "-"}
                  </td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/dashboard/employees/details/${employee._id}`
                        )
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      disabled={loading}
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/dashboard/employees/edit/${employee._id}`
                        )
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(employee._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this employee?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Loading..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
