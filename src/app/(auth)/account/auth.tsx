"use client"
import { useSupabase } from "@/supabase/components/supabase-provider"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"

export default function Page() {
  const { supabase } = useSupabase()
  return (
    <Auth
      supabaseClient={supabase}
      redirectTo={"https://localhost:3000"}
      appearance={{ theme: ThemeSupa }}
    />
  )
}
