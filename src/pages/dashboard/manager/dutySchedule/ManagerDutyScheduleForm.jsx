import DutyScheduleForm from "components/dutySchedule/DutyScheduleForm";
import { useParams } from "react-router-dom";

const ManagerDutyScheduleForm = () => {
  const { departmentId, scheduleId } = useParams();

  return (
    <DutyScheduleForm departmentId={departmentId} scheduleId={scheduleId} />
  );
};

export default ManagerDutyScheduleForm;
