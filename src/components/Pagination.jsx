import React from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const Pagination = ({
  pageNumber,
  setPageNumber,
  totalItem,
  perPage,
  showItem,
}) => {
  let totalPage = Math.ceil(totalItem / perPage);
  let startPage = pageNumber;
  let dif = totalPage - pageNumber;

  if (dif <= showItem) {
    startPage = totalPage - showItem;
  }

  let endPage = startPage < 0 ? showItem : showItem + startPage;

  if (startPage <= 0) {
    startPage = 1;
  }

  const createButton = () => {
    const btns = [];

    for (let i = startPage; i < endPage; i++) {
      btns.push(
        <li
          key={i}
          onClick={() => setPageNumber(i)}
          className={`cursor-pointer w-[33px] h-[33px] rounded-full flex justify-center items-center 
            ${
              pageNumber === i
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-400/50"
            }`}
        >
          {i}
        </li>
      );
    }

    return btns;
  };

  return (
    <div className="flex justify-between items-center w-full">
      {/* Page Indicator */}
      {totalItem > 0 && pageNumber > 0 && (
        <span className="text-gray-700 font-medium">
          Page {pageNumber} of {totalPage}
        </span>
      )}

      {/* Pagination Buttons */}
      <ul className="flex gap-2">
        {pageNumber > 1 && (
          <li
            onClick={() => setPageNumber(pageNumber - 1)}
            className="cursor-pointer w-[33px] h-[33px] rounded-full flex justify-center items-center bg-blue-500 text-white hover:bg-blue-700"
          >
            <MdKeyboardDoubleArrowLeft />
          </li>
        )}

        {createButton()}

        {pageNumber < totalPage && (
          <li
            onClick={() => setPageNumber(pageNumber + 1)}
            className="cursor-pointer w-[33px] h-[33px] rounded-full flex justify-center items-center bg-blue-500 text-white hover:bg-blue-700"
          >
            <MdKeyboardDoubleArrowRight />
          </li>
        )}
      </ul>
    </div>
  );
};

export default Pagination;
