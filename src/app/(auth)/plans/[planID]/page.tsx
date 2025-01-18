'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Plan, PlanEntry } from '@/types/planTypes';
import Link from 'next/link';

export default function PlanDetailsPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [planEntries, setPlanEntries] = useState<PlanEntry[]>([]);
  const [showCompleted, setShowCompleted] = useState(true); // Toggle for completed days
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchPlanData() {
      try {
        setLoading(true);

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/login');
          return;
        }

        const planId = params.planID;

        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select('*')
          .eq('id', planId)
          .single();

        if (planError) throw planError;
        setPlan(planData);

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
    const { error } = await supabase
      .from('plan_entries')
      .update({ is_checked: checked })
      .eq('id', entryId);

    if (error) {
      console.error('Error updating entry:', error);
      alert('Failed to update progress.');
    } else {
      setPlanEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === entryId ? { ...entry, is_checked: checked } : entry
        )
      );
      calculateProgress(planEntries);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!plan) return <div>Plan not found</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 border-b pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Plan Name: {plan!.name}</h1>
            <p className="text-sm text-gray-500">
              {new Date(plan!.start_date).toLocaleDateString()} - {new Date(plan!.end_date).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center mt-4 md:mt-0 md:ml-4">
            <progress
              className="progress progress-primary w-48"
              value={progress}
              max="100"
            >
              {progress}%
            </progress>
            <span className="ml-4 text-lg font-medium">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
          />
          <label className="text-sm">Show Completed Days</label>
        </div>
      </div>


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-y-auto max-h-96">
        {planEntries
          .filter((entry) => (showCompleted ? true : !entry.is_checked))
          .map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-lg shadow-md ${entry.is_checked ? 'bg-green-100' : 'bg-gray-100'
                }`}
            >
              <h3 className="text-sm font-bold">
                {new Date(entry.date).toLocaleDateString()}
              </h3>
              <p className="text-xs">{entry.reading}</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={entry.is_checked}
                  onChange={(e) =>
                    handleCheckboxChange(entry.id, e.target.checked)
                  }
                  className="checkbox"
                />
                <label className="text-xs">Completed</label>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
