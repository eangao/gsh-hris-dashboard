import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeaveTemplates,
  createLeaveTemplate,
  updateLeaveTemplate,
  deleteLeaveTemplate,
  toggleLeaveTemplateStatus,
  messageClear,
} from "./../../../../store/Reducers/leaveTemplateReducer";

import Pagination from "./../../../../components/Pagination";
import Search from "./../../../../components/Search";

import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaClipboardList,
  FaGavel,
  FaFlag,
  FaClock,
  FaUsers,
  FaExclamationTriangle,
  FaShieldAlt,
  FaToggleOn,
  FaToggleOff,
  FaCalendarCheck,
  FaFileAlt,
  FaMedkit,
  FaMoneyBillWave,
  FaUserCheck,
  FaGenderless,
} from "react-icons/fa";

import { buttonOverrideStyle } from "./../../../../utils/utils";
import { PropagateLoader } from "react-spinners";

const LeaveTemplates = () => {
  const dispatch = useDispatch();

  const {
    leaveTemplates,
    totalLeaveTemplates,
    loading,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.leaveTemplates);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [perPage, setPerpage] = useState(5);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("true");
  const [mandatoryFilter, setMandatoryFilter] = useState("");

  // Reset page to 1 when searchValue changes
  useEffect(() => {
    if (searchValue && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchValue, currentPage]);

  // Optimize getLeaveTemplates with useCallback
  const getLeaveTemplates = useCallback(() => {
    const obj = {
      perPage: parseInt(perPage),
      page: parseInt(currentPage),
      searchValue,
      category: categoryFilter || undefined,
      isActive: activeFilter || undefined,
      isMandatoryByLaw: mandatoryFilter || undefined,
    };
    dispatch(fetchLeaveTemplates(obj));
  }, [
    currentPage,
    perPage,
    searchValue,
    categoryFilter,
    activeFilter,
    mandatoryFilter,
    dispatch,
  ]);

  // Fetch data when dependencies change
  useEffect(() => {
    getLeaveTemplates();
  }, [getLeaveTemplates]);

  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    category: "vacation",
    description: "",
    maxDaysPerYear: 15,
    maxConsecutiveDays: 5,
    requiresMedicalCertificate: false,
    isPaid: true,
    minAdvanceNoticeDays: 1,
    isCarryOverAllowed: false,
    genderEligibility: "both",
    minServicePeriodMonths: 0,
    isActive: true,
    legalBasis: "",
    isMandatoryByLaw: false,
    requiresGovernmentBenefitCoordination: false,
    requiredDocuments: [],
    isCompensatoryTimeOff: false,
    compensatoryRate: 1.0,
    maxAccumulatedDays: 0,
    ctoExpiryMonths: 12,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState(null);

  // Optimize reset form with useCallback
  const resetForm = useCallback(() => {
    setFormData({
      _id: null,
      name: "",
      category: "vacation",
      description: "",
      maxDaysPerYear: 15,
      maxConsecutiveDays: 5,
      requiresMedicalCertificate: false,
      isPaid: true,
      minAdvanceNoticeDays: 1,
      isCarryOverAllowed: false,
      genderEligibility: "both",
      minServicePeriodMonths: 0,
      isActive: true,
      legalBasis: "",
      isMandatoryByLaw: false,
      requiresGovernmentBenefitCoordination: false,
      requiredDocuments: [],
      isCompensatoryTimeOff: false,
      compensatoryRate: 1.0,
      maxAccumulatedDays: 0,
      ctoExpiryMonths: 12,
    });
  }, []);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      getLeaveTemplates();
      setIsModalOpen(false);
      setDeleteId(null);
      resetForm();
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, getLeaveTemplates, resetForm, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // Auto-sync dependent fields when category changes
    if (name === "category") {
      // Set defaults based on category
      if (value === "maternity") {
        updatedFormData.genderEligibility = "female";
        updatedFormData.maxDaysPerYear = 105; // Philippine law
        updatedFormData.isMandatoryByLaw = true;
        updatedFormData.legalBasis =
          "RA 11210 (105-Day Expanded Maternity Leave Act)";
        updatedFormData.requiresGovernmentBenefitCoordination = true;
        updatedFormData.requiredDocuments = [
          "medical_certificate",
          "certification_from_attending_physician",
        ];
      } else if (value === "paternity") {
        updatedFormData.genderEligibility = "male";
        updatedFormData.maxDaysPerYear = 7; // Philippine law
        updatedFormData.isMandatoryByLaw = true;
        updatedFormData.legalBasis = "RA 8972 (Paternity Leave Act of 2000)";
        updatedFormData.requiresGovernmentBenefitCoordination = false;
        updatedFormData.requiredDocuments = ["marriage_certificate"];
      } else if (value === "sick") {
        updatedFormData.maxDaysPerYear = 15;
        updatedFormData.requiresMedicalCertificate = true;
        updatedFormData.isMandatoryByLaw = true;
        updatedFormData.legalBasis = "Labor Code of the Philippines";
        updatedFormData.requiredDocuments = ["medical_certificate"];
      } else if (value === "compensatory") {
        updatedFormData.isCompensatoryTimeOff = true;
        updatedFormData.compensatoryRate = 1.25;
        updatedFormData.maxAccumulatedDays = 30;
        updatedFormData.requiredDocuments = [
          "overtime_record",
          "supervisor_approval",
        ];
      } else {
        updatedFormData.genderEligibility = "both";
        updatedFormData.isMandatoryByLaw = false;
        updatedFormData.legalBasis = "";
        updatedFormData.requiresGovernmentBenefitCoordination = false;
        updatedFormData.requiredDocuments = [];
        updatedFormData.isCompensatoryTimeOff = false;
      }
    }

    // Auto-sync compensatory fields
    if (name === "isCompensatoryTimeOff") {
      if (checked) {
        updatedFormData.category = "compensatory";
        updatedFormData.compensatoryRate = 1.25;
        updatedFormData.maxAccumulatedDays = 30;
        updatedFormData.requiredDocuments = [
          "overtime_record",
          "supervisor_approval",
        ];
      } else {
        updatedFormData.compensatoryRate = 1.0;
        updatedFormData.maxAccumulatedDays = 0;
      }
    }

    setFormData(updatedFormData);
  };

  const handleDocumentChange = (document, checked) => {
    const updatedDocuments = checked
      ? [...formData.requiredDocuments, document]
      : formData.requiredDocuments.filter((doc) => doc !== document);

    setFormData({
      ...formData,
      requiredDocuments: updatedDocuments,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (formData.maxConsecutiveDays > formData.maxDaysPerYear) {
      toast.error(
        "Maximum consecutive days cannot exceed maximum days per year"
      );
      return;
    }

    if (formData._id) {
      dispatch(updateLeaveTemplate(formData));
    } else {
      dispatch(createLeaveTemplate(formData));
    }
  };

  const handleEdit = (template) => {
    setFormData({
      ...template,
      requiredDocuments: template.requiredDocuments || [],
    });
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id, name) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = () => {
    dispatch(deleteLeaveTemplate(deleteId));
  };

  const handleToggleStatus = (id) => {
    dispatch(toggleLeaveTemplateStatus(id));
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      sick: "bg-red-50 text-red-700 border-red-500",
      vacation: "bg-blue-50 text-blue-700 border-blue-500",
      emergency: "bg-orange-50 text-orange-700 border-orange-500",
      maternity: "bg-pink-50 text-pink-700 border-pink-500",
      paternity: "bg-cyan-50 text-cyan-700 border-cyan-500",
      bereavement: "bg-gray-50 text-gray-700 border-gray-500",
      personal: "bg-purple-50 text-purple-700 border-purple-500",
      study: "bg-indigo-50 text-indigo-700 border-indigo-500",
      compensatory: "bg-green-50 text-green-700 border-green-500",
      special: "bg-yellow-50 text-yellow-700 border-yellow-500",
    };
    return (
      categoryConfig[category] || "bg-gray-50 text-gray-700 border-gray-500"
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive
      ? "bg-green-50 text-green-700 border-green-500"
      : "bg-red-50 text-red-700 border-red-500";
  };

  // Loading skeleton component
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

  const availableDocuments = [
    { value: "medical_certificate", label: "Medical Certificate" },
    { value: "police_report", label: "Police Report" },
    { value: "death_certificate", label: "Death Certificate" },
    { value: "marriage_certificate", label: "Marriage Certificate" },
    { value: "adoption_papers", label: "Adoption Papers" },
    { value: "solo_parent_id", label: "Solo Parent ID" },
    {
      value: "certification_from_attending_physician",
      label: "Physician Certification",
    },
    { value: "overtime_record", label: "Overtime Record" },
    { value: "holiday_work_record", label: "Holiday Work Record" },
    { value: "supervisor_approval", label: "Supervisor Approval" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="mb-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Leave Templates Management
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Manage leave types, policies, and Philippine labor law compliance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block bg-white/10 p-3 rounded-full">
              <FaClipboardList className="h-8 w-8" />
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
              <span className="hidden sm:inline">Add Leave Template</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
        <Search
          setPerpage={setPerpage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          inputPlaceholder={"Search leave templates by name or description"}
        />

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Categories</option>
              <option value="sick">Sick Leave</option>
              <option value="vacation">Vacation Leave</option>
              <option value="emergency">Emergency Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
              <option value="bereavement">Bereavement Leave</option>
              <option value="personal">Personal Leave</option>
              <option value="study">Study Leave</option>
              <option value="compensatory">Compensatory Leave</option>
              <option value="special">Special Leave</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Legal Requirement
            </label>
            <select
              value={mandatoryFilter}
              onChange={(e) => setMandatoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Types</option>
              <option value="true">Mandatory by Law</option>
              <option value="false">Company Policy</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setCategoryFilter("");
                setActiveFilter("");
                setMandatoryFilter("");
                setSearchValue("");
                setCurrentPage(1);
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
                {totalLeaveTemplates} template
                {totalLeaveTemplates !== 1 ? "s" : ""} found
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaClipboardList className="h-4 w-4 mr-2 text-blue-600" />
                    Leave Template
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaFlag className="h-4 w-4 mr-2 text-blue-600" />
                    Category & Status
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaCalendarCheck className="h-4 w-4 mr-2 text-blue-600" />
                    Allocation & Rules
                  </div>
                </th>
                <th className="p-4 text-sm font-semibold text-gray-700">
                  <div className="flex items-center">
                    <FaGavel className="h-4 w-4 mr-2 text-blue-600" />
                    Legal & Payment
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
                {leaveTemplates?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="text-blue-400 mb-2">
                        <FaClipboardList className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No leave templates found
                      </h3>
                      <p className="text-gray-500">
                        {searchValue
                          ? "No templates match your current search."
                          : "No leave templates have been added yet."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  leaveTemplates?.map((template) => (
                    <tr
                      key={template._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                            <span className="text-blue-700 font-bold text-sm">
                              {template.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 mb-1 text-sm capitalize">
                              {template?.name}
                            </div>
                            {template.description && (
                              <div className="text-xs text-gray-500 truncate max-w-40">
                                {template.description}
                              </div>
                            )}
                            {template.legalBasis && (
                              <div className="text-xs text-blue-600 font-medium">
                                {template.legalBasis}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getCategoryBadge(
                              template.category
                            )}`}
                          >
                            {template.category}
                          </span>
                          <br />
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                              template.isActive
                            )}`}
                          >
                            {template.isActive ? "Active" : "Inactive"}
                          </span>
                          {template.isMandatoryByLaw && (
                            <div className="text-xs text-purple-600 font-medium flex items-center gap-1">
                              <FaGavel className="h-3 w-3" />
                              Legal Requirement
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <FaCalendarCheck className="h-3 w-3 text-blue-600" />
                            <span className="font-medium">
                              {template.maxDaysPerYear}
                            </span>{" "}
                            days/year
                          </div>
                          <div className="flex items-center gap-1">
                            <FaClock className="h-3 w-3 text-green-600" />
                            <span className="font-medium">
                              {template.maxConsecutiveDays}
                            </span>{" "}
                            consecutive
                          </div>
                          {template.requiresMedicalCertificate && (
                            <div className="text-xs text-red-600 flex items-center gap-1">
                              <FaMedkit className="h-3 w-3" />
                              Medical Cert Required
                            </div>
                          )}
                          {template.genderEligibility &&
                            template.genderEligibility !== "both" && (
                              <div className="text-xs text-purple-600 flex items-center gap-1">
                                <FaGenderless className="h-3 w-3" />
                                {template.genderEligibility === "male"
                                  ? "Male Only"
                                  : template.genderEligibility === "female"
                                  ? "Female Only"
                                  : `${template.genderEligibility} Only`}
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <FaMoneyBillWave
                              className={`h-3 w-3 ${
                                template.isPaid
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                template.isPaid
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {template.isPaid ? "Paid" : "Unpaid"}
                            </span>
                          </div>
                          {template.requiresGovernmentBenefitCoordination && (
                            <div className="text-xs text-blue-600 flex items-center gap-1">
                              <FaShieldAlt className="h-3 w-3" />
                              SSS Coordination
                            </div>
                          )}
                          {template.isCompensatoryTimeOff && (
                            <div className="text-xs text-green-600 flex items-center gap-1">
                              <FaUserCheck className="h-3 w-3" />
                              CTO Rate: {template.compensatoryRate}x
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(template._id)}
                            className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm ${
                              template.isActive
                                ? "bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border-red-200 hover:border-red-300"
                                : "bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border-green-200 hover:border-green-300"
                            }`}
                            disabled={loading}
                            title={
                              template.isActive ? "Deactivate" : "Activate"
                            }
                          >
                            {template.isActive ? (
                              <FaToggleOff className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <FaToggleOn className="h-3.5 w-3.5 mr-1" />
                            )}
                            {template.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleEdit(template)}
                            className="inline-flex items-center px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-300 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm"
                            disabled={loading}
                          >
                            <FaEdit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteConfirm(template._id, template.name)
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
      {totalLeaveTemplates > perPage && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                    {leaveTemplates.length === 0
                      ? 0
                      : (currentPage - 1) * perPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-blue-700">
                    {Math.min(currentPage * perPage, totalLeaveTemplates)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-blue-700">
                    {totalLeaveTemplates}
                  </span>{" "}
                  templates
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-end">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">
                  Page {currentPage} of{" "}
                  {Math.ceil(totalLeaveTemplates / perPage)}
                </span>
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalLeaveTemplates}
                  perPage={perPage}
                  showItem={Math.min(
                    5,
                    Math.ceil(totalLeaveTemplates / perPage)
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
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
                        ? "Edit Leave Template"
                        : "Add New Leave Template"}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {formData._id
                        ? "Update leave template configuration"
                        : "Create a new leave type and policy"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaClipboardList className="text-blue-600" />
                      <span>Leave Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter leave template name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaFlag className="text-purple-600" />
                      <span>Category</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    >
                      <option value="sick">Sick Leave</option>
                      <option value="vacation">Vacation Leave</option>
                      <option value="emergency">Emergency Leave</option>
                      <option value="maternity">Maternity Leave</option>
                      <option value="paternity">Paternity Leave</option>
                      <option value="bereavement">Bereavement Leave</option>
                      <option value="personal">Personal Leave</option>
                      <option value="study">Study Leave</option>
                      <option value="compensatory">Compensatory Leave</option>
                      <option value="special">Special Leave</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe the leave policy and usage guidelines"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Leave Allocation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaCalendarCheck className="text-green-600" />
                      <span>Max Days Per Year</span>
                    </label>
                    <input
                      type="number"
                      name="maxDaysPerYear"
                      value={formData.maxDaysPerYear}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaClock className="text-orange-600" />
                      <span>Max Consecutive Days</span>
                    </label>
                    <input
                      type="number"
                      name="maxConsecutiveDays"
                      value={formData.maxConsecutiveDays}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Policy Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaClock className="text-indigo-600" />
                      <span>Min Advance Notice (Days)</span>
                    </label>
                    <input
                      type="number"
                      name="minAdvanceNoticeDays"
                      value={formData.minAdvanceNoticeDays}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaUserCheck className="text-cyan-600" />
                      <span>Min Service Period (Months)</span>
                    </label>
                    <input
                      type="number"
                      name="minServicePeriodMonths"
                      value={formData.minServicePeriodMonths}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Eligibility and Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <FaGenderless className="text-purple-600" />
                      <span>Gender Eligibility</span>
                    </label>
                    <select
                      name="genderEligibility"
                      value={formData.genderEligibility}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="both">Both Male & Female</option>
                      <option value="male">Male Only</option>
                      <option value="female">Female Only</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Legal Basis
                    </label>
                    <input
                      type="text"
                      name="legalBasis"
                      placeholder="e.g., RA 11210, Labor Code Art. 95"
                      value={formData.legalBasis}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Compensatory Time Off Fields */}
                {formData.isCompensatoryTimeOff && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="text-sm font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <FaUserCheck className="text-green-600" />
                      Compensatory Time Off Settings
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Compensation Rate
                        </label>
                        <input
                          type="number"
                          name="compensatoryRate"
                          value={formData.compensatoryRate}
                          onChange={handleChange}
                          min="1"
                          step="0.25"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Max Accumulated Days
                        </label>
                        <input
                          type="number"
                          name="maxAccumulatedDays"
                          value={formData.maxAccumulatedDays}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Expiry Months
                        </label>
                        <input
                          type="number"
                          name="ctoExpiryMonths"
                          value={formData.ctoExpiryMonths}
                          onChange={handleChange}
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Required Documents */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FaFileAlt className="text-yellow-600" />
                    <span>Required Documents</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
                    {availableDocuments.map((doc) => (
                      <label
                        key={doc.value}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={formData.requiredDocuments.includes(
                            doc.value
                          )}
                          onChange={(e) =>
                            handleDocumentChange(doc.value, e.target.checked)
                          }
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{doc.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isPaid"
                        checked={formData.isPaid}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaMoneyBillWave className="text-green-600" />
                        Paid Leave
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="requiresMedicalCertificate"
                        checked={formData.requiresMedicalCertificate}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaMedkit className="text-red-600" />
                        Requires Medical Certificate
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isCarryOverAllowed"
                        checked={formData.isCarryOverAllowed}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaCalendarCheck className="text-blue-600" />
                        Allow Carry Over to Next Year
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaToggleOn className="text-green-600" />
                        Active Template
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isMandatoryByLaw"
                        checked={formData.isMandatoryByLaw}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaGavel className="text-purple-600" />
                        Mandatory by Philippine Law
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="requiresGovernmentBenefitCoordination"
                        checked={formData.requiresGovernmentBenefitCoordination}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaShieldAlt className="text-blue-600" />
                        SSS Coordination Required
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isCompensatoryTimeOff"
                        checked={formData.isCompensatoryTimeOff}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 rounded border-2 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <label className="ml-3 text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaUserCheck className="text-green-600" />
                        Compensatory Time Off
                      </label>
                    </div>
                  </div>
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
                  <p className="text-gray-800 font-medium text-lg capitalize">
                    Delete "{deleteName}" leave template?
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    This leave template will be permanently removed from the
                    system.
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

export default LeaveTemplates;
