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
    if (!employeeId) return;

    dispatch(fetchManagedDepartments(employeeId));
  }, [employeeId, dispatch]);

  // Memoized fetch for schedules
  const getDutySchedulesByDepartment = useCallback(() => {
    if (!selectedDepartment) return;

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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading duty schedules...</p>
          </div>
        </div>
      ) : (
        <div>
          {/* If no managed departments, show enhanced message */}
          {!managedDepartments || managedDepartments.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 text-center max-w-md">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  No Department Assigned
                </h2>
                <p className="text-gray-600">
                  You currently have no department assigned to manage. Please
                  contact your administrator to assign department management
                  permissions.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Professional Header with Gradient Background */}
              <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-4 sm:p-6 text-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2 truncate flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      Duty Schedule Management
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base">
                      Create, manage, and track duty schedules for your
                      departments
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Department Selection */}
                    <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2 min-w-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 flex-shrink-0 text-blue-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <label className="text-xs font-medium text-blue-200 block">
                          Department:
                        </label>
                        {managedDepartments &&
                        managedDepartments.length === 1 ? (
                          <span className="font-semibold text-white uppercase text-sm truncate block">
                            {managedDepartments[0].name}
                          </span>
                        ) : (
                          <select
                            className="bg-transparent border-0 text-white font-semibold uppercase text-sm focus:outline-none focus:ring-0 p-0 min-w-0 truncate"
                            value={selectedDepartment}
                            onChange={handleDepartmentChange}
                          >
                            <option value="" className="text-gray-800">
                              Select Department
                            </option>
                            {managedDepartments.map((dept) => (
                              <option
                                key={dept._id}
                                value={dept._id}
                                className="text-gray-800 uppercase"
                              >
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Decorative Icon - Matching HrEmployees style */}
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
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>

                    {/* Create Button - Updated to match HrEmployees style */}
                    <button
                      onClick={handleAddDutySchedule}
                      disabled={!selectedDepartment}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white/20 disabled:bg-white/10 disabled:border-white/10 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 hover:shadow-lg text-sm sm:text-base"
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
                      <span className="hidden sm:inline">Create Schedule</span>
                      <span className="sm:hidden">Create</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Search and Filters Section - Updated to match HrEmployees */}
              <div className="mb-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Search
                      setPerpage={setPerpage}
                      setSearchValue={setSearchValue}
                      searchValue={searchValue}
                      inputPlaceholder="Search by schedule name..."
                      perPage={perPage}
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Empty State */}
              {!selectedDepartment ? (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-8 text-center">
                  <div className="text-blue-400 mb-4">
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
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Select a Department
                  </h3>
                  <p className="text-blue-600">
                    Please select a department from the header to view and
                    manage its duty schedules.
                  </p>
                </div>
              ) : (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                  {/* Mobile Card View - show on small/medium screens */}
                  <div className="lg:hidden">
                    {dutyScheduleLoading ? (
                      <div className="p-8 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                          <span className="text-gray-600">
                            Loading schedules...
                          </span>
                        </div>
                      </div>
                    ) : filteredDutySchedules?.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="text-blue-400 mb-4">
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No duty schedules found
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {searchValue
                            ? `No schedules found matching "${searchValue}"`
                            : "No duty schedules have been created for this department yet."}
                        </p>
                        {!searchValue && (
                          <button
                            onClick={handleAddDutySchedule}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-flex items-center gap-2"
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Create First Schedule
                          </button>
                        )}
                      </div>
                    ) : (
                      filteredDutySchedules?.map((schedule) => (
                        <div
                          key={schedule?._id}
                          className="p-4 border-b border-gray-200 last:border-b-0"
                        >
                          {/* Mobile Card Header */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900  uppercase text-sm truncate">
                                    {schedule?.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 text-blue-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                      />
                                    </svg>
                                    <span className="text-sm text-blue-700 font-medium uppercase">
                                      {schedule?.department?.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {/* Status Badge */}
                              <div className="flex-shrink-0">
                                {schedule?.status === "draft" ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                                      <path
                                        fillRule="evenodd"
                                        d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Draft
                                  </span>
                                ) : schedule?.status === "submitted" ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    For Cluster Approval
                                  </span>
                                ) : schedule?.status === "director_approved" ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    For HR Approval
                                  </span>
                                ) : schedule?.status === "hr_approved" ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Approved
                                  </span>
                                ) : schedule?.status === "director_rejected" ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      <svg
                                        className="w-3 h-3 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      Rejected By Cluster
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
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      <svg
                                        className="w-3 h-3 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
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
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Unknown
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Mobile Card Actions */}
                          <div className="flex flex-wrap gap-2">
                            {schedule?.status === "draft" ||
                            schedule?.status === "director_rejected" ||
                            schedule?.status === "hr_rejected" ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleEditDutySchedule(schedule?._id)
                                  }
                                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center gap-2 flex-1 justify-center"
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
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
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
                                  className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-4 py-2 rounded-lg text-sm hover:from-green-700 hover:to-emerald-800 transition-all duration-200 flex items-center gap-2 flex-1 justify-center"
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
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
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
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2 flex-1 justify-center"
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
                                    Print Schedule
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
                                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center gap-2 flex-1 justify-center"
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
                                    View Schedule
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Desktop Table View - show on large screens */}
                  <div className="hidden lg:block">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-gray-200">
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                              Schedule Name
                            </div>
                          </th>
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">
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
                          <th className="p-4 text-left text-sm font-semibold text-gray-700">
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
                              <div className="text-blue-400 mb-4">
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
                              <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No duty schedules found
                              </h3>
                              <p className="text-gray-500 mb-4">
                                {searchValue
                                  ? `No schedules found matching "${searchValue}"`
                                  : "No duty schedules have been created for this department yet."}
                              </p>
                              {!searchValue && (
                                <button
                                  onClick={handleAddDutySchedule}
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-flex items-center gap-2"
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
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                  </svg>
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
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-blue-700"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                      />
                                    </svg>
                                  </div>
                                  <div className="font-semibold text-gray-900 capitalize">
                                    {schedule?.name}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <div className="font-bold text-gray-900 uppercase tracking-wide text-xs">
                                    {schedule?.department?.name}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                {/* Enhanced Status badges with icons */}
                                {schedule?.status === "draft" ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                                      <path
                                        fillRule="evenodd"
                                        d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Draft
                                  </span>
                                ) : schedule?.status === "submitted" ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    For Cluster Approval
                                  </span>
                                ) : schedule?.status === "director_approved" ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    For HR Approval
                                  </span>
                                ) : schedule?.status === "hr_approved" ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Approved
                                  </span>
                                ) : schedule?.status === "director_rejected" ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      <svg
                                        className="w-3 h-3 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
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
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      <svg
                                        className="w-3 h-3 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
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
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Unknown
                                  </span>
                                )}
                              </td>
                              <td className="p-4">
                                <div className="flex justify-center space-x-2">
                                  {schedule?.status === "draft" ||
                                  schedule?.status === "director_rejected" ||
                                  schedule?.status === "hr_rejected" ? (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleEditDutySchedule(schedule?._id)
                                        }
                                        className="inline-flex items-center px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                                      >
                                        <svg
                                          className="w-4 h-4 mr-1.5"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                          />
                                        </svg>
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
                                        className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border border-green-200 hover:border-green-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                                      >
                                        <svg
                                          className="w-4 h-4 mr-1.5"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        Submit
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
                                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 border border-blue-200 hover:border-blue-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                                          disabled={loading}
                                        >
                                          <svg
                                            className="w-4 h-4 mr-1.5"
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
                                          Print
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
                                          className="inline-flex items-center px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                                          disabled={loading}
                                        >
                                          <svg
                                            className="w-4 h-4 mr-1.5"
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
                                          View
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

              {/* Enhanced Pagination */}
              {selectedDepartment && totalDutySchedule > perPage && (
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
                            {dutySchedules.length === 0
                              ? 0
                              : (currentPage - 1) * perPage + 1}
                          </span>{" "}
                          to{" "}
                          <span className="font-medium text-blue-700">
                            {Math.min(currentPage * perPage, totalDutySchedule)}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium text-blue-700">
                            {totalDutySchedule}
                          </span>{" "}
                          schedules
                        </span>
                      </div>
                    </div>

                    {/* Page Navigation */}
                    <div className="flex items-center justify-center sm:justify-end">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 hidden sm:block">
                          Page {currentPage} of{" "}
                          {Math.ceil(totalDutySchedule / perPage)}
                        </span>
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
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
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
                </div>
                <span>{modalTitle}</span>
              </h2>
              <button
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 p-2 rounded-lg"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-800 whitespace-pre-line break-words leading-relaxed">
                  {modalRemarks}
                </p>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t bg-gray-50">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium"
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
