import { Database } from "@/supabase/database.types";
import { createClient } from "@supabase/supabase-js";

export const createApiClient = () =>
  createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
