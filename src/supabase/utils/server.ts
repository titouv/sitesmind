import { headers, cookies } from "next/headers";
import {
  createRouteHandlerSupabaseClient,
  createServerComponentSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

export const createServerComponentClient = () => {
  return createServerComponentSupabaseClient<Database, "public">({
    headers,
    cookies,
  });
};

export const createServerComponentClientAsAdmin = () => {
  console.log("createServerComponentClientAsAdmin");
  return createClient<Database, "public">(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  );
};

export const createApiClientAsAnon = () => {
  console.log("createApiClientAsAnon");
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
export const createApiClient = () => {
  console.log("createApiClient");
  return createRouteHandlerSupabaseClient<Database>({
    cookies,
    headers,
  });
};
