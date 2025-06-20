import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  messageClear,
  hrApproval,
} from "../../../../store/Reducers/dutyScheduleReducer";
import toast from "react-hot-toast";

import { fetchHrDutySchedulesByStatus } from "../../../../store/Reducers/dutyScheduleReducer";
import Search from "../../../../components/Search";
import Pagination from "../../../../components/Pagination";

const HrDutySchedule = () => {
  const dispatch = useDispatch();

  const { dutySchedules, totalDutySchedule, loading } = useSelector(
    (state) => state.dutySchedule
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);
  const [remarksModal, setRemarksModal] = useState({
    open: false,
    scheduleId: null,
  });
  const [remarks, setRemarks] = useState("");
  const { successMessage, errorMessage } = useSelector(
    (state) => state.dutySchedule
  );
  const [statusFilter, setStatusFilter] = useState("pending_hr_approval");

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

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setRemarksModal({ open: false, scheduleId: null });
      setRemarks("");

      // Optionally, refetch schedules here
      dispatch(
        fetchHrDutySchedulesByStatus({
          perPage: parseInt(perPage),
          page: parseInt(currentPage),
          searchValue,
          statusFilter, // Pass status to thunk
        })
      );
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  // Handler for status tab click
  const handleStatusTabClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on tab change
  };

  // Rename handler for HR approval
  const handleHrApproval = (scheduleId) => {
    dispatch(hrApproval({ id: scheduleId, action: "approve" }));
  };

  const handleRejectDutySchedule = (scheduleId) => {
    setRemarksModal({ open: true, scheduleId });
  };

  const handleSubmitRejection = () => {
    if (!remarks.trim()) {
      toast.error("Remarks are required for rejection.");
      return;
    }
    dispatch(
      hrApproval({
        id: remarksModal.scheduleId,
        action: "reject",
        remarks,
      })
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-center">Duty Schedule</h1>
      </div>
      {/* Status Tabs - above the table for better UX */}
      <div className="flex items-center space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded font-medium transition-colors duration-150 ${
            statusFilter === "pending_hr_approval"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => handleStatusTabClick("pending_hr_approval")}
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
                  <td className="p-3 capitalize">{schedule?.status}</td>
                  {schedule?.status === "director_approved" ? (
                    <td className="p-3 flex justify-end space-x-2">
                      <button
                        onClick={() => handleRejectDutySchedule(schedule?._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleHrApproval(schedule?._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                    </td>
                  ) : (
                    ""
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Remarks Modal for Rejection */}
      {remarksModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-2 text-red-600">
              Reject Duty Schedule
            </h2>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={4}
              placeholder="Enter remarks (required)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setRemarksModal({ open: false, scheduleId: null });
                  setRemarks("");
                }}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRejection}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}

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
