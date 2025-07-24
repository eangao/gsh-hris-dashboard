import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  assignDepartmentManager,
  deleteDepartment,
  messageClear,
} from "../../../../store/Reducers/departmentReducer";
import { fetchAllClusters } from "../../../../store/Reducers/clusterReducer";
import { fetchEmployeesManagers } from "../../../../store/Reducers/employeeReducer";
import Pagination from "../../../../components/Pagination";
import Search from "../../../../components/Search";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaSitemap,
  FaCrown,
  FaUserTie,
  FaUsers,
} from "react-icons/fa";

import { buttonOverrideStyle } from "../../../../utils/utils";
import { PropagateLoader } from "react-spinners";

const Department = () => {
  const dispatch = useDispatch();

  const {
    department,
    departments,
    totalDepartment,
    loading,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.department);

  const { clusters } = useSelector((state) => state.cluster);
  const { managers } = useSelector((state) => state.employee);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, currentPage]);

  // Optimize getDepartments with useCallback
  const getDepartments = useCallback(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(fetchDepartments(obj));
  }, [currentPage, perPage, searchValue, dispatch]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    cluster: "",
    manager: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toAssignManager, setToAssignManager] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  // Optimize reset form with useCallback
  const resetForm = useCallback(() => {
    setFormData({
      _id: null,
      name: "",
      cluster: "",
      manager: null,
    });
  }, []);

  // Optimize helper functions with useCallback
  const getAllClusters = useCallback(() => {
    dispatch(fetchAllClusters());
  }, [dispatch]);

  const getEmployeesManagers = useCallback(() => {
    dispatch(fetchEmployeesManagers());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      getDepartments();
      setIsModalOpen(false);
      setDeleteId(null);
      setToAssignManager(false);
      resetForm();
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, getDepartments, resetForm, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData._id) {
      // Editing an existing department
      if (toAssignManager) {
        dispatch(assignDepartmentManager(formData));
      } else {
        dispatch(updateDepartment(formData));
      }
    } else {
      // Creating a new department
      dispatch(createDepartment(formData));
    }
  };

  //====edit============
  const handleEdit = (departmentId) => {
    setSelectedId(departmentId);

    getAllClusters();

    dispatch(fetchDepartmentById(departmentId));
  };

  useEffect(() => {
    if (department && department._id === selectedId) {
      setFormData(department);
      setIsModalOpen(true);
    }
  }, [department, selectedId]);
  //====edit============

  //====Asign manager============

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    dispatch(deleteDepartment(deleteId));
  };

  const handleAssignManager = (dept) => {
    setToAssignManager(true);
    setSelectedId(dept._id);
    getEmployeesManagers();
    dispatch(fetchDepartmentById(dept._id));
    getAllClusters();
    setIsModalOpen(true);
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
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
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
              <div className="h-8 bg-gray-300 rounded w-12"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Enhanced Header - Mobile Optimized (Matching Cluster.jsx) */}
      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Department Management
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Manage organizational departments and managers
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-white/10 p-3 rounded-full">
              <FaSitemap className="h-8 w-8" />
            </div>
            <button
              onClick={() => {
                getAllClusters();
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center gap-2 hover:shadow-lg text-sm sm:text-base"
              disabled={loading}
            >
              <FaPlus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Add Department</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Department Search (Matching Cluster.jsx) */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder={"Search departments by name"}
        />

        {/* Search Results Info */}
        {searchValue && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">
                Search results for: "<strong>{searchValue}</strong>"
              </span>
              <span className="text-blue-600">
                {totalDepartment} department{totalDepartment !== 1 ? "s" : ""}{" "}
                found
              </span>
            </div>
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
                    <FaSitemap className="h-4 w-4 mr-2 text-blue-600" />
                    Department Name
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaCrown className="h-4 w-4 mr-2 text-blue-600" />
                    Cluster
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaUserTie className="h-4 w-4 mr-2 text-blue-600" />
                    Assigned Manager
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
                {departments?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-12 text-center">
                      <div className="text-blue-400 mb-2">
                        <FaUsers className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No departments found
                      </h3>
                      <p className="text-gray-500">
                        {searchValue
                          ? "No departments match your current search."
                          : "No departments have been added yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  departments?.map((dept) => (
                    <tr
                      key={dept._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                            <span className="text-blue-700 font-bold text-sm">
                              {dept.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 mb-1 text-sm uppercase">
                              {dept?.name?.toLowerCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 border border-purple-200">
                            <span className="text-purple-700 font-bold text-xs">
                              {dept?.cluster?.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 capitalize">
                              {dept?.cluster?.name?.toLowerCase()}
                            </div>
                            <div className="text-xs text-gray-500">Cluster</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {!dept?.manager ? (
                          <div className="flex items-center">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-500">
                              <div className="w-2 h-2 rounded-full mr-1.5 bg-yellow-500"></div>
                              Not Assigned
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 border border-green-200">
                              <span className="text-green-700 font-bold text-sm">
                                {dept?.manager.personalInformation?.firstName
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                                {dept?.manager.personalInformation?.lastName
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 mb-1">
                                <span className="capitalize">
                                  {dept?.manager.personalInformation?.lastName},
                                </span>{" "}
                                <span className="capitalize">
                                  {dept?.manager.personalInformation?.firstName}
                                </span>{" "}
                                {dept?.manager.personalInformation
                                  ?.middleName && (
                                  <span className="capitalize">
                                    {dept?.manager.personalInformation?.middleName
                                      .charAt(0)
                                      .toUpperCase()}
                                    .
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                Manager
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleAssignManager(dept)}
                            className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border border-green-200 hover:border-green-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                            disabled={loading}
                            title="Assign Manager"
                          >
                            <FaUserTie className="h-3.5 w-3.5 mr-1" />
                            Assign
                          </button>
                          {!dept?.isDefault && (
                            <>
                              <button
                                onClick={() => {
                                  setToAssignManager(false);
                                  handleEdit(dept._id);
                                }}
                                className="inline-flex items-center px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                                disabled={loading}
                              >
                                <FaEdit className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteConfirm(dept._id, dept.name)
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
      {totalDepartment > perPage && (
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
                    {departments.length === 0
                      ? 0
                      : (currentPage - 1) * perPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-blue-700">
                    {Math.min(currentPage * perPage, totalDepartment)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-blue-700">
                    {totalDepartment}
                  </span>{" "}
                  departments
                </span>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Page {currentPage} of {Math.ceil(totalDepartment / perPage)}
                </span>
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalDepartment}
                  perPage={perPage}
                  showItem={Math.min(5, Math.ceil(totalDepartment / perPage))}
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
                      toAssignManager ? (
                        <FaUserTie className="text-white text-lg" />
                      ) : (
                        <FaEdit className="text-white text-lg" />
                      )
                    ) : (
                      <FaPlus className="text-white text-lg" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {formData._id
                        ? toAssignManager
                          ? "Assign Manager"
                          : "Edit Department"
                        : "Add New Department"}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {formData._id
                        ? toAssignManager
                          ? "Assign a manager to this department"
                          : "Update department information"
                        : "Create a new organizational department"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Department Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FaSitemap className="text-blue-600" />
                    <span>Department Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter department name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 capitalize bg-gray-50 focus:bg-white"
                    required={!toAssignManager}
                    disabled={toAssignManager}
                  />
                </div>

                {/* Cluster Selection Field */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FaCrown className="text-purple-600" />
                    <span>Cluster</span>
                  </label>
                  <div className="relative">
                    <select
                      name="cluster"
                      value={formData.cluster._id}
                      onChange={(e) =>
                        setFormData({ ...formData, cluster: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none capitalize"
                      required={!toAssignManager}
                      disabled={toAssignManager}
                    >
                      <option value="">Select a cluster...</option>
                      {clusters.map((cluster) => (
                        <option key={cluster._id} value={cluster._id}>
                          {cluster.name}
                        </option>
                      ))}
                    </select>
                    <FaSitemap className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Manager Assignment Field */}
                {toAssignManager && (
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaUserTie className="text-green-600" />
                      <span>Select Manager</span>
                    </label>
                    <div className="relative">
                      <select
                        name="manager"
                        value={formData.manager?._id || formData.manager}
                        onChange={(e) =>
                          setFormData({ ...formData, manager: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white appearance-none capitalize"
                        required={toAssignManager}
                        disabled={!toAssignManager}
                      >
                        <option value="">Choose a manager...</option>
                        {managers.map((manager) => {
                          const { firstName, middleName, lastName } =
                            manager.personalInformation;
                          const middleInitial = middleName
                            ? middleName.charAt(0).toUpperCase() + "."
                            : "";
                          const displayName =
                            `${lastName}, ${firstName} ${middleInitial}`.trim();
                          return (
                            <option key={manager._id} value={manager._id}>
                              {displayName}
                            </option>
                          );
                        })}
                      </select>
                      <FaUserTie className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Modal Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setToAssignManager(false);
                    }}
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
                      toAssignManager ? (
                        <div className="flex items-center space-x-2">
                          <FaUserTie />
                          <span>Assign</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <FaEdit />
                          <span>Update</span>
                        </div>
                      )
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
                    Delete "{deleteName}" department?
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    All data associated with this department will be permanently
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

export default Department;
