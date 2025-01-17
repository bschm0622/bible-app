"use client"; // Mark this as a client component

import { useState, useEffect } from "react";
import { supabase } from "@utils/supabase/client";
import { Plan, PlanEntry } from "@/types/planTypes";

const ViewPlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [planEntries, setPlanEntries] = useState<PlanEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [entriesPerPage] = useState(5); // Number of entries per page
  const [userId, setUserId] = useState<string | null>(null);


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
    if (!selectedPlan?.id) return;

    // Fetch plan entries when a plan is selected
    async function fetchPlanEntries() {
      const { data, error } = await supabase
        .from("plan_entries")
        .select("*")
        .eq("plan_id", selectedPlan.id);

      if (error) {
        console.error("Error fetching plan entries:", error);
      } else {
        setPlanEntries(data || []);
      }
    }

    fetchPlanEntries();
  }, [selectedPlan]);

  const openModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    setCurrentPage(1); // Reset to the first page when opening the modal
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setIsModalOpen(false);
  };

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = planEntries.slice(indexOfFirstEntry, indexOfLastEntry);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(planEntries.length / entriesPerPage);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">View All Plans</h1>

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
                    onClick={() => openModal(plan)}
                    className="text-blue-500 hover:underline"
                  >
                    View Entries
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Plan Details: {selectedPlan.name}
            </h2>
            <div className="mb-4">
              <strong>Start Date:</strong>{" "}
              {new Date(selectedPlan.start_date).toLocaleDateString()}
            </div>
            <div className="mb-4">
              <strong>End Date:</strong>{" "}
              {new Date(selectedPlan.end_date).toLocaleDateString()}
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Reading</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((entry, index) => (
                    <tr key={index}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.reading}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Next
              </button>
            </div>

            <button
              onClick={closeModal}
              className="mt-4 py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPlansPage;
