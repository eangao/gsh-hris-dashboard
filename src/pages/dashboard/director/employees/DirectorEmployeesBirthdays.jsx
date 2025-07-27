import React, { useEffect } from "react";

import { fetchEmployeesBirthdaysByCluster } from "../../../../store/Reducers/employeeReducer";
import { useDispatch, useSelector } from "react-redux";
import EmployeesBirthdays from "../../../../components/employee/EmployeesBirthdays";
import { useNavigate } from "react-router-dom";

const DirectorEmployeesBirthdays = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const managedCluster =
    userInfo?.employee?.employmentInformation?.managedCluster;

  const { birthdayEmployees, birthdayLoading } = useSelector(
    (state) => state.employee
  );

  const [employeeDetails, setEmployeeDetails] = React.useState("");

  // Fetch data on component mount
  useEffect(() => {
    if (managedCluster && managedCluster._id) {
      dispatch(fetchEmployeesBirthdaysByCluster(managedCluster._id));
    }
  }, [dispatch, managedCluster]);

  useEffect(() => {
    if (employeeDetails) {
      navigate(`/director/employees/details/${employeeDetails}`);
    }
  }, [employeeDetails, navigate]);

  return (
    <EmployeesBirthdays
      birthdayEmployees={birthdayEmployees}
      birthdayLoading={birthdayLoading}
      employeeDetails={employeeDetails}
      setEmployeeDetails={setEmployeeDetails}
    />
  );
};

export default DirectorEmployeesBirthdays;
