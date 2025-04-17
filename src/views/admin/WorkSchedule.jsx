import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkSchedules,
  createWorkSchedule,
  updateWorkSchedule,
  deleteWorkSchedule,
  messageClear,
} from "../../store/Reducers/workScheduleReducer";
import DaysOfWeekSelector from "../components/DaysOfWeekSelector ";
import Search from "../components/Search";
import toast from "react-hot-toast";
import Pagination from "../components/Pagination";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { buttonOverrideStyle } from "../../utils/utils";

const WorkSchedule = () => {
  const [daysOfWeek, setDaysOfWeek] = useState([]);

  const dispatch = useDispatch();
  const { schedules, totalSchedule, loading, errorMessage, successMessage } =
    useSelector((state) => state.workSchedule);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  useEffect(() => {
    // Reset to page 1 if searchValue is not empty
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1); // Reset page to 1 when a search is triggered
    }

    getWorkSchedules();
  }, [searchValue, currentPage, perPage, dispatch]);

  const getWorkSchedules = () => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };

    dispatch(fetchWorkSchedules(obj));
  };

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    daysOfWeek: "",
    startTime: "",
    endTime: "",
    description: "",
    status: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  useEffect(() => {
    dispatch(fetchWorkSchedules());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);

      getWorkSchedules();

      setIsModalOpen(false);
      setDeleteId(null);

      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData._id) {
      dispatch(updateWorkSchedule(formData));
    } else {
      dispatch(createWorkSchedule(formData));
    }
  };

  const handleEdit = (schedule) => {
    setFormData(schedule);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    dispatch(deleteWorkSchedule(deleteId));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      daysOfWeek: "",
      startTime: "",
      endTime: "",
      description: "",
      status: "",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/*  Header and Add  Work Schedule  */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold  text-center">
          Work Schedule Management
        </h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Add Schedule
        </button>
      </div>

      {/* Search  */}

      <div className=" mb-4">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder={"Search Work Schedule..."}
        />
      </div>
      {/* Schedules Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Days of Week</th>
              <th className="p-3">Time Range</th>
              <th className="p-3">Description</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-3 text-center">
                  Loading...
                </td>
              </tr>
            ) : schedules.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No schedules found.
                </td>
              </tr>
            ) : (
              schedules?.map((schedule) => (
                <tr key={schedule.id} className="border-t">
                  <td className="p-3">{schedule.name}</td>
                  <td className="p-3">{schedule.daysOfWeek}</td>
                  <td className="p-3">
                    {schedule.startTime} - {schedule.endTime}
                  </td>
                  <td className="p-3">{schedule.description}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        schedule.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {schedule.status}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      disabled={loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteConfirm(schedule.id, schedule.name)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      disabled={loading}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination  */}
      {totalSchedule <= perPage ? (
        ""
      ) : (
        <div className="w-full flex justify-end mt-4 bottom-4 right-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalSchedule}
            perPage={perPage}
            showItem={Math.min(5, Math.ceil(totalSchedule / perPage))}
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {formData.id ? "Edit Schedule" : "Add Schedule"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Morning Shift"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Days of the Week
                </label>
                <DaysOfWeekSelector
                  selectedDays={daysOfWeek}
                  onChange={setDaysOfWeek}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mt-1"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mt-1"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Additional details"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  rows="3"
                  disabled={loading}
                />
              </div>

              {formData.id ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mt-1"
                    required
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              ) : (
                ""
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading ? true : false}
                  className={`bg-blue-500 w-[100px] text-white px-4 py-2 rounded ${
                    loading ? "" : " hover:bg-blue-600"
                  } overflow-hidden`}
                >
                  {loading ? (
                    <PropagateLoader
                      color="#fff"
                      cssOverride={buttonOverrideStyle}
                    />
                  ) : formData._id ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this schedule?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Loading..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkSchedule;
