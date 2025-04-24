import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchEmployeeDetailsById } from "../../store/Reducers/employeeReducer";

const EmployeeDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { employee, loading } = useSelector((state) => state.employee);

  useEffect(() => {
    if (id) {
      dispatch(fetchEmployeeDetailsById(id));
    }
  }, [dispatch, id]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No employee data found</p>
      </div>
    );
  }

  //hide position
  const positionName =
    employee.employmentInformation?.position?.name?.toLowerCase() || "";

  const isDepartmentVisible = () =>
    positionName !== "president" && positionName !== "director";

  const isClusterVisible = () => positionName === "director";

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl print:px-0 print:py-0 print:max-w-none">
      {/* Header with Print Button */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-gray-800">Employee Details</h1>
        {/* <button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print
        </button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
        {/* Personal Information with Photo */}
        <div className="bg-white p-6 rounded-lg shadow-md print:shadow-none print:p-4 print:border print:border-gray-200">
          <div className="flex flex-col md:flex-col lg:flex-row gap-6 items-start">
            {/* Personal Info */}
            <div className="flex-1 order-2 lg:order-1">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Personal Information
              </h2>
              <div className="space-y-4">
                <p className="text-lg font-medium text-gray-900">
                  {employee.personalInformation?.firstName}{" "}
                  {employee.personalInformation?.middleName}{" "}
                  {employee.personalInformation?.lastName}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem
                    label="Civil Status"
                    value={employee.personalInformation?.civilStatus}
                  />

                  <InfoItem
                    label="Gender"
                    value={employee.personalInformation?.gender}
                  />

                  {/* Conditionally render Maiden Name when Civil Status is not "Single" and Gender is not "Male" */}
                  {employee.personalInformation?.civilStatus?.toLowerCase() !==
                    "single" &&
                    employee.personalInformation?.gender?.toLowerCase() ===
                      "female" && (
                      <InfoItem
                        label="Maiden Name"
                        value={employee.personalInformation?.maidenName}
                      />
                    )}

                  <InfoItem
                    label="Birthdate"
                    value={formatDate(employee.personalInformation?.birthdate)}
                  />
                  <InfoItem
                    label="Religion"
                    value={employee.personalInformation?.religion?.name}
                  />
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="w-full sm:w-48 flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200 transition-all duration-300">
                {employee.personalInformation?.photoUrl ? (
                  <img
                    src={employee.personalInformation.photoUrl}
                    alt={`${employee.personalInformation?.firstName} ${employee.personalInformation?.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/images/user.png"
                    alt="Default profile"
                    className="w-32 h-32 object-contain opacity-75"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md print:shadow-none print:p-4 print:border print:border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Contact Information
          </h2>
          <div className="space-y-3">
            <InfoItem
              label="Temporary Address"
              value={employee.contactInformation?.temporaryAddress}
            />
            <InfoItem
              label="Permanent Address"
              value={employee.contactInformation?.permanentAddress}
            />
            <InfoItem
              label="Phone Number"
              value={employee.contactInformation?.phoneNumber}
            />
            <InfoItem
              label="Personal Email"
              value={employee.contactInformation?.personalEmail}
            />
            <InfoItem
              label="Company Email"
              value={employee.contactInformation?.campanyEmail}
            />
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-white p-6 rounded-lg shadow-md print:shadow-none print:p-4 print:border print:border-gray-200 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Employment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="Hospital Employee ID"
              value={employee.employmentInformation?.hospitalEmployeeId}
            />
            <InfoItem
              label="Position"
              value={employee.employmentInformation?.position?.name}
            />

            {/* Conditionally render Department */}
            {isDepartmentVisible() && (
              <InfoItem
                label="Department"
                value={employee.employmentInformation?.department?.name}
              />
            )}

            {/* Conditionally render Cluster */}
            {isClusterVisible() && (
              <InfoItem
                label="Cluster"
                value={employee.employmentInformation?.cluster?.name}
              />
            )}

            <InfoItem
              label="Employment Status"
              value={employee.employmentInformation?.employmentStatus?.name}
            />
            <InfoItem
              label="Date Started"
              value={formatDate(employee.employmentInformation?.dateStarted)}
            />
            <InfoItem
              label="Date Employed"
              value={formatDate(employee.employmentInformation?.dateEmployed)}
            />
          </div>

          {employee.employmentInformation?.statusHistory?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Status History</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {employee.employmentInformation.statusHistory.map(
                  (status, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
                    >
                      <div className="space-y-3">
                        <InfoItem
                          label="Employment Status"
                          value={status?.statusId?.name}
                        />
                        <InfoItem
                          label="Date Effective"
                          value={formatDate(status.dateEffective)}
                        />
                        <InfoItem label="Remarks" value={status.remarks} />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Government Information */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Government Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="SSS Number"
              value={employee.governmentInformation?.sssNumber}
            />
            <InfoItem
              label="PhilHealth Number"
              value={employee.governmentInformation?.philhealthNumber}
            />
            <InfoItem
              label="PAG-IBIG Number"
              value={employee.governmentInformation?.pagibigNumber}
            />
            <InfoItem label="TIN" value={employee.governmentInformation?.tin} />
          </div>
        </div>

        {/* Education Information */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Education Information
          </h2>
          <div className="space-y-4">
            <InfoItem
              label="Highest Attainment"
              value={employee.educationInformation?.highestAttainment}
            />
            <InfoItem
              label="License Number"
              value={employee.educationInformation?.licenseNumber}
            />

            {employee.educationInformation?.schoolsAttended?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Schools Attended</h3>
                <div className="space-y-4">
                  {employee.educationInformation.schoolsAttended.map(
                    (school, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoItem
                            label="School Name"
                            value={school.schoolName}
                          />
                          <InfoItem
                            label="Education Level"
                            value={school.educationLevel}
                          />
                          <InfoItem label="Degree" value={school.degree} />
                          <InfoItem label="Major" value={school.major} />
                          <InfoItem
                            label="Year Graduated"
                            value={school.yearGraduated}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable component for displaying information items
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="text-gray-900">{value || "-"}</span>
  </div>
);

export default EmployeeDetails;
