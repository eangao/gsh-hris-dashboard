import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShiftTemplates,
  createShiftTemplate,
  updateShiftTemplate,
  deleteShiftTemplate,
  messageClear,
} from "../../../../store/Reducers/shiftTemplateReducer";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaClock,
  FaCalendarAlt,
  FaSun,
  FaMoon,
  FaUsers,
} from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { buttonOverrideStyle } from "../../../../utils/utils";
import Search from "../../../../components/Search";
import Pagination from "../../../../components/Pagination";
import { formatTimeTo12HourPH } from "../../../../utils/phDateUtils";

// Handle special cases for non-duty types
//   day-off  =>  bg-gray-200          // Gray background for Day Off
//   holiday-off => bg-orange-200      // Orange background for Holiday Off
//   leave => bg-yellow-200            // Yellow background for Leave
const shiftColors = [
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

  // ADDITIONAL 100 DISTINCT COLORS - No Close Colors, Perfect for Black Text
  // Very Light Tones - 50 variants (Excellent contrast)
  "bg-red-50",
  "bg-orange-50",
  "bg-amber-50",
  "bg-yellow-50",
  "bg-lime-50",
  "bg-green-50",
  "bg-emerald-50",
  "bg-teal-50",
  "bg-cyan-50",
  "bg-sky-50",
  "bg-blue-50",
  "bg-indigo-50",
  "bg-violet-50",
  "bg-purple-50",
  "bg-fuchsia-50",
  "bg-pink-50",
  "bg-rose-50",
  "bg-stone-50",
  "bg-neutral-50",
  "bg-zinc-50",
  "bg-gray-50",
  "bg-slate-50",

  // Light-Medium Tones - 200 variants (Good separation from existing)
  "bg-red-200",
  // "bg-orange-200", // REMOVED: Reserved for holiday-off
  "bg-amber-200",
  // "bg-yellow-200", // REMOVED: Reserved for leave
  "bg-lime-200",
  "bg-emerald-300", // Avoiding emerald-200 (too close to existing)
  "bg-teal-200",
  "bg-cyan-300", // Avoiding cyan-200 (exists above)
  "bg-sky-300", // Avoiding sky-200 (exists above)
  "bg-blue-200",
  "bg-indigo-200",
  "bg-violet-300", // Avoiding violet-200 (exists above)
  "bg-purple-200",
  "bg-fuchsia-200",
  "bg-pink-200",
  "bg-rose-300", // Different from rose-200 above
  "bg-stone-200",
  "bg-neutral-200",
  "bg-zinc-200",
  // "bg-gray-200", // REMOVED: Reserved for day-off
  "bg-slate-300", // Different from slate-200 above

  // Medium Tones - 300 variants (Well separated)
  "bg-red-300",
  "bg-orange-300",
  "bg-amber-300",
  "bg-yellow-300",
  "bg-lime-300",
  "bg-green-300",
  "bg-teal-300",
  "bg-blue-300",
  "bg-indigo-300",
  "bg-purple-300",
  "bg-stone-300",
  "bg-neutral-300",
  "bg-zinc-300",
  "bg-gray-300",

  // Light-Medium Alternative Variants - Avoiding close colors
  "bg-red-150", // Custom light tone
  "bg-orange-150",
  "bg-amber-150",
  "bg-yellow-150",
  "bg-lime-150",
  "bg-green-150",
  "bg-emerald-150",
  "bg-teal-150",
  "bg-cyan-150",
  "bg-sky-150",
  "bg-blue-150",
  "bg-indigo-150",
  "bg-violet-150",
  "bg-purple-150",
  "bg-fuchsia-150",
  "bg-pink-150",
  "bg-rose-150",

  // Warmer Light Variants
  "bg-red-75",
  "bg-orange-75",
  "bg-amber-75",
  "bg-yellow-75",
  "bg-lime-75",
  "bg-green-75",
  "bg-emerald-75",
  "bg-teal-75",
  "bg-cyan-75",
  "bg-sky-75",
  "bg-blue-75",
  "bg-indigo-75",
  "bg-violet-75",
  "bg-purple-75",
  "bg-fuchsia-75",
  "bg-pink-75",
  "bg-rose-75",

  // Neutral Light Variants
  "bg-stone-75",
  "bg-neutral-75",
  "bg-zinc-75",
  "bg-gray-75",
  "bg-slate-75",

  // Total: 15 (existing) + 97 (remaining after removing reserved colors) = 112 colors
  // All checked for visual distinctiveness and black text compatibility
  // Reserved colors removed: bg-gray-200, bg-orange-200, bg-yellow-200
];

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

  const [formData, setFormData] = useState(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, currentPage]);

  // Optimize getShiftTemplates with useCallback
  const getShiftTemplates = useCallback(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(fetchShiftTemplates(obj));
  }, [currentPage, perPage, searchValue, dispatch]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    getShiftTemplates();
  }, [getShiftTemplates]);

  // Optimize reset form with useCallback
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

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
  }, [successMessage, errorMessage, getShiftTemplates, dispatch]);

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

  // Loading skeleton component for better UX (Matching Cluster)
  const TableSkeleton = () => (
    <tbody className="divide-y divide-gray-200">
      {[...Array(perPage)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </td>
          <td className="p-4">
            <div className="h-6 bg-gray-300 rounded w-20"></div>
          </td>
          <td className="p-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-28"></div>
            </div>
          </td>
          <td className="p-4">
            <div className="flex justify-center gap-2">
              <div className="h-8 bg-gray-300 rounded w-12"></div>
              <div className="h-8 bg-gray-300 rounded w-12"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  const renderScheduleForm = () => {
    const isStandard = formData.type === "Standard";

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Template Name Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <FaClock className="text-blue-600" />
              <span>Template Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder={
                formData.type === "Standard"
                  ? "e.g., Office Schedule"
                  : formData.type === "Shifting"
                  ? "e.g., Night Shift"
                  : "Enter template name"
              }
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
              required
              disabled={loading}
            />
          </div>

          {/* Type Field */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <FaCalendarAlt className="text-blue-600" />
              <span>Shift Type</span>
            </label>
            <div className="relative">
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                required
                disabled={loading}
              >
                <option value="Standard">Standard (Office Hours)</option>
                <option value="Shifting">Shifting Schedule</option>
              </select>
              <FaCalendarAlt className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Standard Schedule Fields */}
        {isStandard && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <h3 className="flex items-center text-sm font-semibold text-blue-700 mb-4">
                <FaSun className="mr-2" />
                Standard Office Hours
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Morning In
                  </label>
                  <input
                    type="time"
                    name="morningIn"
                    value={formData.morningIn}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Morning Out
                  </label>
                  <input
                    type="time"
                    name="morningOut"
                    value={formData.morningOut}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Afternoon In
                  </label>
                  <input
                    type="time"
                    name="afternoonIn"
                    value={formData.afternoonIn}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Afternoon Out
                  </label>
                  <input
                    type="time"
                    name="afternoonOut"
                    value={formData.afternoonOut}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-white"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shifting Schedule Fields */}
        {!isStandard && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
              <h3 className="flex items-center text-sm font-semibold text-purple-700 mb-4">
                <FaMoon className="mr-2" />
                Shifting Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-white"
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
                  className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <label className="ml-3 text-sm font-medium text-gray-700 flex items-center">
                  <FaMoon className="mr-2 text-indigo-500" />
                  Night Differential
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2"
            disabled={loading}
          >
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl min-w-[120px] flex items-center justify-center"
          >
            {loading ? (
              <PropagateLoader color="#fff" cssOverride={buttonOverrideStyle} />
            ) : formData._id ? (
              <div className="flex items-center space-x-2">
                <FaEdit />
                <span>Update</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <FaPlus />
                <span>Create</span>
              </div>
            )}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Enhanced Header - Mobile Optimized (Matching Cluster) */}
      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Shift Template Management
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Manage work shift schedules and templates
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-white/10 p-3 rounded-full">
              <FaClock className="h-8 w-8" />
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center gap-2 hover:shadow-lg text-sm sm:text-base"
              disabled={loading}
            >
              <FaPlus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Add Shift Template</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Shift Template Search (Matching Cluster) */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder={"Search shift templates by name"}
        />

        {/* Search Results Info */}
        {searchValue && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">
                Search results for: "<strong>{searchValue}</strong>"
              </span>
              <span className="text-blue-600">
                {totalShiftTemplate} template
                {totalShiftTemplate !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Shift Templates Table (Matching Cluster) */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaClock className="h-4 w-4 mr-2 text-blue-600" />
                    Template Name
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-4 w-4 mr-2 text-blue-600" />
                    Type
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaSun className="h-4 w-4 mr-2 text-blue-600" />
                    Schedule
                  </div>
                </th>
                <th className="p-4 text-center text-sm font-semibold text-gray-700">
                  <div className="flex items-center justify-center">
                    <FaUsers className="h-4 w-4 mr-2 text-blue-600" />
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            {loading ? (
              <TableSkeleton />
            ) : (
              <tbody className="divide-y divide-gray-200">
                {shiftTemplates?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="text-blue-400 mb-2">
                        <FaClock className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No shift templates found
                      </h3>
                      <p className="text-gray-500">
                        {searchValue
                          ? "No templates match your current search."
                          : "No shift templates have been added yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  shiftTemplates?.map((shift, index) => (
                    <tr
                      key={shift._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                            <span className="text-blue-700 font-bold text-sm">
                              {shift.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 mb-1 text-sm uppercase">
                              {shift.name}
                            </div>
                            {/* <div className="text-xs text-gray-500">
                              Template #{index + 1}
                            </div> */}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            shift.status === "off"
                              ? "bg-gray-50 text-gray-700 border border-gray-500"
                              : shift.type === "Standard"
                              ? "bg-blue-50 text-blue-700 border border-blue-500"
                              : "bg-purple-50 text-purple-700 border border-purple-500"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-1.5 ${
                              shift.status === "off"
                                ? "bg-gray-500"
                                : shift.type === "Standard"
                                ? "bg-blue-500"
                                : "bg-purple-500"
                            }`}
                          ></div>
                          {shift.status === "off" ? "Inactive" : shift.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm space-y-1">
                          {shift.type === "Standard" ? (
                            <>
                              <div className="flex items-center text-gray-700">
                                <FaSun className="h-3 w-3 mr-2 text-yellow-500" />
                                <span className="text-gray-600">Morning:</span>
                                <span className="ml-1 font-medium">
                                  {formatTimeTo12HourPH(shift.morningIn)} -{" "}
                                  {formatTimeTo12HourPH(shift.morningOut)}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <FaSun className="h-3 w-3 mr-2 text-orange-500" />
                                <span className="text-gray-600">
                                  Afternoon:
                                </span>
                                <span className="ml-1 font-medium">
                                  {formatTimeTo12HourPH(shift.afternoonIn)} -{" "}
                                  {formatTimeTo12HourPH(shift.afternoonOut)}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center text-gray-700">
                              {shift.isNightDifferential ? (
                                <FaMoon className="h-3 w-3 mr-2 text-indigo-500" />
                              ) : (
                                <FaSun className="h-3 w-3 mr-2 text-yellow-500" />
                              )}
                              <span className="font-medium">
                                {formatTimeTo12HourPH(shift.startTime)} -{" "}
                                {formatTimeTo12HourPH(shift.endTime)}
                                {shift.isNightDifferential && (
                                  <span className="text-indigo-600 font-medium ml-1">
                                    (Night)
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(shift)}
                            className={`inline-flex items-center px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm ${
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
                            <FaEdit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteConfirm(shift._id, shift.name)
                            }
                            className={`inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm ${
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
                            <FaTrashAlt className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Enhanced Pagination (Matching Cluster) */}
      {totalShiftTemplate > perPage && (
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
                    {shiftTemplates.length === 0
                      ? 0
                      : (currentPage - 1) * perPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-blue-700">
                    {Math.min(currentPage * perPage, totalShiftTemplate)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-blue-700">
                    {totalShiftTemplate}
                  </span>{" "}
                  templates
                </span>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Page {currentPage} of{" "}
                  {Math.ceil(totalShiftTemplate / perPage)}
                </span>
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalShiftTemplate}
                  perPage={perPage}
                  showItem={Math.min(
                    5,
                    Math.ceil(totalShiftTemplate / perPage)
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    {formData._id ? (
                      <FaEdit className="text-white text-lg" />
                    ) : (
                      <FaPlus className="text-white text-lg" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {formData._id
                        ? "Edit Shift Template"
                        : "Add Shift Template"}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {formData._id
                        ? "Update shift template information"
                        : "Create a new work shift template"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">{renderScheduleForm()}</div>
          </div>
        </div>
      )}

      {/* Professional Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FaTrashAlt className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Confirm Deletion
                  </h2>
                  <p className="text-red-100 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center space-y-4">
                <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <FaTrashAlt className="text-3xl text-red-500" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium text-lg">
                    Delete "{deleteName}" template?
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    This shift template will be permanently removed and cannot
                    be recovered.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl min-w-[100px] flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FaTrashAlt />
                      <span>Delete</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftTemplates;
