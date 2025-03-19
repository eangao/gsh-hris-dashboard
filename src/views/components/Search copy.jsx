import React from "react";

const Search = ({
  setPerpage,
  setSearchValue,
  searchValue,
  inputPlaceholder,
}) => {
  return (
    <div className="flex justify-between items-center">
      <select
        onChange={(e) => setPerpage(parseInt(e.target.value))}
        className="px-4 py-2 focus:border-slate-800 outline-none border border-slate-400  rounded text-slate-900"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
      <input
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
        className="px-4 py-2 focus:border-slate-800 outline-none border border-slate-400  rounded text-slate-900"
        type="text"
        placeholder={inputPlaceholder}
      />
    </div>
  );
};

export default Search;
