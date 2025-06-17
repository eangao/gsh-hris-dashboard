import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchManagedDepartments } from "../../../../store/Reducers/employeeReducer";
import { fetchDutySchedulesByDepartment } from "../../../../store/Reducers/dutyScheduleReducer";
import Search from "../../../../components/Search";
import Pagination from "../../../../components/Pagination";

const ScheduleManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { role, userInfo } = useSelector((state) => state.auth);
  const { employee: employeeId } = userInfo;

  const { managedDepartments } = useSelector((state) => state.employee);

  const { dutySchedules, totalDutySchedule, loading } = useSelector(
    (state) => state.dutySchedule
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    dispatch(fetchManagedDepartments(employeeId)); // fetch managed departments for this employee
  }, [employeeId, dispatch]);

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    if (selectedDepartment) {
      dispatch(
        fetchDutySchedulesByDepartment({
          departmentId: selectedDepartment,
          perPage: parseInt(perPage),
          page: parseInt(currentPage),
          searchValue,
        })
      );
    }
  }, [currentPage, perPage, searchValue, selectedDepartment, dispatch]);

  // If only one department, set it as selected by default
  useEffect(() => {
    if (
      managedDepartments &&
      managedDepartments.length === 1 &&
      selectedDepartment !== managedDepartments[0]._id
    ) {
      setSelectedDepartment(managedDepartments[0]._id);
    }
  }, [managedDepartments, selectedDepartment]);

  // Handle department change
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    if (departmentId === "") {
      setSelectedDepartment("");
    } else {
      setSelectedDepartment(departmentId);
    }
    setCurrentPage(1);
  };

  const handleAddDutySchedule = () => {
    if (role === "MANAGER") {
      if (selectedDepartment === "") {
        alert("Please select a department first.");
        return;
      }
      // Use departmentId in path param (no query string anymore)
      navigate(`/manager/duty-schedule/${selectedDepartment}/create`);
    } else {
      alert("You are not authorized to add duty schedule.");
    }
  };

  const handleEditDutySchedule = (scheduleId) => {
    if (role === "MANAGER") {
      if (!selectedDepartment) {
        alert("Please select a department first.");
        return;
      }
      // Pass both departmentId and scheduleId in path param
      navigate(
        `/manager/duty-schedule/${selectedDepartment}/edit/${scheduleId}`
      );
    } else {
      alert("You are not authorized to edit employees.");
    }
  };

  // If no managed departments, show message and do not render the rest of the page
  if (!managedDepartments || managedDepartments.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">No Department Assigned</h2>
          <p className="text-gray-600">
            You have no department assigned to manage yet.
          </p>
        </div>
      </div>
    );
  }

  // Only show schedules for selected department
  const filteredDutySchedules = selectedDepartment ? dutySchedules : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-center">Duty Schedule</h1>
        <div className="flex items-center space-x-2">
          {managedDepartments && managedDepartments.length === 1 ? (
            <span className="font-semibold px-3 py-2 bg-gray-100 rounded">
              {managedDepartments[0].name}
            </span>
          ) : (
            <select
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
            >
              <option value="">Select Department</option>
              {managedDepartments &&
                managedDepartments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
            </select>
          )}
          <button
            onClick={handleAddDutySchedule}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Duty Schedule
          </button>
        </div>
      </div>

      <div className="mb-4">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder="Search duty schedule..."
        />
      </div>
      {/* Duty Schedule Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Schedule</th>
              <th className="p-3">Department</th>
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
            ) : filteredDutySchedules?.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">
                  No duty schedules found.
                </td>
              </tr>
            ) : (
              filteredDutySchedules?.map((schedule) => (
                <tr key={schedule?._id} className="border-t">
                  <td className="p-3">
                    <span className="capitalize">{schedule?.name}</span>
                  </td>
                  <td className="p-3 capitalize">
                    {schedule?.department?.name}
                  </td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditDutySchedule(schedule?._id)}
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
      {totalDutySchedule <= perPage ? (
        ""
      ) : (
        <div className="w-full flex justify-end mt-4 bottom-4 right-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalDutySchedule}
            perPage={perPage}
            showItem={Math.min(5, Math.ceil(totalDutySchedule / perPage))}
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
