"use client"; // Mark this as a client component

import { supabase } from '../../utils/supabase'; // Supabase client for database interactions
import { useState, useEffect } from 'react';
import { calculateBooks, decideDistribution, generateReadingPlan } from '../lib/readingPlan'; // Helper functions for plan generation
import { v4 as uuidv4 } from 'uuid'; // UUID for unique plan IDs
import { Plan, PlanEntry } from '../../types/planTypes'; // Types for plans and plan entries
import { BibleBook } from '../../types/bibleBook'; // Type for Bible books
import DateRangePicker from "../components/dateRangePicker"; // Custom date range picker component
import Select from 'react-select'; // React Select for multi-select with chips and search

function BiblePlan() {
  // State variables
  const [bibleData, setBibleData] = useState<BibleBook[]>([]); // Holds Bible data fetched from Supabase
  const [plan, setPlan] = useState<PlanEntry[]>([]); // Generated reading plan
  const [selectionType, setSelectionType] = useState("books"); // Type of selection (books, testament, type)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // User-selected options
  const [startDate, setStartDate] = useState(''); // Selected start date
  const [endDate, setEndDate] = useState(''); // Selected end date
  const [planName, setPlanName] = useState(''); // User-defined plan name

  // Fetch Bible data from Supabase on component mount
  useEffect(() => {
    async function fetchBibleData() {
      const { data, error } = await supabase
        .from('bible_books')
        .select('*')
        .limit(1193); // Limit to maximum number of chapters in the Bible

      if (error) {
        console.error('Error fetching Bible data:', error);
      } else {
        setBibleData(data || []); // Populate state with fetched data
      }
    }

    fetchBibleData();
  }, []);

  // Generate selection options based on the current selection type
  function getSelectionOptions() {
    if (selectionType === "books") {
      return [...new Set(bibleData.map(book => book.book_name))].map(bookName => ({
        value: bookName,
        label: bookName, // Map book names to value-label pairs
      }));
    }

    if (selectionType === "testament") {
      return ["Old Testament", "New Testament"].map(testament => ({
        value: testament,
        label: testament, // Map testaments to value-label pairs
      }));
    }

    if (selectionType === "type") {
      return [...new Set(bibleData.map(book => book.type))].map(type => ({
        value: type,
        label: type, // Map types to value-label pairs
      }));
    }

    return []; // Return empty array if no valid selection type
  }

  // Handle the generation of a reading plan
  const handleGenerateReadingPlan = async () => {
    const start = new Date(startDate); // Parse start date
    const end = new Date(endDate); // Parse end date

    // Validate user inputs
    if (selectedOptions.length === 0 || !startDate || !endDate || start >= end) {
      alert("Please provide valid input.");
      return;
    }

    // Calculate selected books based on user options
    const selectedBooks = calculateBooks(selectedOptions, selectionType, bibleData);

    // Check if any books were selected
    if (selectedBooks.length === 0) {
      alert("No books selected based on your options.");
      return;
    }

    // Prepare chapter details for the reading plan
    const chapters = selectedBooks.map(row => ({
      book: row.book_name,
      chapter: row.chapter,
      verses: row.verses,
    }));

    // Compute totals for plan generation
    const totalChapters = chapters.length;
    const totalVerses = chapters.reduce((sum, chapter) => sum + chapter.verses, 0);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Determine distribution type for the plan
    const distributionType = decideDistribution(totalChapters, totalVerses, totalDays);
    const readingPlanMethod = distributionType.method;

    // Generate the reading plan
    const generatedPlan = generateReadingPlan(
      readingPlanMethod,
      selectedBooks,
      totalDays,
      start,
      end
    );

    setPlan(generatedPlan); // Update state with generated plan

    // Save the generated plan to Supabase
    const planNameToSave = planName || `Reading Plan from ${startDate} to ${endDate}`;
    const planId = uuidv4(); // Generate unique plan ID

    const { data: planData, error: planError } = await supabase
      .from('plans')
      .insert<Plan[]>([
        {
          id: planId,
          name: planNameToSave,
          start_date: start,
          end_date: end,
          user_id: '00000000-0000-0000-0000-000000000000', // Placeholder user ID
          created_at: new Date(),
        },
      ])
      .select('*')
      .single();

    if (planError) {
      console.error('Error inserting plan:', planError);
      return;
    }

    // Prepare and save plan entries
    const planEntries = generatedPlan.map(entry => ({
      plan_id: planData.id,
      date: entry.date,
      reading: entry.reading,
      created_at: new Date(),
    }));

    const { error: entriesError } = await supabase
      .from('plan_entries')
      .insert(planEntries);

    if (entriesError) {
      console.error('Error inserting plan entries:', entriesError);
    } else {
      console.log('Plan and entries saved successfully!');
    }
  };

  // Handle date range picker changes
  const handleDateChange = (start: string | null, end: string | null) => {
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    }
  };

  return (
    <div className="card mx-auto p-6 space-y-8 max-w-3xl">
      <div className="bg-base-200 p-8 rounded-xl shadow-sm">
        <h1 className="text-4xl font-extrabold text-center text-primary-content mb-8">
          Bible Reading Plan Generator
        </h1>
        <form id="readingPlanForm" className="space-y-6">
          {/* Plan Name */}
          <div>
            <label htmlFor="planName" className="block text-sm text-primary-content">
              Plan Name:
            </label>
            <input
              type="text"
              id="planName"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Enter a name for your plan"
              className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Selection Type */}
          <div>
            <label htmlFor="selectionType" className="block text-sm text-primary-content">
              Select by:
            </label>
            <select
              id="selectionType"
              onChange={(e) => setSelectionType(e.target.value)}
              value={selectionType}
              className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="books">Specific Books</option>
              <option value="testament">Testament</option>
              <option value="type">Type</option>
            </select>
          </div>

          {/* Multi-Select */}
          <div>
            <label htmlFor="selection" className="block text-sm text-primary-content">
              Choose:
            </label>
            <Select
              isMulti
              options={getSelectionOptions()}
              onChange={(options) => setSelectedOptions(options.map(opt => opt.value))}
              className="mt-1"
              placeholder="Search and select..."
            />
          </div>

          {/* Date Range Picker */}
          <DateRangePicker onDateChange={handleDateChange} />

          {/* Generate Plan Button */}
          <button
            type="button"
            onClick={handleGenerateReadingPlan}
            className="w-full py-2 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Generate Plan
          </button>
        </form>
      </div>

      {/* Display Generated Plan */}
      {plan.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Your Reading Plan:</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reading</th>
                </tr>
              </thead>
              <tbody>
                {plan.map((entry, index) => {
                  const [year, month, day] = entry.date.split("-").map(Number);
                  const localDate = new Date(year, month - 1, day);

                  return (
                    <tr key={index}>
                      <td>
                        {localDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td>{entry.reading}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default BiblePlan;
