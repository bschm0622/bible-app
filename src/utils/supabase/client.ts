import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Function to create a Supabase client (server-side or client-side context specific)
export function createClient() {
  // This can be used for dynamic or isolated client creation if needed
  return createBrowserClient(supabaseUrl, supabaseKey);
}

// Default browser-side Supabase client
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
