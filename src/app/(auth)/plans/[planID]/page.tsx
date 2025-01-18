'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Plan, PlanEntry } from '@/types/planTypes';
import Link from 'next/link';

export default function PlanDetailsPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [planEntries, setPlanEntries] = useState<PlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // To track progress for the progress bar

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchPlanData() {
      try {
        setLoading(true);

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/login');
          return;
        }

        const planId = params.planID; // Access URL parameter

        // Fetch plan details
        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select('*')
          .eq('id', planId)
          .single();

        if (planError) throw planError;
        setPlan(planData);

        // Fetch plan entries
        const { data: entriesData, error: entriesError } = await supabase
          .from('plan_entries')
          .select('*')
          .eq('plan_id', planId)
          .order('date', { ascending: true });

        if (entriesError) throw entriesError;
        setPlanEntries(entriesData || []);
        calculateProgress(entriesData || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchPlanData();
  }, [params.planID, router]);

  const calculateProgress = (entries: PlanEntry[]) => {
    const totalEntries = entries.length;
    const checkedEntries = entries.filter((entry) => entry.is_checked).length;
    const progressPercentage = (checkedEntries / totalEntries) * 100;
    setProgress(progressPercentage);
  };

  const handleCheckboxChange = async (entryId: string, checked: boolean) => {
    // Update the `is_checked` column for the plan entry
    const { error } = await supabase
      .from('plan_entries')
      .update({ is_checked: checked })
      .eq('id', entryId);

    if (error) {
      console.error('Error updating entry:', error);
      alert('Failed to update progress.');
    } else {
      // Update local state to reflect changes immediately
      setPlanEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === entryId ? { ...entry, is_checked: checked } : entry
        )
      );
      calculateProgress(planEntries); // Recalculate the progress bar
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!plan) return <div>Plan not found</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/plans/view" className="btn btn-outline mb-4">
          ← Back to Plans
        </Link>
        <h1 className="text-3xl font-bold">{plan!.name}</h1>
        <div className="text-sm text-gray-500 mt-2">
          {new Date(plan!.start_date).toLocaleDateString()} - {new Date(plan!.end_date).toLocaleDateString()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="text-xl font-semibold mb-2">Progress</div>
        <progress
          className="progress progress-primary w-full"
          value={progress}
          max="100"
        >
          {progress}%
        </progress>
      </div>

      <div className="space-y-4">
        {planEntries.map((entry) => (
          <div key={entry.id} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">
                {new Date(entry.date).toLocaleDateString()}
              </h2>
              <p>{entry.reading}</p>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={entry.is_checked}
                  onChange={(e) =>
                    handleCheckboxChange(entry.id, e.target.checked)
                  }
                  className="checkbox"
                />
                <label>Completed</label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
