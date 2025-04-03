import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  // createEmployee,
  messageClear,
} from "../../store/Reducers/employeeReducer";
import { fetchAllEmploymentStatus } from "../../store/Reducers/employmentStatusReducer";
import { fetchAllReligions } from "../../store/Reducers/religionReducer";
import { fetchAllPositions } from "../../store/Reducers/positionReducer";
import { fetchAllDepartments } from "../../store/Reducers/departmentReducer";
import { fetchAllClusters } from "../../store/Reducers/clusterReducer";
import toast from "react-hot-toast";

const Test = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, errorMessage, successMessage } = useSelector(
    (state) => state.employee
  );
  const { departments } = useSelector((state) => state.department);
  const { clusters } = useSelector((state) => state.cluster);
  const { positions } = useSelector((state) => state.position);
  const { employmentStatuses } = useSelector((state) => state.employmentStatus);
  const { religions } = useSelector((state) => state.religion);

  const [formData, setFormData] = useState({
    // personalInformation
    firstName: "",
    middleName: "",
    lastName: "",
    civilStatus: "",
    maidenName: "",
    birthdate: "",
    gender: "",
    religionId: "",
    photoUrl: "",

    // contactInformation
    temporaryAddress: "",
    permanentAddress: "",
    phoneNumber: "",
    personalEmail: "",
    campanyEmail: "",

    // educationInformation
    highestAttainment: "",
    schoolsAttended: [],
    licenseNumber: "",

    // employmentInformation
    employeeId: "",
    positionId: "",
    departmentId: "",
    clusterId: "",
    employmentStatusId: "",
    dateStarted: "",
    dateTransferToGSH: "",
    dateEmployed: "",
    statusHistory: [], // Added status history array

    // governmentInformation
    sssNumber: "",
    philhealthNumber: "",
    pagibigNumber: "",
    tin: "",
  });

  useEffect(() => {
    // Fetch initial data
    dispatch(fetchAllDepartments());
    dispatch(fetchAllPositions());
    dispatch(fetchAllReligions());
    dispatch(fetchAllEmploymentStatus());
    dispatch(fetchAllClusters());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/admin/dashboard/employees");
    }

    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const handleChange = (e) => {
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(createEmployee(formData));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Add New Employee</h1>

      <form onSubmit={handleSubmit}>
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
                value={formData.firstName}
                onChange={handleChange}
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
                value={formData.middleName}
                onChange={handleChange}
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
                value={formData.lastName}
                onChange={handleChange}
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
                value={formData.civilStatus}
                onChange={handleChange}
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
                Maiden Name
              </label>
              <input
                type="text"
                name="maidenName"
                value={formData.maidenName}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Birthdate
              </label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Religion
              </label>
              <select
                name="religionId"
                value={formData.religionId}
                onChange={handleChange}
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
        {/* Section Save Buttons */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard/employees")}
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
              {loading ? "Adding..." : "Save Employee"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Test;
