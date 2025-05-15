import React, { useState } from "react";
import PropTypes from "prop-types";

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * DaysOfWeekSelector Component
 *
 * A component for selecting multiple days of the week.
 * Matches the design system with consistent styling and interactions.
 *
 * @param {Object} props
 * @param {Array} props.selectedDays - Array of initially selected days
 * @param {Function} props.onChange - Callback function when selection changes
 * @param {boolean} props.disabled - Whether the selector is disabled
 */
const DaysOfWeekSelector = ({
  selectedDays = [],
  onChange,
  disabled = false,
}) => {
  const [days, setDays] = useState(selectedDays);

  const toggleDay = (day) => {
    if (disabled) return;

    const updatedDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];

    setDays(updatedDays);
    onChange(updatedDays);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allDays.map((day) => {
        const isSelected = days.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            disabled={disabled}
            className={`
              px-3 py-2 rounded-md text-sm font-medium
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${
                isSelected
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            aria-pressed={isSelected}
            role="checkbox"
          >
            {day.substring(0, 3)}
          </button>
        );
      })}
    </div>
  );
};

DaysOfWeekSelector.propTypes = {
  selectedDays: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default DaysOfWeekSelector;

{
  /* <div>
<label className="block text-sm font-medium text-gray-700 mb-2">
  Days of Week
</label>
<DaysOfWeekSelector
  selectedDays={daysOfWeek}
  onChange={setDaysOfWeek}
/>
</div> */
}
