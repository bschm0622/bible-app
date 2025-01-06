"use client"; // Mark this as a client component

import { useState } from 'react';
import { supabase } from '../utils/supabase';

export default function App() {
  const [planType, setPlanType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const createPlan = async () => {
    const { data, error } = await supabase
      .from('reading_plans')
      .insert([{ plan_type: planType, start_date: startDate, end_date: endDate }]);

    if (error) {
      console.error('Error creating plan:', error.message);
    } else {
      alert('Plan created successfully!');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Create Your Reading Plan</h1>
      <div className="mt-4">
        <label className="block">Plan Type</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={planType}
          onChange={(e) => setPlanType(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="block">Start Date</label>
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="block">End Date</label>
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button
        onClick={createPlan}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Plan
      </button>
    </div>
  );
}
