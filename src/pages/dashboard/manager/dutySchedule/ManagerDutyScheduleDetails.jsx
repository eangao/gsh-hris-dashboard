import { useParams } from "react-router-dom";
import DutyScheduleDetails from "../../../../components/dutySchedule/DutySheduleDetails";

const ManagerDutyScheduleDetails = () => {
  const { scheduleId } = useParams();

  return <DutyScheduleDetails scheduleId={scheduleId} approvalType="manager" />;
};

export default ManagerDutyScheduleDetails;
