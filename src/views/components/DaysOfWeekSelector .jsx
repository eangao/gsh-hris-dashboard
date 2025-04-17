import React, { useState } from "react";

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DaysOfWeekSelector = ({ selectedDays = [], onChange }) => {
  const [days, setDays] = useState(selectedDays);

  const toggleDay = (day) => {
    const updatedDays = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];

    setDays(updatedDays);
    onChange(updatedDays);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allDays.map((day) => (
        <label key={day} className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={days.includes(day)}
            onChange={() => toggleDay(day)}
          />
          {day}
        </label>
      ))}
    </div>
  );
};

export default DaysOfWeekSelector;
