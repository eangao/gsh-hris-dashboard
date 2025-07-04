import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa6";
import { getCurrentDatePH, formatDateTimePH } from "../utils/phDateUtils";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeDetailsById } from "../store/Reducers/employeeReducer";

const Header = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { employee: employeeId } = userInfo;
  const { employee: employeeDetails } = useSelector((state) => state.employee);

  // State to hold the current PH date and time string
  const [dateTimePH, setDateTimePH] = useState(
    formatDateTimePH(getCurrentDatePH())
  );

  // Set up interval to update the PH date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTimePH(formatDateTimePH(getCurrentDatePH()));
    }, 1000);
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeDetailsById(employeeId));
    }
  }, [employeeId, dispatch]);

  return (
    <div className="fixed top-0 left-0 w-full   z-40">
      <div className="ml-0 lg:ml-[260px]  flex justify-between items-center bg-[#b1addf] px-5 transition-all">
        {/* Sidebar toggle button for mobile */}
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-[35px] flex lg:hidden h-[35px] rounded-sm bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 justify-center items-center cursor-pointer"
        >
          <span>
            <FaList />
          </span>
        </div>

        {/* PH Date and Time display (visible on md and up) */}
        <div className="hidden md:block">
          {/* Professional, bold, and larger PH date/time with indigo color for contrast */}
          <span className="font-bold text-lg text-indigo-900">
            {dateTimePH}
          </span>
        </div>

        {/* User info section */}
        <div className="flex justify-center items-center gap-8 relative">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center gap-3">
              <div className="flex justify-center items-center flex-col text-end">
                <h2 className="text-md font-bold">
                  {employeeDetails?.personalInformation
                    ? `${employeeDetails.personalInformation.firstName} ${
                        employeeDetails.personalInformation.middleName
                          ? employeeDetails.personalInformation.middleName.charAt(
                              0
                            ) + "."
                          : ""
                      } ${employeeDetails.personalInformation.lastName}${
                        employeeDetails.personalInformation.suffix
                          ? ", " + employeeDetails.personalInformation.suffix
                          : ""
                      }`
                    : ""}
                </h2>
                <div className="text-[14px] w-full font-normal">
                  {employeeDetails?.employmentInformation ? (
                    employeeDetails.employmentInformation.position?.level?.toLowerCase() ===
                    "staff" ? (
                      <>
                        <span>
                          {employeeDetails.employmentInformation.department?.name?.toUpperCase() ||
                            ""}
                        </span>{" "}
                        -{" "}
                        <span className="capitalize">
                          {employeeDetails.employmentInformation.position?.name
                            ? employeeDetails.employmentInformation.position.name
                                .charAt(0)
                                .toUpperCase() +
                              employeeDetails.employmentInformation.position.name
                                .slice(1)
                                .toLowerCase()
                            : ""}
                        </span>
                      </>
                    ) : (
                      <span className="capitalize">
                        {employeeDetails.employmentInformation.position?.name
                          ? employeeDetails.employmentInformation.position.name
                              .charAt(0)
                              .toUpperCase() +
                            employeeDetails.employmentInformation.position.name
                              .slice(1)
                              .toLowerCase()
                          : ""}
                      </span>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <img
                className="w-[35px] h-[35px] rounded-full overflow-hidden"
                src="http://localhost:3001/images/admin.jpg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
