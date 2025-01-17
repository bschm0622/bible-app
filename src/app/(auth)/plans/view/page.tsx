"use client"; // Mark this as a client component

import { useState, useEffect } from "react";
import { supabase } from "@utils/supabase/client";
import { Plan, PlanEntry } from "@/types/planTypes";
import { useRouter } from "next/navigation"; // For navigation

const ViewPlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planEntries, setPlanEntries] = useState<PlanEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [entriesPerPage] = useState(5); // Number of entries per page
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user info on mount
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
    if (!userId) return;
    // Fetch plans when userId is available
    async function fetchPlans() {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.error("Error fetching plans:", error);
      } else {
        setPlans(data || []);
      }
    }
    fetchPlans();
  }, [userId]);

  useEffect(() => {
    if (!planEntries.length) return;

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = planEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  }, [currentPage, planEntries]);

  const openPlanDetails = (planId: string) => {
    router.push(`/plans/view/${planId}`);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(planEntries.length / entriesPerPage);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">View All Plans</h1>

      {/* Plans Table */}
      <div className="overflow-x-auto mb-8">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.name}</td>
                <td>{new Date(plan.start_date).toLocaleDateString()}</td>
                <td>{new Date(plan.end_date).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => openPlanDetails(plan.id)}
                    className="btn btn-primary btn-sm"
                  >
                    View Entries
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-outline btn-sm"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-outline btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewPlansPage;
