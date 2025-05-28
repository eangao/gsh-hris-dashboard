import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDutySchedules } from "../../store/Reducers/dutyScheduleReducer";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";

const DutySchedule = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);

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
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };

    dispatch(fetchDutySchedules(obj));
  }, [currentPage, perPage, searchValue, dispatch]);

  const handleAddDutySchedule = () => {
    if (role === "ADMIN") {
      navigate("/admin/dashboard/duty-schedule/add");
    } else if (role === "HR_MANAGER") {
      navigate("/hr/dashboard/duty-schedule/add");
    } else {
      // Optional: fallback if unauthorized role
      alert("You are not authorized to add duty schedule.");
    }
  };

  const handleEditDutySchedule = (scheduleId) => {
    if (role === "ADMIN") {
      navigate(`/admin/dashboard/duty-schedule/edit/${scheduleId}`);
    } else if (role === "HR_MANAGER") {
      navigate(`/hr/dashboard/duty-schedule/edit/${scheduleId}`);
    } else {
      alert("You are not authorized to edit employees.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-center">Duty Schedule</h1>
        <button
          onClick={handleAddDutySchedule}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Duty Schedule
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
                    <span className="capitalize">{schedule?.name},</span>
                  </td>
                  <td className="p-3 capitalize">
                    {schedule?.department?.name}
                  </td>

                  <td className="p-3 flex justify-center space-x-2">
                    {/* <button
                      onClick={() =>
                        navigate(
                          `/admin/dashboard/duty-schedule/details/${schedule?._id}`
                        )
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      disabled={loading}
                    >
                      View
                    </button> */}
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

export default DutySchedule;
