import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchHrDutySchedulesByStatus } from "../../../../store/Reducers/dutyScheduleReducer";
import Search from "../../../../components/Search";
import Pagination from "../../../../components/Pagination";
import { useNavigate } from "react-router-dom";

const HrDutySchedule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dutySchedules, totalDutySchedule, loading } = useSelector(
    (state) => state.dutySchedule
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  const [statusFilter, setStatusFilter] = useState("director_approved");

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, currentPage]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    dispatch(
      fetchHrDutySchedulesByStatus({
        perPage: parseInt(perPage),
        page: parseInt(currentPage),
        searchValue,
        statusFilter,
      })
    );
  }, [currentPage, perPage, searchValue, statusFilter, dispatch]);

  // Handler for status tab click
  const handleStatusTabClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on tab change
  };

  // Handler for viewing a duty schedule (implement navigation or modal as needed)
  const handleViewDutySchedule = (departmentId, scheduleId) => {
    // Pass both departmentId and scheduleId in path param
    navigate(`/hr/duty-schedule/${departmentId}/view/${scheduleId}`);
  };

  const handlePrintDutySchedule = (departmentId, scheduleId) => {
    navigate(
      `/hr/duty-schedule/print/department/${departmentId}/schedule/${scheduleId}`
    );
  };

  return (
    <div className="p-6 pt-1 max-w-7xl mx-auto">
      <div className="flex justify-between mb-2">
        {/* Status Tabs - above the table for better UX */}
        <div className="flex items-center space-x-2 mb-0">
          <button
            className={`px-4 py-2 rounded font-medium transition-colors duration-150 ${
              statusFilter === "director_approved"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handleStatusTabClick("director_approved")}
          >
            For Approval
          </button>
          <button
            className={`px-4 py-2 rounded font-medium transition-colors duration-150 ${
              statusFilter === "hr_approved"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => handleStatusTabClick("hr_approved")}
          >
            Approved
          </button>
        </div>
        <h1 className="text-2xl font-bold text-center">Duty Schedule</h1>
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
                    {schedule?.status === "director_approved"
                      ? "For HR Approval"
                      : schedule?.status === "hr_approved"
                      ? "Approved"
                      : ""}
                  </td>
                  <td className="p-3 capitalize text-right">
                    {/* Print Button: Opens print-optimized view in new tab */}

                    {schedule?.status === "hr_approved" && (
                      <>
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
                      </>
                    )}

                    {schedule?.status === "director_approved" && (
                      <>
                        <button
                          onClick={() =>
                            handleViewDutySchedule(
                              schedule.department?._id,
                              schedule?._id
                            )
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          View
                        </button>
                      </>
                    )}
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

export default HrDutySchedule;
