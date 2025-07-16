import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShiftTemplates,
  createShiftTemplate,
  updateShiftTemplate,
  deleteShiftTemplate,
  messageClear,
} from "../../../../store/Reducers/shiftTemplateReducer";
import toast from "react-hot-toast";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { buttonOverrideStyle } from "./../../../../utils/utils";
import Search from "./../../../../components/Search";
import Pagination from "./../../../../components/Pagination";
import { formatTimeTo12HourPH } from "../../../../utils/phDateUtils";

const shiftColors = [
  // Already Used — KEEP EXACTLY
  "bg-pink-300",
  "bg-blue-100",
  "bg-purple-100",
  "bg-green-200",
  "bg-teal-100",
  "bg-orange-100",
  "bg-cyan-200", // close to teal → use 200
  "bg-lime-100",
  "bg-red-100",
  "bg-yellow-100",

  // Other Unique or Differentiated Colors
  "bg-indigo-100",
  "bg-gray-100",
  "bg-rose-200", // close to red/pink → use 200
  "bg-violet-200", // close to purple → use 200
  "bg-fuchsia-300", // close to violet → use 300
  "bg-emerald-200", // close to green → use 200
  "bg-sky-200", // close to blue → use 200
  "bg-slate-200", // close to zinc/gray → use 200
];

