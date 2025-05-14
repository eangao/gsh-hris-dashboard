import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createUser,
  updateUser,
  fetchUsers,
  getUnregisteredUsers,
  fetchUserById,
  messageClear,
  clearUnRegisteredUsers,
} from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";
import Search from "../components/Search";
import { FaCheck, FaEdit, FaSearch, FaTimes } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { buttonOverrideStyle } from "../../utils/utils";
import Pagination from "../components/Pagination";

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

  useEffect(() => {
    // Reset to page 1 if searchValue is not empty
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }

    getUsers();
  }, [searchValue, currentPage]);

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
  }, [successMessage, errorMessage]);

  const [formData, setFormData] = useState({
    id: null,
    email: "",
    role: "",
    employee: null,
  });

  const getUsers = () => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
    };

    dispatch(fetchUsers(obj));
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUnregisteredUser(null);
  };

  //====edit============
  const handleEdit = (userId) => {
    setSelectedUserId(userId);
    dispatch(fetchUserById(userId));
  };

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
    role: Yup.string().required("Required"),
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

  const handleRowClick = (selectedUnregisteredUser) => {
    setSelectedUnregisteredUser(selectedUnregisteredUser);
  };

  const searchUnregisteredUsers = (searchUnregisteredUser) => {
    dispatch(getUnregisteredUsers({ searchUnregisteredUser }));

    setTimeout(() => {
      setSearchEmployeeButtonClick(true);
    }, 1000); // delay in milliseconds (500ms = 0.5s)
  };

  // Function to trigger search
  const triggerSearch = (value) => {
    searchUnregisteredUsers(value);
    setShowClear(!!value); // Show "X" only if input exists after searching
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      triggerSearch(inputValue);
    }
  };

  // Handle search button click
  const handleSearchButtonClick = () => {
    triggerSearch(inputValue);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setShowClear(false); // Hide "X" when input is empty
    } else {
      setShowClear(false); // Hide "X" while typing
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setInputValue(""); // Clear input field
    setShowClear(false); // Hide "X"
    dispatch(clearUnRegisteredUsers());
    setSearchEmployeeButtonClick(false);
  };

  const handleCancelSearchUnregisteredUser = () => {
    setIsSearchUnregisteredUserModalOpen(false);
    handleClearSearch();
    setSelectedUnregisteredUser(null);
  };

  const handleSelectedUnregisteredUser = () => {
    setIsSearchUnregisteredUserModalOpen(false);
    handleClearSearch();

    setIsUserModalOpen(true);
  };

  //==============================================
  //search Unregistered Users end

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-center">User Management</h1>
        <button
          onClick={() => {
            resetForm();
            setIsSearchUnregisteredUserModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Add User
        </button>
      </div>

      <div className="mb-4">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder="Search User..."
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">User</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="p-3 text-center">
                  loading...
                </td>
              </tr>
            ) : users?.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users?.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-2  ">
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
                  </td>
                  <td className="p-2 lowercase">
                    {user?.email?.toLowerCase()}
                  </td>
                  <td className="p-2 lowercase">{user?.role?.toLowerCase()}</td>
                  <td className="p-2 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        handleEdit(user._id);
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      disabled={loading}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalUser > perPage && (
        <div className="w-full flex justify-end mt-4">
          <Pagination
            pageNumber={currentPage}
            setPageNumber={setCurrentPage}
            totalItem={totalUser}
            perPage={perPage}
            showItem={Math.min(5, Math.ceil(totalUser / perPage))}
          />
        </div>
      )}

      {/* User Form Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {formData._id ? "Edit User" : "Add User"}
            </h2>

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
                <Form className="space-y-4">
                  <div>
                    <label className="block font-medium">Email</label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full border px-3 py-2 rounded"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">Role</label>
                    <Field
                      as="select"
                      name="role"
                      className="w-full border px-3 py-2 rounded"
                    >
                      <option value="">Select a role</option>
                      <option value="admin">Admin</option>
                      <option value="employee">Employee</option>
                      <option value="user">User</option>
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={handleCloseUserModal}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      disabled={isSubmitting}
                    >
                      {formData._id ? "Update" : "Create User"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {isSearchUnregisteredUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Search employee to add</h2>

            <div className="relative flex items-center mb-5">
              <input
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                value={inputValue}
                className="w-full px-4 py-2 pr-12 focus:border-slate-800 outline-none border border-slate-400 rounded text-slate-900"
                type="text"
                placeholder="Search employee firstname or lastname..."
              />

              {showClear ? (
                // "X" button appears and disappears when clicked or when the input is empty
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 text-red-600 rounded p-2 hover:text-red-700"
                >
                  <FaTimes />
                </button>
              ) : (
                // Search button appears when "X" is hidden
                inputValue && (
                  <button
                    onClick={handleSearchButtonClick}
                    className="absolute right-2 text-blue-600 rounded p-2 hover:text-blue-700"
                  >
                    <FaSearch />
                  </button>
                )
              )}
            </div>

            {loading ? (
              <span className="p-3 text-center ">loading...</span>
            ) : unRegisteredUsers?.length === 0 ? (
              <span className="p-3 text-center text-gray-500 ">
                {searchEmployeeButtonClick &&
                  inputValue &&
                  "No employee found."}
              </span>
            ) : (
              <div className="max-h-[440px] overflow-y-auto">
                <table className="w-full border-collapse ">
                  <thead>
                    <tr className="bg-blue-200">
                      <th className="text-left p-2">Employee</th>
                      <th className="text-left  p-2">Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unRegisteredUsers?.map((userToRegistered) => {
                      const isSelected =
                        selectedUnregisteredUser === userToRegistered;

                      return (
                        <tr
                          key={userToRegistered._id}
                          onClick={() => handleRowClick(userToRegistered)}
                          className={`cursor-pointer ${
                            isSelected ? "bg-blue-50" : ""
                          }`}
                        >
                          <td className="text-left border-y p-2 flex items-center justify-start ">
                            <span className={`${isSelected ? "mr-2" : ""} `}>
                              {isSelected && (
                                <FaCheck className="text-blue-600 " />
                              )}
                            </span>
                            <div>
                              <span className="capitalize">
                                {userToRegistered.personalInformation?.lastName}
                                ,
                              </span>{" "}
                              <span className="capitalize">
                                {
                                  userToRegistered.personalInformation
                                    ?.firstName
                                }
                              </span>{" "}
                              {userToRegistered.personalInformation
                                ?.middleName && (
                                <span className="capitalize">
                                  {userToRegistered.personalInformation?.middleName
                                    .charAt(0)
                                    .toUpperCase()}
                                  .
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-left border-y p-2">
                            {userToRegistered.employmentInformation?.position
                              ?.name || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>{" "}
              </div>
            )}
            <div className="flex justify-end space-x-2 mt-5">
              <button
                type="button"
                onClick={handleCancelSearchUnregisteredUser}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
              {selectedUnregisteredUser && (
                <button
                  type="button"
                  onClick={handleSelectedUnregisteredUser}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  Select
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
