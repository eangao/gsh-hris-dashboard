import React, { useEffect, useState } from "react";
import { FaList } from "react-icons/fa6";
import { getCurrentDatePH, formatDateTimePH } from "../utils/phDateUtils";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/Reducers/authReducer";
import {
  BiLogOutCircle,
  BiUserCircle,
  BiCog,
  BiHelpCircle,
} from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Header = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { employee } = userInfo;

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

  // useEffect(() => {
  //   if (employeeId) {
  //     dispatch(fetchEmployeeDetailsById(employeeId));
  //   }
  // }, [employeeId, dispatch]);

  // State to manage dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full z-40 shadow-md bg-gradient-to-r from-[#3B5998] via-[#6A82FB] to-[#56CCF2]">
      <div className="ml-0 lg:ml-[260px] flex justify-between items-center px-5 py-2 transition-all">
        {/* Sidebar toggle button for mobile */}
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-[40px] flex lg:hidden h-[40px] rounded-full bg-[#3B5998] shadow-lg hover:bg-[#6A82FB] justify-center items-center cursor-pointer border-2 border-white"
        >
          <span className="text-white text-xl">
            <FaList />
          </span>
        </div>

        {/* PH Date and Time display (visible on md and up) */}
        <div className="hidden md:block">
          <span className="font-bold text-lg text-white drop-shadow-md tracking-wide">
            {dateTimePH}
          </span>
        </div>

        <div className="flex justify-center items-center gap-8 relative">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center gap-3">
              {/* User info section */}
              <div className="flex justify-center items-end flex-col text-end drop-shadow-lg">
                <h2 className="text-md font-bold text-[#1a237e] drop-shadow-sm">
                  {employee?.personalInformation
                    ? `${employee.personalInformation.firstName} ${
                        employee.personalInformation.middleName
                          ? employee.personalInformation.middleName.charAt(0) +
                            "."
                          : ""
                      } ${employee.personalInformation.lastName}${
                        employee.personalInformation.suffix
                          ? ", " + employee.personalInformation.suffix
                          : ""
                      }`
                    : ""}
                </h2>
                <div className="text-[14px] w-full font-normal text-[#263159] drop-shadow">
                  {employee?.employmentInformation ? (
                    employee.employmentInformation.position?.level?.toLowerCase() ===
                    "staff" ? (
                      <>
                        <span>
                          {employee.employmentInformation.department?.name?.toUpperCase() ||
                            ""}
                        </span>{" "}
                        -{" "}
                        <span className="capitalize">
                          {employee.employmentInformation.position?.name
                            ? employee.employmentInformation.position.name
                                .charAt(0)
                                .toUpperCase() +
                              employee.employmentInformation.position.name
                                .slice(1)
                                .toLowerCase()
                            : ""}
                        </span>
                      </>
                    ) : (
                      <span className="capitalize">
                        {employee.employmentInformation.position?.name
                          ? employee.employmentInformation.position.name
                              .charAt(0)
                              .toUpperCase() +
                            employee.employmentInformation.position.name
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

              {/* Profile image with dropdown menu */}
              <div className="relative">
                <img
                  className="w-[45px] h-[45px] rounded-full border-2 border-white shadow-md object-cover bg-white cursor-pointer"
                  src="http://localhost:3001/images/admin.jpg"
                  alt="User profile"
                  tabIndex={0}
                  onClick={() => setShowDropdown((prev) => !prev)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />
                {/* Dropdown menu (controlled by click) */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-opacity duration-200">
                    <button
                      className="w-full flex items-center gap-3 text-left px-4 py-2 text-[#1a237e] hover:bg-[#e3eafd] rounded-t-lg"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/employee/account-settings");
                      }}
                    >
                      <BiCog className="text-lg" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 text-left px-4 py-2 text-[#1a237e] hover:bg-[#e3eafd]"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/employee/profile");
                      }}
                    >
                      <BiUserCircle className="text-lg" />
                      <span>My Profile</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 text-left px-4 py-2 text-[#1a237e] hover:bg-[#e3eafd]"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/employee/help-support");
                      }}
                    >
                      <BiHelpCircle className="text-lg" />
                      <span>Help & Support</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 text-left px-4 py-2 text-[#1a237e] hover:bg-[#e3eafd] rounded-b-lg"
                      onClick={async () => {
                        setShowDropdown(false);
                        await dispatch(logout({}));
                        navigate("/login");
                      }}
                    >
                      <BiLogOutCircle className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
