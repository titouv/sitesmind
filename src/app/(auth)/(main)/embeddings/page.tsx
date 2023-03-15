import "server-only";

import { createServerComponentClient } from "@/supabase/utils/server";

// do not cache this page
export const revalidate = 0;

export default async function ServerComponent() {
  const supabase = createServerComponentClient();
  const { data } = await supabase.from("documents").select("*");

  return <pre>{JSON.stringify({ data }, null, 2)}</pre>;
}
