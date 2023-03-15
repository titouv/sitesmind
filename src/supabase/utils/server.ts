import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "../database.types";

export const createServerComponentClient = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
