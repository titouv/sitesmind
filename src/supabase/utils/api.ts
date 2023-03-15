import { Database } from "@/supabase/database.types";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const createAdminClient = () =>
  createBrowserSupabaseClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SECRET_KEY,
  });
