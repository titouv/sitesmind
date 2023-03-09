"use client"

import { Button } from "@/components/ui/button"
import { useSupabase } from "./supabase-provider"

// Supabase auth needs to be triggered client-side
export default function Login() {
  const { supabase } = useSupabase()

  const handleEmailLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: "jon@supabase.com",
      password: "password",
    })
  }

  const handleGitHubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <>
      <Button onClick={handleEmailLogin}>Email Login</Button>
      <Button onClick={handleGitHubLogin}>GitHub Login</Button>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  )
}
