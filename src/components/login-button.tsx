"use client";

import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/config/site";
import { useSupabase } from "@/supabase/components/supabase-provider";

export function LoginButton() {
  const { supabase } = useSupabase();

  return (
    <Button
      size="lg"
      onClick={async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: BASE_URL + "/create",
          },
        });
        if (error) {
          console.error(error);
        }
      }}
    >
      Try it out
    </Button>
  );
}
