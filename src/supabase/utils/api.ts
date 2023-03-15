import type { Database } from "@/supabase/database.types";
import { createClient as createClientSupabase } from "@supabase/supabase-js";

export const createAdminClient = () =>
  createClientSupabase<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  );
