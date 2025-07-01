import { useNavigate, useParams } from "react-router-dom";
import DutySchedulePrint from "../../../../components/dutySchedule/DutySchedulePrint";
import { OptimizedDutySchedulePrint } from "../../../../components/dutySchedule";

const ManagerDutySchedulePrint = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  return <DutySchedulePrint scheduleId={scheduleId} />;
  // return (
  //   <OptimizedDutySchedulePrint
  //     scheduleId={scheduleId}
  //     onCancel={() => navigate(-1)}
  //   />
  // );
};

export default ManagerDutySchedulePrint;
