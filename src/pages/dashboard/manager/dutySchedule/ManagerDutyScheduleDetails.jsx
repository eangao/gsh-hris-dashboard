import { useParams, useSearchParams } from "react-router-dom";
import DutyScheduleDetails from "../../../../components/dutySchedule/DutySheduleDetails";
import { OptimizedDutyScheduleDetails } from "../../../../components/dutySchedule";

const ManagerDutyScheduleDetails = () => {
  const { scheduleId } = useParams();

  const [searchParams] = useSearchParams();

  const forApproval = searchParams.get("forApproval") || "false"; // Defaults to "false" if not present

  return (
    <DutyScheduleDetails
      scheduleId={scheduleId}
      approvalType="manager"
      forApproval={forApproval}
    />
  );
  // return (
  //   <OptimizedDutyScheduleDetails
  //     scheduleId={scheduleId}
  //     approvalType="manager"
  //   />
  // );
};

export default ManagerDutyScheduleDetails;
