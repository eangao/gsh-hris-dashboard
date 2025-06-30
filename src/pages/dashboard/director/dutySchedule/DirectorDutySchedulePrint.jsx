import { useParams } from "react-router-dom";
import DutySchedulePrint from "../../../../components/dutySchedule/DutySchedulePrint";

const DirectorDutySchedulePrint = () => {
  const { scheduleId } = useParams();

  return <DutySchedulePrint scheduleId={scheduleId} />;
};

export default DirectorDutySchedulePrint;
