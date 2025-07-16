import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchManagedDepartments } from "../../../../store/Reducers/employeeReducer";
import {
  fetchDutySchedulesByDepartment,
  messageClear,
} from "../../../../store/Reducers/dutyScheduleReducer";
import Search from "../../../../components/Search";
import Pagination from "../../../../components/Pagination";
import toast from "react-hot-toast";

const ManagerDutySchedule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.employee?._id;

  const { loading: managedDepartmentsLoading, managedDepartments } =
    useSelector((state) => state.employee);

  const {
    dutySchedules,
    totalDutySchedule,
    loading: dutyScheduleLoading,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.dutySchedule);

  const loading = managedDepartmentsLoading || dutyScheduleLoading;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRemarks, setModalRemarks] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  // Fetch managed departments
  useEffect(() => {
    dispatch(fetchManagedDepartments(employeeId));
  }, [employeeId, dispatch]);

  // Memoized fetch for schedules
  const getDutySchedulesByDepartment = useCallback(() => {
    dispatch(
      fetchDutySchedulesByDepartment({
        departmentId: selectedDepartment,
        perPage: parseInt(perPage),
        page: parseInt(currentPage),
        searchValue,
      })
    );
  }, [dispatch, selectedDepartment, perPage, currentPage, searchValue]);

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, currentPage]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    if (selectedDepartment) {
      getDutySchedulesByDepartment();
    }
  }, [selectedDepartment, getDutySchedulesByDepartment]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      getDutySchedulesByDepartment();
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, getDutySchedulesByDepartment]);

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

  // Set first department as selected and trigger handleDepartmentChange on first load
  useEffect(() => {
    if (
      managedDepartments &&
      managedDepartments.length > 0 &&
      !selectedDepartment
    ) {
      setSelectedDepartment(managedDepartments[0]._id);
      // Reset pagination when department changes
      setCurrentPage(1);
      setSearchValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managedDepartments]);

  // Handle department change
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    if (departmentId === "") {
      setSelectedDepartment("");
    } else {
      setSelectedDepartment(departmentId);
    }
    // Reset pagination and search when department changes
    setCurrentPage(1);
    setSearchValue("");
  };

  const handleAddDutySchedule = () => {
    if (selectedDepartment === "") {
      alert("Please select a department first.");
      return;
    }
    // Use departmentId in path param (no query string anymore)
    navigate(`/manager/duty-schedule/${selectedDepartment}/create`);
  };

  const handleEditDutySchedule = (scheduleId) => {
    if (!selectedDepartment) {
      alert("Please select a department first.");
      return;
    }
    // Pass both departmentId and scheduleId in path param
    navigate(`/manager/duty-schedule/${selectedDepartment}/edit/${scheduleId}`);
  };

  const handleViewDutySchedule = (
    departmentId,
    scheduleId,
    forApproval = false
  ) => {
    // Pass both departmentId and scheduleId in path param
    navigate(
      `/manager/duty-schedule/${departmentId}/view/${scheduleId}?forApproval=${forApproval}`
    );
  };

  const handlePrintDutySchedule = (departmentId, scheduleId) => {
    navigate(
      `/manager/duty-schedule/print/department/${departmentId}/schedule/${scheduleId}`
    );
  };

  // Only show schedules for selected department
  const filteredDutySchedules = selectedDepartment ? dutySchedules : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid mb-4"></div>
          </div>
        </div>
      ) : (
        <div>
          {/* If no managed departments, show message and do not render the rest of the page */}
          {!managedDepartments || managedDepartments.length === 0 ? (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="bg-white p-8 rounded shadow text-center">
                <h2 className="text-xl font-bold mb-2">
                  No Department Assigned
                </h2>
                <p className="text-gray-600">
                  You have no department assigned to manage yet.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Duty Schedule Management
                </h1>
                <div className="flex items-center space-x-4">
                  {/* Department Selection */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-600">
                      Department:
                    </label>
                    {managedDepartments && managedDepartments.length === 1 ? (
                      <span className="font-semibold px-4 py-2 bg-blue-100 text-blue-800 rounded-lg uppercase border">
                        {managedDepartments[0].name}
                      </span>
                    ) : (
                      <select
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase min-w-[150px]"
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                      >
                        <option value="">Select Department</option>
                        {managedDepartments.map((dept) => (
                          <option
                            key={dept._id}
                            value={dept._id}
                            className="uppercase"
                          >
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Create Button */}
                  <button
                    onClick={handleAddDutySchedule}
                    disabled={!selectedDepartment}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Create Schedule</span>
                  </button>
                </div>
              </div>

              {/* Search and Filters Section */}
              <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-4">
                    <Search
                      setPerpage={setPerpage}
                      setSearchValue={setSearchValue}
                      searchValue={searchValue}
                      inputPlaceholder="Search by schedule name..."
                    />
                  </div>

                  {/* Results Summary */}
                  <div className="text-sm text-gray-600">
                    {selectedDepartment && (
                      <span>
                        Showing {filteredDutySchedules?.length || 0} of{" "}
                        {totalDutySchedule} schedules
                        {searchValue && ` for "${searchValue}"`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Duty Schedule Table */}
              {!selectedDepartment ? (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Select a Department
                  </h3>
                  <p className="text-gray-500">
                    Please select a department to view its duty schedules.
                  </p>
                </div>
              ) : (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">
                            Schedule Name
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">
                            Department
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">
                            Status
                          </th>
                          <th className="p-4 text-right text-sm font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dutyScheduleLoading ? (
                          <tr>
                            <td colSpan="4" className="p-8 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                                <span className="text-gray-600">
                                  Loading schedules...
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : filteredDutySchedules?.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="p-8 text-center">
                              <div className="text-gray-400 mb-4">
                                <svg
                                  className="w-12 h-12 mx-auto"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                              <h3 className="text-lg font-medium text-gray-700 mb-2">
                                No Duty Schedules Found
                              </h3>
                              <p className="text-gray-500 mb-4">
                                {searchValue
                                  ? `No schedules found matching "${searchValue}"`
                                  : "No duty schedules have been created for this department yet."}
                              </p>
                              {!searchValue && (
                                <button
                                  onClick={handleAddDutySchedule}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Create First Schedule
                                </button>
                              )}
                            </td>
                          </tr>
                        ) : (
                          filteredDutySchedules?.map((schedule) => (
                            <tr
                              key={schedule?._id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="p-4">
                                <div className="font-medium text-gray-900 capitalize">
                                  {schedule?.name}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                  {schedule?.department?.name}
                                </span>
                              </td>
                              <td className="p-4">
                                {schedule?.status === "draft" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Draft
                                  </span>
                                ) : schedule?.status === "submitted" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    For Cluster Approval
                                  </span>
                                ) : schedule?.status === "director_approved" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    For HR Approval
                                  </span>
                                ) : schedule?.status === "hr_approved" ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Approved
                                  </span>
                                ) : schedule?.status === "director_rejected" ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Rejected By Cluster Head
                                    </span>
                                    {schedule?.directorApproval?.remarks && (
                                      <button
                                        type="button"
                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                        onClick={() => {
                                          setModalRemarks(
                                            schedule.directorApproval.remarks
                                          );
                                          setModalTitle(
                                            "Remarks from Cluster Head"
                                          );
                                          setModalOpen(true);
                                        }}
                                        aria-label="View Remarks"
                                      >
                                        <svg
                                          className="h-4 w-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                                          />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                ) : schedule?.status === "hr_rejected" ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Rejected By HR
                                    </span>
                                    {schedule?.hrApproval?.remarks && (
                                      <button
                                        type="button"
                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                        onClick={() => {
                                          setModalRemarks(
                                            schedule.hrApproval.remarks
                                          );
                                          setModalTitle("Remarks from HR");
                                          setModalOpen(true);
                                        }}
                                        aria-label="View Remarks"
                                      >
                                        <svg
                                          className="h-4 w-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                                          />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Unknown
                                  </span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end space-x-2">
                                  {schedule?.status === "draft" ||
                                  schedule?.status === "director_rejected" ||
                                  schedule?.status === "hr_rejected" ? (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleEditDutySchedule(schedule?._id)
                                        }
                                        className="bg-amber-500 text-white px-3 py-1 rounded-md text-sm hover:bg-amber-600 transition-colors"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleViewDutySchedule(
                                            schedule.department?._id,
                                            schedule?._id,
                                            true
                                          )
                                        }
                                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors"
                                      >
                                        Submit For Approval
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      {schedule?.status === "hr_approved" ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handlePrintDutySchedule(
                                              schedule.department?._id,
                                              schedule?._id
                                            )
                                          }
                                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                                          disabled={loading}
                                        >
                                          <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                            />
                                          </svg>
                                          <span>Print</span>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleViewDutySchedule(
                                              schedule.department?._id,
                                              schedule?._id,
                                              false
                                            )
                                          }
                                          className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors flex items-center space-x-1"
                                          disabled={loading}
                                        >
                                          <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                          </svg>
                                          <span>View</span>
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {selectedDepartment && totalDutySchedule > perPage && (
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white px-4 py-3 rounded-lg shadow-sm border">
                  <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * perPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * perPage, totalDutySchedule)}
                    </span>{" "}
                    of <span className="font-medium">{totalDutySchedule}</span>{" "}
                    results
                  </div>
                  <div className="flex justify-center sm:justify-end">
                    <Pagination
                      pageNumber={currentPage}
                      setPageNumber={setCurrentPage}
                      totalItem={totalDutySchedule}
                      perPage={perPage}
                      showItem={Math.min(
                        5,
                        Math.ceil(totalDutySchedule / perPage)
                      )}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Enhanced Modal for remarks */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span>{modalTitle}</span>
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-800 whitespace-pre-line break-words leading-relaxed">
                  {modalRemarks}
                </p>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t bg-gray-50">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDutySchedule;
