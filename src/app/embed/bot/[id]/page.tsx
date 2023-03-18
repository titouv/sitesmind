import { ChatBot } from "@/app/embed/bot/[id]/bot";
import { createServerComponentClientAsAdmin } from "@/supabase/utils/server";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClientAsAdmin();

  const { data: bot, error } = await supabase
    .from("bots")
    .select("id, name")
    .eq("id", params.id)
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return <div>error</div>;
  }

  return <ChatBot bot={bot} />;
}
