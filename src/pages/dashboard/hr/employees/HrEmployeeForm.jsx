import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEmployee,
  fetchEmployeeById,
  messageClear,
  updateEmployee,
} from "../../../../store/Reducers/employeeReducer";
import { fetchAllEmploymentStatus } from "../../../../store/Reducers/employmentStatusReducer";
import { fetchAllReligions } from "../../../../store/Reducers/religionReducer";
import { fetchAllPositions } from "../../../../store/Reducers/positionReducer";
import { fetchAllDepartments } from "../../../../store/Reducers/departmentReducer";
import { fetchAllClusters } from "../../../../store/Reducers/clusterReducer";

import toast from "react-hot-toast";
import FormDatePicker from "../../../../components/FormDatePicker";
import {
  convertDatePHToUTCISO,
  formatDatePH,
  getBirthdateLimits,
  getTodayDatePH,
} from "../../../../utils/phDateUtils";

const HrEmployeeForm = () => {
  const { employeeId } = useParams(); // This will be undefined for add
  const isEditMode = !!employeeId;

  const { minDate, maxDate } = getBirthdateLimits();

  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { employee, loading, errorMessage, successMessage } = useSelector(
    (state) => state.employee
  );
  const { departments } = useSelector((state) => state.department);
  const { positions } = useSelector((state) => state.position);
  const { employmentStatuses } = useSelector((state) => state.employmentStatus);
  const { religions } = useSelector((state) => state.religion);

  const [formData, setFormData] = useState({
    personalInformation: {
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      civilStatus: "",
      maidenName: "",
      birthdate: "",
      gender: "",
      religion: "",
      temporaryAddress: "",
      permanentAddress: "",
      phoneNumber: "",
      photoUrl: "",
    },

    educationInformation: {
      highestAttainment: "",
      isLicensedProfessional: false,
      prcNumber: "",
      schoolsAttended: [],
    },
    employmentInformation: {
      hospitalEmployeeId: "",
      scheduleType: "",
      position: "",
      department: null,
      employmentStatus: "",
      dateStarted: "",
      dateTransferToGSH: "",
      dateEmployed: "",
      statusHistory: [], // Added status history array
    },
    governmentInformation: {
      sssNumber: "",
      philhealthNumber: "",
      pagibigNumber: "",
      tin: "",
    },
  });

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchAllDepartments());
    dispatch(fetchAllPositions());
    dispatch(fetchAllReligions());
    dispatch(fetchAllEmploymentStatus());
    dispatch(fetchAllClusters());

    if (isEditMode) {
      dispatch(fetchEmployeeById(employeeId)); // Assuming you have this action
    }
  }, [dispatch, isEditMode, employeeId]);

  useEffect(() => {
    if (isEditMode && employee) {
      const formattedStatusHistory =
        employee.employmentInformation?.statusHistory?.map((item) => ({
          ...item,
          dateEffective: formatDatePH(item.dateEffective),
        })) || [];

      setFormData({
        ...employee,
        personalInformation: {
          ...employee.personalInformation,
          birthdate: formatDatePH(employee.personalInformation?.birthdate),
        },
        employmentInformation: {
          ...employee.employmentInformation,
          dateStarted: formatDatePH(
            employee.employmentInformation?.dateStarted
          ),
          dateEmployed: formatDatePH(
            employee.employmentInformation?.dateEmployed
          ),
          dateTransferToGSH: formatDatePH(
            employee.employmentInformation?.dateTransferToGSH
          ),
          statusHistory: formattedStatusHistory, // ✅ apply formatting to each item
        },
      });
    }
  }, [employee, isEditMode]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      if (successMessage) {
        toast.success(successMessage);

        navigate(-1);
      }

      if (errorMessage) {
        toast.error(errorMessage);
      }

      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const handleChange = useCallback((section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  }, []);

  //===============Handle Maiden Name start====================
  const [isMaiden, setIsMaiden] = useState(false);

  const handleMaidenNameVisibility = useCallback(
    (civilStatus, gender) => {
      if (civilStatus === "MARRIED" && gender === "FEMALE") {
        setIsMaiden(true);
      } else {
        setIsMaiden(false);
        handleChange("personalInformation", "maidenName", "");
      }
    },
    [handleChange]
  );

  // Set maiden name visibility when employee data loads
  useEffect(() => {
    if (isEditMode && employee) {
      handleMaidenNameVisibility(
        employee.personalInformation?.civilStatus,
        employee.personalInformation?.gender
      );
    }
  }, [employee, isEditMode, handleMaidenNameVisibility]);

  // Also trigger maiden name visibility when form data changes
  useEffect(() => {
    handleMaidenNameVisibility(
      formData.personalInformation.civilStatus,
      formData.personalInformation.gender
    );
  }, [
    formData.personalInformation.civilStatus,
    formData.personalInformation.gender,
    handleMaidenNameVisibility,
  ]);

  //===============Handle Maiden Name end====================

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (isEditMode) {
  //     dispatch(updateEmployee({ id, employeeData: formData }));
  //   } else {
  //     dispatch(createEmployee(formData));
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔁 Deep copy form data
    const dataToSubmit = JSON.parse(JSON.stringify(formData));

    // 🔁 Convert personal birthdate
    if (dataToSubmit.personalInformation.birthdate) {
      dataToSubmit.personalInformation.birthdate = convertDatePHToUTCISO(
        dataToSubmit.personalInformation.birthdate
      );
    }

    // 🔁 Convert employment dates
    const emp = dataToSubmit.employmentInformation;
    ["dateStarted", "dateEmployed", "dateTransferToGSH"].forEach((field) => {
      if (emp[field]) {
        emp[field] = convertDatePHToUTCISO(emp[field]);
      }
    });

    // 🔁 Convert statusHistory dates
    if (Array.isArray(emp.statusHistory)) {
      emp.statusHistory = emp.statusHistory.map((item) => ({
        ...item,
        dateEffective: item.dateEffective
          ? convertDatePHToUTCISO(item.dateEffective)
          : null,
      }));
    }

    // ✅ Final dispatch
    if (isEditMode) {
      dispatch(updateEmployee({ employeeId, employeeData: dataToSubmit }));
    } else {
      dispatch(createEmployee(dataToSubmit));
    }
  };

  //======================== School Attended Start============================

  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isEditingSchool, setIsEditingSchool] = useState(false);
  const [selectedSchoolIndex, setSelectedSchoolIndex] = useState(null);
  const [isDeleteSchoolModalOpen, setIsDeleteSchoolModalOpen] = useState(false);

  const [schoolFormData, setSchoolFormData] = useState({
    schoolName: "",
    educationLevel: "",
    degree: "",
    yearGraduated: "",
  });

  // Reset School Form
  const resetSchoolForm = () => {
    setSchoolFormData({
      schoolName: "",
      educationLevel: "",
      degree: "",
      yearGraduated: "",
    });
  };

  const handleAddSchool = () => {
    const { schoolName, educationLevel, yearGraduated } = schoolFormData;

    //==================================================
    //TEMPORARY COMMENTED TO ENCODE EMPLOYEE EITH LACKING INFO
    //FOR INITIAL RELEASE
    //==================================================
    // Validation check
    // if (!schoolName || !educationLevel || !yearGraduated) {
    //   alert("Please fill in all required fields.");
    //   return;
    // }
    //==================================================

    const schoolFormDatas = [...formData.educationInformation.schoolsAttended];
    schoolFormDatas.push(schoolFormData);

    setFormData({
      ...formData,
      educationInformation: {
        ...formData.educationInformation,
        schoolsAttended: schoolFormDatas,
      },
    });

    setIsSchoolModalOpen(false);
  };

  const handleEditSchool = () => {
    const { schoolName, educationLevel, yearGraduated } = schoolFormData;
    //==================================================
    //TEMPORARY COMMENTED TO ENCODE EMPLOYEE EITH LACKING INFO
    //FOR INITIAL RELEASE
    //==================================================
    // Validation check
    // if (!schoolName || !educationLevel || !yearGraduated) {
    //   alert("Please fill in all required fields.");
    //   return;
    // }
    //==================================================

    const newSchools = [...formData.educationInformation.schoolsAttended];
    newSchools[selectedSchoolIndex] = schoolFormData;

    setFormData({
      ...formData,
      educationInformation: {
        ...formData.educationInformation,
        schoolsAttended: newSchools,
      },
    });

    resetSchoolForm();
    setIsEditingSchool(false);
    setIsSchoolModalOpen(false);
  };

  const handleDeleteSchool = () => {
    const newSchools = formData.educationInformation.schoolsAttended.filter(
      (_, index) => index !== selectedSchoolIndex
    );

    setFormData({
      ...formData,
      educationInformation: {
        ...formData.educationInformation,
        schoolsAttended: newSchools,
      },
    });

    setIsDeleteSchoolModalOpen(false);
  };
  //================ School Attended End  ===========

  //===================================================
  // Employment Status History
  //===================================================

  // Modal states for Employment Status History
  const [
    isEmploymentStatusHistoryModalOpen,
    setIsEmploymentStatusHistoryModalOpen,
  ] = useState(false);

  const [
    isEditingEmploymentStatusHistory,
    setIsEditingEmploymentStatusHistory,
  ] = useState(false);

  const [
    isDeleteEmploymentStatusHistoryModalOpen,
    setIsDeleteEmploymentStatusHistoryModalOpen,
  ] = useState(false);
  const [
    selectedEmploymentStatusHistoryIndex,
    setSelectedEmploymentStatusHistoryIndex,
  ] = useState(null);

  // Employement Status History Modal Form State
  const [employmentstatusHistoryFormData, setEmploymentStatusHistoryFormData] =
    useState({
      statusId: "",
      dateEffective: "",
      remarks: "",
    });

  // Reset Employement Status History
  const resetEmploymentStatusHistoryForm = () => {
    setEmploymentStatusHistoryFormData({
      statusId: "",
      dateEffective: "",
      remarks: "",
    });
  };

  const handleAddEmploymentStatusHistory = () => {
    const { statusId, dateEffective, remarks } =
      employmentstatusHistoryFormData;

    // Validation check: Ensure all fields are filled
    if (!statusId || !dateEffective) {
      alert("Please fill in all the required fields.");
      return; // Stop execution if any field is empty
    }

    const newStatusHistory = [...formData.employmentInformation.statusHistory];
    newStatusHistory.push(employmentstatusHistoryFormData);

    setFormData({
      ...formData,
      employmentInformation: {
        ...formData.employmentInformation,
        statusHistory: newStatusHistory,
      },
    });

    setEmploymentStatusHistoryFormData({
      statusId: "",
      dateEffective: "",
      remarks: "",
    });

    resetEmploymentStatusHistoryForm();
    setIsEmploymentStatusHistoryModalOpen(false);
  };

  const handleEditEmploymentStatusHistory = () => {
    const { statusId, dateEffective, remarks } =
      employmentstatusHistoryFormData;

    // Validation check: Ensure all fields are filled
    if (!statusId || !dateEffective) {
      alert("Please fill in all the required fields.");
      return; // Stop execution if any field is empty
    }

    const newStatusHistory = [...formData.employmentInformation.statusHistory];
    newStatusHistory[selectedEmploymentStatusHistoryIndex] =
      employmentstatusHistoryFormData;

    setFormData({
      ...formData,
      employmentInformation: {
        ...formData.employmentInformation,
        statusHistory: newStatusHistory,
      },
    });

    resetEmploymentStatusHistoryForm();
    setIsEditingEmploymentStatusHistory(false);
    setIsEmploymentStatusHistoryModalOpen(false);
  };

  const handleDeleteEmploymentStatusHistory = () => {
    const newStatusHistory =
      formData.employmentInformation.statusHistory.filter(
        (_, index) => index !== selectedEmploymentStatusHistoryIndex
      );

    setFormData({
      ...formData,
      employmentInformation: {
        ...formData.employmentInformation,
        statusHistory: newStatusHistory,
      },
    });

    setIsDeleteEmploymentStatusHistoryModalOpen(false);
  };
  //================ Employement Status History  ===========

  //===============Handle position start====================
  const [selectedPositionLevel, setSelectedPositionLevel] = useState("");

  const handlePositionChange = (selectedId) => {
    const selectedPos = positions.find((pos) => pos._id === selectedId);
    const level = selectedPos?.level?.toLowerCase() || "";

    setSelectedPositionLevel(level);
    handleChange("employmentInformation", "position", selectedId);

    // Clear hidden fields
    if (
      level === "executive" ||
      level === "directorial" ||
      level === "managerial" ||
      level === "supervisory" ||
      level === "physician"
    ) {
      handleChange("employmentInformation", "department", null);
    }
  };

  const isDepartmentVisible = () => {
    const hiddenPositionsLevel = [
      "executive",
      "directorial",
      "managerial",
      "supervisory",
      "physician",
    ];
    return !hiddenPositionsLevel.includes(selectedPositionLevel);
  };

  //to handel the edit
  useEffect(() => {
    const selectedId = formData?.employmentInformation?.position;
    if (selectedId && positions.length > 0) {
      const selectedPos = positions.find((pos) => pos._id === selectedId);
      const level = selectedPos?.level?.toLowerCase() || "";
      setSelectedPositionLevel(level);
    }
  }, [formData?.employmentInformation?.position, positions]);

  //===============Handle position end====================

  // const departmentOptions = departments.map((dept) => ({
  //   value: dept._id,
  //   label: dept.name,
  // }));

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Memoized values for performance
  const birthdateLimits = useMemo(() => getBirthdateLimits(), []);

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg shadow-md p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {isEditMode ? "Update Employee Record" : "Add New Employee"}
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  {isEditMode
                    ? "Update employee information and records"
                    : "Create a new employee record with complete information"}
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* ============================================================== */}
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Personal Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Basic personal details and identification information
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.personalInformation.firstName}
                    onChange={(e) =>
                      handleChange(
                        "personalInformation",
                        "firstName",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.personalInformation.middleName}
                    onChange={(e) =>
                      handleChange(
                        "personalInformation",
                        "middleName",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter middle name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.personalInformation.lastName}
                    onChange={(e) =>
                      handleChange(
                        "personalInformation",
                        "lastName",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter last name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Suffix
                  </label>
                  <select
                    name="suffix"
                    value={formData.personalInformation.suffix || ""}
                    onChange={(e) =>
                      handleChange(
                        "personalInformation",
                        "suffix",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">Select Suffix</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                    <option value="VI">VI</option>
                    <option value="VII">VII</option>
                    <option value="VIII">VIII</option>
                    <option value="IX">IX</option>
                    <option value="X">X</option>
                  </select>
                </div>

                {/* Maiden Name Field - Hidden if Civil Status is 'Single' */}
                {isMaiden && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Maiden Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="maidenName"
                      value={formData.personalInformation.maidenName}
                      onChange={(e) =>
                        handleChange(
                          "personalInformation",
                          "maidenName",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter maiden name"
                      required={isMaiden}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Civil Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="civilStatus"
                    value={formData.personalInformation.civilStatus}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange("personalInformation", "civilStatus", value);
                      handleMaidenNameVisibility(
                        value,
                        formData.personalInformation.gender
                      );
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  >
                    <option value="">Select Civil Status</option>
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED">Married</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.personalInformation.gender}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange("personalInformation", "gender", value);
                      handleMaidenNameVisibility(
                        formData.personalInformation.civilStatus,
                        value
                      );
                    }}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Birthdate <span className="text-red-500">*</span>
                  </label>
                  <FormDatePicker
                    name="birthdate"
                    value={formData.personalInformation.birthdate}
                    onChange={(field, value) =>
                      handleChange("personalInformation", field, value)
                    }
                    required
                    placeholder="Select Birthdate"
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Religion
                  </label>
                  <select
                    name="religion"
                    value={formData.personalInformation.religion}
                    onChange={(e) =>
                      handleChange(
                        "personalInformation",
                        "religion",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">Select Religion</option>
                    {religions.map((religion) => (
                      <option key={religion._id} value={religion._id}>
                        {religion.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.personalInformation.phoneNumber}
                    onChange={(e) =>
                      handleChange(
                        "personalInformation",
                        "phoneNumber",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2 md:col-span-2 xl:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Temporary Address
                  </label>
                  <textarea
                    value={formData.personalInformation.temporaryAddress}
                    onChange={(e) =>
                      handleChange(
                        "personalInformation",
                        "temporaryAddress",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                    placeholder="Enter temporary address"
                    rows="3"
                  />
                </div>

                <div className="space-y-2 md:col-span-2 xl:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Permanent Address
                  </label>
                  <textarea
                    value={formData.personalInformation.permanentAddress}
                    onChange={(e) =>
                      handleChange(
                        "personalInformation",
                        "permanentAddress",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                    placeholder="Enter permanent address"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* ============================================================== */}
          {/* Employment Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
                Employment Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Employment details and job-related information
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.employmentInformation.hospitalEmployeeId}
                    onChange={(e) =>
                      handleChange(
                        "employmentInformation",
                        "hospitalEmployeeId",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    placeholder="Enter employee ID"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Schedule Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="scheduleType"
                    value={formData.employmentInformation?.scheduleType}
                    onChange={(e) =>
                      handleChange(
                        "employmentInformation",
                        "scheduleType",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    required
                  >
                    <option value="">Select Schedule Type</option>
                    <option value="Standard">Standard</option>
                    <option value="Shifting">Shifting</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.employmentInformation.position}
                    onChange={(e) => handlePositionChange(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    required
                  >
                    <option value="">Select Position</option>
                    {positions.map((pos) => (
                      <option key={pos._id} value={pos._id}>
                        {pos.name}
                      </option>
                    ))}
                  </select>
                </div>

                {isDepartmentVisible() && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <select
                      value={formData.employmentInformation.department}
                      onChange={(e) =>
                        handleChange(
                          "employmentInformation",
                          "department",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Employment Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.employmentInformation.employmentStatus}
                    onChange={(e) =>
                      handleChange(
                        "employmentInformation",
                        "employmentStatus",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    required
                  >
                    <option value="">Select Employment Status</option>
                    {employmentStatuses.map((status) => (
                      <option key={status._id} value={status._id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date Started
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <FormDatePicker
                    name="dateStarted"
                    value={formData.employmentInformation.dateStarted}
                    onChange={(field, value) =>
                      handleChange("employmentInformation", field, value)
                    }
                    // required
                    placeholder="Select Date Started"
                    maxDate={getTodayDatePH()}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date Transferred To GSH{" "}
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <FormDatePicker
                    name="dateTransferToGSH"
                    value={formData.employmentInformation.dateTransferToGSH}
                    onChange={(field, value) =>
                      handleChange("employmentInformation", field, value)
                    }
                    // required
                    placeholder="Select Date Transfer to GSH"
                    maxDate={getTodayDatePH()}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date Employed
                    {/* <span className="text-red-500">*</span> */}
                  </label>
                  <FormDatePicker
                    name="dateEmployed"
                    value={formData.employmentInformation.dateEmployed}
                    onChange={(field, value) =>
                      handleChange("employmentInformation", field, value)
                    }
                    // required
                    placeholder="Select Date Employed"
                    maxDate={getTodayDatePH()}
                  />
                </div>
              </div>

              {/* Status History Table */}
              <div className="mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Employment Status History
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Track employment status changes over time
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      resetEmploymentStatusHistoryForm();
                      setIsEmploymentStatusHistoryModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 focus:ring-4 focus:ring-emerald-200 font-medium text-sm transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 inline-block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Status
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Effective
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remarks
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {formData.employmentInformation.statusHistory.map(
                          (status, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {employmentStatuses.find(
                                  (s) => s._id === status.statusId
                                )?.name || "Unknown"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDatePH(
                                  status.dateEffective,
                                  "MMM D, YYYY"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {status.remarks || "—"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedEmploymentStatusHistoryIndex(
                                        index
                                      );
                                      setEmploymentStatusHistoryFormData(
                                        status
                                      );
                                      setIsEditingEmploymentStatusHistory(true);
                                      setIsEmploymentStatusHistoryModalOpen(
                                        true
                                      );
                                    }}
                                    className="text-emerald-600 hover:text-emerald-900 transition-colors duration-200 inline-flex items-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedEmploymentStatusHistoryIndex(
                                        index
                                      );
                                      setIsDeleteEmploymentStatusHistoryModalOpen(
                                        true
                                      );
                                    }}
                                    className="text-red-600 hover:text-red-900 transition-colors duration-200 inline-flex items-center"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  {formData.employmentInformation.statusHistory.length ===
                    0 && (
                    <div className="px-6 py-8 text-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 mx-auto mb-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p>No employment status history records found</p>
                      <p className="text-sm">
                        Click "Add Status" to add the first record
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* ============================================================== */}
          {/* Education Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
                Education Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Educational background and professional credentials
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Highest Educational Attainment{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.educationInformation.highestAttainment}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(
                        "educationInformation",
                        "highestAttainment",
                        value
                      );

                      // Auto-reset license fields if value is NOT PRC-eligible
                      const prcEligibleLevels = [
                        "College Graduate",
                        "Master’s Level",
                        "Master’s Graduate",
                        "Doctorate Level",
                        "Doctorate Graduate",
                      ];

                      if (!prcEligibleLevels.includes(value)) {
                        handleChange(
                          "educationInformation",
                          "isLicensedProfessional",
                          false
                        );
                        handleChange("educationInformation", "prcNumber", "");
                      }
                    }}
                    className="w-full p-2 border rounded mt-1"
                    required
                  >
                    <option value="">Select Highest Attainment</option>
                    <option value="High School Graduate">
                      High School Graduate
                    </option>
                    <option value="Senior High School Graduate">
                      Senior High School Graduate
                    </option>
                    <option value="Technical/Vocational Graduate">
                      Technical/Vocational Graduate
                    </option>
                    <option value="College Level">College Level</option>
                    <option value="College Graduate">College Graduate</option>
                    <option value="Master’s Level">Master’s Level</option>
                    <option value="Master’s Graduate">Master’s Graduate</option>
                    <option value="Doctorate Level">Doctorate Level</option>
                    <option value="Doctorate Graduate">
                      Doctorate Graduate
                    </option>
                  </select>
                </div>

                {[
                  "College Graduate",
                  "Master’s Level",
                  "Master’s Graduate",
                  "Doctorate Level",
                  "Doctorate Graduate",
                ].includes(formData.educationInformation.highestAttainment) && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isLicensedProfessional"
                      checked={
                        formData.educationInformation.isLicensedProfessional
                      }
                      onChange={(e) => {
                        const checked = e.target.checked;
                        handleChange(
                          "educationInformation",
                          "isLicensedProfessional",
                          checked
                        );
                        if (!checked) {
                          handleChange("educationInformation", "prcNumber", "");
                        }
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isLicensedProfessional"
                      className="text-sm font-medium text-gray-700"
                    >
                      Licensed Professional
                    </label>
                  </div>
                )}

                {formData.educationInformation.isLicensedProfessional && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      PRC Number
                    </label>
                    <input
                      type="text"
                      name="prcNumber"
                      value={formData.educationInformation.prcNumber}
                      onChange={(e) =>
                        handleChange(
                          "educationInformation",
                          "prcNumber",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>
                )}
              </div>
              {/* Schools Attended Table */}
              <div className="col-span-2 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Schools Attended</h3>
                  <button
                    type="button"
                    onClick={() => {
                      resetSchoolForm();
                      setIsSchoolModalOpen(true);
                      setIsEditingSchool(false);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 focus:ring-4 focus:ring-purple-200 font-medium text-sm transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 inline-block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add School
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          School Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Education Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Program / Degree
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year Graduated
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.educationInformation.schoolsAttended.map(
                        (school, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {school.schoolName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {school.educationLevel}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {school.degree || "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {school.yearGraduated}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSchoolIndex(index);
                                    setSchoolFormData(school);
                                    setIsEditingSchool(true);
                                    setIsSchoolModalOpen(true);
                                  }}
                                  className="text-purple-600 hover:text-purple-900 transition-colors duration-200 inline-flex items-center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSchoolIndex(index);
                                    setIsDeleteSchoolModalOpen(true);
                                  }}
                                  className="text-red-600 hover:text-red-900 transition-colors duration-200 inline-flex items-center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                {formData.educationInformation.schoolsAttended.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mx-auto mb-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p>No schools attended records found</p>
                    <p className="text-sm">
                      Click "Add School" to add the first record
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* ============================================================== */}
          {/* Government Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Government Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Government-issued identification numbers and credentials
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    SSS Number
                  </label>
                  <input
                    type="text"
                    value={formData.governmentInformation.sssNumber}
                    onChange={(e) =>
                      handleChange(
                        "governmentInformation",
                        "sssNumber",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="Enter SSS number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    PhilHealth Number
                  </label>
                  <input
                    type="text"
                    value={formData.governmentInformation.philhealthNumber}
                    onChange={(e) =>
                      handleChange(
                        "governmentInformation",
                        "philhealthNumber",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="Enter PhilHealth number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pag-IBIG Number
                  </label>
                  <input
                    type="text"
                    value={formData.governmentInformation.pagibigNumber}
                    onChange={(e) =>
                      handleChange(
                        "governmentInformation",
                        "pagibigNumber",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="Enter Pag-IBIG number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    TIN
                  </label>
                  <input
                    type="text"
                    value={formData.governmentInformation.tin}
                    onChange={(e) =>
                      handleChange(
                        "governmentInformation",
                        "tin",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder="Enter TIN"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* ============================================================== */}
          {/* Section Save Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-6 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-200 font-medium text-sm transition-colors duration-200 disabled:opacity-50"
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 inline-block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 font-medium text-sm transition-all duration-200 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {isEditMode ? "Updating..." : "Creating..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {isEditMode ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      )}
                      {isEditMode ? "Update Employee" : "Add New Employee"}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* =================Modal===================== */}
        {/* Start Schools Attended Modal */}

        {/* Add / Edit School Modal */}
        {isSchoolModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                {isEditingSchool ? "Edit School" : "Add School"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    School Name <span className="text-red-700">*</span>
                  </label>
                  <input
                    type="text"
                    value={schoolFormData.schoolName}
                    onChange={(e) =>
                      setSchoolFormData({
                        ...schoolFormData,
                        schoolName: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Education Level <span className="text-red-700">*</span>
                  </label>
                  <select
                    value={schoolFormData.educationLevel}
                    onChange={(e) =>
                      setSchoolFormData({
                        ...schoolFormData,
                        educationLevel: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="">Select education level</option>
                    <option value="High School">High School</option>
                    <option value="Senior High School">
                      Senior High School
                    </option>
                    <option value="Vocational/Technical">
                      Vocational/Technical
                    </option>
                    <option value="College">College</option>
                    <option value="Graduate School">Graduate School</option>
                    <option value="Doctorate">Doctorate</option>
                  </select>
                </div>
                {schoolFormData.educationLevel === "Vocational/Technical" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Course / Program
                    </label>
                    <input
                      type="text"
                      value={schoolFormData.degree}
                      onChange={(e) =>
                        setSchoolFormData({
                          ...schoolFormData,
                          degree: e.target.value,
                        })
                      }
                      placeholder="e.g., Automotive Technology, Electrical Installation"
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>
                )}

                {(schoolFormData.educationLevel === "College" ||
                  schoolFormData.educationLevel === "Graduate School" ||
                  schoolFormData.educationLevel === "Doctorate") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={schoolFormData.degree}
                      onChange={(e) =>
                        setSchoolFormData({
                          ...schoolFormData,
                          degree: e.target.value,
                        })
                      }
                      placeholder="e.g., BS in Nursing, MS in Nursing, Doctor of Medicine (MD)"
                      className="w-full p-2 border rounded mt-1"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year Graduated <span className="text-red-700">*</span>
                  </label>
                  <select
                    //==================================================
                    //TEMPORARY COMMENTED REQUIRED TO ENCODE EMPLOYEE EITH LACKING INFO
                    //FOR INITIAL RELEASE
                    //==================================================
                    // required
                    value={schoolFormData.yearGraduated}
                    onChange={(e) =>
                      setSchoolFormData({
                        ...schoolFormData,
                        yearGraduated: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="">Select Year</option>
                    {Array.from(
                      { length: new Date().getFullYear() - 1950 + 1 },
                      (_, i) => 1950 + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsSchoolModalOpen(false);
                    setIsEditingSchool(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={isEditingSchool ? handleEditSchool : handleAddSchool}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 inline-flex items-center"
                >
                  {isEditingSchool ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                  {isEditingSchool ? "Update School" : "Add School"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Schoold Attended Modal */}
        {isDeleteSchoolModalOpen && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex  items-center justify-center`}
          >
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Delete School</h3>
              <p>Are you sure you want to delete this school record?</p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteSchoolModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSchool}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* End Schools Attended Modal */}
        {/* ==================================================== */}

        {/* Start Employment STatus History Modal */}
        {isEmploymentStatusHistoryModalOpen && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
          >
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                {isEditingEmploymentStatusHistory
                  ? " Edit Employment Status History"
                  : " Add Employment Status History"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-700">*</span>
                  </label>
                  <select
                    value={employmentstatusHistoryFormData.statusId}
                    onChange={(e) =>
                      setEmploymentStatusHistoryFormData({
                        ...employmentstatusHistoryFormData,
                        statusId: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="">Select Employment Status</option>
                    {employmentStatuses.map((status) => (
                      <option key={status._id} value={status._id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date Effective <span className="text-red-700">*</span>
                  </label>
                  <FormDatePicker
                    name="dateEffective"
                    value={employmentstatusHistoryFormData.dateEffective}
                    onChange={(name, value) =>
                      setEmploymentStatusHistoryFormData((prev) => ({
                        ...prev,
                        [name]: value,
                      }))
                    }
                    required
                    placeholder="Select date effective"
                    maxDate={getTodayDatePH()} // ⛔ no future date
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Remarks
                  </label>
                  <textarea
                    value={employmentstatusHistoryFormData.remarks}
                    onChange={(e) =>
                      setEmploymentStatusHistoryFormData({
                        ...employmentstatusHistoryFormData,
                        remarks: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded mt-1"
                    rows="3"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsEmploymentStatusHistoryModalOpen(false);
                    setIsEditingEmploymentStatusHistory(false);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={
                    isEditingEmploymentStatusHistory
                      ? handleEditEmploymentStatusHistory
                      : handleAddEmploymentStatusHistory
                  }
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 inline-flex items-center"
                >
                  {isEditingEmploymentStatusHistory ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  )}
                  {isEditingEmploymentStatusHistory
                    ? "Update Status"
                    : "Add Status"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Employment Status History Modal */}
        {isDeleteEmploymentStatusHistoryModalOpen && (
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
          >
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                Delete Status History
              </h3>
              <p>Are you sure you want to delete this status history?</p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() =>
                    setIsDeleteEmploymentStatusHistoryModalOpen(false)
                  }
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEmploymentStatusHistory}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* End Employment Status History  Modal */}
        {/* ==================================================== */}
      </div>
    </div>
  );
};

export default HrEmployeeForm;
