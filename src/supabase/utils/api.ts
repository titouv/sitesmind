import { Database } from "@/supabase/database.types";
import { createClient } from "@supabase/supabase-js";

export const createApiClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
