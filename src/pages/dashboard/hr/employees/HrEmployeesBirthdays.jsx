import React, { useEffect } from "react";

import { fetchEmployeesBirthdays } from "../../../../store/Reducers/employeeReducer";
import { useDispatch, useSelector } from "react-redux";
import EmployeesBirthdays from "../../../../components/employee/EmployeesBirthdays";
import { useNavigate } from "react-router-dom";

const HrEmployeesBirthdays = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { birthdayEmployees, birthdayLoading } = useSelector(
    (state) => state.employee
  );

  const [employeeDetails, setEmployeeDetails] = React.useState("");

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchEmployeesBirthdays());
  }, [dispatch]);

  useEffect(() => {
    if (employeeDetails) {
      navigate(`/hr/employees/details/${employeeDetails}`);
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

export default HrEmployeesBirthdays;
