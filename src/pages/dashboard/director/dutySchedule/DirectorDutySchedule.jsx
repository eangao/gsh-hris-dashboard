import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  directorApproval,
  messageClear,
} from "../../../../store/Reducers/dutyScheduleReducer";
import toast from "react-hot-toast";

import { fetchManagedCluster } from "../../../../store/Reducers/employeeReducer";
import { fetchDutySchedulesForDirectorApprovalByCluster } from "../../../../store/Reducers/dutyScheduleReducer";
import Search from "../../../../components/Search";
import Pagination from "../../../../components/Pagination";
import { useNavigate } from "react-router-dom";

const DirectorDutySchedule = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { employee: employeeId } = userInfo;

  const { managedCluster } = useSelector((state) => state.employee);

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

  useEffect(() => {
    dispatch(fetchManagedCluster(employeeId)); // fetch managed cluster for this director
  }, [employeeId, dispatch]);

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, currentPage]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    if (managedCluster && managedCluster._id) {
      dispatch(
        fetchDutySchedulesForDirectorApprovalByCluster({
          clusterId: managedCluster._id,
          perPage: parseInt(perPage),
          page: parseInt(currentPage),
          searchValue,
        })
      );
    }
  }, [currentPage, perPage, searchValue, managedCluster, dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setRemarksModal({ open: false, scheduleId: null });
      setRemarks("");
      // Optionally, refetch schedules here
      if (managedCluster && managedCluster._id) {
        dispatch(
          fetchDutySchedulesForDirectorApprovalByCluster({
            clusterId: managedCluster._id,
            perPage: parseInt(perPage),
            page: parseInt(currentPage),
            searchValue,
          })
        );
      }
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const handleViewDutySchedule = (departmentId, scheduleId) => {
    // Pass both departmentId and scheduleId in path param
    navigate(`/director/duty-schedule/${departmentId}/view/${scheduleId}`);
  };

  // If no managed cluster, show message and do not render the rest of the page
  if (!managedCluster) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">No Cluster Assigned</h2>
          <p className="text-gray-600">
            You have no cluster assigned to manage yet.
          </p>
        </div>
      </div>
    );
  }

  const handleDirectorApproval = (scheduleId) => {
    dispatch(directorApproval({ id: scheduleId, action: "approve" }));
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
      directorApproval({
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
                  <td className="p-3 capitalize">{schedule?.status}</td>
                  <td className="p-3 capitalize text-right">
                    {schedule?.status === "submitted" && (
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

export default DirectorDutySchedule;
