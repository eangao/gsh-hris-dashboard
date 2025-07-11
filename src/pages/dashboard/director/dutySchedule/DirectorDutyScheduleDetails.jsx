import { useParams, useSearchParams } from "react-router-dom";
import DutyScheduleDetails from "../../../../components/dutySchedule/DutySheduleDetails";

const DirectorDutyScheduleDetails = () => {
  const { scheduleId, departmentId } = useParams();

  const [searchParams] = useSearchParams();

  const forApproval = searchParams.get("forApproval") || "false"; // Defaults to "false" if not present

  return (
    <DutyScheduleDetails
      scheduleId={scheduleId}
      approvalType="director"
      forApproval={forApproval}
      departmentId={departmentId}
    />
  );
};

export default DirectorDutyScheduleDetails;
