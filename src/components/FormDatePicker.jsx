import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

/**
 * Reusable DatePicker with icon, full width, min/max, and error message support.
 *
 * Props:
 * - name: string
 * - value: string (YYYY-MM-DD)
 * - onChange: function(name, value: YYYY-MM-DD)
 * - required: boolean
 * - minDate: string (YYYY-MM-DD)
 * - maxDate: string (YYYY-MM-DD)
 * - error: string (optional error message to display below)
 */
export default function FormDatePicker({
  name,
  value,
  placeholder,
  onChange,
  required = false,
  minDate,
  maxDate,
  error,
}) {
  const selectedDate = value ? moment(value, "YYYY-MM-DD").toDate() : null;

  const handleChange = (date) => {
    const formatted = moment(date).format("YYYY-MM-DD");
    onChange(name, formatted);
  };

  const min = minDate ? moment(minDate, "YYYY-MM-DD").toDate() : null;
  const max = maxDate ? moment(maxDate, "YYYY-MM-DD").toDate() : null;

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full">
      <FaRegCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
      <input
        type="text"
        ref={ref}
        value={value}
        onClick={onClick}
        readOnly
        required={required}
        placeholder={placeholder}
        className={`w-full pl-10 p-2 border rounded mt-1 bg-white cursor-pointer ${
          error ? "border-red-500" : ""
        }`}
        style={{ width: "100%" }}
      />
    </div>
  ));

  return (
    <div className="w-full">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="MMM d, yyyy"
        customInput={<CustomInput />}
        wrapperClassName="w-full"
        minDate={min}
        maxDate={max}
        showMonthDropdown // ✅ Easier month selection
        showYearDropdown // ✅ Easier year selection
        dropdownMode="select" // ✅ Show as dropdowns instead of scroll
      />
      {error && <p className="text-sm text-red-600 mt-1 ml-1">{error}</p>}
    </div>
  );
}
