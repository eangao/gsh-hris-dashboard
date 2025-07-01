import { useParams } from "react-router-dom";
import DutyScheduleDetails from "../../../../components/dutySchedule/DutySheduleDetails";
import { OptimizedDutyScheduleDetails } from "../../../../components/dutySchedule";

const ManagerDutyScheduleDetails = () => {
  const { scheduleId } = useParams();

  // return <DutyScheduleDetails scheduleId={scheduleId} approvalType="manager" />;
  return (
    <OptimizedDutyScheduleDetails
      scheduleId={scheduleId}
      approvalType="manager"
    />
  );
};

export default ManagerDutyScheduleDetails;
