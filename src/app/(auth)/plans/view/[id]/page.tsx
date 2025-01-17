"use client"; // Mark this as a client component

import { useState, useEffect } from "react";
import { supabase } from "@utils/supabase/client";
import { Plan, PlanEntry } from "@/types/planTypes";
import { useParams } from 'next/navigation'; // Correctly using useParams to get dynamic route params

const ViewPlanDetailsPage = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [planEntries, setPlanEntries] = useState<PlanEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [entriesPerPage] = useState(5); // Number of entries per page
  const [userId, setUserId] = useState<string | null>(null);
  
  // Use useParams to get the dynamic route parameter
  const { plan_id } = useParams(); // Access plan_id from the URL

  // Fetch user info and the selected plan
  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Error fetching user:", error);
        alert("You must be logged in to view plans.");
        return;
      }
      setUserId(user.id);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId || !plan_id) return;

    // Fetch the specific plan based on plan_id
    async function fetchPlan() {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("id", plan_id)
        .single();

      if (error) {
        console.error("Error fetching plan:", error);
      } else {
        setPlan(data || null);
      }
    }
    fetchPlan();
  }, [userId, plan_id]);

  useEffect(() => {
    if (!plan?.id) return;

    // Fetch the plan entries when the plan is available
    async function fetchPlanEntries() {
      const { data, error } = await supabase
        .from("plan_entries")
        .select("*")
        .eq("plan_id", plan.id);

      if (error) {
        console.error("Error fetching plan entries:", error);
      } else {
        setPlanEntries(data || []);
      }
    }

    fetchPlanEntries();
  }, [plan]);

  // Handle pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = planEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(planEntries.length / entriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle checking off a day and updating progress
  const toggleCompletion = async (entryId: string) => {
    const entry = planEntries.find((entry) => entry.id === entryId);
    if (!entry) return;

    const { data, error } = await supabase
      .from("plan_entries")
      .update({ completed: !entry.completed })
      .eq("id", entryId);

    if (error) {
      console.error("Error updating completion:", error);
    } else {
      setPlanEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === entryId ? { ...entry, completed: !entry.completed } : entry
        )
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      {plan ? (
        <>
          <h1 className="text-4xl font-bold text-center mb-8">{plan.name} - Plan Details</h1>

          <div className="my-4">
            <strong>Progress: </strong>
            <progress
              className="progress progress-primary w-full"
              value={planEntries.filter((entry) => entry.completed).length}
              max={planEntries.length}
            ></progress>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentEntries.map((entry) => (
              <div key={entry.id} className="card w-full bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{new Date(entry.date).toLocaleDateString()}</h2>
                  <p>{entry.reading}</p>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={entry.completed}
                      onChange={() => toggleCompletion(entry.id)}
                      className="checkbox checkbox-primary"
                    />
                    <span className="ml-2">Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-outline"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-center">Loading plan details...</p>
      )}
    </div>
  );
};

export default ViewPlanDetailsPage;
