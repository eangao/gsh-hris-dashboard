import { useParams } from "react-router-dom";
import DutyScheduleDetails from "../../../../components/dutySchedule/DutySheduleDetails";

const EmployeeDutyScheduleDetails = () => {
  const { scheduleId, employeeId, departmentId } = useParams();

  return (
    <DutyScheduleDetails
      scheduleId={scheduleId}
      departmentId={departmentId}
      employeeId={employeeId}
      forApproval={false}
    />
  );
};

export default EmployeeDutyScheduleDetails;
