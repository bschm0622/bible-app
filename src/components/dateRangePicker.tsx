'use client';

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
    today.setHours(0, 0, 0, 0);
    let start: Date | null = null;
    let end: Date | null = null;

    switch (range) {
      case "30 days":
        start = new Date(today);
        end = new Date(today);
        end.setDate(today.getDate() + 29);
        break;
      case "next month":
        start = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        end = new Date(today.getFullYear(), today.getMonth() + 2, 0);
        break;
      case "90 days":
        start = new Date(today);
        end = new Date(today);
        end.setDate(today.getDate() + 89);
        break;
      case "180 days":
        start = new Date(today);
        end = new Date(today);
        end.setDate(today.getDate() + 179);
        break;
      case "365 days":
        start = new Date(today);
        end = new Date(today);
        end.setDate(today.getDate() + 364);
        break;
      case "custom":
        start = null;
        end = null;
        break;
      default:
        break;
    }

    setRangeType(range);

    if (start) {
      const startStr = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      ).toISOString().split('T')[0];
      setStartDate(startStr);
    }
    
    if (end) {
      const endStr = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
      ).toISOString().split('T')[0];
      setEndDate(endStr);
    }

    // Notify parent component of date changes
    onDateChange(
      start ? start.toISOString().split('T')[0] : null,
      end ? end.toISOString().split('T')[0] : null
    );
  };

  const handleCustomDateChange = (type: "start" | "end", value: string) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];

    if (type === "start") {
      setStartDate(dateStr);
    } else {
      setEndDate(dateStr);
    }

    // Notify parent component of custom date changes
    onDateChange(
      type === "start" ? dateStr : startDate,
      type === "end" ? dateStr : endDate
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "None";

    // Create date from the ISO string and adjust for local timezone
    const date = new Date(dateString + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: 'UTC'  // Force UTC timezone for consistent display
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Dynamic header content based on selected range
  const getHeaderText = () => {
    switch (rangeType) {
      case "30 days":
        return `Selected Range: ${formatDate(startDate)} to ${formatDate(endDate)}`;
      case "next month":
        return `Selected Range: ${formatDate(startDate)} to ${formatDate(endDate)}`;
      case "90 days":
        return `Selected Range: ${formatDate(startDate)} to ${formatDate(endDate)}`;
      case "180 days":
        return `Selected Range: ${formatDate(startDate)} to ${formatDate(endDate)}`;
      case "365 days":
        return `Selected Range: ${formatDate(startDate)} to ${formatDate(endDate)}`;
      case "custom":
        return `Selected Range: ${formatDate(startDate)} to ${formatDate(endDate)}`;
      default:
        return `Select a Date Range`;
    }
  };

  return (
    <div className="p-6 bg-base-200 rounded-lg">
      <h3 className="text-lg font-bold mb-4">{getHeaderText()}</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {["custom", "30 days", "next month", "90 days", "180 days", "365 days"].map((option) => (
          <button
            key={option}
            onClick={(event) => handleRangeSelection(event, option)} // Pass event and option
            className={`btn ${rangeType === option ? "btn-secondary" : "btn-outline"} btn-sm rounded-md`}
          >
            {option}
          </button>
        ))}
      </div>

      {rangeType === "custom" && (
        <div className="flex gap-6 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate || ""}
              onChange={(e) => handleCustomDateChange("start", e.target.value)}
              className="input input-bordered w-full mt-1"
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
              className="input input-bordered w-full mt-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
