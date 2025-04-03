// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   updateEmployee,
//   messageClear,
//   updatePersonalInfo,
//   updateContactInfo,
//   updateEmploymentInfo,
//   updateGovernmentInfo,
// } from "../../store/Reducers/employeeReducer";
// import { fetchEmploymentStatus } from "../../store/Reducers/employmentStatusReducer";
// import { fetchReligions } from "../../store/Reducers/religionReducer";

// const EditEmployee = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { employees, loading, error, success, message } = useSelector(
//     (state) => state.employee
//   );
//   const { departments = [] } = useSelector((state) => state.department);
//   const { positions = [] } = useSelector((state) => state.position);
//   const { employmentStatuses = [] } = useSelector(
//     (state) => state.employmentStatus
//   );
//   const { religions = [] } = useSelector((state) => state.religion);

//   const [formData, setFormData] = useState({
//     personalInformation: {
//       employeeId: "",
//       lastName: "",
//       firstName: "",
//       middleName: "",
//       maidenName: "",
//       birthdate: "",
//       gender: "",
//       civilStatus: "",
//       religionId: "",
//       photoUrl: "",
//     },
//     contactInformation: {
//       addresses: {
//         temporaryAddress: "",
//         permanentAddress: "",
//       },
//       phoneNumber: "",
//       email: "",
//     },
//     educationInformation: {
//       highestAttainment: "",
//       schoolsAttended: [],
//       prcNumber: "",
//     },
//     employmentInformation: {
//       departmentId: "",
//       positionId: "",
//       employmentStatusId: "",
//       dateStarted: "",
//     },
//     governmentInformation: {
//       sssNumber: "",
//       philhealthNumber: "",
//       pagibigNumber: "",
//       tin: "",
//     },
//   });

//   useEffect(() => {
//     // Fetch initial data
//     dispatch(fetchEmploymentStatus());
//     dispatch(fetchReligions());
//   }, [dispatch]);

//   useEffect(() => {
//     const employee = employees.find((emp) => emp._id === id);
//     if (employee) {
//       setFormData(employee);
//     }
//   }, [id, employees]);

//   useEffect(() => {
//     if (success) {
//       setTimeout(() => {
//         dispatch(messageClear());
//         navigate("/admin/dashboard/employees");
//       }, 2000);
//     }
//   }, [success, dispatch, navigate]);

