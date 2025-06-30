import { useParams } from "react-router-dom";
import DutySchedulePrint from "../../../../components/dutySchedule/DutySchedulePrint";

const ManagerDutySchedulePrint = () => {
  const { scheduleId } = useParams();

  return <DutySchedulePrint scheduleId={scheduleId} />;
};

export default ManagerDutySchedulePrint;
