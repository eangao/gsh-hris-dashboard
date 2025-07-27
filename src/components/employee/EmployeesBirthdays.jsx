import React, { useState, useMemo, useCallback } from "react";
import {
  getEmployeesBirthdaysByPeriod,
  getBirthdayStatsPH,
  getAgePHFromISO,
} from "../../utils/phDateUtils";

const EmployeesBirthdays = ({
  birthdayEmployees,
  birthdayLoading,
  employeeDetails,
  setEmployeeDetails,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [searchValue, setSearchValue] = useState("");

  // Process employees for selected period
  const filteredEmployees = useMemo(() => {
    if (!birthdayEmployees || birthdayEmployees.length === 0) return [];

    let employees = getEmployeesBirthdaysByPeriod(
      birthdayEmployees,
      selectedPeriod
    );

    // Apply search filter
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      employees = employees.filter((emp) => {
        const fullName = `${emp.personalInformation?.firstName || ""} ${
          emp.personalInformation?.middleName || ""
        } ${emp.personalInformation?.lastName || ""} ${
          emp.personalInformation?.suffix || ""
        }`.toLowerCase();
        return fullName.includes(searchLower);
      });
    }

    return employees;
  }, [birthdayEmployees, selectedPeriod, searchValue]);

  // Birthday statistics
  const birthdayStats = useMemo(() => {
    if (!birthdayEmployees || birthdayEmployees.length === 0) {
      return {
        threeDaysAgo: 0,
        twoDaysAgo: 0,
        yesterday: 0,
        today: 0,
        tomorrow: 0,
        twoDaysFromNow: 0,
        threeDaysFromNow: 0,
        fourDaysFromNow: 0,
        fiveDaysFromNow: 0,
        sixDaysFromNow: 0,
        oneWeekFromNow: 0,
        lastWeek: 0,
        thisWeek: 0,
        thisMonth: 0,
        lastMonth: 0,
        nextMonth: 0,
      };
    }
    return getBirthdayStatsPH(birthdayEmployees);
  }, [birthdayEmployees]);

  // Event handlers
  const handleViewEmployee = useCallback(
    (employeeId) => {
      setEmployeeDetails(employeeId);
    },
    [setEmployeeDetails]
  );

  const handlePeriodChange = useCallback((period) => {
    setSelectedPeriod(period);
    setSearchValue("");
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  // Get period display info
  const getPeriodInfo = useCallback((period) => {
    switch (period) {
      case "threeDaysAgo":
        return {
          title: "3 Days Ago",
          icon: "📅",
          color: "bg-gray-50 border-gray-200 text-gray-700",
          activeColor: "bg-gray-100 border-gray-300 text-gray-800",
        };
      case "twoDaysAgo":
        return {
          title: "2 Days Ago",
          icon: "📅",
          color: "bg-gray-50 border-gray-200 text-gray-700",
          activeColor: "bg-gray-100 border-gray-300 text-gray-800",
        };
      case "yesterday":
        return {
          title: "Yesterday",
          icon: "⏮️",
          color: "bg-orange-50 border-orange-200 text-orange-700",
          activeColor: "bg-orange-100 border-orange-300 text-orange-800",
        };
      case "today":
        return {
          title: "Today's Birthdays",
          icon: "🎂",
          color: "bg-red-50 border-red-200 text-red-700",
          activeColor: "bg-red-100 border-red-300 text-red-800",
        };
      case "tomorrow":
        return {
          title: "Tomorrow",
          icon: "⏭️",
          color: "bg-green-50 border-green-200 text-green-700",
          activeColor: "bg-green-100 border-green-300 text-green-800",
        };
      case "twoDaysFromNow":
        return {
          title: "2 Days From Now",
          icon: "📅",
          color: "bg-blue-50 border-blue-200 text-blue-700",
          activeColor: "bg-blue-100 border-blue-300 text-blue-800",
        };
      case "threeDaysFromNow":
        return {
          title: "3 Days From Now",
          icon: "📅",
          color: "bg-blue-50 border-blue-200 text-blue-700",
          activeColor: "bg-blue-100 border-blue-300 text-blue-800",
        };
      case "fourDaysFromNow":
        return {
          title: "4 Days From Now",
          icon: "📅",
          color: "bg-indigo-50 border-indigo-200 text-indigo-700",
          activeColor: "bg-indigo-100 border-indigo-300 text-indigo-800",
        };
      case "fiveDaysFromNow":
        return {
          title: "5 Days From Now",
          icon: "📅",
          color: "bg-indigo-50 border-indigo-200 text-indigo-700",
          activeColor: "bg-indigo-100 border-indigo-300 text-indigo-800",
        };
      case "sixDaysFromNow":
        return {
          title: "6 Days From Now",
          icon: "📅",
          color: "bg-purple-50 border-purple-200 text-purple-700",
          activeColor: "bg-purple-100 border-purple-300 text-purple-800",
        };
      case "oneWeekFromNow":
        return {
          title: "1 Week From Now",
          icon: "📅",
          color: "bg-purple-50 border-purple-200 text-purple-700",
          activeColor: "bg-purple-100 border-purple-300 text-purple-800",
        };
      case "lastMonth":
        return {
          title: "Last Month Birthdays",
          icon: "📅",
          color: "bg-gray-50 border-gray-200 text-gray-700",
          activeColor: "bg-gray-100 border-gray-300 text-gray-800",
        };
      case "lastWeek":
        return {
          title: "Last Week's Birthdays",
          icon: "📆",
          color: "bg-orange-50 border-orange-200 text-orange-700",
          activeColor: "bg-orange-100 border-orange-300 text-orange-800",
        };
      case "thisWeek":
        return {
          title: "This Week's Birthdays",
          icon: "📆",
          color: "bg-yellow-50 border-yellow-200 text-yellow-700",
          activeColor: "bg-yellow-100 border-yellow-300 text-yellow-800",
        };
      case "thisMonth":
        return {
          title: "This Month's Birthdays",
          icon: "🗓️",
          color: "bg-blue-50 border-blue-200 text-blue-700",
          activeColor: "bg-blue-100 border-blue-300 text-blue-800",
        };
      case "nextMonth":
        return {
          title: "Next Month's Birthdays",
          icon: "⏭️",
          color: "bg-purple-50 border-purple-200 text-purple-700",
          activeColor: "bg-purple-100 border-purple-300 text-purple-800",
        };
      default:
        return {
          title: "Birthdays",
          icon: "🎉",
          color: "bg-gray-50 border-gray-200 text-gray-700",
          activeColor: "bg-gray-100 border-gray-300 text-gray-800",
        };
    }
  }, []);

  // Loading skeleton for cards
  const BirthdayCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="flex gap-2 mt-3">
            <div className="h-7 bg-gray-200 rounded w-20"></div>
            <div className="h-7 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const currentPeriodInfo = getPeriodInfo(selectedPeriod);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              🎉 Employee Birthdays
            </h1>
            <p className="text-purple-100 text-lg">
              Celebrate and track employee birthdays across different periods
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-600 text-white">
              <span className="mr-2">{currentPeriodInfo.icon}</span>
              {filteredEmployees.length}{" "}
              {filteredEmployees.length === 1 ? "birthday" : "birthdays"}{" "}
              {selectedPeriod === "today"
                ? "today"
                : getPeriodInfo(selectedPeriod).title.toLowerCase()}
            </div>
          </div>
          <div className="hidden lg:block bg-white/10 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Birthday Statistics Cards */}
      <div className="space-y-4">
        {/* Broader Periods */}
        <div className="space-y-3">
          <h3 className="text-md font-medium text-gray-800 px-2">
            Birthday Periods
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              {
                period: "lastMonth",
                label: "Last Month",
                count: birthdayStats.lastMonth,
                color: "bg-gray-100 text-gray-800 border-gray-300",
              },
              {
                period: "lastWeek",
                label: "Last Week",
                count: birthdayStats.lastWeek,
                color: "bg-orange-100 text-orange-800 border-orange-300",
              },
              {
                period: "today",
                label: "Today",
                count: birthdayStats.today,
                color: "bg-red-100 text-red-800 border-red-300",
              },
              {
                period: "thisWeek",
                label: "This Week",
                count: birthdayStats.thisWeek,
                color: "bg-yellow-100 text-yellow-800 border-yellow-300",
              },
              {
                period: "thisMonth",
                label: "This Month",
                count: birthdayStats.thisMonth,
                color: "bg-blue-100 text-blue-800 border-blue-300",
              },
              {
                period: "nextMonth",
                label: "Next Month",
                count: birthdayStats.nextMonth,
                color: "bg-purple-100 text-purple-800 border-purple-300",
              },
            ].map(({ period, label, count, color }) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  selectedPeriod === period
                    ? `${color} shadow-md`
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{getPeriodInfo(period).icon}</span>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
                <p className="text-sm font-medium">{label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-2xl">{currentPeriodInfo.icon}</span>
              {currentPeriodInfo.title}
            </h2>
            <p className="text-gray-600">
              {filteredEmployees.length}{" "}
              {filteredEmployees.length === 1 ? "employee" : "employees"} found
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pr-12 focus:border-purple-600 outline-none border border-gray-300 rounded-lg shadow-sm text-gray-900 transition-all"
              placeholder="Search by employee name..."
              disabled={birthdayLoading}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Birthday Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {birthdayLoading ? (
          [...Array(6)].map((_, index) => <BirthdayCardSkeleton key={index} />)
        ) : filteredEmployees.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">{currentPeriodInfo.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No birthdays found
              </h3>
              <p className="text-gray-600">
                {searchValue
                  ? `No employees found matching "${searchValue}" for ${getPeriodInfo(
                      selectedPeriod
                    ).title.toLowerCase()}`
                  : `No employee birthdays ${getPeriodInfo(
                      selectedPeriod
                    ).title.toLowerCase()}`}
              </p>
              {searchValue && (
                <button
                  onClick={() => setSearchValue("")}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredEmployees.map((employee) => (
            <div
              key={employee._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-purple-200">
                  <span className="text-purple-700 font-bold text-lg">
                    {employee.personalInformation?.firstName?.charAt(0)}
                    {employee.personalInformation?.lastName?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    <span className="capitalize">
                      {employee.personalInformation?.firstName}
                    </span>{" "}
                    {employee.personalInformation?.middleName && (
                      <span className="capitalize">
                        {employee.personalInformation?.middleName
                          .charAt(0)
                          .toUpperCase()}
                        .
                      </span>
                    )}{" "}
                    <span className="capitalize">
                      {employee.personalInformation?.lastName}
                    </span>
                    {employee.personalInformation?.suffix && (
                      <span className="uppercase text-sm ml-1">
                        {employee.personalInformation?.suffix}
                      </span>
                    )}
                  </h3>

                  <div className="space-y-1 mb-3">
                    <div className="font-medium text-purple-700 uppercase tracking-wide text-sm">
                      {employee?.department?.name || "NO DEPARTMENT"}
                    </div>
                    <div className="text-gray-600 capitalize text-sm">
                      {employee?.position?.name || "NO POSITION"}
                    </div>
                    <div className="text-green-600 capitalize text-sm font-medium">
                      {employee?.employmentStatus?.name || "NO STATUS"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
                      🎂 {employee.birthdayThisYear}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      {getAgePHFromISO(employee.personalInformation?.birthdate)}{" "}
                      years old
                    </span>

                    {/* Timing badge with green background */}
                    {selectedPeriod === "today" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200 animate-pulse">
                        🎉 Today!
                      </span>
                    )}
                    {selectedPeriod === "yesterday" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        ⏮️ Yesterday
                      </span>
                    )}
                    {selectedPeriod === "tomorrow" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        ⏭️ Tomorrow
                      </span>
                    )}
                    {selectedPeriod === "twoDaysAgo" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        📅 2 days ago
                      </span>
                    )}
                    {selectedPeriod === "threeDaysAgo" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        📅 3 days ago
                      </span>
                    )}
                    {selectedPeriod === "twoDaysFromNow" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        📅 2 days from now
                      </span>
                    )}
                    {selectedPeriod === "threeDaysFromNow" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        📅 3 days from now
                      </span>
                    )}
                    {selectedPeriod === "fourDaysFromNow" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        📅 4 days from now
                      </span>
                    )}
                    {selectedPeriod === "fiveDaysFromNow" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        📅 5 days from now
                      </span>
                    )}
                    {selectedPeriod === "sixDaysFromNow" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        📅 6 days from now
                      </span>
                    )}
                    {selectedPeriod === "oneWeekFromNow" && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        📅 1 week from now
                      </span>
                    )}
                    {[
                      "lastWeek",
                      "thisWeek",
                      "thisMonth",
                      "nextMonth",
                      "lastMonth",
                    ].includes(selectedPeriod) && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                        {employee.actualDaysFromToday === 0
                          ? "🎉 Today!"
                          : employee.actualDaysFromToday === 1
                          ? "Tomorrow"
                          : employee.actualDaysFromToday === -1
                          ? "Yesterday"
                          : employee.actualDaysFromToday > 1
                          ? `${employee.actualDaysFromToday} days from now`
                          : employee.actualDaysFromToday < -1
                          ? `${Math.abs(employee.actualDaysFromToday)} days ago`
                          : "Today"}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleViewEmployee(employee._id)}
                    className="w-full px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 hover:text-purple-800 border border-purple-200 hover:border-purple-300 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    disabled={birthdayLoading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    View Employee Profile
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Search Results Info */}
      {searchValue && filteredEmployees.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-700">
              Search results for "<strong>{searchValue}</strong>" in{" "}
              {getPeriodInfo(selectedPeriod).title.toLowerCase()}
            </span>
            <button
              onClick={() => setSearchValue("")}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesBirthdays;
