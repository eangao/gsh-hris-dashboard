import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEmployee,
  fetchEmployeeById,
  messageClear,
  updateEmployee,
} from "../../store/Reducers/employeeReducer";
import { fetchAllEmploymentStatus } from "../../store/Reducers/employmentStatusReducer";
import { fetchAllReligions } from "../../store/Reducers/religionReducer";
import { fetchAllPositions } from "../../store/Reducers/positionReducer";
import { fetchAllDepartments } from "../../store/Reducers/departmentReducer";
import { fetchAllClusters } from "../../store/Reducers/clusterReducer";

import toast from "react-hot-toast";
import Select from "react-select";

const EmployeeForm = () => {
  const { id } = useParams(); // This will be undefined for add
  const isEditMode = !!id;

  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { employee, loading, errorMessage, successMessage } = useSelector(
    (state) => state.employee
  );
  const { departments } = useSelector((state) => state.department);
  const { clusters } = useSelector((state) => state.cluster);
  const { positions } = useSelector((state) => state.position);
  const { employmentStatuses } = useSelector((state) => state.employmentStatus);
  const { religions } = useSelector((state) => state.religion);

  const [formData, setFormData] = useState({
    personalInformation: {
      firstName: "",
      middleName: "",
      lastName: "",
      civilStatus: "",
      maidenName: "",
      birthdate: "",
      gender: "",
      religion: "",
      photoUrl: "",
    },
    contactInformation: {
      temporaryAddress: "",
      permanentAddress: "",
      phoneNumber: "",
      personalEmail: "",
      campanyEmail: "",
    },
    educationInformation: {
      highestAttainment: "",
      schoolsAttended: [],
      licenseNumber: "",
    },
    employmentInformation: {
      hospitalEmployeeId: "",
      scheduleType: "",
      position: "",
      department: null,
      cluster: null,
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
      dispatch(fetchEmployeeById(id)); // Assuming you have this action
    }
  }, [dispatch, isEditMode, id]);

  useEffect(() => {
    if (isEditMode && employee) {
      setFormData({
        ...employee,
        personalInformation: {
          ...employee.personalInformation,
          birthdate: formatDateForInput(
            employee.personalInformation?.birthdate
          ),
        },
        employmentInformation: {
          ...employee.employmentInformation,
          dateStarted: formatDateForInput(
            employee.employmentInformation?.dateStarted
          ),
          dateEmployed: formatDateForInput(
            employee.employmentInformation?.dateEmployed
          ),
          dateTransferToGSH: formatDateForInput(
            employee.employmentInformation?.dateTransferToGSH
          ),
        },
      });
    }
  }, [employee, isEditMode]);

  useEffect(() => {
    if (successMessage || errorMessage) {
      if (successMessage) {
        toast.success(successMessage);
        if (role === "admin") {
          navigate("/admin/dashboard/employee");
        } else if (role === "hr") {
          navigate("/hr/dashboard/employee");
        }
      }

      if (errorMessage) {
        toast.error(errorMessage);
      }

      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const handleChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      //hande in select query find by id
      // Remove the createdAt and isDeleted properties from employeeData
      // const {
      // createdAt,
      // isDeleted,
      // updatedAt,
      // __v,
      //   ...employeeDataWithoutUnwantedFields
      // } = formData;

      dispatch(updateEmployee({ id, employeeData: formData }));
    } else {
      dispatch(createEmployee(formData));
    }
  };

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0]; // returns "yyyy-MM-dd"
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
    major: "",
    yearGraduated: "",
  });

  // Reset School Form
  const resetSchoolForm = () => {
    setSchoolFormData({
      schoolName: "",
      educationLevel: "",
      degree: "",
      major: "",
      yearGraduated: "",
    });
  };

  const handleAddSchool = () => {
    const { schoolName, educationLevel, yearGraduated } = schoolFormData;

    // Validation check
    if (!schoolName || !educationLevel || !yearGraduated) {
      alert("Please fill in all required fields.");
      return;
    }

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

    // Validation check
    if (!schoolName || !educationLevel || !yearGraduated) {
      alert("Please fill in all required fields.");
      return;
    }

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

  //===============Handle Maiden Name start====================
  const [isMaiden, setIsMaiden] = useState(false);

  const handleMaidenNameVisibility = (civilStatus, gender) => {
    if (civilStatus !== "Single" && civilStatus !== "" && gender === "Female") {
      setIsMaiden(true);
    } else {
      setIsMaiden(false);
      handleChange("personalInformation", "maidenName", "");
    }
  };
  //===============Handle Maiden Name end====================

  //===============Handle position start====================
  const [selectedPositionName, setSelectedPositionName] = useState("");

  const handlePositionChange = (selectedId) => {
    const selectedPos = positions.find((pos) => pos._id === selectedId);
    const name = selectedPos?.name?.toLowerCase() || "";

    setSelectedPositionName(name);
    handleChange("employmentInformation", "position", selectedId);

    // Clear hidden fields
    if (name === "president") {
      handleChange("employmentInformation", "department", null);
      handleChange("employmentInformation", "cluster", null);
    } else if (name === "director") {
      handleChange("employmentInformation", "department", null);
    } else {
      handleChange("employmentInformation", "cluster", null);
    }
  };

  const isDepartmentVisible = () => {
    return (
      selectedPositionName !== "president" &&
      selectedPositionName !== "director"
    );
  };

  const isClusterVisible = () => selectedPositionName === "director";

  //to handel the edit
  useEffect(() => {
    const selectedId = formData?.employmentInformation?.position;
    if (selectedId && positions.length > 0) {
      const selectedPos = positions.find((pos) => pos._id === selectedId);
      const name = selectedPos?.name?.toLowerCase() || "";
      setSelectedPositionName(name);
    }
  }, [formData?.employmentInformation?.position, positions]);

  //===============Handle position end====================

  // const departmentOptions = departments.map((dept) => ({
  //   value: dept._id,
  //   label: dept.name,
  // }));

  const handleCancel = () => {
    if (role === "admin") {
      navigate("/admin/dashboard/employee");
    } else if (role === "hr") {
      navigate("/hr/dashboard/employee");
    } else {
      alert("You are not authorized to access the employee list.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Add New Employee</h1>

      <form onSubmit={handleSubmit}>
        {/* ============================================================== */}
        {/* Personal Information Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {" "}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
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
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div>
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
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
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
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Civil Status
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
                className="w-full p-2 border rounded mt-1"
                required
              >
                <option value="">Select Civil Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
                <option value="Seperated">Seperated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
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
                className="w-full p-2 border rounded mt-1"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {/* Maiden Name Field - Hidden if Civil Status is 'Single' */}
            {isMaiden && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maiden Name
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
                  className="w-full p-2 border rounded mt-1"
                  required={isMaiden} // only required when visible
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Birthdate
              </label>
              <input
                type="date"
                name="birthdate"
                value={formData.personalInformation.birthdate}
                onChange={(e) =>
                  handleChange(
                    "personalInformation",
                    "birthdate",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div>
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
                className="w-full p-2 border rounded mt-1"
              >
                <option value="">Select Religion</option>
                {religions.map((religion) => (
                  <option key={religion._id} value={religion._id}>
                    {religion.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Contact Information Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temporary Address
              </label>
              <textarea
                value={formData.contactInformation.temporaryAddress}
                onChange={(e) =>
                  handleChange(
                    "contactInformation",
                    "temporaryAddress",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Permanent Address
              </label>
              <textarea
                value={formData.contactInformation.permanentAddress}
                onChange={(e) =>
                  handleChange(
                    "contactInformation",
                    "permanentAddress",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.contactInformation.phoneNumber}
                onChange={(e) =>
                  handleChange(
                    "contactInformation",
                    "phoneNumber",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Personal Email
              </label>
              <input
                type="email"
                value={formData.contactInformation.personalEmail}
                onChange={(e) =>
                  handleChange(
                    "contactInformation",
                    "personalEmail",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Campany Email
              </label>
              <input
                type="email"
                value={formData.contactInformation.campanyEmail}
                onChange={(e) =>
                  handleChange(
                    "contactInformation",
                    "campanyEmail",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Employment Information Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Employment Information
          </h2>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee ID
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
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Schedule Type
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
                className="w-full p-2 border rounded mt-1"
                required
              >
                <option value="">Select Schedule Type</option>
                <option value="Standard">Standard</option>
                <option value="Shifting">Shifting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <select
                value={formData.employmentInformation.position}
                onChange={(e) => handlePositionChange(e.target.value)}
                className="w-full p-2 border rounded mt-1"
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                {/* <Select
                  options={departmentOptions}
                  value={departmentOptions.find(
                    (option) =>
                      option.value === formData.employmentInformation.department
                  )}
                  onChange={(selected) =>
                    handleChange(
                      "employmentInformation",
                      "department",
                      selected ? selected.value : null
                    )
                  }
                  placeholder="Select Department"
                  isClearable
                /> */}
                <select
                  value={formData.employmentInformation.department}
                  onChange={(e) =>
                    handleChange(
                      "employmentInformation",
                      "department",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded mt-1"
                  required={isDepartmentVisible()} // ✅ required only if visible
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

            {isClusterVisible() && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cluster
                </label>
                <select
                  value={formData.employmentInformation.cluster}
                  onChange={(e) =>
                    handleChange(
                      "employmentInformation",
                      "cluster",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded mt-1"
                  required={isClusterVisible()} // ✅ required only if visible
                >
                  <option value="">Select Cluster</option>
                  {clusters.map((cluster) => (
                    <option key={cluster._id} value={cluster._id}>
                      {cluster.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employment Status
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
                className="w-full p-2 border rounded mt-1"
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date Started
              </label>
              <input
                type="date"
                value={formData.employmentInformation.dateStarted}
                onChange={(e) =>
                  handleChange(
                    "employmentInformation",
                    "dateStarted",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date Transfered To GSH
              </label>
              <input
                type="date"
                value={formData.employmentInformation.dateTransferToGSH}
                onChange={(e) =>
                  handleChange(
                    "employmentInformation",
                    "dateTransferToGSH",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date Employed
              </label>
              <input
                type="date"
                value={formData.employmentInformation.dateEmployed}
                onChange={(e) =>
                  handleChange(
                    "employmentInformation",
                    "dateEmployed",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
          </div>

          {/* Status History Table */}
          <div className="col-span-2 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Employment Status History
              </h3>
              <button
                type="button"
                onClick={() => {
                  resetEmploymentStatusHistoryForm();
                  setIsEmploymentStatusHistoryModalOpen(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Status
              </button>
            </div>
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
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {employmentStatuses.find(
                            (s) => s._id === status.statusId
                          )?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(status.dateEffective).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {status.remarks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEmploymentStatusHistoryIndex(index);
                              setEmploymentStatusHistoryFormData(status);
                              setIsEditingEmploymentStatusHistory(true);
                              setIsEmploymentStatusHistoryModalOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEmploymentStatusHistoryIndex(index);
                              setIsDeleteEmploymentStatusHistoryModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Education Information Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Education Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Highest Educational Attainment
              </label>
              <select
                value={formData.educationInformation.highestAttainment}
                onChange={(e) =>
                  handleChange(
                    "educationInformation",
                    "highestAttainment",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
                required
              >
                <option value="">Select Highest Attainment</option>
                <option value="Elementary">Elementary</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                License Number
              </label>
              <input
                type="text"
                value={formData.educationInformation.licenseNumber}
                onChange={(e) =>
                  handleChange(
                    "educationInformation",
                    "licenseNumber",
                    e.target.value
                  )
                }
                className="w-full p-2 border rounded mt-1"
              />
            </div>
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
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
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
                      Degree
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Major
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
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {school.schoolName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {school.educationLevel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {school.degree || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {school.major || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {school.yearGraduated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSchoolIndex(index);
                              setSchoolFormData(school);
                              setIsEditingSchool(true);
                              setIsSchoolModalOpen(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSchoolIndex(index);
                              setIsDeleteSchoolModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Government Information Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Government Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div>
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
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div>
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
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                TIN
              </label>
              <input
                type="text"
                value={formData.governmentInformation.tin}
                onChange={(e) =>
                  handleChange("governmentInformation", "tin", e.target.value)
                }
                className="w-full p-2 border rounded mt-1"
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Section Save Buttons */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {isEditMode ? "Update Employee" : "Add New Employee"}
            </button>
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
                  <option value="">Select Education Level</option>
                  <option value="Elementary">Elementary</option>
                  <option value="High School">High School</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
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
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Major
                </label>
                <input
                  type="text"
                  value={schoolFormData.major}
                  onChange={(e) =>
                    setSchoolFormData({
                      ...schoolFormData,
                      major: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year Graduated <span className="text-red-700">*</span>
                </label>
                <select
                  required
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={isEditingSchool ? handleEditSchool : handleAddSchool}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSchool}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
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
                <input
                  type="date"
                  value={employmentstatusHistoryFormData.dateEffective}
                  onChange={(e) =>
                    setEmploymentStatusHistoryFormData({
                      ...employmentstatusHistoryFormData,
                      dateEffective: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded mt-1"
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={
                  isEditingEmploymentStatusHistory
                    ? handleEditEmploymentStatusHistory
                    : handleAddEmploymentStatusHistory
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEmploymentStatusHistory}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Employment Status History  Modal */}
      {/* ==================================================== */}
    </div>
  );
};

export default EmployeeForm;
