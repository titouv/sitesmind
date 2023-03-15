import { Database } from "@/supabase/database.types";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
export const createApiClient = () =>
  createBrowserSupabaseClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
