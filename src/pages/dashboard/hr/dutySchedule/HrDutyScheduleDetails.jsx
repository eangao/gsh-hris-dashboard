import { useParams, useSearchParams } from "react-router-dom";
import DutyScheduleDetails from "../../../../components/dutySchedule/DutySheduleDetails";

const HrDutyScheduleDetails = () => {
  const { scheduleId } = useParams();

  const [searchParams] = useSearchParams();

  const forApproval = searchParams.get("forApproval") || "false"; // Defaults to "false" if not present

  return (
    <DutyScheduleDetails
      scheduleId={scheduleId}
      approvalType="hr"
      forApproval={forApproval}
    />
  );
};

export default HrDutyScheduleDetails;
