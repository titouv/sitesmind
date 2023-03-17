import { headers, cookies } from "next/headers";
import {
  createRouteHandlerSupabaseClient,
  createServerComponentSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

export const createServerComponentClient = () =>
  createServerComponentSupabaseClient<Database, "public">({
    headers,
    cookies,
  });

export const createApiClientAsAnon = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

export const createApiClient = () =>
  createRouteHandlerSupabaseClient<Database>({
    cookies,
    headers,
  });
