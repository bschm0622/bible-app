"use client";

import { useState, useEffect } from "react";
import { supabase } from "@utils/supabase/client";
import { Plan } from "@/types/planTypes";
import Link from "next/link";

const ViewPlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [entriesPerPage] = useState(5); // Number of entries per page
  const [userId, setUserId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Sort direction
  const [sortBy, setSortBy] = useState<string>("created_at"); // Column to sort by

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
    if (!userId) return;
    async function fetchPlans() {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", userId)
        .order(sortBy, { ascending: sortOrder === "asc" }); // Sort based on the current state
      if (error) {
        console.error("Error fetching plans:", error);
      } else {
        setPlans(data || []);
      }
    }
    fetchPlans();
  }, [userId, sortBy, sortOrder]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(plans.length / entriesPerPage);

  const deletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
      return;
    }
    try {
      // Delete related entries in `plan_entries`
      const { error: entryError } = await supabase
        .from("plan_entries")
        .delete()
        .eq("plan_id", planId);

      if (entryError) {
        throw new Error("Failed to delete plan entries: " + entryError.message);
      }

      // Delete the plan itself
      const { error: planError } = await supabase
        .from("plans")
        .delete()
        .eq("id", planId);

      if (planError) {
        throw new Error("Failed to delete plan: " + planError.message);
      }

      // Remove the plan from local state
      setPlans(plans.filter((plan) => plan.id !== planId));
      alert("Plan deleted successfully!");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "An error occurred while deleting the plan.");
    } finally {
    }
  };
  const handleSort = (column: string) => {
    const newSortOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newSortOrder);
  };


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">View All Plans</h1>
        <p className="text-gray-600 mt-2">
          Explore your saved plans and manage your entries with ease.
        </p>
      </div>

      {/* Plans Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg mb-8">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-primary text-white">
              <th onClick={() => handleSort("name")}>
                Name
                {sortBy === "name" && (sortOrder === "asc" ? " 🔼" : " 🔽")}
              </th>
              <th onClick={() => handleSort("start_date")}>
                Start Date
                {sortBy === "start_date" && (sortOrder === "asc" ? " 🔼" : " 🔽")}
              </th>
              <th onClick={() => handleSort("end_date")}>
                End Date
                {sortBy === "end_date" && (sortOrder === "asc" ? " 🔼" : " 🔽")}
              </th>
              <th onClick={() => handleSort("created_at")}>
                Created At
                {sortBy === "created_at" && (sortOrder === "asc" ? " 🔼" : " 🔽")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
           <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td className="font-medium">{plan.name}</td>
                <td>{new Date(plan.start_date).toLocaleDateString()}</td>
                <td>{new Date(plan.end_date).toLocaleDateString()}</td>
                <td>{new Date(plan.created_at).toLocaleDateString()}</td>
                <td className="flex gap-2">
                  <Link
                    href={`/plans/${plan.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    View Entries
                  </Link>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-outline btn-sm"
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
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
