import { Database } from "@/supabase/database.types";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const createBrowserClient = () => {
  console.log("createBrowserClient");
  return createBrowserSupabaseClient<Database>();
};
