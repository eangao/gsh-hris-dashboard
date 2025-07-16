import EmployeeDetails from "../../../components/employee/EmployeeDetails";
import { useSelector } from "react-redux";

const MyProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const employeeId = userInfo?.employee?._id;

  // Show loading if authentication is still loading or if we don't have employeeId yet
  if (!employeeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin mx-auto"
              style={{
                animationDuration: "0.8s",
                animationDirection: "reverse",
              }}
            ></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Profile...
          </h2>
          <p className="text-gray-500">Fetching your information...</p>
        </div>
      </div>
    );
  }

  return <EmployeeDetails employeeId={employeeId} />;
};

export default MyProfile;
