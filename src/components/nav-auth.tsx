"use client"

import { ProfilePicture } from "@/app/(main)/profile-picture"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/supabase/components/supabase-provider"

export function NavAuth({ children }: { children: React.ReactNode }) {
  const { supabase, session } = useSupabase()

  return session ? (
    <>
      <Button
        variant="outline"
        onClick={async () => {
          await supabase.auth.signOut()
        }}
      >
        Sign out
      </Button>
      {/* this should be the profile picture */}
      {children}
    </>
  ) : (
    <Button
      onClick={async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: "http://localhost:3000/try",
          },
        })
        if (error) {
          console.error(error)
        }
      }}
    >
      Sign in
    </Button>
  )
}
