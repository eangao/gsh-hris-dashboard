import { useParams } from "react-router-dom";
import EmployeeDetails from "../../../../components/employee/EmployeeDetails";

const DirectorEmployeeDetails = () => {
  const { employeeId } = useParams();

  return <EmployeeDetails employeeId={employeeId} />;
};

export default DirectorEmployeeDetails;
