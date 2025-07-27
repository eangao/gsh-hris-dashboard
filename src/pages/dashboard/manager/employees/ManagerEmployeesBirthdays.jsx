import React, { useEffect, useMemo } from "react";

import { fetchEmployeesBirthdays } from "../../../../store/Reducers/employeeReducer";
import { useDispatch, useSelector } from "react-redux";
import EmployeesBirthdays from "../../../../components/employee/EmployeesBirthdays";
import { useNavigate } from "react-router-dom";
import { fetchEmployeesBirthdaysByDepartments } from "./../../../../store/Reducers/employeeReducer";

const ManagerEmployeesBirthdays = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  // Extract departments from the new API structure - Memoized for performance
  const managedDepartments = useMemo(
    () =>
      userInfo?.employee?.employmentInformation?.managedDepartments?.map(
        (item) => item.department
      ) || [],
    [userInfo?.employee?.employmentInformation?.managedDepartments]
  );

  const { birthdayEmployees, birthdayLoading } = useSelector(
    (state) => state.employee
  );

  const [employeeDetails, setEmployeeDetails] = React.useState("");

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchEmployeesBirthdaysByDepartments(managedDepartments));
  }, [dispatch, managedDepartments]);

  useEffect(() => {
    if (employeeDetails) {
      navigate(`/manager/employees/details/${employeeDetails}`);
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

export default ManagerEmployeesBirthdays;
