"use client";

import { createContext, useContext, useState } from "react";
import { createClient } from "@/supabase/utils/browser";

import type { Session, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/supabase/database.types";

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
  session: SessionOrNull;
};

type SessionOrNull = Session | null;

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: SessionOrNull;
}) {
  const [supabase] = useState(() => createClient());

  return (
    <Context.Provider value={{ supabase, session }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  } else {
    return context;
  }
};
