"use client";
import { supabase } from '@utils/supabase';
import { useState, useEffect } from 'react';
import { calculateBooks, decideDistribution, generateReadingPlan } from '@lib/readingPlan';
import { v4 as uuidv4 } from 'uuid';
import { Plan, PlanEntry } from '@/types/planTypes';
import { BibleBook } from '@/types/bibleBook';
import DateRangePicker from "@components/dateRangePicker";
import dynamic from 'next/dynamic';
const CustomSelect = dynamic(() => import("@components/customSelect"), { ssr: false }); 


function BiblePlan() {
  const [bibleData, setBibleData] = useState<BibleBook[]>([]);
  const [plan, setPlan] = useState<PlanEntry[]>([]);
  const [selectionType, setSelectionType] = useState("books");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    async function fetchBibleData() {
      const { data, error } = await supabase
        .from('bible_books')
        .select('*')
        .limit(1193);

      if (error) {
        console.error('Error fetching Bible data:', error);
      } else {
        setBibleData(data || []);
      }
    }

    fetchBibleData();
  }, []);

  function getSelectionOptions() {
    if (selectionType === "books") {
      return [...new Set(bibleData.map(book => book.book_name))].map(bookName => ({
        value: bookName,
        label: bookName,
      }));
    }

    if (selectionType === "testament") {
      return ["Old Testament", "New Testament"].map(testament => ({
        value: testament,
        label: testament,
      }));
    }

    if (selectionType === "type") {
      return [...new Set(bibleData.map(book => book.type))].map(type => ({
        value: type,
        label: type,
      }));
    }

    return [];
  }

const handleSelectionChange = (options: any) => {
  // options is now an array of selected values
  setSelectedOptions(options ? options.map((opt: any) => opt.value) : []);
};

  const handleGenerateReadingPlan = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (selectedOptions.length === 0 || !startDate || !endDate || start >= end) {
      alert("Please provide valid input.");
      return;
    }

    const selectedBooks = calculateBooks(selectedOptions, selectionType, bibleData);

    if (selectedBooks.length === 0) {
      alert("No books selected based on your options.");
      return;
    }

    const chapters = selectedBooks.map(row => ({
      book: row.book_name,
      chapter: row.chapter,
      verses: row.verses,
    }));

    const totalChapters = chapters.length;
    const totalVerses = chapters.reduce((sum, chapter) => sum + chapter.verses, 0);
    
    const diffTime = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const distributionType = decideDistribution(totalChapters, totalVerses, totalDays);
    const readingPlanMethod = distributionType.method;

    const generatedPlan = generateReadingPlan(
      readingPlanMethod,
      selectedBooks,
      totalDays,
      start,
      end
    );

    setPlan(generatedPlan);

    const planNameToSave = planName || `Reading Plan from ${startDate} to ${endDate}`;
    const planId = uuidv4();

    const { data: planData, error: planError } = await supabase
      .from('plans')
      .insert<Plan[]>([
        {
          id: planId,
          name: planNameToSave,
          start_date: start,
          end_date: end,
          user_id: '00000000-0000-0000-0000-000000000000',
          created_at: new Date(),
        },
      ])
      .select('*')
      .single();

    if (planError) {
      console.error('Error inserting plan:', planError);
      return;
    }

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

  const handleDateChange = (start: string | null, end: string | null) => {
    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    }
  };

  return (
<div className="card mx-auto p-6 space-y-8 max-w-3xl">
  <div className="bg-base-200 p-8 rounded-xl shadow-md">
    <h1 className="text-4xl font-extrabold text-center text-primary-content mb-8">
      Bible Reading Plan Generator
    </h1>
    <form id="readingPlanForm" className="space-y-6">
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
          className="mt-1 block w-full px-4 py-2 border border-base-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="selectionType" className="block text-sm text-primary-content">
          Select by:
        </label>
        <select
          id="selectionType"
          onChange={(e) => setSelectionType(e.target.value)}
          value={selectionType}
          className="mt-1 block w-full px-4 py-2 border border-base-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="books">Specific Books</option>
          <option value="testament">Testament</option>
          <option value="type">Type</option>
        </select>
      </div>

      {/* CustomSelect with dynamic options passed from getSelectionOptions */}
      <div>
        <label htmlFor="planName" className="block text-sm text-primary-content">
          Choose:
        </label>
        <CustomSelect
          options={getSelectionOptions()}
          onChange={handleSelectionChange}
        />
      </div>

      <DateRangePicker onDateChange={handleDateChange} />

      <button
        type="button"
        onClick={handleGenerateReadingPlan}
        className="w-full py-2 px-4 btn btn-primary"
      >
        Generate Plan
      </button>
    </form>
  </div>

  {plan.length > 0 && (
    <div className="bg-base-100 p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-neutral-content">Your Reading Plan:</h2>
      <div className="overflow-x-auto">
        <table className="table w-full text-base-content">
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
