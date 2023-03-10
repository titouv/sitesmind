import type { Database } from "@/supabase/database.types"
import { createClient } from "@supabase/supabase-js"

export const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)
