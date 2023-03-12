import { Database } from "@/supabase/database.types";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const createClient = () => createBrowserSupabaseClient<Database>();
