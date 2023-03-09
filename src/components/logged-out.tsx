"use client"

import { Button } from "@/components/ui/button"
import { useSupabase } from "@/supabase/components/supabase-provider"

export function LoggedOut() {
  const { supabase } = useSupabase()
  return <Button onClick={() => supabase.auth.signOut()}>Logout</Button>
}
