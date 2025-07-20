import React, { useEffect, useState, useRef } from "react";
import { FaList } from "react-icons/fa6";
import { getCurrentDatePH, formatDateTimePH } from "../utils/phDateUtils";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/Reducers/authReducer";
import {
  BiLogOutCircle,
  BiUserCircle,
  BiCog,
  BiHelpCircle,
  BiChevronDown,
  BiTime,
} from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "../hooks/useWindowSize";

const Header = ({ showSidebar, setShowSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const dropdownRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);
  const { employee } = userInfo;

  const isLargeScreen = width >= 1024;

  // State to hold the current PH date and time string
  const [dateTimePH, setDateTimePH] = useState(
    formatDateTimePH(getCurrentDatePH())
  );

  // State to manage dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Set up interval to update the PH date and time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTimePH(formatDateTimePH(getCurrentDatePH()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enhanced logout function with loading state
  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowDropdown(false);
    try {
      await dispatch(logout({}));
      navigate("/login");
    } catch (error) {
      // console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!employee?.personalInformation) return "U";
    const firstName = employee.personalInformation.firstName || "";
    const lastName = employee.personalInformation.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Get formatted user name
  const getFormattedUserName = () => {
    if (!employee?.personalInformation) return "User";
    const { firstName, middleName, lastName, suffix } =
      employee.personalInformation;
    const middleInitial = middleName ? middleName.charAt(0) + "." : "";
    const suffixText = suffix ? `, ${suffix}` : "";
    return `${firstName} ${middleInitial} ${lastName}${suffixText}`.trim();
  };

  // Get formatted position and department
  const getFormattedPosition = () => {
    if (!employee?.employmentInformation) return "";
    const { position, department } = employee.employmentInformation;

    if (!position?.name) return "";

    const positionName =
      position.name.charAt(0).toUpperCase() +
      position.name.slice(1).toLowerCase();

    if (position.level?.toLowerCase() === "staff" && department?.name) {
      return `${department.name.toUpperCase()} - ${positionName}`;
    }

    return positionName;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white shadow-md border-b border-gray-200">
      <div
        className={`${
          showSidebar ? "ml-0 lg:ml-[260px]" : "ml-0"
        } flex justify-between items-center px-4 lg:px-6 py-3 transition-all duration-300 ease-in-out`}
      >
        {/* Left Section - Sidebar Toggle & DateTime */}
        <div className="flex items-center gap-4">
          {/* Sidebar toggle button */}
          {(!showSidebar || !isLargeScreen) && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Toggle sidebar"
            >
              <FaList className="text-sm" />
            </button>
          )}

          {/* Date and Time Display */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <BiTime className="text-gray-500 text-lg" />
            <span className="text-sm font-medium text-gray-700 tracking-wide">
              {dateTimePH}
            </span>
          </div>

          {/* Mobile Date/Time - shown only on small screens */}
          <div className="md:hidden flex items-center">
            <div className="px-2 py-1 bg-gray-50 rounded-md border border-gray-200">
              <span className="text-xs font-medium text-gray-600">
                {dateTimePH}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - User Profile */}
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="hidden sm:flex flex-col items-end text-right">
            <h2 className="text-sm font-semibold text-gray-900 leading-tight">
              {getFormattedUserName()}
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {getFormattedPosition()}
            </p>
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="User menu"
            >
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {getUserInitials()}
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>

              {/* Dropdown Arrow */}
              <BiChevronDown
                className={`text-gray-500 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 transform transition-all duration-200 ease-out scale-100 opacity-100 animate-in slide-in-from-top-2">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {getFormattedUserName()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {getFormattedPosition()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 group"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/employee/profile");
                    }}
                  >
                    <BiUserCircle className="text-lg group-hover:scale-110 transition-transform duration-150" />
                    <span className="text-sm font-medium">My Profile</span>
                  </button>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 group"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/employee/account-settings");
                    }}
                  >
                    <BiCog className="text-lg group-hover:scale-110 group-hover:rotate-90 transition-all duration-150" />
                    <span className="text-sm font-medium">
                      Account Settings
                    </span>
                  </button>

                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 group"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate("/employee/help-support");
                    }}
                  >
                    <BiHelpCircle className="text-lg group-hover:scale-110 transition-transform duration-150" />
                    <span className="text-sm font-medium">Help & Support</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-100 pt-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 group disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <BiLogOutCircle
                      className={`text-lg transition-transform duration-150 ${
                        isLoggingOut ? "animate-spin" : "group-hover:scale-110"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
