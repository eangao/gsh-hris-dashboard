import { useParams } from "react-router-dom";
import DutyScheduleDetails from "../../../../components/dutySchedule/DutySheduleDetails";

const EmployeeDutyScheduleDetails = () => {
  const { scheduleId, employeeId } = useParams();

  return (
    <DutyScheduleDetails scheduleId={scheduleId} employeeId={employeeId} />
  );
};

export default EmployeeDutyScheduleDetails;
