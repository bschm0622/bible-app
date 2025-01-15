"use client";

import React, { useState } from "react";

type DateRangePickerProps = {
  onDateChange: (start: string | null, end: string | null) => void;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [rangeType, setRangeType] = useState<string>("custom");

  const handleRangeSelection = (
    event: React.MouseEvent<HTMLButtonElement>,
    range: string
  ) => {
    event.preventDefault();
    const today = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (range) {
      case "30 days":
        start = today;
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
        break;
      case "next month":
        start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        break;
      case "90 days":
        start = today;
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 90);
        break;
      case "180 days":
        start = today;
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 180);
        break;
      case "365 days":
        start = today;
        end = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        break;
      case "custom":
        start = null;
        end = null;
        break;
      default:
        break;
    }

    setRangeType(range);

    if (start) setStartDate(start.toISOString().split("T")[0]);
    if (end) setEndDate(end.toISOString().split("T")[0]);

    // Notify parent component of date changes
    onDateChange(
      start ? start.toISOString().split("T")[0] : null,
      end ? end.toISOString().split("T")[0] : null
    );
  };

  const handleCustomDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    // Notify parent component of custom date changes
    onDateChange(
      type === "start" ? value : startDate,
      type === "end" ? value : endDate
    );
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Select a Date Range</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {["30 days", "next month", "90 days", "180 days", "365 days", "custom"].map((option) => (
          <button
            key={option}
            onClick={(event) => handleRangeSelection(event, option)} // Pass event and option
            className={`btn ${
              rangeType === option ? "btn-primary" : "btn-outline"
            } btn-sm`}
          >
            {option}
          </button>
        ))}
      </div>

      {rangeType === "custom" && (
        <div className="flex gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate || ""}
              onChange={(e) => handleCustomDateChange("start", e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate || ""}
              onChange={(e) => handleCustomDateChange("end", e.target.value)}
              className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

      <div className="text-sm">
        <strong>Selected Range:</strong>
        <p>
          Start: {startDate || "None"} | End: {endDate || "None"}
        </p>
      </div>
    </div>
  );
};

export default DateRangePicker;
