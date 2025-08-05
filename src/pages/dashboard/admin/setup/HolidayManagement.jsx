import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  messageClear,
} from "./../../../../store/Reducers/holidayReducer";

import Pagination from "./../../../../components/Pagination";
import Search from "./../../../../components/Search";

import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaCalendarAlt,
  FaGlobe,
  FaFlag,
  FaClock,
  FaUsers,
  FaExclamationTriangle,
  FaShieldAlt,
} from "react-icons/fa";

import { buttonOverrideStyle } from "./../../../../utils/utils";
import { PropagateLoader } from "react-spinners";
import {
  formatDatePH,
  convertDatePHToUTCISO,
  formatReadableDatePH,
} from "./../../../../utils/phDateUtils";

const HolidayManagement = () => {
  const dispatch = useDispatch();

  const { holidays, totalHoliday, loading, successMessage, errorMessage } =
    useSelector((state) => state.holidays);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);
  const [typeFilter, setTypeFilter] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [yearFilter, setYearFilter] = useState(
    new Date().getFullYear().toString()
  );

  // 1️⃣ Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, currentPage]);

  // Optimize getHolidays with useCallback
  const getHolidays = useCallback(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
      type: typeFilter,
      scope: scopeFilter,
      status: statusFilter,
      year: yearFilter,
    };
    dispatch(fetchHolidays(obj));
  }, [
    currentPage,
    perPage,
    searchValue,
    typeFilter,
    scopeFilter,
    statusFilter,
    yearFilter,
    dispatch,
  ]);

  // 2️⃣ Fetch data after currentPage, perPage, or searchValue is updated
  useEffect(() => {
    getHolidays();
  }, [getHolidays]);

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    date: "",
    type: "Regular Holiday",
    scope: "National",
    workStatus: "Non-Working",
    isRecurring: true,
    payRule: "200%",
    status: "Active",
    notes: "",
    region: "",
    city: "",
    province: "",
    legalBasis: "Republic Act",
    referenceNumber: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  // Optimize reset form with useCallback
  const resetForm = useCallback(() => {
    setFormData({
      _id: null,
      name: "",
      date: "",
      type: "Regular Holiday",
      scope: "National",
      workStatus: "Non-Working",
      isRecurring: true,
      payRule: "200%",
      status: "Active",
      notes: "",
      region: "",
      city: "",
      province: "",
      legalBasis: "Republic Act",
      referenceNumber: "",
    });
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      getHolidays();
      setIsModalOpen(false);
      setDeleteId(null);
      resetForm();
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, getHolidays, resetForm, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // Auto-sync dependent fields when type changes
    if (name === "type") {
      // Set default scope based on type
      if (
        value === "Regular Holiday" ||
        value === "Special Non-Working Holiday" ||
        value === "Special Working Holiday"
      ) {
        updatedFormData.scope = "National";
      } else if (value === "Local Holiday") {
        updatedFormData.scope = "Local";
      } else if (value === "Company Holiday") {
        updatedFormData.scope = "Company";
      } else {
        updatedFormData.scope = "National";
      }

      // Set default work status based on type
      if (
        value === "Regular Holiday" ||
        value === "Special Non-Working Holiday"
      ) {
        updatedFormData.workStatus = "Non-Working";
      } else if (value === "Special Working Holiday") {
        updatedFormData.workStatus = "Working";
      } else {
        updatedFormData.workStatus = "Optional";
      }

      // Set default pay rule based on type
      if (value === "Regular Holiday") {
        updatedFormData.payRule = "200%";
      } else if (
        value === "Special Non-Working Holiday" ||
        value === "Special Working Holiday"
      ) {
        updatedFormData.payRule = "130%";
      } else {
        updatedFormData.payRule = "None";
      }

      // Set default isRecurring based on type
      if (
        value !== "Presidential Proclamation" &&
        value !== "Company Holiday"
      ) {
        updatedFormData.isRecurring = true;
      } else {
        updatedFormData.isRecurring = false;
      }

      // Set default legal basis based on type
      if (value === "Regular Holiday") {
        updatedFormData.legalBasis = "Republic Act";
      } else if (value === "Special Non-Working Holiday") {
        updatedFormData.legalBasis = "Republic Act"; // Most permanent special holidays are RAs
      } else if (value === "Special Working Holiday") {
        updatedFormData.legalBasis = "Memorandum Circular"; // Usually annual declarations
      } else if (value === "Presidential Proclamation") {
        updatedFormData.legalBasis = "Presidential Proclamation";
      } else if (value === "Local Holiday") {
        updatedFormData.legalBasis = "Local Ordinance";
      } else if (value === "Company Holiday") {
        updatedFormData.legalBasis = "Company Policy";
      } else {
        updatedFormData.legalBasis = "Memorandum Circular";
      }

      // Set default reference number for yearly recurring holidays
      if (value === "Regular Holiday") {
        updatedFormData.referenceNumber =
          "RA 9492 (Revised Rules on Regular Holidays)";
      } else if (value === "Special Non-Working Holiday") {
        updatedFormData.referenceNumber =
          "RA 9849 (Special Non-Working Holidays)";
      } else if (value === "Special Working Holiday") {
        updatedFormData.referenceNumber =
          "MC 2024-002 (Special Working Holidays)";
      } else {
        updatedFormData.referenceNumber = "";
      }
    }

    // Auto-sync reference number when legal basis changes
    if (name === "legalBasis") {
      if (value === "Republic Act") {
        if (formData.type === "Regular Holiday") {
          updatedFormData.referenceNumber =
            "RA 9492 (Revised Rules on Regular Holidays)";
        } else if (formData.type === "Special Non-Working Holiday") {
          updatedFormData.referenceNumber =
            "RA 9849 (Special Non-Working Holidays)";
        } else {
          updatedFormData.referenceNumber = "RA ";
        }
      } else if (value === "Memorandum Circular") {
        if (formData.type === "Special Non-Working Holiday") {
          updatedFormData.referenceNumber =
            "MC 2024-001 (Special Non-Working Holidays)";
        } else if (formData.type === "Special Working Holiday") {
          updatedFormData.referenceNumber =
            "MC 2024-002 (Special Working Holidays)";
        } else {
          updatedFormData.referenceNumber = "MC ";
        }
      } else if (value === "Presidential Proclamation") {
        updatedFormData.referenceNumber = "Proclamation No. ";
      } else if (value === "Local Ordinance") {
        updatedFormData.referenceNumber = "Local Ordinance No. ";
      } else if (value === "Company Policy") {
        updatedFormData.referenceNumber = "Company Memo ";
      } else if (value === "Executive Order") {
        updatedFormData.referenceNumber = "EO No. ";
      } else if (value === "Presidential Decree") {
        updatedFormData.referenceNumber = "PD No. ";
      } else {
        updatedFormData.referenceNumber = "";
      }
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert PH date to UTC ISO for database storage
    const dataToSubmit = {
      ...formData,
      date: convertDatePHToUTCISO(formData.date),
    };

    if (formData._id) {
      dispatch(updateHoliday(dataToSubmit));
    } else {
      dispatch(createHoliday(dataToSubmit));
    }
  };

  const handleEdit = (holiday) => {
    setFormData({
      ...holiday,
      date: holiday.date ? formatDatePH(holiday.date) : "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    dispatch(deleteHoliday(deleteId));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: "bg-green-50 text-green-700 border-green-500",
      Suspended: "bg-red-50 text-red-700 border-red-500",
      Moved: "bg-blue-50 text-blue-700 border-blue-500",
      Cancelled: "bg-gray-50 text-gray-700 border-gray-500",
      Pending: "bg-yellow-50 text-yellow-700 border-yellow-500",
    };
    return statusConfig[status] || "bg-gray-50 text-gray-700 border-gray-500";
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      "Regular Holiday": "bg-purple-50 text-purple-700 border-purple-500",
      "Special Non-Working Holiday": "bg-blue-50 text-blue-700 border-blue-500",
      "Special Working Holiday": "bg-green-50 text-green-700 border-green-500",
      "Local Holiday": "bg-orange-50 text-orange-700 border-orange-500",
      "Company Holiday": "bg-teal-50 text-teal-700 border-teal-500",
      "Presidential Proclamation": "bg-red-50 text-red-700 border-red-500",
      "Emergency Declaration": "bg-pink-50 text-pink-700 border-pink-500",
      "Bridge Holiday": "bg-indigo-50 text-indigo-700 border-indigo-500",
    };
    return typeConfig[type] || "bg-gray-50 text-gray-700 border-gray-500";
  };

  const getPayRuleBadge = (payRule) => {
    const payConfig = {
      "200%": "bg-emerald-50 text-emerald-700 border-emerald-500",
      "130%": "bg-blue-50 text-blue-700 border-blue-500",
      "100%": "bg-gray-50 text-gray-700 border-gray-500",
      None: "bg-red-50 text-red-700 border-red-500",
    };
    return payConfig[payRule] || "bg-gray-50 text-gray-700 border-gray-500";
  };

  // Loading skeleton component for better UX
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
              <div className="h-3 bg-gray-300 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </td>
          <td className="p-4">
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
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
      {/* Enhanced Header - Mobile Optimized */}
      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Holiday Management
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Manage Philippines holidays and proclamations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-white/10 p-3 rounded-full">
              <FaCalendarAlt className="h-8 w-8" />
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
              <span className="hidden sm:inline">Add Holiday</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Holiday Search and Filters */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder={"Search holidays by name"}
        />

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Types</option>
              <option value="Regular Holiday">Regular Holiday</option>
              <option value="Special Non-Working Holiday">
                Special Non-Working
              </option>
              <option value="Special Working Holiday">Special Working</option>
              <option value="Local Holiday">Local Holiday</option>
              <option value="Company Holiday">Company Holiday</option>
              <option value="Presidential Proclamation">Presidential</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scope
            </label>
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Scopes</option>
              <option value="National">National</option>
              <option value="Regional">Regional</option>
              <option value="Local">Local</option>
              <option value="Company">Company</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Moved">Moved</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setTypeFilter("");
                setScopeFilter("");
                setStatusFilter("");
                setYearFilter(new Date().getFullYear().toString());
                setSearchValue("");
              }}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {searchValue && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">
                Search results for: "<strong>{searchValue}</strong>"
              </span>
              <span className="text-blue-600">
                {totalHoliday} holiday{totalHoliday !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Holidays Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-4 w-4 mr-2 text-blue-600" />
                    Holiday Name
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaClock className="h-4 w-4 mr-2 text-blue-600" />
                    Date
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaFlag className="h-4 w-4 mr-2 text-blue-600" />
                    Type & Status
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaGlobe className="h-4 w-4 mr-2 text-blue-600" />
                    Scope & Pay
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
                {holidays?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="text-blue-400 mb-2">
                        <FaCalendarAlt className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No holidays found
                      </h3>
                      <p className="text-gray-500">
                        {searchValue
                          ? "No holidays match your current search."
                          : "No holidays have been added yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  holidays?.map((holiday) => (
                    <tr
                      key={holiday._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                            <span className="text-blue-700 font-bold text-sm">
                              {holiday.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 mb-1 text-sm">
                              {holiday?.name}
                            </div>
                            {holiday.referenceNumber && (
                              <div className="text-xs text-gray-500">
                                Ref: {holiday.referenceNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {formatReadableDatePH(
                              holiday.date,
                              "dddd, MMMM D, YYYY"
                            )}
                          </div>
                          {holiday.isRecurring && (
                            <div className="text-xs text-green-600 font-medium">
                              Recurring
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeBadge(
                              holiday.type
                            )}`}
                          >
                            {holiday.type}
                          </span>
                          <br />
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                              holiday.status
                            )}`}
                          >
                            {holiday.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium text-gray-600">
                              {holiday.scope}
                            </span>
                            {holiday.province && (
                              <span className="text-xs text-gray-500 block">
                                {holiday.province}
                                {holiday.city && `, ${holiday.city}`}
                              </span>
                            )}
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPayRuleBadge(
                              holiday.payRule
                            )}`}
                          >
                            {holiday.payRule} Pay
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(holiday)}
                            className="inline-flex items-center px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                            disabled={loading}
                          >
                            <FaEdit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteConfirm(holiday._id, holiday.name)
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
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      {totalHoliday > perPage && (
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
                    {holidays.length === 0
                      ? 0
                      : (currentPage - 1) * perPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-blue-700">
                    {Math.min(currentPage * perPage, totalHoliday)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-blue-700">
                    {totalHoliday}
                  </span>{" "}
                  holidays
                </span>
              </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Page {currentPage} of {Math.ceil(totalHoliday / perPage)}
                </span>
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalHoliday}
                  perPage={perPage}
                  showItem={Math.min(5, Math.ceil(totalHoliday / perPage))}
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
                      {formData._id ? "Edit Holiday" : "Add New Holiday"}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {formData._id
                        ? "Update holiday information"
                        : "Create a new holiday declaration"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Holiday Name Field */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaCalendarAlt className="text-blue-600" />
                      <span>Holiday Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter holiday name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Date Field */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between text-sm font-semibold text-gray-700">
                      <div className="flex items-center space-x-2">
                        <FaClock className="text-green-600" />
                        <span>Date</span>
                      </div>
                      {formData.date && (
                        <span className="text-sm text-blue-700 font-medium">
                          {formatReadableDatePH(formData.date, "MMM D, YYYY")}
                        </span>
                      )}
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Type Selection Field */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaFlag className="text-purple-600" />
                      <span>Type</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    >
                      <option value="Regular Holiday">Regular Holiday</option>
                      <option value="Special Non-Working Holiday">
                        Special Non-Working Holiday
                      </option>
                      <option value="Special Working Holiday">
                        Special Working Holiday
                      </option>
                      <option value="Local Holiday">Local Holiday</option>
                      <option value="Company Holiday">Company Holiday</option>
                      <option value="Presidential Proclamation">
                        Presidential Proclamation
                      </option>
                      <option value="Emergency Declaration">
                        Emergency Declaration
                      </option>
                      <option value="Bridge Holiday">Bridge Holiday</option>
                    </select>
                  </div>

                  {/* Scope Selection Field */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaGlobe className="text-indigo-600" />
                      <span>Scope</span>
                    </label>
                    <select
                      name="scope"
                      value={formData.scope}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    >
                      <option value="National">National</option>
                      <option value="Regional">Regional</option>
                      <option value="Local">Local</option>
                      <option value="Company">Company</option>
                    </select>
                  </div>

                  {/* Work Status Field */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaShieldAlt className="text-orange-600" />
                      <span>Work Status</span>
                    </label>
                    <select
                      name="workStatus"
                      value={formData.workStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    >
                      <option value="Non-Working">Non-Working</option>
                      <option value="Working">Working</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>

                  {/* Pay Rule Field */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaUsers className="text-green-600" />
                      <span>Pay Rule</span>
                    </label>
                    <select
                      name="payRule"
                      value={formData.payRule}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    >
                      <option value="200%">200%</option>
                      <option value="130%">130%</option>
                      <option value="100%">100%</option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  {/* Status Field */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaFlag className="text-purple-600" />
                      <span>Status</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Moved">Moved</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Location Fields (for Local/Regional holidays) */}
                {(formData.scope === "Local" ||
                  formData.scope === "Regional") && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Region
                      </label>
                      <input
                        type="text"
                        name="region"
                        placeholder="Enter region"
                        value={formData.region}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Province
                      </label>
                      <input
                        type="text"
                        name="province"
                        placeholder="Enter province"
                        value={formData.province}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Additional Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Legal Basis Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Legal Basis
                    </label>
                    <select
                      name="legalBasis"
                      value={formData.legalBasis}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="Republic Act">Republic Act</option>
                      <option value="Presidential Decree">
                        Presidential Decree
                      </option>
                      <option value="Presidential Proclamation">
                        Presidential Proclamation
                      </option>
                      <option value="Executive Order">Executive Order</option>
                      <option value="Local Ordinance">Local Ordinance</option>
                      <option value="Company Policy">Company Policy</option>
                      <option value="Memorandum Circular">
                        Memorandum Circular
                      </option>
                    </select>
                  </div>

                  {/* Reference Number Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      name="referenceNumber"
                      placeholder="RA 1234, Proclamation 567, etc."
                      value={formData.referenceNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isRecurring"
                      checked={formData.isRecurring}
                      onChange={handleChange}
                      className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <label className="ml-3 text-sm font-medium text-gray-700">
                      Recurring Annual Holiday
                    </label>
                  </div>
                </div>

                {/* Notes Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Additional notes or description"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
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
                  <FaExclamationTriangle className="text-3xl text-red-500" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium text-lg">
                    Delete "{deleteName}" holiday?
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    This holiday will be permanently removed from the system.
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

export default HolidayManagement;
