"use client";
import { BASE_URL } from "@/config/site";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/supabase/components/supabase-provider";

export function Auth() {
  const { supabase, session } = useSupabase();

  return (
    <div>
      <h1>Auth</h1>
      {session ? (
        <div>
          <p>Logged as {session.user.email} </p>
          <Button
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) console.log("error", error);
            }}
          >
            Logout
          </Button>
        </div>
      ) : (
        <Button
          onClick={async () => {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: BASE_URL + "/create",
              },
            });
            if (error) console.log("error", error);
          }}
        >
          Login
        </Button>
      )}
    </div>
  );
}
