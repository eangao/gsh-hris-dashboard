import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const Search = ({
  setPerpage,
  setSearchValue,
  searchValue,
  inputPlaceholder,
  perPage = 5, // Default value
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showClear, setShowClear] = useState(false);

  // Reset input value when searchValue changes externally (for clearing)
  useEffect(() => {
    if (!searchValue) {
      setInputValue("");
      setShowClear(false);
    } else {
      setInputValue(searchValue);
      setShowClear(true);
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
      setShowClear(false); // Hide "X" while typing
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setInputValue("");
    triggerSearch("");
    setShowClear(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
      {/* Search Input Field */}
      <div className="relative sm:col-span-10">
        <label
          htmlFor="search-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {inputPlaceholder
            ? inputPlaceholder.replace("Search", "").trim() || "Search"
            : "Search"}
        </label>
        <div className="relative">
          <input
            id="search-input"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={inputValue}
            className="w-full px-4 py-2 pr-12 focus:border-blue-600 outline-none border border-gray-300 rounded-md shadow-sm text-gray-900 transition-all"
            type="text"
            placeholder={inputPlaceholder || "Search..."}
            autoComplete="off"
          />

          {showClear ? (
            <button
              onClick={handleClearSearch}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-red-600 rounded p-2 hover:text-red-700 transition-colors"
              title="Clear search"
            >
              <FaTimes />
            </button>
          ) : null}

          <button
            onClick={handleSearchButtonClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 rounded p-2 hover:text-blue-700 transition-colors"
            title="Search"
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
          className="w-full px-4 py-2 focus:border-blue-600 outline-none border border-gray-300 rounded-md shadow-sm text-gray-900 transition-all"
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

export default Search;
