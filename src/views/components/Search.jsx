import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa"; // Import icons

const Search = ({
  setPerpage,
  setSearchValue,
  searchValue,
  inputPlaceholder,
}) => {
  const [inputValue, setInputValue] = useState(searchValue); // Local input state
  const [showClear, setShowClear] = useState(false); // Controls when to show "X"

  // Function to trigger search
  const triggerSearch = (value) => {
    setSearchValue(value);
    setShowClear(!!value); // Show "X" only if input exists after searching
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
      setShowClear(false); // Hide "X" when input is empty
      triggerSearch(""); // Trigger search with an empty value to retrieve all data
    } else {
      setShowClear(false); // Hide "X" while typing
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setInputValue(""); // Clear input field
    triggerSearch(""); // Reset search to retrieve all data
    setShowClear(false); // Hide "X"
  };

  return (
    <div className="flex justify-between items-center">
      <select
        onChange={(e) => setPerpage(parseInt(e.target.value))}
        className="px-4 py-2 focus:border-slate-800 outline-none border border-slate-400 rounded text-slate-900"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>

      <div className="relative flex items-center">
        <input
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          value={inputValue}
          className="px-4 py-2 pr-12 focus:border-slate-800 outline-none border border-slate-400 rounded text-slate-900"
          type="text"
          placeholder={inputPlaceholder}
        />

        {showClear ? (
          // "X" button appears and disappears when clicked or when the input is empty
          <button
            onClick={handleClearSearch}
            className="absolute right-2 text-red-600 rounded p-2 hover:text-red-700"
          >
            <FaTimes />
          </button>
        ) : (
          // Search button appears when "X" is hidden
          <button
            onClick={handleSearchButtonClick}
            className="absolute right-2 text-blue-600 rounded p-2 hover:text-blue-700"
          >
            <FaSearch />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