//   const handleChange = (section, field, value) => {
//     if (field.includes(".")) {
//       const [parent, child] = field.split(".");
//       setFormData({
//         ...formData,
//         [section]: {
//           ...formData[section],
//           [parent]: {
//             ...formData[section][parent],
//             [child]: value,
//           },
//         },
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [section]: {
//           ...formData[section],
//           [field]: value,
//         },
//       });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(updateEmployee({ id, employeeData: formData }));
//   };

//   const handleSaveSection = (section) => {
//     const sectionData = formData[section];
//     switch (section) {
//       case "personalInformation":
//         dispatch(updatePersonalInfo({ id, personalInfo: sectionData }));
//         break;
//       case "contactInformation":
//         dispatch(updateContactInfo({ id, contactInfo: sectionData }));
//         break;
//       case "employmentInformation":
//         dispatch(updateEmploymentInfo({ id, employmentInfo: sectionData }));
//         break;
//       case "governmentInformation":
//         dispatch(updateGovernmentInfo({ id, governmentInfo: sectionData }));
//         break;
//       default:
//         break;
//     }
//   };

//   const FormSection = ({ title, children }) => (
//     <div className="bg-white shadow rounded-lg p-6 mb-6">
//       <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
//         {title}
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
//     </div>
//   );

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4 text-center">Edit Employee</h1>

//       {success && (
//         <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
//       )}

//       <form onSubmit={handleSubmit}>
//         {/* Personal Information Section */}
//         <FormSection title="Personal Information">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Employee ID
//             </label>
//             <input
//               type="text"
//               value={formData.personalInformation.employeeId}
//               onChange={(e) =>
//                 handleChange(
//                   "personalInformation",
//                   "employeeId",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Last Name
//             </label>
//             <input
//               type="text"
//               value={formData.personalInformation.lastName}
//               onChange={(e) =>
//                 handleChange("personalInformation", "lastName", e.target.value)
//               }
//               className="w-full p-2 border rounded mt-1"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               First Name
//             </label>
//             <input
//               type="text"
//               value={formData.personalInformation.firstName}
//               onChange={(e) =>
//                 handleChange("personalInformation", "firstName", e.target.value)
//               }
//               className="w-full p-2 border rounded mt-1"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Middle Name
//             </label>
//             <input
//               type="text"
//               value={formData.personalInformation.middleName}
//               onChange={(e) =>
//                 handleChange(
//                   "personalInformation",
//                   "middleName",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Gender
//             </label>
//             <select
//               value={formData.personalInformation.gender}
//               onChange={(e) =>
//                 handleChange("personalInformation", "gender", e.target.value)
//               }
//               className="w-full p-2 border rounded mt-1"
//               required
//             >
//               <option value="">Select Gender</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Birthdate
//             </label>
//             <input
//               type="date"
//               value={formData.personalInformation.birthdate?.split("T")[0]}
//               onChange={(e) =>
//                 handleChange("personalInformation", "birthdate", e.target.value)
//               }
//               className="w-full p-2 border rounded mt-1"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Civil Status
//             </label>
//             <select
//               value={formData.personalInformation.civilStatus}
//               onChange={(e) =>
//                 handleChange(
//                   "personalInformation",
//                   "civilStatus",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//               required
//             >
//               <option value="">Select Civil Status</option>
//               <option value="Single">Single</option>
//               <option value="Married">Married</option>
//               <option value="Widowed">Widowed</option>
//               <option value="Divorced">Divorced</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Religion
//             </label>
//             <select
//               value={formData.personalInformation.religionId}
//               onChange={(e) =>
//                 handleChange(
//                   "personalInformation",
//                   "religionId",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//             >
//               <option value="">Select Religion</option>
//               {religions.map((religion) => (
//                 <option key={religion._id} value={religion._id}>
//                   {religion.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </FormSection>

//         {/* Contact Information Section */}
//         <FormSection title="Contact Information">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Temporary Address
//             </label>
//             <textarea
//               value={formData.contactInformation.addresses.temporaryAddress}
//               onChange={(e) =>
//                 handleChange(
//                   "contactInformation",
//                   "addresses.temporaryAddress",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//               rows="3"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Permanent Address
//             </label>
//             <textarea
//               value={formData.contactInformation.addresses.permanentAddress}
//               onChange={(e) =>
//                 handleChange(
//                   "contactInformation",
//                   "addresses.permanentAddress",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//               rows="3"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               value={formData.contactInformation.phoneNumber}
//               onChange={(e) =>
//                 handleChange(
//                   "contactInformation",
//                   "phoneNumber",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               value={formData.contactInformation.email}
//               onChange={(e) =>
//                 handleChange("contactInformation", "email", e.target.value)
//               }
//               className="w-full p-2 border rounded mt-1"
//             />
//           </div>
//         </FormSection>

//         {/* Employment Information Section */}
//         <FormSection title="Employment Information">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Department
//             </label>
//             <select
//               value={formData.employmentInformation.departmentId}
//               onChange={(e) =>
//                 handleChange(
//                   "employmentInformation",
//                   "departmentId",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//               required
//             >
//               <option value="">Select Department</option>
//               {departments.map((dept) => (
//                 <option key={dept._id} value={dept._id}>
//                   {dept.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Position
//             </label>
//             <select
//               value={formData.employmentInformation.positionId}
//               onChange={(e) =>
//                 handleChange(
//                   "employmentInformation",
//                   "positionId",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//               required
//             >
//               <option value="">Select Position</option>
//               {positions.map((pos) => (
//                 <option key={pos._id} value={pos._id}>
//                   {pos.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Employment Status
//             </label>
//             <select
//               value={formData.employmentInformation.employmentStatusId}
//               onChange={(e) =>
//                 handleChange(
//                   "employmentInformation",
//                   "employmentStatusId",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//               required
//             >
//               <option value="">Select Employment Status</option>
//               {employmentStatuses.map((status) => (
//                 <option key={status._id} value={status._id}>
//                   {status.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Date Started
//             </label>
//             <input
//               type="date"
//               value={formData.employmentInformation.dateStarted?.split("T")[0]}
//               onChange={(e) =>
//                 handleChange(
//                   "employmentInformation",
//                   "dateStarted",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//               required
//             />
//           </div>
//         </FormSection>

//         {/* Government Information Section */}
//         <FormSection title="Government Information">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               SSS Number
//             </label>
//             <input
//               type="text"
//               value={formData.governmentInformation.sssNumber}
//               onChange={(e) =>
//                 handleChange(
//                   "governmentInformation",
//                   "sssNumber",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               PhilHealth Number
//             </label>
//             <input
//               type="text"
//               value={formData.governmentInformation.philhealthNumber}
//               onChange={(e) =>
//                 handleChange(
//                   "governmentInformation",
//                   "philhealthNumber",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Pag-IBIG Number
//             </label>
//             <input
//               type="text"
//               value={formData.governmentInformation.pagibigNumber}
//               onChange={(e) =>
//                 handleChange(
//                   "governmentInformation",
//                   "pagibigNumber",
//                   e.target.value
//                 )
//               }
//               className="w-full p-2 border rounded mt-1"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               TIN
//             </label>
//             <input
//               type="text"
//               value={formData.governmentInformation.tin}
//               onChange={(e) =>
//                 handleChange("governmentInformation", "tin", e.target.value)
//               }
//               className="w-full p-2 border rounded mt-1"
//             />
//           </div>
//         </FormSection>

//         {/* Section Save Buttons */}
//         <div className="flex justify-between items-center mt-6">
//           <div className="flex space-x-2">
//             <button
//               type="button"
//               onClick={() => navigate("/admin/dashboard/employees")}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//               disabled={loading}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               disabled={loading}
//             >
//               {loading ? "Updating..." : "Update Employee"}
//             </button>
//           </div>
//           <div className="flex space-x-2">
//             <button
//               type="button"
//               onClick={() => handleSaveSection("personalInformation")}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               disabled={loading}
//             >
//               Save Personal Info
//             </button>
//             <button
//               type="button"
//               onClick={() => handleSaveSection("contactInformation")}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               disabled={loading}
//             >
//               Save Contact Info
//             </button>
//             <button
//               type="button"
//               onClick={() => handleSaveSection("employmentInformation")}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               disabled={loading}
//             >
//               Save Employment Info
//             </button>
//             <button
//               type="button"
//               onClick={() => handleSaveSection("governmentInformation")}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               disabled={loading}
//             >
//               Save Government Info
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditEmployee;
