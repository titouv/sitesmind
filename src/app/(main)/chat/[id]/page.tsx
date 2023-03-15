import Chat from "@/app/(main)/chat/[id]/chat";
import { createClient } from "@/supabase/utils/server";
import { notFound } from "next/navigation";
export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();
  // get list of bots and validate that the bot exists
  const { data: bots, error } = await supabase
    .from("bots")
    .select("*")
    .eq("id", params.id);
  if (error || !bots || bots.length === 0) {
    return notFound();
  }

  return <Chat params={params} />;
}
