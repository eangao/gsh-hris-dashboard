import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmploymentStatus,
  createEmploymentStatus,
  updateEmploymentStatus,
  deleteEmploymentStatus,
  messageClear,
} from "./../../../../store/Reducers/employmentStatusReducer";

import Pagination from "./../../../../components/Pagination";
import Search from "./../../../../components/Search";

import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaUserCheck,
  FaFileAlt,
  FaIdBadge,
  FaUsers,
} from "react-icons/fa";

import { buttonOverrideStyle } from "./../../../../utils/utils";
import { PropagateLoader } from "react-spinners";

const EmploymentStatus = () => {
  const dispatch = useDispatch();

  const {
    employmentStatuses,
    totalEmploymentStatus,
    loading,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.employmentStatus);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, currentPage]);

  // Optimize getEmploymentStatus with useCallback
  const getEmploymentStatus = useCallback(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(fetchEmploymentStatus(obj));
  }, [currentPage, perPage, searchValue, dispatch]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    getEmploymentStatus();
  }, [getEmploymentStatus]);

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
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
      description: "",
    });
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);

      getEmploymentStatus();

      setIsModalOpen(false);
      setDeleteId(null);

      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, getEmploymentStatus, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData._id) {
      dispatch(updateEmploymentStatus(formData));
    } else {
      dispatch(createEmploymentStatus(formData));
    }
  };

  const handleEdit = (employmentStatus) => {
    setFormData(employmentStatus);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    dispatch(deleteEmploymentStatus(deleteId));
  };

  // Loading skeleton component for better UX (Matching Cluster.jsx)
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
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
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

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Enhanced Header - Mobile Optimized (Matching Cluster) */}
      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Employment Status Management
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Manage employee status types and descriptions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-white/10 p-3 rounded-full">
              <FaIdBadge className="h-8 w-8" />
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
              <span className="hidden sm:inline">Add Employment Status</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Employment Status Search (Matching Cluster.jsx) */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder={"Search employment status "}
        />

        {/* Search Results Info */}
        {searchValue && (
          <div className="mt-4 text-sm text-gray-600">
            {loading ? (
              <span>Searching...</span>
            ) : (
              <span>
                Found {totalEmploymentStatus} result(s) for "{searchValue}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading skeleton component for better UX (Matching Cluster.jsx) */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaIdBadge className="h-4 w-4 mr-2 text-blue-600" />
                    Employment Status
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
              <TableSkeleton />
            ) : employmentStatuses?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FaIdBadge className="h-12 w-12 text-gray-300" />
                      <p className="text-lg font-medium">
                        No employment status found
                      </p>
                      <p className="text-sm">
                        {searchValue
                          ? `No results for "${searchValue}". Try a different search.`
                          : "Get started by adding your first employment status."}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-200">
                {employmentStatuses?.map((employmentStatus, index) => (
                  <tr
                    key={employmentStatus._id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                          <span className="text-blue-700 font-bold text-sm">
                            {employmentStatus.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 uppercase">
                            {employmentStatus.name?.toLowerCase()}
                          </p>
                          {/* <p className="text-xs text-gray-500 truncate">
                            Status Code:{" "}
                            {employmentStatus._id.slice(-6).toUpperCase()}
                          </p> */}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900 capitalize">
                        {employmentStatus.description?.toLowerCase() ||
                          "No description"}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(employmentStatus)}
                          className="inline-flex items-center px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                          disabled={loading}
                        >
                          <FaEdit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteConfirm(
                              employmentStatus._id,
                              employmentStatus.name
                            )
                          }
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-200 hover:border-red-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                          disabled={loading}
                        >
                          <FaTrashAlt className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Enhanced Pagination (Matching Cluster.jsx) */}
      {totalEmploymentStatus > perPage && (
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
                    {employmentStatuses.length === 0
                      ? 0
                      : (currentPage - 1) * perPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-blue-700">
                    {Math.min(currentPage * perPage, totalEmploymentStatus)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-blue-700">
                    {totalEmploymentStatus}
                  </span>{" "}
                  employment statuses
                </span>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Page {currentPage} of{" "}
                  {Math.ceil(totalEmploymentStatus / perPage)}
                </span>
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalEmploymentStatus}
                  perPage={perPage}
                  showItem={Math.min(
                    5,
                    Math.ceil(totalEmploymentStatus / perPage)
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Create/Edit Modal (Matching Cluster.jsx) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <FaIdBadge className="h-6 w-6" />
                {formData._id
                  ? "Edit Employment Status"
                  : "Add Employment Status"}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {formData._id
                  ? "Update employment status information"
                  : "Create a new employment status type"}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Employment Status Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FaUserCheck className="text-blue-600" />
                    <span>Employment Status Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter employment status name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 capitalize bg-gray-50 focus:bg-white"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FaFileAlt className="text-blue-600" />
                    <span>Description</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Enter status description (optional)"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 capitalize bg-gray-50 focus:bg-white resize-none"
                    disabled={loading}
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 min-w-[120px] justify-center"
                  >
                    {loading ? (
                      <PropagateLoader
                        color="#fff"
                        cssOverride={buttonOverrideStyle}
                        size={8}
                      />
                    ) : (
                      <>
                        <FaUserCheck className="h-4 w-4" />
                        {formData._id ? "Update" : "Add"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Professional Delete Confirmation Modal (Matching Cluster.jsx) */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-700 text-white p-6 rounded-t-2xl">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <FaTrashAlt className="h-6 w-6" />
                Confirm Delete
              </h2>
              <p className="text-red-100 text-sm mt-1">
                This action cannot be undone
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaTrashAlt className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    Are you sure you want to delete this employment status?
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold text-red-600 capitalize">
                      {deleteName}
                    </span>
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 min-w-[100px] justify-center"
                >
                  {loading ? (
                    <PropagateLoader color="#fff" size={8} />
                  ) : (
                    <>
                      <FaTrashAlt className="h-4 w-4" />
                      Delete
                    </>
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

export default EmploymentStatus;
