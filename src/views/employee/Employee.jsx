import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchEmployees,
  deleteEmployee,
  messageClear,
} from "../../store/Reducers/employeeReducer";
import Search from "../components/Search";
import Pagination from "../components/Pagination";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const Employee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);

  const { employees, totalEmployee, loading, successMessage, errorMessage } =
    useSelector((state) => state.employee);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  useEffect(() => {
    // Reset to page 1 if searchValue is not empty
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }

    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };

    dispatch(fetchEmployees(obj));
  }, [searchValue, currentPage, perPage, dispatch]);

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
    if (role === "admin") {
      navigate("/admin/dashboard/employee/add");
    } else if (role === "hr") {
      navigate("/hr/dashboard/employee/add");
    } else {
      // Optional: fallback if unauthorized role
      alert("You are not authorized to add employees.");
    }
  };

  const handleEditEmployee = (employeeId) => {
    if (role === "admin") {
      navigate(`/admin/dashboard/employee/edit/${employeeId}`);
    } else if (role === "hr") {
      navigate(`/hr/dashboard/employee/edit/${employeeId}`);
    } else {
      alert("You are not authorized to edit employees.");
    }
  };

  const handleViewEmployee = (employeeId) => {
    if (role === "admin") {
      navigate(`/admin/dashboard/employee/details/${employeeId}`);
    } else if (role === "hr") {
      navigate(`/hr/dashboard/employee/details/${employeeId}`);
    } else {
      alert("You are not authorized to view this employee.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-center">Employee Management</h1>
        <button
          onClick={handleAddEmployee}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Employee
        </button>
      </div>

      <div className="mb-4">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder="Search Employee..."
        />
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
              <th className="p-3">Employee Id</th>
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
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee._id} className="border-t">
                  <td className="p-3">
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
                  </td>
                  <td className="p-3 capitalize">
                    {employee?.department?.name || "-"}
                  </td>
                  <td className="p-3 capitalize">{employee?.position?.name}</td>
                  <td className="p-3 capitalize">
                    {employee?.employmentStatus?.name}
                  </td>
                  <td className="p-3 capitalize">
                    {employee?.employmentInformation?.hospitalEmployeeId}
                  </td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleViewEmployee(employee?._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      disabled={loading}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditEmployee(employee?._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    {/* <button
                      onClick={() =>
                        handleDeleteConfirm(
                          employee._id,
                          `${employee.personalInformation?.lastName}, ${employee.personalInformation?.firstName}`
                        )
                      }
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      disabled={loading}
                    >
                      <FaTrashAlt />
                    </button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination  */}
      {totalEmployee <= perPage ? (
        ""
      ) : (
        <div className="w-full flex justify-end mt-4 bottom-4 right-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalEmployee}
            perPage={perPage}
            showItem={Math.min(5, Math.ceil(totalEmployee / perPage))}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>{`Are you sure you want to delete ${deleteName}?`}</p>
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
                {loading ? "loading..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