const ShiftTemplates = () => {
  const dispatch = useDispatch();
  const {
    shiftTemplates,
    totalShiftTemplate,
    loading,
    errorMessage,
    successMessage,
  } = useSelector((state) => state.shiftTemplate);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  const initialFormData = {
    name: "",
    type: "Standard",

    //for standard office schedule
    morningIn: "",
    morningOut: "",
    afternoonIn: "",
    afternoonOut: "",

    //for shifting schedule
    startTime: "",
    endTime: "",
    isNightDifferential: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

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

    dispatch(fetchShiftTemplates(obj));
  }, [currentPage, perPage, searchValue, dispatch]);

  const getShiftTemplates = () => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(fetchShiftTemplates(obj));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      getShiftTemplates();
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getUniqueShiftColor = () => {
    const usedColors = shiftTemplates.map((ws) => ws.shiftColor);

    const availableColors = shiftColors.filter(
      (color) => !usedColors.includes(color)
    );
    return availableColors.length > 0 ? availableColors[0] : "bg-white";
  };

  const prepareFormDataForSubmit = (data) => {
    const isStandard = data.type === "Standard";
    if (isStandard) {
      return {
        ...data,
        morningIn: data.morningIn ? data.morningIn : "",
        morningOut: data.morningOut ? data.morningOut : "",
        afternoonIn: data.afternoonIn ? data.afternoonIn : "",
        afternoonOut: data.afternoonOut ? data.afternoonOut : "",
      };
    } else {
      return {
        ...data,
        startTime: data.startTime ? data.startTime : "",
        endTime: data.endTime ? data.endTime : "",
      };
    }
  };

  const mapScheduleForForm = (shift) => {
    if (!shift) return shift;
    if (shift.type === "Standard") {
      return {
        ...shift,
        morningIn: shift.morningIn ? shift.morningIn : "",
        morningOut: shift.morningOut ? shift.morningOut : "",
        afternoonIn: shift.afternoonIn ? shift.afternoonIn : "",
        afternoonOut: shift.afternoonOut ? shift.afternoonOut : "",
      };
    } else {
      return {
        ...shift,
        startTime: shift.startTime ? shift.startTime : "",
        endTime: shift.endTime ? shift.endTime : "",
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = prepareFormDataForSubmit(formData);
    if (formData._id) {
      dispatch(updateShiftTemplate(submitData));
    } else {
      const uniqueColor = getUniqueShiftColor();
      const newFormData = { ...submitData, shiftColor: uniqueColor };
      dispatch(createShiftTemplate(newFormData));
    }
  };

  const handleEdit = (schedule) => {
    setFormData(mapScheduleForForm(schedule));
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    dispatch(deleteShiftTemplate(deleteId));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const renderScheduleForm = () => {
    const isStandard = formData.type === "Standard";

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder={
                formData.type === "Standard"
                  ? "e.g., Office Schedule"
                  : formData.type === "Shifting"
                  ? "e.g., Shifting 1"
                  : ""
              }
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
              disabled={loading}
            >
              <option value="Standard">Standard (Office)</option>
              <option value="Shifting">Shifting</option>
            </select>
          </div>
        </div>

        {/* Standard Schedule Fields */}
        {isStandard && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Morning In
                </label>
                <input
                  type="time"
                  name="morningIn"
                  value={formData.morningIn}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Morning Out
                </label>
                <input
                  type="time"
                  name="morningOut"
                  value={formData.morningOut}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Afternoon In
                </label>
                <input
                  type="time"
                  name="afternoonIn"
                  value={formData.afternoonIn}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Afternoon Out
                </label>
                <input
                  type="time"
                  name="afternoonOut"
                  value={formData.afternoonOut}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Shifting Schedule Fields */}
        {!isStandard && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isNightDifferential"
                checked={formData.isNightDifferential}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
              />
              <label className="ml-2 text-sm text-gray-700">
                Night Differential
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading ? (
              <PropagateLoader color="#fff" cssOverride={buttonOverrideStyle} />
            ) : formData._id ? (
              "Update"
            ) : (
              "Add"
            )}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Shift Template Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
          disabled={loading}
        >
          Add Schedule
        </button>
      </div>

      <div className="mb-6">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder="Search Shift Template..."
        />
      </div>

      {/* Desktop Table View */}
      <div className="bg-white shadow rounded-lg overflow-hidden hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Schedule</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-3 text-center">
                  <PropagateLoader color="#4B5563" />
                </td>
              </tr>
            ) : shiftTemplates?.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-3 text-center text-gray-500">
                  No schedules found.
                </td>
              </tr>
            ) : (
              shiftTemplates?.map((shift) => (
                <tr key={shift._id} className="border-t">
                  <td className="p-3">{shift.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded ${
                        shift.status === "off"
                          ? ""
                          : shift.type === "Standard"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {shift.status === "off" ? "-" : shift.type}
                    </span>
                  </td>
                  <td className="p-3">
                    {shift.type === "Standard" ? (
                      <>
                        <div>
                          Morning: {formatTimeTo12HourPH(shift.morningIn)} -{" "}
                          {formatTimeTo12HourPH(shift.morningOut)}
                        </div>
                        <div>
                          Afternoon: {formatTimeTo12HourPH(shift.afternoonIn)} -{" "}
                          {formatTimeTo12HourPH(shift.afternoonOut)}
                        </div>
                      </>
                    ) : (
                      <>
                        {formatTimeTo12HourPH(shift.startTime)} -{" "}
                        {formatTimeTo12HourPH(shift.endTime)}
                        {shift.isNightDifferential && " (Night)"}
                      </>
                    )}
                  </td>

                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(shift)}
                      className={`bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 ${
                        shift.isSystemDefault
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={loading || shift.isSystemDefault}
                      title={
                        shift.isSystemDefault
                          ? "System default shifts cannot be edited"
                          : "Edit"
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(shift._id, shift.name)}
                      className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ${
                        shift.isSystemDefault
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={loading || shift.isSystemDefault}
                      title={
                        shift.isSystemDefault
                          ? "System default shifts cannot be deleted"
                          : "Delete"
                      }
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

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {loading ? (
          <div className="text-center py-4">
            <PropagateLoader color="#4B5563" />
          </div>
        ) : shiftTemplates?.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No schedules found.
          </div>
        ) : (
          shiftTemplates?.map((shift) => (
            <div
              key={shift._id}
              className="bg-white rounded-lg shadow p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{shift.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(shift)}
                    className={`bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 ${
                      shift.isSystemDefault
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={loading || shift.isSystemDefault}
                    title={
                      shift.isSystemDefault
                        ? "System default shifts cannot be edited"
                        : "Edit"
                    }
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm(shift._id, shift.name)}
                    className={`bg-red-500 text-white p-2 rounded hover:bg-red-600 ${
                      shift.isSystemDefault
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={loading || shift.isSystemDefault}
                    title={
                      shift.isSystemDefault
                        ? "System default shifts cannot be deleted"
                        : "Delete"
                    }
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded ${
                      shift.type === "Standard"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {shift.type}
                  </span>
                </div>
              </div>

              <div className="text-sm">
                <div className="text-gray-500 font-medium">Shift:</div>
                <div className="mt-1 space-y-1">
                  {shift.type === "Standard" ? (
                    <>
                      <div>
                        <span className="text-gray-600">Morning: </span>
                        {formatTimeTo12HourPH(shift.morningIn)} -{" "}
                        {formatTimeTo12HourPH(shift.morningOut)}
                      </div>
                      <div>
                        <span className="text-gray-600">Afternoon: </span>
                        {formatTimeTo12HourPH(shift.afternoonIn)} -{" "}
                        {formatTimeTo12HourPH(shift.afternoonOut)}
                      </div>
                    </>
                  ) : (
                    <div>
                      {formatTimeTo12HourPH(shift.startTime)} -{" "}
                      {formatTimeTo12HourPH(shift.endTime)}
                      {shift.isNightDifferential && (
                        <span className="text-blue-600 font-medium">
                          {" "}
                          (Night)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalShiftTemplate > perPage && (
        <div className="w-full flex justify-end mt-4 bottom-4 right-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalShiftTemplate}
            perPage={perPage}
            showItem={Math.min(5, Math.ceil(totalShiftTemplate / perPage))}
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {formData._id ? "Edit Schedule" : "Add Schedule"}
            </h2>
            {renderScheduleForm()}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete the shift template "{deleteName}"?
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteId(null)}
                className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={loading}
              >
                {loading ? (
                  <PropagateLoader
                    color="#fff"
                    cssOverride={buttonOverrideStyle}
                  />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftTemplates;
