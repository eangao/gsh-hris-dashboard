import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  fetchUsers,
  getUnregisteredUsers,
  fetchUserById,
  messageClear,
  clearUnRegisteredUsers,
} from "../../../store/Reducers/authReducer";
import toast from "react-hot-toast";
import Search from "../../../components/Search";
import { FaCheck, FaSearch, FaTimes } from "react-icons/fa";
import Pagination from "../../../components/Pagination";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const UserManagement = () => {
  const dispatch = useDispatch();

  const {
    users,
    user,
    totalUser,
    unRegisteredUsers,
    loading,
    errorMessage,
    successMessage,
  } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, currentPage]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };

    dispatch(fetchUsers(obj));
  }, [currentPage, perPage, searchValue, dispatch]);

  // Memoized getUsers function to avoid recreation
  const getUsers = useCallback(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(fetchUsers(obj));
  }, [perPage, currentPage, searchValue, dispatch]);

  const handleCloseUserModal = useCallback(() => {
    setIsUserModalOpen(false);
    setSelectedUnregisteredUser(null);
  }, []);

  useEffect(() => {
    if (successMessage || errorMessage) {
      successMessage && toast.success(successMessage);
      errorMessage && toast.error(errorMessage);

      if (successMessage) {
        getUsers();
        handleCloseUserModal();
      }

      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, getUsers, handleCloseUserModal]);

  const [formData, setFormData] = useState({
    id: null,
    email: "",
    role: "",
    employee: null,
  });

  //====edit============
  const handleEdit = useCallback(
    (userId) => {
      setSelectedUserId(userId);
      dispatch(fetchUserById(userId));
    },
    [dispatch]
  );

  useEffect(() => {
    if (user && user._id === selectedUserId) {
      setFormData(user);
      setIsUserModalOpen(true);
    }
  }, [user, selectedUserId]);
  //====edit============

  const resetForm = () => {
    setFormData({
      _id: null,
      email: "",
      role: "",
      employee: null,
    });
  };

  //=======================================
  // Formik Yup Validation
  const userValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .matches(
        /^[a-zA-Z0-9._%+-]+@adventisthealth-gng\.com$/,
        "Email must be @adventisthealth-gng.com"
      )
      .required("Required"),
    role: Yup.string()
      .oneOf(
        [
          "EMPLOYEE",
          "MANAGER",
          "DIRECTOR",
          "EXECUTIVE",
          "HR_ADMIN",
          "MARKETING_ADMIN",
          "ADMIN",
        ],
        "Invalid role"
      )
      .required("Role is required"),
  });

  const handleUserFormSubmit =
    (formData) =>
    async (values, { setSubmitting }) => {
      const payload = {
        ...formData,
        email: values.email,
        role: values.role,
        employee: selectedUnregisteredUser._id,
      };

      if (payload._id) {
        // dispatch(updateUser(payload));
      } else {
        dispatch(createUser(payload));
      }

      setSubmitting(false); // ← tells Formik the submit is done
    };

  //==============================================
  //search Unregistered Users start
  const [
    isSearchUnregisteredUserModalOpen,
    setIsSearchUnregisteredUserModalOpen,
  ] = useState(false);
  const [selectedUnregisteredUser, setSelectedUnregisteredUser] =
    useState(null);

  const [inputValue, setInputValue] = useState(""); // Local input state
  const [showClear, setShowClear] = useState(false); // Controls when to show "X"
  const [searchEmployeeButtonClick, setSearchEmployeeButtonClick] =
    useState(false);

  const handleRowClick = useCallback((selectedUnregisteredUser) => {
    setSelectedUnregisteredUser(selectedUnregisteredUser);
  }, []);

  const searchUnregisteredUsers = useCallback(
    (searchUnregisteredUser) => {
      dispatch(getUnregisteredUsers({ searchUnregisteredUser }));

      setTimeout(() => {
        setSearchEmployeeButtonClick(true);
      }, 1000);
    },
    [dispatch]
  );

  // Function to trigger search
  const triggerSearch = useCallback(
    (value) => {
      searchUnregisteredUsers(value);
      setShowClear(!!value);
    },
    [searchUnregisteredUsers]
  );

  // Handle Enter key press
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        triggerSearch(inputValue);
      }
    },
    [triggerSearch, inputValue]
  );

  // Handle search button click
  const handleSearchButtonClick = useCallback(() => {
    triggerSearch(inputValue);
  }, [triggerSearch, inputValue]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setShowClear(false);
    } else {
      setShowClear(false);
    }
  }, []);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setInputValue("");
    setShowClear(false);
    dispatch(clearUnRegisteredUsers());
    setSearchEmployeeButtonClick(false);
  }, [dispatch]);

  const handleCancelSearchUnregisteredUser = useCallback(() => {
    setIsSearchUnregisteredUserModalOpen(false);
    handleClearSearch();
    setSelectedUnregisteredUser(null);
  }, [handleClearSearch]);

  const handleSelectedUnregisteredUser = useCallback(() => {
    setIsSearchUnregisteredUserModalOpen(false);
    handleClearSearch();
    setIsUserModalOpen(true);
  }, [handleClearSearch]);

  //==============================================
  //search Unregistered Users end

  // Table skeleton component for better UX
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
            <div className="h-3 bg-gray-300 rounded w-32"></div>
          </td>
          <td className="p-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </td>
          <td className="p-4">
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </td>
          <td className="p-4">
            <div className="h-3 bg-gray-300 rounded w-12"></div>
          </td>
          <td className="p-4">
            <div className="h-6 bg-gray-300 rounded w-16"></div>
          </td>
          <td className="p-4">
            <div className="flex justify-center">
              <div className="h-8 bg-gray-300 rounded w-12"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  // Helper function to get status badge styling
  const getStatusStyle = (isActive) => {
    return isActive
      ? "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-500"
      : "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-500";
  };

  const getStatusDot = (isActive) => {
    return isActive ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Enhanced Header - Mobile Optimized */}
      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              User Management
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <div className="flex items-center gap-4">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsSearchUnregisteredUserModalOpen(true);
              }}
              className="bg-white/20 hover:bg-white/30 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center gap-2 hover:shadow-lg text-sm sm:text-base"
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              <span className="hidden sm:inline">Add User</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
        <Search
          setPerpage={setPerpage}
          perPage={perPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder="Search users by name"
        />

        {/* Search Results Info */}
        {searchValue && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">
                Search results for: "<strong>{searchValue}</strong>"
              </span>
              <span className="text-blue-600">
                {totalUser} user{totalUser !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced User Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            {loading ? (
              <TableSkeleton />
            ) : users?.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No users found
                      </h3>
                      <p className="text-gray-500">
                        {searchValue
                          ? "No users match your current search."
                          : "No users have been created yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-gray-200 bg-white">
                {users?.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                          <span className="text-blue-700 font-bold text-sm">
                            {user.employee.personalInformation?.firstName?.charAt(
                              0
                            )}
                            {user.employee.personalInformation?.lastName?.charAt(
                              0
                            )}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">
                            <span className="capitalize">
                              {user.employee.personalInformation?.lastName},
                            </span>{" "}
                            <span className="capitalize">
                              {user.employee.personalInformation?.firstName}
                            </span>{" "}
                            {user.employee.personalInformation?.middleName && (
                              <span className="capitalize">
                                {user.employee.personalInformation?.middleName
                                  .charAt(0)
                                  .toUpperCase()}
                                .
                              </span>
                            )}
                          </div>
                          {/* <div className="text-xs text-gray-500 font-mono">
                            ID: {user._id.slice(-8)}
                          </div> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 lowercase font-medium">
                        {user?.email?.toLowerCase()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900 uppercase tracking-wide text-xs">
                          {user?.position?.name || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700 capitalize">
                        {user?.position?.level || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                        {user?.role}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={getStatusStyle(user?.isActive)}>
                        <div
                          className={`w-2 h-2 rounded-full mr-1.5 ${getStatusDot(
                            user?.isActive
                          )}`}
                        ></div>
                        {user?.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleEdit(user._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                          disabled={loading}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3.5 w-3.5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
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

      {/* Enhanced Pagination */}
      {totalUser > perPage && (
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
                    {users.length === 0 ? 0 : (currentPage - 1) * perPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-blue-700">
                    {Math.min(currentPage * perPage, totalUser)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-blue-700">{totalUser}</span>{" "}
                  users
                </span>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Page {currentPage} of {Math.ceil(totalUser / perPage)}
                </span>
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalUser}
                  perPage={perPage}
                  showItem={Math.min(5, Math.ceil(totalUser / perPage))}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced User Form Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
                {formData._id ? "Edit User" : "Add User"}
              </h2>
            </div>

            <div className="p-6">
              <Formik
                initialValues={{
                  email: formData.email || "",
                  role: formData.role || "",
                }}
                enableReinitialize
                validationSchema={userValidationSchema}
                onSubmit={handleUserFormSubmit(formData)}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        disabled
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg capitalize bg-gray-50 text-gray-800 font-medium"
                        value={
                          `${
                            selectedUnregisteredUser?.personalInformation
                              ?.lastName || ""
                          }, ` +
                          `${
                            selectedUnregisteredUser?.personalInformation
                              ?.firstName || ""
                          } ` +
                          `${
                            selectedUnregisteredUser?.personalInformation
                              ?.middleName
                              ? selectedUnregisteredUser.personalInformation.middleName
                                  .charAt(0)
                                  .toUpperCase() + "."
                              : ""
                          }`
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <input
                        name="position"
                        type="text"
                        disabled
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg capitalize bg-gray-50 text-gray-800 font-medium"
                        value={`${
                          selectedUnregisteredUser?.employmentInformation
                            ?.position?.name || ""
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position Level
                      </label>
                      <input
                        name="positionLevel"
                        type="text"
                        disabled
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg capitalize bg-gray-50 text-gray-800 font-medium"
                        value={`${
                          selectedUnregisteredUser?.employmentInformation
                            ?.position?.level || ""
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Field
                        name="email"
                        type="email"
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="user@adventisthealth-gng.com"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Role
                      </label>
                      <Field
                        as="select"
                        name="role"
                        className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      >
                        <option value="">Select Role</option>
                        <option value="EMPLOYEE">Employee</option>
                        <option value="MANAGER">Manager</option>
                        <option value="DIRECTOR">Director</option>
                        <option value="EXECUTIVE">Executive</option>
                        <option value="HR_ADMIN">HR Admin</option>
                        <option value="MARKETING_ADMIN">Marketing Admin</option>
                        <option value="ADMIN">Admin</option>
                      </Field>
                      <p className="text-xs text-gray-500 mt-2">
                        ⚠️ Please ensure the selected role aligns with the
                        user's position level (e.g., choose "Manager" for
                        positions with a managerial level).
                      </p>
                      <ErrorMessage
                        name="role"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCloseUserModal}
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-lg font-medium transition-all duration-200"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {formData._id ? "Update User" : "Create User"}
                          </>
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Search Unregistered User Modal */}
      {isSearchUnregisteredUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                </svg>
                Search Employee to Add User
              </h2>
            </div>

            <div className="p-6 flex-1 overflow-hidden flex flex-col">
              <div className="relative flex items-center mb-6">
                <input
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  value={inputValue}
                  className="w-full px-4 py-3 pr-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none border border-gray-300 rounded-lg text-gray-900 transition-all"
                  type="text"
                  placeholder="Search employee by first name or last name..."
                />

                {showClear ? (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-12 text-red-600 rounded p-2 hover:text-red-700 hover:bg-red-50 transition-all"
                    title="Clear search"
                  >
                    <FaTimes />
                  </button>
                ) : (
                  inputValue && (
                    <button
                      onClick={handleSearchButtonClick}
                      className="absolute right-12 text-blue-600 rounded p-2 hover:text-blue-700 hover:bg-blue-50 transition-all"
                      title="Search"
                    >
                      <FaSearch />
                    </button>
                  )
                )}

                <button
                  onClick={handleSearchButtonClick}
                  className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md p-2 transition-all"
                  title="Search"
                  disabled={!inputValue || loading}
                >
                  <FaSearch />
                </button>
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <span className="text-gray-600">
                      Searching employees...
                    </span>
                  </div>
                </div>
              ) : unRegisteredUsers?.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-500">
                      {searchEmployeeButtonClick && inputValue
                        ? "No employees found matching your search."
                        : "Enter a search term to find employees."}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                        <th className="text-left p-4 text-sm font-medium text-gray-700 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700 uppercase tracking-wider">
                          Level
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {unRegisteredUsers?.map((userToRegistered) => {
                        const isSelected =
                          selectedUnregisteredUser === userToRegistered;
                        return (
                          <tr
                            key={userToRegistered._id}
                            onClick={() => handleRowClick(userToRegistered)}
                            className={`cursor-pointer transition-all hover:bg-blue-50 ${
                              isSelected
                                ? "bg-blue-100 border-l-4 border-blue-500"
                                : ""
                            }`}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                                  <span className="text-blue-700 font-bold text-sm">
                                    {userToRegistered.personalInformation?.firstName?.charAt(
                                      0
                                    )}
                                    {userToRegistered.personalInformation?.lastName?.charAt(
                                      0
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 capitalize">
                                    {
                                      userToRegistered.personalInformation
                                        ?.lastName
                                    }
                                    ,{" "}
                                    {
                                      userToRegistered.personalInformation
                                        ?.firstName
                                    }{" "}
                                    {userToRegistered.personalInformation
                                      ?.middleName &&
                                      userToRegistered.personalInformation.middleName
                                        .charAt(0)
                                        .toUpperCase() + "."}
                                  </div>
                                  <div className="text-xs text-gray-500 font-mono">
                                    ID: {userToRegistered._id.slice(-8)}
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="ml-auto">
                                    <FaCheck className="text-blue-600 h-4 w-4" />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-4 capitalize text-gray-700 font-medium">
                              {userToRegistered.employmentInformation?.position
                                ?.name || "-"}
                            </td>
                            <td className="p-4 capitalize text-gray-600">
                              {userToRegistered.employmentInformation?.position
                                ?.level || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                type="button"
                onClick={handleCancelSearchUnregisteredUser}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-lg font-medium transition-all duration-200"
                disabled={loading}
              >
                Cancel
              </button>
              {selectedUnregisteredUser && (
                <button
                  type="button"
                  onClick={handleSelectedUnregisteredUser}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                  disabled={loading}
                >
                  <FaCheck />
                  Select Employee
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
