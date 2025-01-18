// app/plans/[planId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Plan, PlanEntry } from '@/types/planTypes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationInfo {
  total: number;
  page: number;
  perPage: number;
}

export default function ViewPlanDetailsPage() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [planEntries, setPlanEntries] = useState<PlanEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    perPage: 5
  });

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

export default function getplanIdFromURL() {
  const pathSegments = window.location.pathname.split('/');
  // Assuming the planId is the second segment in the path:
  return pathSegments[2]; 
}

const planId = getplanIdFromURL();
console.log(planId);
  
  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        setLoading(true);
        
        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          router.push('/login');
          throw new Error('You must be logged in to view plans.');
        }
  
        useEffect(() => {
          const fetchPlanData = async () => {
            try {
              setLoading(true);
        
        // Validate planId
        if (!planId || typeof planId !== 'string') {
          throw new Error('Invalid plan ID');
        }

        // Fetch plan details
        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select('*')
          .eq('id', planId)
          .single();

       if (planError) {
          if (planError.code === 'PGRST116') {
            throw new Error('Plan not found');
          }
          throw planError;
        }

        if (!planData) {
          throw new Error('Plan not found');
        }

        setPlan(planData);

      } catch (err) {
        console.error('Error fetching plan:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Redirect to plans list if plan is not found
        if (err.message === 'Plan not found') {
          router.push('/plans');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [planId, router]);


        // Calculate pagination ranges
        const from = (currentPage - 1) * pagination.perPage;
        const to = from + pagination.perPage - 1;

        // Fetch total count first
        const { count, error: countError } = await supabase
          .from('plan_entries')
          .select('*', { count: 'exact', head: true })
          .eq('plan_id', planId);

        if (countError) throw countError;

        // Fetch paginated entries
        const { data: entriesData, error: entriesError } = await supabase
          .from('plan_entries')
          .select('*')
          .eq('plan_id', planId)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (entriesError) throw entriesError;

        setPlanEntries(entriesData || []);
        setPagination(prev => ({
          ...prev,
          total: count || 0,
          page: currentPage
        }));

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [planId, currentPage, pagination.perPage]);

  const totalPages = Math.ceil(pagination.total / pagination.perPage);

  const handlePageChange = (newPage: number) => {
    // Update URL with new page number
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`/plans/${planId}?${params.toString()}`);
  };

  if (loading) return null; // Let the loading component handle this
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h2 className="text-red-800 font-medium">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/plans')}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Return to Plans
          </button>
        </div>
      </div>
    );
  }
  if (!plan) {
    router.push('/plans');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Plans
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{plan.title}</h1>
        <p className="text-gray-600">{plan.description}</p>
      </div>

      <div className="space-y-4">
        {planEntries.map((entry) => (
          <div key={entry.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
            <p className="text-gray-800">{entry.content}</p>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(entry.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {pagination.total > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 border rounded disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}