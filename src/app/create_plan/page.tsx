//to do:
// add support for two new plan tables in supabase
// add support for writing the plans to the tables when generating plan here
// add new page to view generated plans

"use client"; // Mark this as a client component

import { supabase } from '../../utils/supabase';
import { useState, useEffect } from 'react';
import { calculateBooks, decideDistribution, generateReadingPlan } from '../lib/readingPlan';
import { v4 as uuidv4 } from 'uuid'; // Import UUID v4 generator


interface BibleBook {
  book_name: string;
  testament: string;
  type: string;
  chapter: number;
  verses: number;
}

interface PlanEntry {
  date: string;
  reading: string;
}

interface Plan {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  user_id: string;
  created_at: Date;
}

function BiblePlan() {
  const [bibleData, setBibleData] = useState<BibleBook[]>([]);
  const [plan, setPlan] = useState<PlanEntry[]>([]);
  const [selectionType, setSelectionType] = useState("books");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Fetch the Bible data
    async function fetchBibleData() {
      const { data, error } = await supabase
        .from('bible_books')  // Your table name
        .select('*') // Request the exact row count
        .limit(1193);
  
      if (error) {
        console.error('Error fetching Bible data:', error);  // Log the error
      } else {
        console.log('Bible data fetched:', data);  // Log the fetched data
        setBibleData(data || []);  // Update the state with the fetched data
      }
    }
  
    fetchBibleData();
  }, []); // Empty dependency array ensures this effect runs only once when component mounts


  function updateSelectionOptions() {
  
    if (bibleData.length === 0) {
      return [];  // No data, return empty array
    }
  
    if (selectionType === "books") {
      return [...new Set(bibleData.map(book => book.book_name))].map(bookName => ({
        value: bookName,
        label: bookName,
      }));
    } else if (selectionType === "testament") {
      return ["Old Testament", "New Testament"].map(testament => ({
        value: testament,
        label: testament,
      }));
    } else if (selectionType === "type") {
      const types = [...new Set(bibleData.map(book => book.type))];
      return types.map(type => ({
        value: type,
        label: type,
      }));
    }
    return [];
  }
  

  // Function to handle the button click for generating the reading plan
  const handleGenerateReadingPlan = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log("Selected Options:", selectedOptions);  // Check what's in the selected options

    if (selectedOptions.length === 0 || !startDate || !endDate || start >= end) {
      alert("Please provide valid input.");
      return;
    }

    // Calculate books based on the selected options
    const selectedBooks = calculateBooks(selectedOptions, selectionType, bibleData);

    console.log("Selected Books:", selectedBooks);  // Check what books are being returned

    // If no books are selected, handle the case
    if (selectedBooks.length === 0) {
      alert("No books selected based on your options.");
      return;
    }

    // Calculate total chapters
    const chapters = selectedBooks.map((row) => ({
      book: row.book_name,
      chapter: row.chapter,
      verses: row.verses,
    }));

    const totalChapters = chapters.length;
    const totalVerses = chapters.reduce((sum, chapter) => sum + chapter.verses, 0);


    if (totalChapters === 0) {
      setPlan([{ date: "", reading: "No chapters available to distribute." }]);
      return;
    }

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Decide whether to distribute by chapters, verses, or mixed
    const distributionType = decideDistribution(totalChapters, totalVerses, totalDays); // ensure it's valid

    // Ensure the method exists before passing to generateReadingPlan
    const readingPlanMethod = distributionType.method;

    console.log("Total Chapters: ",totalChapters," Total Verses: ",totalVerses," Plan Type: ",distributionType,"Total Days: ",totalDays)

    // Dynamically generate the reading plan based on the selected UI inputs
    const generatedPlan: PlanEntry[] = generateReadingPlan(
      readingPlanMethod,
      selectedBooks,
      totalDays,
      start,
      end
    );

    // Update the state with the generated reading plan
    setPlan(generatedPlan);

    console.log('Generated Plan:', generatedPlan);
    
    const planName = `Reading Plan from ${startDate} to ${endDate}`;
    const planId = uuidv4(); // Generate a random UUID for the plan ID
    
    const { data: planData, error: planError } = await supabase
    .from('plans')
    .insert<Plan[]>([
      {
      id: planId, // Use the generated UUID
      name: planName,
      start_date: start,
      end_date: end,
      user_id: '00000000-0000-0000-0000-000000000000',
      created_at: new Date(),
    },
  ])
  .select('*') // Ensure data is returned
  .single(); // We expect only one row to be inserted

    if (planError) {
      console.error('Error inserting plan:', planError);
      return;
    }
  
    // Now, planData is guaranteed to have an `id`
    const planIdFromDb = planData.id;
  
    // Insert entries for each day in the generated plan
    const planEntries = generatedPlan.map((entry) => ({
      plan_id: planIdFromDb, // Link entries to the new plan using the DB-generated plan ID
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



return (
  <div className="card mx-auto p-6 space-y-8 max-w-3xl">
    <div className="bg-base-200 p-8 rounded-xl shadow-sm">
    <h1 className="text-4xl font-extrabold text-center text-primary-content mb-8">Bible Reading Plan Generator</h1>
      <form id="readingPlanForm" className="space-y-6">
        {/* Select Plan Type */}
        <div>
          <label htmlFor="selectionType" className="block text-sm text-primary-content">Select by:</label>
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

        {/* Selection Container */}
        <div id="selectionContainer">
          <label htmlFor="selection" className="block text-sm text-primary-content">Choose:</label>
          <select
            id="selection"
            multiple
            onChange={(e) => setSelectedOptions(Array.from(e.target.selectedOptions).map(opt => opt.value))}
            className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {updateSelectionOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Inputs */}
        <div className="space-y-4">
          <div>
            <label htmlFor="startDate" className="block text-sm text-primary-content">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Button to generate plan */}
        <div>
          <button
            type="button"
            onClick={handleGenerateReadingPlan}
            className="w-full py-2 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Generate Plan
          </button>
        </div>
      </form>
    </div>

  {/* Display the generated plan */}
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
    const localDate = new Date(year, month - 1, day); // Note: month is 0-based

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