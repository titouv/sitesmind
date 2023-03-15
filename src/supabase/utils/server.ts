import { headers, cookies } from "next/headers";
import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "../database.types";

export const createServerComponentClient = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });

// export const createRouteHandlerClient = () =>
//   createRouteHandlerSupabaseClient<Database>({
//     headers,
//     cookies,
//   });

// export const createRouteHandlerClientAsAdmin = () =>
//   createRouteHandlerSupabaseClient<Database>({
//     headers,
//     cookies,
//     supabaseKey: process.env.SUPABASE_SECRET_KEY,
//     supabaseUrl: process.env.SUPABASE_URL,
//   });
