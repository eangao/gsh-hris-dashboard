import { useParams } from "react-router-dom";
import EmployeeDetails from "../../../../components/employee/EmployeeDetails";

const HrEmployeeDetails = () => {
  const { employeeId } = useParams();

  return <EmployeeDetails employeeId={employeeId} />;
};

export default HrEmployeeDetails;
