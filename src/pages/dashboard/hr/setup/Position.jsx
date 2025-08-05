import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPositions,
  createPosition,
  updatePosition,
  deletePosition,
  messageClear,
} from "../../../../store/Reducers/positionReducer";

import Pagination from "../../../../components/Pagination";
import Search from "../../../../components/Search";

import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaBriefcase,
  FaLayerGroup,
  FaFileAlt,
  FaUsers,
} from "react-icons/fa";

import { buttonOverrideStyle } from "../../../../utils/utils";
import { PropagateLoader } from "react-spinners";

const Position = () => {
  const dispatch = useDispatch();

  const { positions, totalPosition, loading, successMessage, errorMessage } =
    useSelector((state) => state.position);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, currentPage]);

  // Optimize getPositions with useCallback
  const getPositions = useCallback(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(fetchPositions(obj));
  }, [currentPage, perPage, searchValue, dispatch]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    getPositions();
  }, [getPositions]);

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    level: "",
    description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  // Optimize reset form with useCallback
  const resetForm = useCallback(() => {
    setFormData({
      _id: null,
      name: "",
      level: "",
      description: "",
    });
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      getPositions();
      setIsModalOpen(false);
      setDeleteId(null);
      resetForm();
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, getPositions, resetForm, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData._id) {
      dispatch(updatePosition(formData));
    } else {
      dispatch(createPosition(formData));
    }
  };

  const handleEdit = (position) => {
    setFormData(position);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    dispatch(deletePosition(deleteId));
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Enhanced Header - Mobile Optimized (Matching Cluster.jsx) */}
      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Position Management
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Manage organizational positions and hierarchy levels
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-white/10 p-3 rounded-full">
              <FaBriefcase className="h-8 w-8" />
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
              <span className="hidden sm:inline">Add Position</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Position Search (Matching Cluster.jsx) */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder={"Search positions by name"}
        />

        {/* Search Results Info */}
        {searchValue && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">
                Search results for: "<strong>{searchValue}</strong>"
              </span>
              <span className="text-blue-600">
                {totalPosition} position{totalPosition !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Positions Table (Matching Cluster.jsx) */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaBriefcase className="h-4 w-4 mr-2 text-blue-600" />
                    Position Name
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaLayerGroup className="h-4 w-4 mr-2 text-blue-600" />
                    Level
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaFileAlt className="h-4 w-4 mr-2 text-blue-600" />
                    Description
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
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
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
            ) : (
              <tbody className="divide-y divide-gray-200">
                {positions?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="text-blue-400 mb-2">
                        <FaUsers className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No positions found
                      </h3>
                      <p className="text-gray-500">
                        {searchValue
                          ? "No positions match your current search."
                          : "No positions have been added yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  positions?.map((position) => (
                    <tr
                      key={position._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                            <span className="text-blue-700 font-bold text-sm">
                              {position.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 mb-1 text-sm uppercase">
                              {position?.name?.toLowerCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 bg-gradient-to-br ${
                              position.level === "executive"
                                ? "from-purple-100 to-pink-100 border-purple-200"
                                : position.level === "directorial"
                                ? "from-red-100 to-orange-100 border-red-200"
                                : position.level === "managerial"
                                ? "from-green-100 to-emerald-100 border-green-200"
                                : position.level === "supervisory"
                                ? "from-yellow-100 to-amber-100 border-yellow-200"
                                : position.level === "physician"
                                ? "from-teal-100 to-cyan-100 border-teal-200"
                                : "from-gray-100 to-slate-100 border-gray-200"
                            } rounded-full flex items-center justify-center flex-shrink-0 border`}
                          >
                            <span
                              className={`font-bold text-xs ${
                                position.level === "executive"
                                  ? "text-purple-700"
                                  : position.level === "directorial"
                                  ? "text-red-700"
                                  : position.level === "managerial"
                                  ? "text-green-700"
                                  : position.level === "supervisory"
                                  ? "text-yellow-700"
                                  : position.level === "physician"
                                  ? "text-teal-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {position.level?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 capitalize">
                              {position?.level?.toLowerCase()}
                            </div>
                            <div className="text-xs text-gray-500">Level</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-900 capitalize">
                          {position?.description ? (
                            position.description.toLowerCase()
                          ) : (
                            <span className="text-gray-400 italic">
                              No description
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {!position?.isDefault && (
                            <>
                              <button
                                onClick={() => handleEdit(position)}
                                className="inline-flex items-center px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                                disabled={loading}
                              >
                                <FaEdit className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteConfirm(
                                    position._id,
                                    position.name
                                  )
                                }
                                className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                                disabled={loading}
                              >
                                <FaTrashAlt className="h-3.5 w-3.5 mr-1" />
                                Delete
                              </button>
                            </>
                          )}
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

      {/* Enhanced Pagination (Matching Cluster.jsx) */}
      {totalPosition > perPage && (
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
                    {positions.length === 0
                      ? 0
                      : (currentPage - 1) * perPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-blue-700">
                    {Math.min(currentPage * perPage, totalPosition)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-blue-700">
                    {totalPosition}
                  </span>{" "}
                  positions
                </span>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Page {currentPage} of {Math.ceil(totalPosition / perPage)}
                </span>
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalPosition}
                  perPage={perPage}
                  showItem={Math.min(5, Math.ceil(totalPosition / perPage))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
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
                      {formData._id ? "Edit Position" : "Add New Position"}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {formData._id
                        ? "Update position information"
                        : "Create a new organizational position"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Position Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FaBriefcase className="text-blue-600" />
                    <span>Position Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter position name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 capitalize bg-gray-50 focus:bg-white"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Level Selection Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FaLayerGroup className="text-purple-600" />
                    <span>Level</span>
                  </label>
                  <div className="relative">
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none"
                      required
                    >
                      <option value="">Select a level...</option>
                      <option value="staff">Staff</option>
                      <option value="managerial">Managerial</option>
                      <option value="supervisory">Supervisory</option>
                      <option value="directorial">Directorial</option>
                      <option value="physician">Physician</option>
                      <option value="executive">Executive</option>
                    </select>
                    <FaLayerGroup className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FaFileAlt className="text-green-600" />
                    <span>Description</span>
                  </label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Enter position description (optional)"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 capitalize bg-gray-50 focus:bg-white"
                    disabled={loading}
                  />
                </div>

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
                      <PropagateLoader
                        color="#fff"
                        cssOverride={buttonOverrideStyle}
                      />
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
            </div>
          </div>
        </div>
      )}

      {/* Professional Delete Confirmation Modal */}
      {deleteId !== null && (
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
                    Delete "{deleteName}" position?
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    All data associated with this position will be permanently
                    removed.
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

export default Position;
