import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchDutySchedulesByEmployee } from "../../../../store/Reducers/dutyScheduleReducer";
import Search from "../../../../components/Search";
import Pagination from "../../../../components/Pagination";

const EmployeeDutySchedule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.employee?._id;

  const { dutySchedules, totalDutySchedule, loading } = useSelector(
    (state) => state.dutySchedule
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    dispatch(
      fetchDutySchedulesByEmployee({
        employeeId,
        perPage: parseInt(perPage),
        page: parseInt(currentPage),
        searchValue,
      })
    );
  }, [dispatch, employeeId, perPage, currentPage, searchValue]);

  const handleViewDutySchedule = (departmentId, scheduleId) => {
    // Pass both departmentId and scheduleId in path param
    navigate(
      `/employee/duty-schedule/view/employee/${employeeId}/department/${departmentId}/schedule/${scheduleId}`
    );
  };

  const handlePrintDutySchedule = (departmentId, scheduleId) => {
    navigate(
      `/employee/duty-schedule/print/employee/${employeeId}/schedule/${scheduleId}`
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-center">Duty Schedule</h1>
        <div className="flex items-center space-x-2"></div>
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
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : dutySchedules?.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">
                  No duty schedules found.
                </td>
              </tr>
            ) : (
              dutySchedules?.map((schedule) => (
                <tr key={schedule?._id} className="border-t">
                  <td className="p-3">
                    <span className="capitalize">{schedule?.name}</span>
                  </td>
                  <td className="p-3 capitalize">
                    {schedule?.department?.name}
                  </td>
                  <td className="p-3 capitalize">
                    {schedule?.status === "draft"
                      ? "Draft"
                      : schedule?.status === "submitted"
                      ? "For Cluster Approval"
                      : schedule?.status === "director_approved"
                      ? "For HR Approval"
                      : schedule?.status === "hr_approved"
                      ? "Approved"
                      : schedule?.status === "director_rejected" ||
                        schedule?.status === "hr_rejected"
                      ? " Draft" // To Hide rejected schedules from employee view
                      : ""}
                  </td>
                  {schedule?.status === "hr_approved" ? (
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          handlePrintDutySchedule(
                            schedule.department?._id,
                            schedule?._id
                          )
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2"
                        disabled={loading}
                      >
                        Print
                      </button>
                    </td>
                  ) : (
                    <td className="p-3 flex space-x-2 justify-end">
                      <button
                        onClick={() =>
                          handleViewDutySchedule(
                            schedule.department?._id,
                            schedule?._id,
                            false
                          )
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        View
                      </button>
                    </td>
                  )}
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

export default EmployeeDutySchedule;
