import type { Database } from "@/supabase/database.types";
import { createClient as createClientSupabase } from "@supabase/supabase-js";

export const createClient = () =>
  createClientSupabase<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
