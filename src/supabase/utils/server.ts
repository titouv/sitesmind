import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "../database.types";

export const createServerComponentClient = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });

import { createClient } from "@supabase/supabase-js";
import { createRouteHandlerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const createApiClientAsAnon = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

export const createApiClient = () =>
  createRouteHandlerSupabaseClient({
    cookies,
    headers,
  });
