import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaChevronDown } from "react-icons/fa";

const EmployeeSearchFrontend = ({
  setPerpage,
  perPage = 10,
  setSearchValue,
  searchValue,
  inputPlaceholder,
  employees = [],
  loading = false,
  departments = [],
  selectedDepartment = "",
  onDepartmentChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showClear, setShowClear] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Reset input value when searchValue changes externally (for clearing)
  useEffect(() => {
    if (!searchValue) {
      setInputValue("");
      setShowClear(false);
    }
  }, [searchValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.closest(".employee-search-dropdown") === null) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to trigger search
  const triggerSearch = (value) => {
    setSearchValue(value);
    setShowClear(!!value);
    setShowDropdown(false);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      triggerSearch(inputValue);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    } else if (e.key === "ArrowDown" && !showDropdown) {
      setShowDropdown(true);
    }
  };

  // Handle search button click
  const handleSearchButtonClick = () => {
    triggerSearch(inputValue);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setShowClear(false);
      triggerSearch("");
    } else {
      setShowClear(true);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    // Only show dropdown if we have employees
    if (employees && employees.length > 0) {
      setShowDropdown(true);
    }
  };

  // Format employee name from personal information
  const formatEmployeeName = (employee) => {
    if (!employee) return "Unknown";

    if (employee.personalInformation) {
      const { firstName, lastName, middleName } = employee.personalInformation;
      return `${firstName || ""} ${middleName ? middleName + " " : ""}${
        lastName || ""
      }`.trim();
    }

    // Fallback if the structure is different
    return employee.name || "Unknown";
  };

  // Handle employee selection from dropdown
  const handleEmployeeSelect = (employee) => {
    const employeeName = formatEmployeeName(employee);

    // Set the display value to the employee name
    setInputValue(employeeName);

    // Pass the employee ID to the parent component for filtering
    if (employee._id) {
      triggerSearch(employee._id);
    }

    setShowDropdown(false);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setInputValue("");
    triggerSearch("");
    setShowClear(false);
    setShowDropdown(false); // Hide dropdown when clearing
  };

  // Get department label
  const getDepartmentLabel = () => {
    if (!departments || departments.length === 0) {
      return "Select Department";
    }

    if (departments.length === 1) {
      return departments[0].name;
    }

    const selectedDept = departments.find(
      (dept) => dept._id === selectedDepartment
    );
    return selectedDept ? selectedDept.name : "Select Department";
  };

  // Check if there's only one department to show label instead of dropdown
  const singleDepartment = departments && departments.length === 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
      {/* Department Selection - Only show if we have departments */}
      {departments && departments.length > 0 && (
        <div className="sm:col-span-4">
          {singleDepartment ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="px-4 py-2 border uppercase border-gray-300 rounded-md bg-gray-50 text-gray-700">
                {getDepartmentLabel()}
              </div>
            </div>
          ) : (
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={onDepartmentChange}
                disabled={loading}
                className={`w-full px-4 py-2 text-sm font-medium uppercase focus:border-blue-600 outline-none border border-gray-300 rounded-md shadow-sm text-gray-900 transition-all ${
                  loading ? "bg-gray-50 cursor-not-allowed" : "bg-white"
                }`}
              >
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Employee Search - Show in remaining space */}
      <div
        className={`relative ${
          departments && departments.length > 0
            ? "sm:col-span-6"
            : "sm:col-span-10"
        }`}
      >
        <label
          htmlFor="employee-search"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {inputPlaceholder || "Search Employee"}
          {employees && employees.length > 0 && (
            <span className="text-xs text-blue-600 ml-1">
              (click dropdown to select employee)
            </span>
          )}
        </label>
        <div className="relative">
          <input
            id="employee-search"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            value={inputValue}
            disabled={loading}
            className={`w-full px-4 py-2 pr-12 focus:border-blue-600 outline-none border border-gray-300 rounded-md shadow-sm text-gray-900 transition-all ${
              loading ? "bg-gray-50 cursor-not-allowed" : ""
            }`}
            type="text"
            placeholder={
              loading
                ? "Loading employees..."
                : employees && employees.length > 0
                ? `${inputPlaceholder || "Search"} (${
                    employees.length
                  } employees available)`
                : inputPlaceholder || "Search by name..."
            }
            autoComplete="off"
          />

          {showClear && !loading ? (
            <button
              onClick={handleClearSearch}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-600 rounded p-2 hover:text-red-700"
              title="Clear search"
            >
              <FaTimes />
            </button>
          ) : null}

          <button
            onClick={() =>
              employees && employees.length > 0
                ? setShowDropdown(!showDropdown)
                : handleSearchButtonClick()
            }
            disabled={loading}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 rounded p-2 hover:text-blue-700 transition-all ${
              showDropdown && employees && employees.length > 0
                ? "bg-blue-50"
                : ""
            } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
            title={
              loading
                ? "Loading..."
                : employees && employees.length > 0
                ? `${showDropdown ? "Hide" : "Show"} employee list`
                : "Search"
            }
          >
            {employees && employees.length > 0 ? (
              <FaChevronDown
                className={`transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            ) : (
              <FaSearch />
            )}
          </button>

          {/* Employee dropdown */}
          {showDropdown && employees && employees.length > 0 && (
            <div className="employee-search-dropdown absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {employees.map((employee) => {
                const employeeName = formatEmployeeName(employee);
                const nameInitials =
                  employeeName.split(" ")[0]?.charAt(0) +
                  (employeeName
                    .split(" ")
                    [employeeName.split(" ").length - 1]?.charAt(0) || "");

                // Get employee position if available
                const position =
                  employee.employmentInformation?.position?.name || "";

                return (
                  <div
                    key={employee._id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                    onClick={() => handleEmployeeSelect(employee)}
                  >
                    <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                      <span className="text-blue-600 font-semibold text-xs">
                        {nameInitials || "??"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {employeeName}
                      </div>
                      {position && (
                        <div className="text-xs text-gray-500 truncate">
                          {position}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {employees.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No employees found
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Per page selection */}
      <div className="sm:col-span-2">
        <label
          htmlFor="per-page"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Show
        </label>
        <select
          id="per-page"
          onChange={(e) => setPerpage(parseInt(e.target.value))}
          value={perPage.toString()}
          disabled={loading}
          className={`w-full px-4 py-2 focus:border-blue-600 outline-none border border-gray-300 rounded-md shadow-sm text-gray-900 transition-all ${
            loading ? "bg-gray-50 cursor-not-allowed" : ""
          }`}
        >
          <option value="5">5 rows</option>
          <option value="10">10 rows</option>
          <option value="20">20 rows</option>
          <option value="50">50 rows</option>
        </select>
      </div>
    </div>
  );
};

export default EmployeeSearchFrontend;
