import { Chat } from "@/app/(auth)/(main)/bot/[id]/chat/chat";
import { createServerComponentClient } from "@/supabase/utils/server";
export const runtime = "edge";
const DEFAULT_CONTEXT_SENTENCE = (
  trainedOnContent: string
) => `You are Q&A bot trained on the content : ${trainedOnContent}. A highly intelligent system that answers
user questions based on the information provided by the user above
each question. If the information can not be found in the information
provided by the user you truthfully say "I don't know"`;

const DEFAULT_START_SENTENCE = (botName: string) =>
  `Hello I'm the ${botName} bot. How can I help you today?`;

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

  console.log(bot);

  if (error) {
    throw new Error(error.message);
  }

  if (!bot || !bot.sources || !Array.isArray(bot.sources)) {
    throw new Error("No data");
  }

  const metaJoined = bot.sources.map((d) => d.metadata).join(", ");

  const color = bot.color || "#000000";
  const startSentence = bot.start_sentence || DEFAULT_START_SENTENCE(bot.name);
  const contextSentence =
    bot.context_sentence || DEFAULT_CONTEXT_SENTENCE(metaJoined);

  return (
    <>
      <Chat
        botId={bot.id}
        botColor={color}
        botContextSentence={contextSentence}
        botStartSentence={startSentence}
        botMeta={metaJoined}
        botName={bot.name}
      />
    </>
  );
}
