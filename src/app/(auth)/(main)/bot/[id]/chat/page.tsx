import { Chat } from "@/app/(auth)/(main)/bot/[id]/chat/chat";
import { createServerComponentClient } from "@/supabase/utils/server";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient();

  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .eq("bot_id", params.id);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No data");
  }

  const metaJoined = data.map((d) => d.meta).join(", ");

  return (
    <>
      <Chat bot={{ id: params.id, meta: metaJoined }} />
    </>
  );
}
