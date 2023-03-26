import { Chat } from "@/app/(auth)/(main)/bot/[id]/chat/chat";
import { createServerComponentClient } from "@/supabase/utils/server";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient();

  const { data: bot, error } = await supabase
    .from("bots")
    .select(
      `
    *,
    sources (
      *
    )
  `
    )
    .eq("id", params.id)
    .limit(1)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!bot || !bot.sources || !Array.isArray(bot.sources)) {
    throw new Error("No data");
  }

  const metaJoined = bot.sources.map((d) => d.meta).join(", ");

  return (
    <>
      <Chat bot={{ id: params.id, name: bot.name, meta: metaJoined }} />
    </>
  );
}
