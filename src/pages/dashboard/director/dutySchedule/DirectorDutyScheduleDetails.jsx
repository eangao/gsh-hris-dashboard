import { useParams } from "react-router-dom";
import DutyScheduleDetails from "../../../../components/dutySchedule/DutySheduleDetails";

const DirectorDutyScheduleDetails = () => {
  const { scheduleId } = useParams();

  return (
    <DutyScheduleDetails scheduleId={scheduleId} approvalType="director" />
  );
};

export default DirectorDutyScheduleDetails;
