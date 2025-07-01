import EmployeeDetails from "../../../components/employee/EmployeeDetails";
import { useSelector } from "react-redux";

const MyProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { employee: employeeId } = userInfo;

  return <EmployeeDetails employeeId={employeeId} />;
};

export default MyProfile;
