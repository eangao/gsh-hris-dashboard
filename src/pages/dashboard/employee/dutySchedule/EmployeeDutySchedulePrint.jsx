import { useParams } from "react-router-dom";
import DutySchedulePrint from "../../../../components/dutySchedule/DutySchedulePrint";

const EmployeeDutySchedulePrint = () => {
  const { employeeId, scheduleId } = useParams();

  return <DutySchedulePrint employeeId={employeeId} scheduleId={scheduleId} />;
};

export default EmployeeDutySchedulePrint;
