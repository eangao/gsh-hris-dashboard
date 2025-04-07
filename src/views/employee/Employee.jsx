import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEmployees } from "../../store/Reducers/employeeReducer";
import Search from "../components/Search";
import Pagination from "../components/Pagination";

const Employee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employees, totalEmployee, loading } = useSelector(
    (state) => state.employee
  );

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-center">Employee Management</h1>
        <button
          onClick={() => navigate("/admin/dashboard/employee/add")}
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
                    {employee?.department?.name}
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
                      onClick={() =>
                        navigate(
                          `/admin/dashboard/employee/details/${employee?._id}`
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
                          `/admin/dashboard/employee/edit/${employee?._id}`
                        )
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      disabled={loading}
                    >
                      Edit
                    </button>
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
    </div>
  );
};

export default Employee;
