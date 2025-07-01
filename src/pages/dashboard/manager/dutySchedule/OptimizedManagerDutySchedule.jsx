/**
 * Optimized Manager Duty Schedule Page
 *
 * This component demonstrates how to use the new shared components
 * and utilities to create a cleaner, more maintainable duty schedule page.
 *
 * @author HRIS Development Team
 * @version 2.0.0
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchManagedDepartments } from "../../../../store/Reducers/employeeReducer";
import {
  fetchDutySchedulesByDepartment,
  messageClear as dutyScheduleMessageClear,
} from "../../../../store/Reducers/dutyScheduleReducer";
import DutyScheduleHeader, {
  LoadingSpinner,
  EmptyState,
} from "../../../../components/dutySchedule/DutyScheduleHeader";
import { StatusBadge } from "../../../../components/dutySchedule/ApprovalActions";
import Search from "../../../../components/Search";
import Pagination from "../../../../components/Pagination";

/**
 * Department selector component
 */
const DepartmentSelector = ({
  departments,
  selectedDepartment,
  onDepartmentChange,
  loading = false,
}) => {
  if (!departments?.length) return null;

  return (
    <div className="mb-4">
      <label
        htmlFor="department-select"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Department
      </label>
      <select
        id="department-select"
        value={selectedDepartment}
        onChange={onDepartmentChange}
        disabled={loading}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
      >
        <option value="">Select a department</option>
        {departments.map((dept) => (
          <option key={dept._id} value={dept._id}>
            {dept.name}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * Duty schedule table component
 */
const DutyScheduleTable = ({
  schedules,
  onView,
  onEdit,
  onPrint,
  loading = false,
}) => {
  if (!schedules?.length) {
    return (
      <EmptyState
        message="No duty schedules found"
        action={{
          label: "Create New Schedule",
          onClick: () => {
            /* Handle create action */
          },
        }}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Schedule Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Period
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {schedules.map((schedule) => (
            <tr key={schedule._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {schedule.name}
                </div>
                <div className="text-sm text-gray-500">
                  {schedule.department?.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(schedule.startDate).toLocaleDateString()} -{" "}
                {new Date(schedule.endDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={schedule.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(schedule.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onView(schedule._id)}
                    className="text-blue-600 hover:text-blue-900"
                    disabled={loading}
                  >
                    View
                  </button>
                  {schedule.status === "draft" && (
                    <button
                      onClick={() => onEdit(schedule._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      disabled={loading}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => onPrint(schedule._id)}
                    className="text-green-600 hover:text-green-900"
                    disabled={loading}
                  >
                    Print
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Main Optimized Manager Duty Schedule Component
 */
const OptimizedManagerDutySchedule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { userInfo } = useSelector((state) => state.auth);
  const { employee: employeeId } = userInfo;
  const { managedDepartments } = useSelector((state) => state.employee);
  const {
    dutySchedules,
    totalDutySchedule,
    loading,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.dutySchedule);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerPage] = useState(5);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  /**
   * Initialize data on component mount
   */
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchManagedDepartments(employeeId));
    }
  }, [employeeId, dispatch]);

  /**
   * Reset page to 1 when search value changes
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  /**
   * Fetch duty schedules when dependencies change
   */
  useEffect(() => {
    if (selectedDepartment) {
      const params = {
        departmentId: selectedDepartment,
        page: currentPage,
        perPage,
        search: searchValue,
      };
      dispatch(fetchDutySchedulesByDepartment(params));
    }
  }, [selectedDepartment, currentPage, perPage, searchValue, dispatch]);

  /**
   * Handle success/error messages
   */
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(dutyScheduleMessageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(dutyScheduleMessageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  /**
   * Auto-select department if only one is managed
   */
  useEffect(() => {
    if (managedDepartments?.length === 1 && !selectedDepartment) {
      setSelectedDepartment(managedDepartments[0]._id);
    }
  }, [managedDepartments, selectedDepartment]);

  /**
   * Handle department selection change
   */
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  /**
   * Navigation handlers
   */
  const handleAddDutySchedule = () => {
    if (!selectedDepartment) {
      toast.error("Please select a department first");
      return;
    }
    navigate(`/dashboard/manager/duty-schedule/${selectedDepartment}/create`);
  };

  const handleEditDutySchedule = (scheduleId) => {
    navigate(
      `/dashboard/manager/duty-schedule/${selectedDepartment}/${scheduleId}/edit`
    );
  };

  const handleViewDutySchedule = (scheduleId) => {
    navigate(`/dashboard/manager/duty-schedule/${scheduleId}/details`);
  };

  const handlePrintDutySchedule = (scheduleId) => {
    navigate(`/dashboard/manager/duty-schedule/${scheduleId}/print`);
  };

  /**
   * Prepare header actions
   */
  const headerActions = [
    {
      key: "add",
      label: "Create New Schedule",
      onClick: handleAddDutySchedule,
      variant: "primary",
      disabled: !selectedDepartment || loading,
    },
  ];

  // Show loading if departments are not loaded yet
  if (!managedDepartments && loading) {
    return (
      <div className="min-h-screen bg-white p-4">
        <LoadingSpinner message="Loading your departments..." />
      </div>
    );
  }

  // Show message if no departments are managed
  if (managedDepartments?.length === 0) {
    return (
      <div className="min-h-screen bg-white p-4">
        <DutyScheduleHeader
          title="Duty Schedule Management"
          showBackButton={false}
        />
        <EmptyState message="You don't manage any departments. Please contact your administrator." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <DutyScheduleHeader
        title="Duty Schedule Management"
        subtitle="Manage duty schedules for your departments"
        showBackButton={false}
        actions={headerActions}
        loading={loading}
      />

      {/* Department Selector */}
      <DepartmentSelector
        departments={managedDepartments}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={handleDepartmentChange}
        loading={loading}
      />

      {/* Search and filters */}
      {selectedDepartment && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Search
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              placeholder="Search duty schedules..."
            />
          </div>
          <div className="sm:w-32">
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>
      )}

      {/* Duty Schedule Table */}
      {selectedDepartment ? (
        <>
          <DutyScheduleTable
            schedules={dutySchedules}
            onView={handleViewDutySchedule}
            onEdit={handleEditDutySchedule}
            onPrint={handlePrintDutySchedule}
            loading={loading}
          />

          {/* Pagination */}
          {totalDutySchedule > perPage && (
            <div className="mt-6">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={totalDutySchedule}
                perPage={perPage}
                showItem={Math.min(perPage, dutySchedules?.length || 0)}
              />
            </div>
          )}
        </>
      ) : (
        <EmptyState message="Please select a department to view duty schedules" />
      )}
    </div>
  );
};

export default OptimizedManagerDutySchedule;
