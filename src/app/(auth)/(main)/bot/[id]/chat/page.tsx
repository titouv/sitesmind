import { Chat } from "@/app/(auth)/(main)/bot/[id]/chat/chat";
import { createServerComponentClient } from "@/supabase/utils/server";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("bot_id", params.id)
    .limit(1)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("No data");
  }

  const url = data.url;

  return (
    <>
      <Chat bot={{ id: params.id, url }} />
    </>
  );
}
