import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const EmployeeSearchDatabase = ({
  setPerpage,
  perPage = 10,
  setSearchValue,
  searchValue,
  inputPlaceholder,
  loading = false,
  managedDepartments = [],
  selectedDepartment = "",
  onDepartmentChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showClear, setShowClear] = useState(false);

  // Reset input value when searchValue changes externally (for clearing)
  useEffect(() => {
    if (!searchValue) {
      setInputValue("");
      setShowClear(false);
    }
  }, [searchValue]);

  // Function to trigger search
  const triggerSearch = (value) => {
    setSearchValue(value);
    setShowClear(!!value);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      triggerSearch(inputValue);
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

  // Handle clear search
  const handleClearSearch = () => {
    setInputValue("");
    triggerSearch("");
    setShowClear(false);
  };

  // Get department label
  const getDepartmentLabel = () => {
    if (!managedDepartments || managedDepartments.length === 0) {
      return "Select Department";
    }

    if (managedDepartments.length === 1) {
      return managedDepartments[0].name;
    }

    const selectedDept = managedDepartments.find(
      (dept) => dept._id === selectedDepartment
    );
    return selectedDept ? selectedDept.name : "Select Department";
  };

  // Check if there's only one department to show label instead of dropdown
  const singleDepartment =
    managedDepartments && managedDepartments.length === 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
      {/* Department Selection - Only show if we have departments */}
      {managedDepartments && managedDepartments.length > 0 && (
        <div className="sm:col-span-4">
          {singleDepartment ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <div className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
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
                className="w-full px-4 py-2 focus:border-blue-600 outline-none border border-gray-300 rounded-md shadow-sm text-gray-900 bg-white transition-all"
                disabled={loading}
              >
                <option value="">All Departments</option>
                {managedDepartments.map((dept) => (
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
          managedDepartments && managedDepartments.length > 0
            ? "sm:col-span-6"
            : "sm:col-span-10"
        }`}
      >
        <label
          htmlFor="employee-search"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {inputPlaceholder || "Search Employee"}
        </label>
        <div className="relative">
          <input
            id="employee-search"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={inputValue}
            className="w-full px-4 py-2 pr-12 focus:border-blue-600 outline-none border border-gray-300 rounded-md shadow-sm text-gray-900 transition-all"
            type="text"
            placeholder={
              inputPlaceholder || "Search by name, ID, or position..."
            }
            autoComplete="off"
            disabled={loading}
          />

          {showClear ? (
            <button
              onClick={handleClearSearch}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-600 rounded p-2 hover:text-red-700"
              title="Clear search"
              disabled={loading}
            >
              <FaTimes />
            </button>
          ) : null}

          <button
            onClick={handleSearchButtonClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 rounded p-2 hover:text-blue-700 transition-all"
            title="Search"
            disabled={loading}
          >
            <FaSearch />
          </button>
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
          className="w-full px-4 py-2 focus:border-blue-600 outline-none border border-gray-300 rounded-md shadow-sm text-gray-900"
          disabled={loading}
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

export default EmployeeSearchDatabase;
